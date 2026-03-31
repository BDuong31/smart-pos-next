'use client';

import React from 'react';
import { Plus, Trash2, X } from 'lucide-react';

import { getIngredients } from '@/apis/ingredient';
import { getInventoryBatchs, createInventoryBatch } from '@/apis/inventory-batch';
import { createStockCheck, getStockChecks } from '@/apis/stock-check';
import { createStockCheckDetail } from '@/apis/stock-check-detail';
import { SplashScreen } from '@/components/loading';
import { useToast } from '@/context/toast-context';
import { useSelector } from 'react-redux';
import { RootState } from "@/store/store";
import { IIngredientDetail } from '@/interfaces/ingredient';
import { IStockCheckDetail } from '@/interfaces/stock-check-detail';
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';
import { IStockCheckFull } from '@/interfaces/stock-check';
import IngredientDropdown from '@/components/ingredient/IngredientDropdown';
interface Adjustment {
  quantity: number;
  expiryDate: string;
}

interface StockCheckItem {
  ingredientId: string;
  systemQty: number;
  actualQty: number;
  reason: string;
  diff: number;
  adjustments: Adjustment[];
}

const LIMIT = 7;

const getPaginationRange = (currentPage: number, totalPages: number) => {
  const range = [];
  const maxVisiblePages = 7;
  if (totalPages <= maxVisiblePages) { for (let i = 1; i <= totalPages; i++) { range.push(i); } return range; }
  range.push(1);
  const startPage = Math.max(2, currentPage - 1);
  const endPage = Math.min(totalPages - 1, currentPage + 1);
  if (startPage > 2) range.push('...');
  else if (startPage === 2 && totalPages > 3) range.push(2);
  for (let i = startPage; i <= endPage; i++) { if (!range.includes(i)) range.push(i); }
  if (endPage < totalPages - 1) range.push('...');
  else if (endPage === totalPages - 1 && totalPages > 3) range.push(totalPages - 1);
  if (!range.includes(totalPages)) range.push(totalPages);
  let finalRange = [];
  for (let i = 0; i < range.length; i++) { if (range[i] === '...' && i > 0 && i < range.length - 1 && Number(range[i-1]) + 1 === range[i+1]) { continue; } finalRange.push(range[i]); }
  return finalRange;
};

