'use client'

import React from "react"
import { getProducts } from "@/apis/product"
import { getVariants } from "@/apis/variant"
import { getOptionItems } from "@/apis/option"
import { getRecipes, createRecipe, updateRecipe, deleteRecipe } from "@/apis/recipe"
import { getIngredients } from "@/apis/ingredient"

import { useToast } from "@/context/toast-context"
import { Plus, Trash2 } from "lucide-react"
import { IProductDetails } from "@/interfaces/product"
import { IVariant } from "@/interfaces/variant"
import { IOptionItem } from "@/interfaces/option"
import { IIngredientDetail } from "@/interfaces/ingredient"

const LIMIT = 10

export default function RecipeView() {
  const { showToast } = useToast()
  const [mode, setMode] = React.useState<"product" | "option">("product")

  // ================= DATA STATES =================
  const [products, setProducts] = React.useState<IProductDetails[]>([])
  const [variants, setVariants] = React.useState<IVariant[]>([])
  const [options, setOptions] = React.useState<IOptionItem[]>([])
  const [ingredients, setIngredients] = React.useState<IIngredientDetail[]>([])
  const [displayRecipes, setDisplayRecipes] = React.useState<any[]>([])

  // ================= PAGINATION STATES =================
  const [totalProduct, setTotalProduct] = React.useState(LIMIT)
  const [totalVariant, setTotalVariant] = React.useState(LIMIT)
  const [totalOption, setTotalOption] = React.useState(LIMIT)
  const [totalIngredient, setTotalIngredient] = React.useState(LIMIT)

  const [productPage, setProductPage] = React.useState(1)
  const [variantPage, setVariantPage] = React.useState(1)
  const [optionPage, setOptionPage] = React.useState(1)
  const [ingredientPage, setIngredientPage] = React.useState(1)

  // ================= SELECTION STATES =================
  const [selectedProduct, setSelectedProduct] = React.useState<IProductDetails | null>(null)
  const [selectedVariant, setSelectedVariant] = React.useState<IVariant | null>(null)
  const [selectedOption, setSelectedOption] = React.useState<IOptionItem | null>(null)

  // ================= ADD MODAL STATES =================
  const [selectedIngredientId, setSelectedIngredientId] = React.useState("")
  const [amount, setAmount] = React.useState(0)
  const [deleteTarget, setDeleteTarget] = React.useState<any>(null)

  // ================= HELPERS =================
  const canLoadMore = (page: number, total: number) => page <= Math.ceil(total / LIMIT)

  // ================= API LOADERS =================
  const loadRecipes = async (pId?: string, vId?: string, oId?: string) => {
    try {
      // Gọi API với cả productId và variantId đồng thời
      const res = await getRecipes(undefined, undefined, pId, vId, oId, 1, 100)
      setDisplayRecipes(res.data)
    } catch (error) {
      showToast("Không thể tải công thức", "error")
    }
  }

  const loadProducts = async (page = 1) => {
    if (!canLoadMore(page, totalProduct)) return
    const res = await getProducts({}, page, LIMIT)
    setProducts(prev => page === 1 ? res.data : [...prev, ...res.data])
    setTotalProduct(res.total)
  }

  const loadVariants = async (productId: string, page = 1) => {
    const res = await getVariants({ productId }, page, LIMIT)
    setVariants(prev => page === 1 ? res.data : [...prev, ...res.data])
    setTotalVariant(res.total)
    return res.data
  }

  const loadOptions = async (page = 1) => {
    if (!canLoadMore(page, totalOption)) return
    const res = await getOptionItems(undefined, undefined, undefined, page, LIMIT)
    setOptions(prev => page === 1 ? res.data : [...prev, ...res.data])
    setTotalOption(res.total)
  }

  const loadIngredients = async (page = 1) => {
    const res = await getIngredients(undefined, undefined, undefined, undefined, page, LIMIT)
    setIngredients(prev => page === 1 ? res.data : [...prev, ...res.data])
    setTotalIngredient(res.total)
  }

  React.useEffect(() => {
    if (mode === "product") loadProducts(1)
    else loadOptions(1)
    setDisplayRecipes([])
  }, [mode])

  // ================= HANDLERS =================
  const handleProductSelect = async (p: any) => {
    setSelectedProduct(p)
    setVariantPage(1)
    setVariants([])
    
    const vs = await loadVariants(p.id, 1)
    if (vs.length > 0) {
      setSelectedVariant(vs[0])
      loadRecipes(p.id, vs[0].id)
    } else {
      setSelectedVariant(null)
      loadRecipes(p.id)
    }
  }

  const handleVariantSelect = async (v: any) => {
    setSelectedVariant(v)
    loadRecipes(selectedProduct?.id, v.id)
  }

  const handleOptionSelect = async (o: any) => {
    setSelectedOption(o)
    loadRecipes(undefined, undefined, o.id)
  }

  const handleAdd = async () => {
    try {
      const payload: any = { ingredientId: selectedIngredientId, amount }
      
      if (mode === "product") {
        if (!selectedProduct) return
        payload.productId = selectedProduct.id
        payload.variantId = selectedVariant?.id
      } else {
        if (!selectedOption) return
        payload.optionItemId = selectedOption.id
      }

      await createRecipe(payload)
      showToast("Thêm thành công", "success")
      
      // Refresh data
      if (mode === "product") loadRecipes(selectedProduct?.id, selectedVariant?.id)
      else loadRecipes(undefined, undefined, selectedOption?.id)

      ;(document.getElementById("add_modal") as HTMLDialogElement).close()
    } catch {
      showToast("Thêm thất bại", "error")
    }
  }

  const handleUpdate = async (recipe: any, newAmount: number) => {
    if (!recipe?.id) return
    try {
      await updateRecipe(recipe.id, { amount: newAmount })
      showToast("Đã cập nhật", "success")
    } catch {
      showToast("Cập nhật thất bại", "error")
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget?.id) return
    try {
      await deleteRecipe(deleteTarget.id)
      showToast("Đã xóa", "success")
      
      if (mode === "product") loadRecipes(selectedProduct?.id, selectedVariant?.id)
      else loadRecipes(undefined, undefined, selectedOption?.id)
      
      setDeleteTarget(null)
      ;(document.getElementById("delete_modal") as HTMLDialogElement).close()
    } catch {
      showToast("Xóa thất bại", "error")
    }
  }

  // ================= COMPONENTS =================
  function List({ items, onSelect, selected, onLoadMore }: any) {
    const ref = React.useRef<HTMLDivElement>(null)
    
    React.useEffect(() => {
      const el = ref.current
      if (!el) return
      const handle = () => {
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) onLoadMore()
      }
      el.addEventListener("scroll", handle)
      return () => el.removeEventListener("scroll", handle)
    }, [onLoadMore])

    return (
      <div ref={ref} className="card bg-white shadow p-3 h-[500px] overflow-auto border border-base-200">
        {items.map((i: any) => (
          <div
            key={i.id}
            onClick={() => onSelect(i)}
            className={`p-3 border rounded mb-2 cursor-pointer transition-colors
            ${selected?.id === i.id ? "bg-neutral text-white border-neutral" : "hover:bg-base-200"}`}
          >
            {i.name}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản lý công thức</h1>
          <p className="text-base-content/70 text-sm">Trang chủ &gt; Công thức</p>
        </div>
        <div className="flex gap-4">
          <div className="join border border-base-300">
            <button className={`join-item btn btn-sm ${mode === "product" ? "btn-neutral" : ""}`} onClick={() => setMode("product")}>Món ăn</button>
            <button className={`join-item btn btn-sm ${mode === "option" ? "btn-neutral" : ""}`} onClick={() => setMode("option")}>Tuỳ chọn</button>
          </div>
          <button className="btn btn-sm btn-neutral" onClick={() => {
            setIngredients([]); setIngredientPage(1); loadIngredients(1);
            (document.getElementById("add_modal") as HTMLDialogElement).showModal();
          }}>
            <Plus size={16} /> Thêm công thức
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {mode === "product" ? (
          <>
            <div className="col-span-3">
              <p className="font-semibold mb-2 ml-1">Sản phẩm</p>
              <List items={products} selected={selectedProduct} onSelect={handleProductSelect}
                onLoadMore={() => { setProductPage(p => p + 1); loadProducts(productPage + 1) }} />
            </div>
            <div className="col-span-3">
              <p className="font-semibold mb-2 ml-1">Biến thể</p>
              <List items={variants} selected={selectedVariant} onSelect={handleVariantSelect}
                onLoadMore={() => { if (selectedProduct) { setVariantPage(v => v + 1); loadVariants(selectedProduct.id, variantPage + 1) } }} />
            </div>
          </>
        ) : (
          <div className="col-span-4">
            <p className="font-semibold mb-2 ml-1">Tùy chọn (Options)</p>
            <List items={options} selected={selectedOption} onSelect={handleOptionSelect}
              onLoadMore={() => { setOptionPage(o => o + 1); loadOptions(optionPage + 1) }} />
          </div>
        )}

        <div className={mode === "product" ? "col-span-6" : "col-span-8"}>
          <p className="font-semibold mb-2 ml-1">Nguyên liệu thành phần</p>
          <div className="card bg-white shadow p-4 h-[500px] overflow-auto border border-base-200">
            <table className="table table-zebra w-full">
              <thead className="sticky top-0 bg-white z-10">
                <tr>
                  <th>Nguyên Liệu</th>
                  <th className="w-32 text-center">Định lượng</th>
                  <th className="w-20 text-center">Xóa</th>
                </tr>
              </thead>
              <tbody>
                {displayRecipes.map((r: any) => (
                  <tr key={r.id}>
                    <td className="font-medium">{r.ingredient?.name}</td>
                    <td>
                      <input
                        type="number"
                        defaultValue={r.amount}
                        onBlur={(e) => handleUpdate(r, Number(e.target.value))}
                        className="input input-sm input-bordered w-full text-center"
                      />
                    </td>
                    <td className="text-center">
                      <button onClick={() => { setDeleteTarget(r); (document.getElementById("delete_modal") as HTMLDialogElement).showModal() }} className="btn btn-ghost btn-xs text-error">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {displayRecipes.length === 0 && (
                  <tr><td colSpan={3} className="text-center py-10 text-base-content/50">Chưa có dữ liệu công thức</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <dialog id="add_modal" className="modal">
        <div className="modal-box max-w-sm">
          <h3 className="font-bold text-lg mb-4">Thêm nguyên liệu vào công thức</h3>
          <div className="space-y-4">
            <div className="form-control">
              <label className="label text-xs font-bold uppercase">Nguyên liệu</label>
              <IngredientDropdown
                value={selectedIngredientId}
                onChange={setSelectedIngredientId}
                items={ingredients}
                loadMore={() => { setIngredientPage(p => p + 1); loadIngredients(ingredientPage + 1) }}
              />
            </div>
            <div className="form-control">
              <label className="label text-xs font-bold uppercase">Định lượng</label>
              <input type="number" placeholder="Nhập số lượng..." className="input input-bordered w-full"
                onChange={(e) => setAmount(Number(e.target.value))} />
            </div>
          </div>
          <div className="modal-action">
            <form method="dialog"><button className="btn btn-ghost">Hủy</button></form>
            <button className="btn btn-neutral" onClick={handleAdd} disabled={!selectedIngredientId}>Lưu lại</button>
          </div>
        </div>
      </dialog>

      <dialog id="delete_modal" className="modal">
        <div className="modal-box max-w-xs">
          <h3 className="font-bold text-lg">Xác nhận xóa</h3>
          <p className="py-4">Bạn có chắc chắn muốn xóa nguyên liệu này khỏi công thức?</p>
          <div className="modal-action">
            <form method="dialog"><button className="btn btn-ghost">Hủy</button></form>
            <button className="btn btn-error text-white" onClick={handleDelete}>Xác nhận</button>
          </div>
        </div>
      </dialog>
    </div>
  )
}

function IngredientDropdown({ value, onChange, items, loadMore }: any) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handle = (e: any) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener("mousedown", handle)
    return () => document.removeEventListener("mousedown", handle)
  }, [])

  const onScroll = () => {
    const el = scrollRef.current
    if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 5) loadMore()
  }

  const selected = items.find((i: any) => i.id === value)

  return (
    <div ref={ref} className="relative w-full">
      <div onClick={() => setOpen(!open)} className="input input-bordered flex items-center justify-between cursor-pointer">
        <span className={selected ? "text-base-content" : "text-base-content/50"}>{selected?.name || "Chọn nguyên liệu..."}</span>
        <span className="text-xs">▼</span>
      </div>
      {open && (
        <div ref={scrollRef} onScroll={onScroll} className="absolute bg-white border border-base-300 w-full max-h-60 overflow-auto mt-1 rounded-lg shadow-xl z-[100]">
          {items.map((i: any) => (
            <div key={i.id} onClick={() => { onChange(i.id); setOpen(false) }}
              className={`p-3 cursor-pointer hover:bg-neutral hover:text-white transition-colors border-b border-base-100 last:border-0
              ${value === i.id ? "bg-neutral text-white" : ""}`}>
              {i.name} <span className="text-xs opacity-60">({i.unit})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}