"use client";

import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";

// interfaces
import {
  ICombo,
  IComboItemDetail,
} from "@/interfaces/combo";

import { IProduct } from "@/interfaces/product";
import { IVariant } from "@/interfaces/variant";

// apis
import {
  getCombos,
  createCombo,
  updateCombo,
  deleteCombo,
  getComboItems,
  createComboItem,
  deleteComboItem,
} from "@/apis/combo";

import { getProducts } from "@/apis/product";
import { getVariants } from "@/apis/variant";

export default function AdminComboView() {
  const [combos, setCombos] = useState<ICombo[]>([]);
  const [selectedCombo, setSelectedCombo] = useState<ICombo | null>(null);
  const [items, setItems] = useState<IComboItemDetail[]>([]);

  const [products, setProducts] = useState<IProduct[]>([]);
  const [variants, setVariants] = useState<IVariant[]>([]);

  const [loading, setLoading] = useState(true);

  // modal
  const [showComboModal, setShowComboModal] = useState(false);
  const [editingCombo, setEditingCombo] = useState<ICombo | null>(null);

  const [showItemModal, setShowItemModal] = useState(false);

  const [formCombo, setFormCombo] = useState({
    name: "",
    price: 0,
  });

  const [formItem, setFormItem] = useState({
    productId: "",
    variantId: "",
    quantity: 1,
  });

  // ================= FETCH =================
  const fetchCombos = async () => {
    const name = undefined;
    const price = undefined;

    const page = 1;
    const limit = 100;
    const res = await getCombos(name, price, page, limit);
    if (res) setCombos(res.data);
  };

  const fetchItems = async () => {
    if (!selectedCombo) return;
    const comboId = selectedCombo.id;
    const productId = undefined;
    const variantId = undefined;
    const quantity = undefined;
    const page = 1;
    const limit = 100;
    const res = await getComboItems(comboId, productId, variantId, quantity, page, limit);
    if (res) setItems(res.data);
  };

  const fetchProducts = async () => {
    const name = undefined;
    const basePrice = undefined;

    const res = await getProducts({ name, basePrice }, 1, 100);
    if (res) setProducts(res.data);
  };

  const fetchVariants = async (productId?: string) => {
    if (!productId) return;
    const name = undefined;
    const priceDiff = undefined;
    const res = await getVariants({ productId, name, priceDiff }, 1, 100);
    if (res) setVariants(res.data);
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchCombos(), fetchProducts()]).finally(() =>
      setLoading(false)
    );
  }, []);

  useEffect(() => {
    fetchItems();
  }, [selectedCombo]);

  // ================= COMBO =================
  const openCreateCombo = () => {
    setEditingCombo(null);
    setFormCombo({ name: "", price: 0 });
    setShowComboModal(true);
  };

  const openEditCombo = (combo: ICombo) => {
    setEditingCombo(combo);
    setFormCombo({
      name: combo.name,
      price: combo.price,
    });
    setShowComboModal(true);
  };

  const handleSaveCombo = async () => {
    if (editingCombo) {
      await updateCombo(editingCombo.id, formCombo);
    } else {
      await createCombo(formCombo);
    }
    setShowComboModal(false);
    fetchCombos();
  };

  const handleDeleteCombo = async (id: string) => {
    if (!confirm("Xóa combo?")) return;
    await deleteCombo(id);
    fetchCombos();
    setSelectedCombo(null);
  };

  // ================= ITEM =================
  const openCreateItem = () => {
    setFormItem({
      productId: "",
      variantId: "",
      quantity: 1,
    });
    setVariants([]);
    setShowItemModal(true);
  };

  const handleSaveItem = async () => {
    if (!selectedCombo) return;

    await createComboItem({
      comboId: selectedCombo.id,
      ...formItem,
    });

    setShowItemModal(false);
    fetchItems();
  };

  const handleUpdateItem = async (id: string) => {
    
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Xóa item?")) return;
    await deleteComboItem(id);
    fetchItems();
  };

  // ================= UI =================
  return (
    <div className="p-6 bg-base-200 space-y-6 overflow-hidden">
      {/* HEADER */}
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Combo</h1>

        <button
          onClick={openCreateCombo}
          className="btn bg-darkgrey text-white px-2"
        >
          <Plus size={18} /> Thêm Combo
        </button>
      </div>

      <div className="flex gap-6">
        {/* LEFT */}
        <div className="w-1/3 bg-white p-4 rounded-2xl shadow max-h-[80vh] overflow-auto">
          {combos.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedCombo(c)}
              className={`p-4 border rounded-xl mb-2 cursor-pointer ${
                selectedCombo?.id === c.id
                  ? "bg-darkgrey text-white"
                  : "hover:bg-base-200"
              }`}
            >
              <div className="flex justify-between">
                <div>
                  <p>{c.name}</p>
                  <p className="text-sm opacity-70">
                    {c.price}đ
                  </p>
                </div>

                <div className="flex gap-1">
                  <button onClick={() => openEditCombo(c)} className="btn btn-xs btn-ghost">
                    Sửa
                  </button>
                  <button onClick={() => handleDeleteCombo(c.id)} className="btn btn-xs btn-ghost text-error">
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div className="w-2/3 bg-white p-5 rounded-2xl shadow">
          {selectedCombo ? (
            <>
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  {selectedCombo.name}
                </h2>

                <button
                  onClick={openCreateItem}
                  className="btn btn-sm bg-darkgrey text-white px-2"
                >
                  + Thêm sản phẩm
                </button>
              </div>

              <div className="space-y-3 max-h-[60vh] overflow-auto">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between border p-4 rounded-xl"
                  >
                    <div>
                      <p className="font-medium">
                        {item.product.name}
                      </p>
                      <p className="text-sm opacity-60">
                        {item.variant?.name} x {item.quantity}
                      </p>
                    </div>

                    <div className="flex gap-1">
                        <button
                            onClick={() => handleUpdateItem(item.id)}
                            className="btn btn-xs btn-ghost bg-darkgrey text-white px-2 py-4"
                        >
                            Cập nhật
                        </button>

                        <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="btn btn-xs btn-error bg-error text-white px-2 py-4"
                        >
                        Xóa
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center text-gray-400">
              Chọn combo
            </div>
          )}
        </div>
      </div>

      {/* ================= COMBO MODAL ================= */}
      {showComboModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96 space-y-4">
            <h2 className="font-bold">
              {editingCombo ? "Cập nhật" : "Tạo"} Combo
            </h2>

            <input
              className="input input-bordered w-full"
              placeholder="Tên combo"
              value={formCombo.name}
              onChange={(e) =>
                setFormCombo({ ...formCombo, name: e.target.value })
              }
            />

            <input
              type="number"
              className="input input-bordered w-full"
              placeholder="Giá"
              value={formCombo.price}
              onChange={(e) =>
                setFormCombo({
                  ...formCombo,
                  price: Number(e.target.value),
                })
              }
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowComboModal(false)} className="btn btn-outline bg-graymain text-white px-2 py-4">
                Hủy
              </button>
              <button
                onClick={handleSaveCombo}
                className="btn btn-primary bg-darkgrey text-white px-2 py-4"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ITEM MODAL ================= */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96 space-y-4">
            <h2 className="font-bold">Thêm sản phẩm</h2>

            {/* PRODUCT */}
            <select
              className="select select-bordered w-full"
              value={formItem.productId}
              onChange={(e) => {
                setFormItem({
                  ...formItem,
                  productId: e.target.value,
                });
                fetchVariants(e.target.value);
              }}
            >
              <option value="">Chọn product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* VARIANT */}
            <select
              className="select select-bordered w-full"
              value={formItem.variantId}
              onChange={(e) =>
                setFormItem({
                  ...formItem,
                  variantId: e.target.value,
                })
              }
            >
              <option value="">Chọn variant</option>
              {variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>

            {/* QUANTITY */}
            <input
              type="number"
              className="input input-bordered w-full"
              value={formItem.quantity}
              onChange={(e) =>
                setFormItem({
                  ...formItem,
                  quantity: Number(e.target.value),
                })
              }
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowItemModal(false)} className="btn btn-outline bg-graymain text-white px-2 py-4">
                Hủy
              </button>
              <button
                onClick={handleSaveItem}
                className="btn btn-primary bg-darkgrey text-white px-2 py-4"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}