export default function StockCheckView() {
  const { showToast } = useToast();
  const { user } = useSelector((state: RootState) => state.user);

  const [stockChecks, setStockChecks] = React.useState<IStockCheckFull[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  const [loading, setLoading] = React.useState(false);
  const [ingredients, setIngredients] = React.useState<IIngredientDetail[]>([]);
  const [note, setNote] = React.useState('');
  const [batches, setBatches] = React.useState<any[]>([]);
  const [items, setItems] = React.useState<StockCheckItem[]>([]);
  const [checkDate, setCheckDate] = React.useState(
    new Date().toISOString().split('T')[0]
  );

  // ================= FETCH =================
  const fetchStockCheck = async () => {
    setLoading(true);
    try {
      const response = await getStockChecks({}, currentPage, LIMIT);
      setStockChecks(response.data);
      setTotalPages(Math.ceil(response.total / LIMIT))
    } catch {
      showToast('Lấy danh sách kiểm kê kho thất bại', 'error')
    } finally {
      setLoading(false)
    }
  }
  const fetchData = async () => {
    setLoading(true);
    try {
      const [ingRes, batchRes] = await Promise.all([
        getIngredients(undefined, undefined, undefined, undefined, 1, 100),
        getInventoryBatchs(undefined, 1, 100),
      ]);
      setIngredients(ingRes.data);
      setBatches(batchRes.data);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchStockCheck();
    fetchData();
  }, []);

  // ================= HELPERS =================
  const calculateSystemQty = (ingredientId: string) => {
    return batches
      .filter((b) => b.ingredientId === ingredientId)
      .reduce((sum, b) => sum + b.quantity, 0);
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        ingredientId: '',
        systemQty: 0,
        actualQty: 0,
        reason: '',
        diff: 0,
        adjustments: [],
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof StockCheckItem, value: any) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    setItems(updated);
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      if (items.length === 0) {
        showToast('Thêm nguyên liệu', 'error');
        return;
      }

      setLoading(true);

      const stockCheck = await createStockCheck({
        code: `SC${Date.now()}`,
        userId: user?.id || "",
        note: note,
        checkDate: new Date(checkDate),
      });

      if (!stockCheck) {
        showToast("Tạo kiểm kê kho thất bại", 'error');
        return;
      }
      console.log(stockCheck);

      for (const item of items) {
        // save detail
        await createStockCheckDetail({
          checkId: stockCheck?.id || "",
          ingredientId: item.ingredientId,
          systemQty: item.systemQty,
          actualQty: item.actualQty,
          reason: item.reason,
        });

        // ===== THIẾU =====
        if (item.diff < 0) {
          let diff = Math.abs(item.diff);

          const ingBatches = batches
            .filter((b) => b.ingredientId === item.ingredientId)
            .sort((a, b) => new Date(a.importDate).getTime() - new Date(b.importDate).getTime());

          for (const batch of ingBatches) {
            if (diff <= 0) break;

            const used = Math.min(batch.quantity, diff);

            batch.quantity -= used;
            diff -= used;

            await createInventoryBatch({
              ...batch,
              quantity: batch.quantity,
            });
          }
        }

        // ===== DƯ =====
        if (item.diff > 0) {
          if (!item.adjustments.length) {
            throw new Error('Thiếu expiry');
          }

          const sumAdj = item.adjustments.reduce((s, a) => s + a.quantity, 0);
          if (sumAdj !== item.diff) {
            throw new Error('Tổng chia lô không khớp');
          }

          for (const adj of item.adjustments) {
            await createInventoryBatch({
              ingredientId: item.ingredientId,
              quantity: adj.quantity,
              expiryDate: new Date(adj.expiryDate),
              importDate: new Date(),
            });
          }
        }
      }

      showToast('Kiểm kê thành công', 'success');
      setItems([]);
      fetchData();
      (document.getElementById('add_modal') as any).close();
    } catch (e: any) {
      showToast(e.message || 'Lỗi kiểm kê', 'error');
    } finally {
      setLoading(false);
    }
  };

  const goToPrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));
  const goToPage = (page: number) => { if (page >= 1 && page <= totalPages) setCurrentPage(page); };
  
  const pageNumbers = getPaginationRange(currentPage, totalPages);

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ================= UI =================
  if (loading) return <SplashScreen className="h-screen" />;

  return (
    <div className="p-6 flex flex-col gap-6">

      {/* HEADER */}
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Kiểm kê kho</h1>
        <button
          className="btn bg-darkgrey text-white px-2"
          onClick={() => (document.getElementById('add_modal') as any).showModal()}
        >
          <Plus size={16} /> Tạo phiếu kiểm kê
        </button>
      </div>

<div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="text-base-content/70">
                <tr>
                  <th>Mã kiểm kê</th>
                  <th>Người kiểm kê</th>
                  <th>Ghi chú</th>
                  <th>Ngày kiểm kê</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {stockChecks?.map((s) => (
                  <tr key={s.id} className="hover">
                    <td>
                      <div className="font-bold">{s.code}</div>
                    </td>
                    <td>
                      <div className="font-bold">{s.user.fullName}</div>
                    </td>
                    <td>
                      <div className="font-bold">{s.note}</div>
                    </td>
                    <td>{formatDate(s?.checkDate)}</td>
                    <td>
                      <div className="flex gap-1">
                        <button 
                          className="btn btn-ghost btn-circle btn-sm text-error"
                          onClick={() => {}}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-0">
            <button onClick={goToPrevPage} disabled={currentPage === 1} className="p-2 border rounded-xl disabled:opacity-50 hover:bg-gray-100 transition flex items-center gap-1 font-semibold uppercase px-4"><GrFormPrevious size={18} /> TRƯỚC</button>
            {pageNumbers.map((item, index) => (
                <React.Fragment key={index}>
                    {item === '...' ? (<span className="px-3 py-2 text-gray-700">...</span>) : (
                        <button onClick={() => goToPage(item as number)} className={`px-4 py-2 rounded-xl font-semibold transition border ${currentPage === item ? 'bg-black text-white border-black bg-neutral-950' : 'text-black border-gray-300 hover:bg-gray-100'}`}>{item}</button>
                    )}
                </React.Fragment>
            ))}
            <button onClick={goToNextPage} disabled={currentPage === totalPages} className="p-2 border rounded-xl disabled:opacity-50 hover:bg-gray-100 transition flex items-center gap-1 font-semibold uppercase px-4">TIẾP <GrFormNext size={18} className="rotate-180" /></button>
        </div>
      )}

      {/* MODAL */}
      <dialog id="add_modal" className="modal">
        <div className="modal-box max-w-4xl space-y-4">

          {/* DATE */}
          <div className='flex flex-row gap-4'>
            <div>
              <label className="label">
                <span className="label-text">Ngày kiểm kê</span>
              </label>
              <input
                type="date"
                className="input input-bordered rounded-lg w-full mt-2"
                value={checkDate}
                onChange={(e) => setCheckDate(e.target.value)}
              />
            </div>
            <div className="w-full">
              <label className="label">
                <span className="label-text">Ghi chú</span>
              </label>
              <textarea
                className="textarea textarea-bordered rounded-lg w-full mt-2"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          <button className="btn" onClick={handleAddItem}>
            <Plus size={16} /> Thêm nguyên liệu
          </button>

          {/* ITEMS */}
          {items.map((item, index) => (
            <div key={index} className="border p-4 rounded space-y-3 relative">

              <button
                className="bg-error rounded-full px-1 py-1 absolute top-1 right-1"
                onClick={() => handleRemoveItem(index)}
              >
                <X size={12} />
              </button>

              {/* INGREDIENT */}
              <IngredientDropdown
                value={item.ingredientId}
                getIngredientsApi={getIngredients}
                onChange={(id) => {
                  handleChange(index, 'ingredientId', id);
                  handleChange(index, 'systemQty', calculateSystemQty(id));
                }}
              />

              {/* QTY */}
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-2">
                  <label className="label">
                    <span className="label-text">Số lượng tồn kho</span>
                  </label>
                  <input className="input input-bordered" value={item.systemQty > 0 ? item.systemQty : ''} placeholder='Hết nguyên liệu'  disabled />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="label">
                    <span className="label-text">Số lượng thực tế</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={item.actualQty > 0 ? item.actualQty : ''}
                    onChange={(e) => {
                      const actual = Number(e.target.value);
                      const diff = actual - item.systemQty;
                      handleChange(index, 'actualQty', actual);
                      handleChange(index, 'diff', diff);
                    }}
                    placeholder='nhập tồn kho thực tế'
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="label">
                    <span className="label-text">Chênh lệch</span>
                  </label>
                  <input
                    className={`input input-bordered ${
                      item.diff > 0 ? 'text-success' : item.diff < 0 ? 'text-error' : ''
                    }`}
                    value={item.diff ? item.diff : ''}
                    placeholder='Chưa có chênh lệch'
                    disabled
                  />
                </div>
              </div>
              <div className="w-full">
                <label className="label">
                  <span className="label-text">Lý do</span>
                </label>
                <textarea
                  className="textarea textarea-bordered rounded-lg w-full mt-2"
                  value={item.reason}
                  onChange={(e) => handleChange(index, 'reason', e.target.value)}
                  placeholder='nhập lý do'
                />
              </div>

              {/* DƯ */}
              {item.diff > 0 && (
                <div className="space-y-2">
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      handleChange(index, 'adjustments', [
                        ...item.adjustments,
                        { quantity: 0, expiryDate: '' },
                      ]);
                    }}
                  >
                    + Chia lô
                  </button>

                  {(item.adjustments || []).map((adj, i) => (
                    <div key={i} className="flex flex-row justify-between gap-2">
                      <div className="flex flex-row w-full gap-2">
                        <input
                          type="number"
                          className="input input-bordered"
                          value={adj.quantity}
                          onChange={(e) => {
                            const newAdj = [...item.adjustments];
                            newAdj[i].quantity = Number(e.target.value);
                            handleChange(index, 'adjustments', newAdj);
                          }}
                        />
                        <input
                          type="date"
                          className="input input-bordered"
                          value={adj.expiryDate}
                          onChange={(e) => {
                            const newAdj = [...item.adjustments];
                            newAdj[i].expiryDate = e.target.value;
                            handleChange(index, 'adjustments', newAdj);
                          }}
                        />
                      </div>
                      <button
                        className='text-error'
                        onClick={() => {
                          const newAdj = [...item.adjustments];
                          newAdj.splice(i, 1);
                          handleChange(index, 'adjustments', newAdj);
                        }}
                      >
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  ))}

                </div>
              )}

            </div>
          ))}

          <div className="modal-action">
            <form method="dialog">
              <button className="btn" onClick={() => {
                setNote('');
                setItems([]);
              }}>Huỷ</button>
            </form>
            <button className="btn bg-darkgrey text-white px-2" onClick={handleSubmit}>
              Lưu kiểm kê
            </button>
          </div>

        </div>
      </dialog>

    </div>
  );
}