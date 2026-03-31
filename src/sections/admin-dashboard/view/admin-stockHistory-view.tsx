'use client';

import React from 'react';
import { getStockChecks } from '@/apis/stock-check';
import { getStockCheckDetails } from '@/apis/stock-check-detail';
import { getInventoryBatchs } from '@/apis/inventory-batch';
import { SplashScreen } from '@/components/loading';
import { useToast } from '@/context/toast-context';
import { IStockCheckFull } from '@/interfaces/stock-check';

const LIMIT = 10;

export default function StockCheckHistoryView() {
  const { showToast } = useToast();

  const [loading, setLoading] = React.useState(false);

  const [stockChecks, setStockChecks] = React.useState<IStockCheckFull[]>([]);
  const [selected, setSelected] = React.useState<IStockCheckFull | null>(null);

  const [details, setDetails] = React.useState<any[]>([]);
  const [batches, setBatches] = React.useState<any[]>([]);

  // ================= FETCH =================
  const fetchStockChecks = async () => {
    setLoading(true);
    try {
      const res = await getStockChecks({}, 1, LIMIT);
      setStockChecks(res.data);
    } catch {
      showToast('Lỗi load lịch sử', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchDetails = async (checkId: string) => {
    setLoading(true);
    try {
      const [detailRes, batchRes] = await Promise.all([
        getStockCheckDetails({ checkId }, 1, 100),
        getInventoryBatchs(undefined, 1, 100),
      ]);

      setDetails(detailRes.data);
      setBatches(batchRes.data);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchStockChecks();
  }, []);

  React.useEffect(() => {
    if (selected) fetchDetails(selected.id);
  }, [selected]);

  // ================= HELPERS =================
  const getBatchChanges = (ingredientId: string) => {
    return batches.filter(b => b.ingredientId === ingredientId);
  };

  const formatDate = (d: string | Date) =>
    new Date(d).toLocaleDateString('vi-VN');

  // ================= UI =================
  if (loading) return <SplashScreen className="h-screen" />;

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <h1 className="text-3xl font-bold">Lịch sử điều chỉnh kho</h1>

      {/* TABLE */}
      <div className="card bg-base-100 shadow">
        <div className="card-body overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Người</th>
                <th>Ngày</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {stockChecks.map(s => (
                <tr
                  key={s.id}
                  className="hover cursor-pointer"
                  onClick={() => setSelected(s)}
                >
                  <td>{s.code}</td>
                  <td>{s.user?.fullName}</td>
                  <td>{formatDate(s.checkDate)}</td>
                  <td>{s.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selected && (
        <dialog open className="modal">
          <div className="modal-box max-w-6xl space-y-6">

            {/* HEADER */}
            <div className="flex justify-between">
              <div>
                <h2 className="text-2xl font-bold">{selected.code}</h2>
                <p>{selected.user?.fullName}</p>
              </div>
              <button className="btn" onClick={() => setSelected(null)}>
                Đóng
              </button>
            </div>

            {/* DETAILS */}
            {details.map((d, index) => (
              <div key={index} className="border rounded p-4 space-y-3">

                <div className="flex justify-between">
                  <h3 className="font-bold text-lg">
                    {d.ingredient?.name}
                  </h3>

                  <span
                    className={`badge ${
                      d.actualQty > d.systemQty
                        ? 'badge-success'
                        : d.actualQty < d.systemQty
                        ? 'badge-error'
                        : ''
                    }`}
                  >
                    {d.actualQty - d.systemQty}
                  </span>
                </div>

                {/* QTY */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>Tồn hệ thống: {d.systemQty}</div>
                  <div>Thực tế: {d.actualQty}</div>
                  <div>Lý do: {d.reason}</div>
                </div>

                {/* BATCH */}
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-2">Batch liên quan</p>

                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Batch ID</th>
                        <th>Số lượng</th>
                        <th>Expiry</th>
                        <th>Import</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getBatchChanges(d.ingredientId).map(b => (
                        <tr key={b.id}>
                          <td>{b.id.slice(0, 6)}</td>
                          <td>{b.quantity}</td>
                          <td>{formatDate(b.expiryDate)}</td>
                          <td>{formatDate(b.importDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            ))}

          </div>
        </dialog>
      )}

    </div>
  );
}