'use client';

import React from 'react';
import { Plus, X, Trash2 } from 'lucide-react';

import { getImportInvoices, createImportInvoice } from '@/apis/import-invoice';
import { createImportInvoiceDetail, getImportInvoiceDetails } from '@/apis/import-invoice-detail';
import { getIngredients } from '@/apis/ingredient';
import { createInventoryBatch } from '@/apis/inventory-batch';
import { getSuppliers } from '@/apis/supplier';

import { SplashScreen } from '@/components/loading';
import { useToast } from '@/context/toast-context';
import { IImportInvoiceFull } from '@/interfaces/import-invoice';
import { IImportInvoiceItemDetail } from '@/interfaces/import-invoice-detail';

const LIMIT = 10;

interface AddItem {
  ingredientId: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  expiryDate: string;
}

export default function StockInView() {
  const { showToast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const [importInvoices, setImportInvoices] = React.useState<IImportInvoiceFull[]>([]);
  const [selectedInvoice, setSelectedInvoice] = React.useState<IImportInvoiceFull | null>(null);

  const [importInvoiceDetails, setImportInvoiceDetails] = React.useState<IImportInvoiceItemDetail[]>([]);

  const [items, setItems] = React.useState<AddItem[]>([]);
  const [importDate, setImportDate] = React.useState<string>(new Date().toISOString().split("T")[0]);

  const [suppliers, setSuppliers] = React.useState<any[]>([]);
  const [selectedSupplier, setSelectedSupplier] = React.useState<any>(null);
  const [ingredients, setIngredients] = React.useState<any[]>([]);

  // ================= FETCH =================
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await getImportInvoices({}, 1, LIMIT);
      setImportInvoices(res.data);
    } finally {
      setLoading(false);
    }
  };    

  const fetchInvoiceDetails = async (invoiceId: string) => {
    setLoading(true);
    try {
      const res = await getImportInvoiceDetails({ invoiceId }, 1, LIMIT);
      setImportInvoiceDetails(res.data);
    } finally {
      setLoading(false);
    }
  }

  const fetchSuppliers = async () => {
    const res = await getSuppliers(undefined, 1, LIMIT);
    setSuppliers(res.data);
  };

  const fetchIngredients = async () => {
    const res = await getIngredients(undefined, undefined, undefined, undefined, 1, LIMIT);
    setIngredients(res.data);
  };

  React.useEffect(() => {
    fetchInvoices();
    fetchSuppliers();
    fetchIngredients();
  }, []);

  React.useEffect(() => {
    if (selectedInvoice) {
      fetchInvoiceDetails(selectedInvoice.id);
    } else {
      setImportInvoiceDetails([]);
    }
  }, [selectedInvoice]);

  // ================= ITEM HANDLER =================
  const handleAddItem = () => {
    setItems(prev => [...prev, { ingredientId: '', unit: '', quantity: 0, unitPrice: 0, expiryDate: '' }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof AddItem, value: any) => {
    const updated = [...items];
    updated[index][field] = field === 'quantity' || field === 'unitPrice' ? Number(value) : value;
    setItems(updated);
  };

  // ================= ADD NEW INVOICE =================
  const handleSubmit = async () => {
    try {
      if (!selectedSupplier) { showToast("Chọn nhà cung cấp", "error"); return; }
      if (items.length === 0) { showToast("Thêm ít nhất 1 nguyên liệu", "error"); return; }

      for (const item of items) {
        if (!item.ingredientId) { showToast("Chưa chọn nguyên liệu", "error"); return; }
        if (item.quantity <= 0) { showToast("Số lượng phải > 0", "error"); return; }
      }

      const totalCost = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
      setLoading(true);

      const invoice = await createImportInvoice({
        code: `PN${Date.now()}`,
        supplierId: selectedSupplier.id,
        totalCost,
        importDate: new Date(importDate),
      });

      for (const item of items) {
        const detail = await createImportInvoiceDetail({
          invoiceId: invoice.id,
          ingredientId: item.ingredientId,
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: item.unitPrice
        });

        await createInventoryBatch({
          ingredientId: item.ingredientId,
          importInvoiceDetailId: detail.data.id,
          quantity: item.quantity,
          expiryDate: new Date(item.expiryDate),
          importDate: new Date(importDate)
        });
      }

      showToast("Tạo phiếu nhập thành công", "success");
      setItems([]); setSelectedSupplier(null); setImportDate(new Date().toISOString().split("T")[0]);
      fetchInvoices();
      (document.getElementById('add_modal') as any).close();
    } catch {
      showToast("Lỗi tạo phiếu nhập", "error");
    } finally { setLoading(false); }
  };

  // ================= UI =================
  if (loading) return <SplashScreen className="h-screen" />;

  return (
    <div className="p-6 flex flex-col gap-6">

      {/* HEADER */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý nhập kho</h1>
          <p className="text-base-content/70 text-sm">Trang chủ &gt; Nhập kho</p>
        </div>
        <button className="btn bg-darkgrey text-white px-2" onClick={() => (document.getElementById('add_modal') as any).showModal()}>
          <Plus size={16} /> Thêm phiếu nhập
        </button>
      </div>

      {/* INVOICE TABLE */}
      <div className="card bg-base-100 shadow">
        <div className="card-body overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Mã phiếu</th><th>Nhà cung cấp</th><th>Tổng tiền</th><th>Ngày nhập</th>
              </tr>
            </thead>
            <tbody>
              {importInvoices.map(inv => (
                <tr key={inv.id} onClick={() => setSelectedInvoice(inv)}>
                  <td>{inv.code}</td>
                  <td>{inv.supplier?.name || "N/A"}</td>
                  <td>{inv.totalCost.toLocaleString("vi-VN")} đ</td>
                  <td>{new Date(inv.importDate).toLocaleDateString("vi-VN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== ADD MODAL ===== */}
      <dialog id="add_modal" className="modal">
        <div className="modal-box max-w-4xl space-y-4">

          <div className="flex flex-row gap-4">
            <select className="select select-bordered w-full" value={selectedSupplier?.id || ""} onChange={(e) => {
                const sup = suppliers.find(s => s.id === e.target.value); setSelectedSupplier(sup);
            }}>
                <option value="">Chọn nhà cung cấp</option>
                {suppliers.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
            </select>

            {/* IMPORT DATE */}
            <input type="date" className="input input-bordered w-full" value={importDate} onChange={(e) => setImportDate(e.target.value)} />
            <button className="btn bg-darkgrey text-white px-2" onClick={handleAddItem}>+ Thêm nguyên liệu</button>
          </div>
          {/* ITEMS */}
          {items.map((item, index) => (
            <div key={index} className="border p-4 rounded relative space-y-3">
              <button className="bg-error rounded-full px-1 py-1 absolute top-1 right-1" onClick={() => handleRemoveItem(index)}>
                <X size={12} />
              </button>
              <select className="select select-bordered w-full" value={item.ingredientId} onChange={(e) => {
                const ing = ingredients.find(i => i.id === e.target.value);
                handleItemChange(index, "ingredientId", e.target.value);
                if (ing) handleItemChange(index, "unit", ing.unit || "");
              }}>
                <option value="">Chọn nguyên liệu</option>
                {ingredients.map(i => (<option key={i.id} value={i.id}>{i.name}</option>))}
              </select>

              <div className="grid grid-cols-2 gap-2">
                <input className="input input-bordered" placeholder="Đơn vị" value={item.unit} onChange={(e) => handleItemChange(index, "unit", e.target.value)} />
                <input type="number" className="input input-bordered" placeholder="Giá" value={item.unitPrice} onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)} />
                <input type="number" className="input input-bordered" placeholder="Số lượng" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} />
                <input type="date" className="input input-bordered" value={item.expiryDate} onChange={(e) => handleItemChange(index, "expiryDate", e.target.value)} />
              </div>

              <div className="font-semibold">Tổng: {(item.quantity * item.unitPrice).toLocaleString("vi-VN")} đ</div>
            </div>
          ))}
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Huỷ</button>
            </form>
            <form method="dialog">
              <button className="btn bg-darkgrey text-white px-2" onClick={handleSubmit}>Lưu phiếu nhập</button>
            </form>
          </div>

        </div>
      </dialog>

      {/* ===== DETAIL MODAL ===== */}
      {selectedInvoice && (
      <dialog open className="modal">
        <div className="modal-box max-w-5xl space-y-6">

            {/* HEADER */}
            <div className="flex justify-between items-start border-b pb-4">

            {/* LEFT */}
            <div>
                <h3 className="text-2xl font-bold tracking-wide">
                Phiếu nhập: {selectedInvoice.code}
                </h3>

                <div className="mt-2 flex gap-2">
                <span className="badge badge-outline">
                    Nhà cung cấp: {selectedInvoice.supplier?.name || "N/A"}
                </span>
                </div>
            </div>

            {/* RIGHT */}
            <div className="text-right space-y-1">
                <p className="text-sm text-gray-500">
                Ngày nhập
                </p>
                <p className="font-semibold">
                {new Date(selectedInvoice.importDate).toLocaleDateString("vi-VN")}
                </p>

                <p className="text-sm text-gray-500 mt-2">
                Tổng tiền
                </p>
                <p className="text-xl font-bold text-primary">
                {selectedInvoice.totalCost.toLocaleString("vi-VN")} đ
                </p>
            </div>

            </div>

            {/* TABLE */}
            <div className="overflow-x-auto border rounded-xl">
            <table className="table table-zebra">

                <thead className="bg-base-200">
                <tr>
                    <th>#</th>
                    <th>Nguyên liệu</th>
                    <th className="text-center">Đơn vị</th>
                    <th className="text-center">Số lượng</th>
                    <th className="text-right">Đơn giá</th>
                    <th className="text-right">Thành tiền</th>
                </tr>
                </thead>

                <tbody>
                {importInvoiceDetails.map((detail, index) => (
                    <tr key={detail.id} className="hover">

                    <td className="text-sm text-gray-400">
                        {index + 1}
                    </td>

                    <td className="font-medium">
                        {detail.ingredient?.name || "N/A"}
                    </td>

                    <td className="text-center">
                        <span className="badge badge-ghost">
                        {detail.unit}
                        </span>
                    </td>

                    <td className="text-center font-semibold">
                        {detail.quantity}
                    </td>

                    <td className="text-right">
                        {detail.unitPrice.toLocaleString("vi-VN")} đ
                    </td>

                    <td className="text-right font-semibold text-primary">
                        {(detail.quantity * detail.unitPrice).toLocaleString("vi-VN")} đ
                    </td>

                    </tr>
                ))}
                </tbody>

            </table>
            </div>

            {/* FOOTER */}
            <div className="flex justify-between items-center border-t pt-4">

            <div className="text-sm text-gray-500">
                Tổng số dòng: {importInvoiceDetails.length}
            </div>

            <div className="text-right">
                <p className="text-sm text-gray-500">Tổng thanh toán</p>
                <p className="text-2xl font-bold text-primary">
                {selectedInvoice.totalCost.toLocaleString("vi-VN")} đ
                </p>
            </div>

            </div>

            {/* ACTION */}
            <div className="modal-action">
            <button
                className="btn bg-darkgrey text-white px-4"
                onClick={() => setSelectedInvoice(null)}
            >
                Đóng
            </button>
            </div>

        </div>
        </dialog>
      )}

    </div>
  );
}