"use client";

import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { SplashScreen } from "@/components/loading";
import { useToast } from "@/context/toast-context";

import {
  getUnitConversions,
  createUnitConversion,
  updateUnitConversion,
  deleteUnitConversion,
} from "@/apis/unit-conversion";

import { getIngredients } from "@/apis/ingredient";

import {
  IUnitConversion,
  IUnitConversionCreate,
  IUnitConversionDetail,
  IUnitConversionUpdate,
} from "@/interfaces/unit-conversion";
import { IIngredient } from "@/interfaces/ingredient";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

const ITEMS_PER_PAGE = 7;

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

const IngredientDropdown = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState<IIngredient[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const ref = React.useRef<HTMLDivElement>(null);

  // FETCH
  const fetchData = async (pageNum: number) => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const res = await getIngredients(undefined, undefined, undefined, undefined, pageNum, 10);

      if (res?.data) {
        setList((prev) => [...prev, ...res.data]);

        if (res.data.length < 10) {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  // SCROLL LOAD
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (scrollTop + clientHeight >= scrollHeight - 5) {
      const next = page + 1;
      setPage(next);
      fetchData(next);
    }
  };

  // CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (!ref.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const selected = list.find((i) => i.id === value);

  return (
    <div ref={ref} className="relative w-full">

      {/* SELECT BOX */}
      <div
        className="input input-bordered w-full cursor-pointer flex items-center"
        onClick={() => setOpen(!open)}
      >
        {selected?.name || "Chọn nguyên liệu"}
      </div>

      {/* DROPDOWN */}
      {open && (
        <div
          className="absolute z-50 mt-1 w-full border rounded bg-white max-h-60 overflow-y-auto shadow"
          onScroll={handleScroll}
        >
          {list.map((item) => (
            <div
              key={item.id}
              className={`p-2 cursor-pointer hover:bg-blue-100 ${
                value === item.id ? "bg-blue-200 font-semibold" : ""
              }`}
              onClick={() => {
                onChange(item.id);
                setOpen(false);
              }}
            >
              {item.name}
            </div>
          ))}

          {loading && (
            <div className="text-center p-2 text-sm">Đang tải...</div>
          )}

          {!hasMore && (
            <div className="text-center p-2 text-xs text-gray-400">
              Hết dữ liệu
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function AdminUnitConversionView() {
  const { showToast } = useToast();

  const [unitList, setUnitList] = useState<IUnitConversionDetail[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [editingUnit, setEditingUnit] = useState<IUnitConversionDetail>();
  const [unitToDelete, setUnitToDelete] = useState<IUnitConversionDetail>();

  // CREATE
  const [selectedIngredientId, setSelectedIngredientId] = useState("");
  const [newFromUnit, setNewFromUnit] = useState("");
  const [newToUnit, setNewToUnit] = useState("");
  const [newFactor, setNewFactor] = useState<number | "">("");

  // FETCH UNIT
  const fetchUnits = async () => {
    try {
      const res = await getUnitConversions(undefined, undefined, undefined, undefined, currentPage, ITEMS_PER_PAGE);
      if (res?.data) { 
        setUnitList(res.data);
        setTotalPages(Math.ceil(res.total / ITEMS_PER_PAGE));
      }
    } catch (err) {
      showToast("Lỗi tải danh sách", "error");
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchUnits().finally(() => setLoading(false));
  }, [currentPage]);
  // CREATE
  const handleCreate = async () => {
    if (!selectedIngredientId || !newFromUnit || !newToUnit || !newFactor) {
      showToast("Vui lòng nhập đầy đủ", "error");
      return;
    }

    const data: IUnitConversionCreate = {
      ingredientId: selectedIngredientId,
      fromUnit: newFromUnit,
      toUnit: newToUnit,
      factor: Number(newFactor),
    };

    try {
      await createUnitConversion(data);
      showToast("Tạo thành công", "success");
      fetchUnits();
    } catch {
      showToast("Tạo thất bại", "error");
    }

    (document.getElementById("add_modal") as HTMLDialogElement)?.close();

    setSelectedIngredientId("");
    setNewFromUnit("");
    setNewToUnit("");
    setNewFactor("");
  };

  // EDIT
  const handleOpenEdit = (unit: IUnitConversionDetail) => {
    setEditingUnit(unit);
    (document.getElementById("edit_modal") as HTMLDialogElement)?.showModal();
  };

  const handleUpdate = async () => {
    if (!editingUnit) return;

    try {
      await updateUnitConversion(editingUnit.id, {
        fromUnit: editingUnit.fromUnit,
        toUnit: editingUnit.toUnit,
        factor: editingUnit.factor,
      });

      showToast("Cập nhật thành công", "success");
      fetchUnits();
    } catch {
      showToast("Cập nhật thất bại", "error");
    }

    (document.getElementById("edit_modal") as HTMLDialogElement)?.close();
    setEditingUnit(undefined);
  };

  // DELETE
  const handleOpenDelete = (unit: IUnitConversionDetail) => {
    setUnitToDelete(unit);
    (document.getElementById("delete_modal") as HTMLDialogElement)?.showModal();
  };

  const handleDelete = async () => {
    if (!unitToDelete) return;

    try {
      await deleteUnitConversion(unitToDelete.id);
      showToast("Đã xoá", "success");
      fetchUnits();
    } catch {
      showToast("Xoá thất bại", "error");
    }

    (document.getElementById("delete_modal") as HTMLDialogElement)?.close();
    setUnitToDelete(undefined);
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
  
  if (loading) return <SplashScreen className="h-[100vh]" />;

  return (
    <div className="p-6 flex flex-col gap-6">

      {/* HEADER */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý quy đổi đơn vị</h1>
          <p className="text-base-content/70 text-sm">Trang chủ &gt; Quy đổi đơn vị</p>
        </div>
        
        <button
          className="btn btn-neutral bg-darkgrey text-white flex gap-2 px-2"
          onClick={() =>
            (document.getElementById("add_modal") as HTMLDialogElement)?.showModal()
          }
        >
          <Plus size={16} /> THÊM QUY ĐỔI ĐƠN VỊ
        </button>
      </div>

      {/* TABLE */}
      <div className="card bg-base-100 shadow">
        <div className="card-body overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Nguyên liệu</th>
                <th>Từ</th>
                <th>Đến</th>
                <th>Hệ số</th>
                <th>Ngày tạo</th>
                <th>Ngày cập nhật</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {unitList.map((item) => (
                <tr key={item.id}>
                  <td>{item.ingredient?.name}</td>
                  <td>{item.fromUnit}</td>
                  <td>{item.toUnit}</td>
                  <td>{item.factor}</td>
                  <td>{formatDate(item.createdAt)}</td>
                  <td>{formatDate(item.updatedAt)}</td>
                  <td className="flex gap-2">
                    <button className="btn btn-ghost btn-sm" onClick={() => handleOpenEdit(item)}>
                      <Edit size={14} />
                    </button>

                    <button className="btn btn-ghost btn-sm text-error" onClick={() => handleOpenDelete(item)}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

      <dialog id="add_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-3">Thêm Quy Đổi Đơn Vị</h3>

          <IngredientDropdown
            value={selectedIngredientId}
            onChange={setSelectedIngredientId}
          />

          <input
            placeholder="Từ đơn vị"
            value={newFromUnit}
            onChange={(e) => setNewFromUnit(e.target.value)}
            className="input input-bordered w-full mt-2"
          />

          <input
            placeholder="Đến đơn vị"
            value={newToUnit}
            onChange={(e) => setNewToUnit(e.target.value)}
            className="input input-bordered w-full mt-2"
          />

          <input
            type="number"
            placeholder="Hệ số"
            value={newFactor}
            onChange={(e) => setNewFactor(Number(e.target.value))}
            className="input input-bordered w-full mt-2"
          />

          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Huỷ</button>
            </form>
            <button className="btn btn-primary bg-darkgrey text-white px-2" onClick={handleCreate}>
              Lưu
            </button>
          </div>
        </div>
      </dialog>

      <dialog id="edit_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-3">Chỉnh Sửa Quy Đổi Đơn Vị</h3>

          <input
            placeholder="Từ đơn vị"
            value={editingUnit?.fromUnit || ""}
            onChange={(e) => setEditingUnit(prev => prev ? { ...prev, fromUnit: e.target.value } : prev)}
            className="input input-bordered w-full mt-2"
          />

          <input
            placeholder="Đến đơn vị"
            value={editingUnit?.toUnit || ""}
            onChange={(e) => setEditingUnit(prev => prev ? { ...prev, toUnit: e.target.value } : prev)}
            className="input input-bordered w-full mt-2"
          />

          <input
            type="number"
            placeholder="Hệ số"
            value={editingUnit?.factor || ""}
            onChange={(e) => setEditingUnit(prev => prev ? { ...prev, factor: Number(e.target.value) } : prev)}
            className="input input-bordered w-full mt-2"
          />

          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Huỷ</button>
            </form>
            <button className="btn btn-primary bg-darkgrey text-white px-2" onClick={handleUpdate}>
              Lưu
            </button>
          </div>
        </div>
      </dialog>

      <dialog id="delete_modal" className="modal">
        <div className="modal-box"> 
          <h3 className="font-bold text-lg">Xác nhận xoá!</h3> 
          <p className="py-4"> Bạn có chắc muốn xoá{" "} 
            <strong className="text-error"> 
              {unitToDelete?.fromUnit} → {unitToDelete?.toUnit} 
            </strong> 
            ? 
            <br/>
            Hành động này không thể hoàn tác!
          </p> 
          <div className="modal-action"> 
            <form method="dialog"> 
              <button className="btn">Huỷ</button> 
            </form> 
            <button className="btn btn-error bg-error text-white px-2" onClick={handleDelete}> Xoá </button> 
          </div> 
        </div> 
      </dialog>
    </div>
  );
}