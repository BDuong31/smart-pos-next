'use client'

import React from "react"
import {
  getProducts,
} from "@/apis/product"
import {
  getVariants,
} from "@/apis/variant"
import {
  getOptionItems,
} from "@/apis/option"
import {
  getRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe
} from "@/apis/recipe"
import {
  getIngredients
} from "@/apis/ingredient"

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

  // ================= DATA =================
  const [products, setProducts] = React.useState<IProductDetails[]>([])
  const [variants, setVariants] = React.useState<IVariant[]>([])
  const [options, setOptions] = React.useState<IOptionItem[]>([])
  const [ingredients, setIngredients] = React.useState<IIngredientDetail[]>([])

  // ================= TOTAL =================
  const [totalProduct, setTotalProduct] = React.useState(LIMIT)
  const [totalVariant, setTotalVariant] = React.useState(LIMIT)
  const [totalOption, setTotalOption] = React.useState(LIMIT)
  const [totalIngredient, setTotalIngredient] = React.useState(LIMIT)

  // ================= PAGE =================
  const [productPage, setProductPage] = React.useState(1)
  const [variantPage, setVariantPage] = React.useState(1)
  const [optionPage, setOptionPage] = React.useState(1)
  const [ingredientPage, setIngredientPage] = React.useState(1)

  // ================= SELECT =================
  const [selectedProduct, setSelectedProduct] = React.useState<IProductDetails | null>(null)
  const [selectedVariant, setSelectedVariant] = React.useState<IVariant | null>(null)
  const [selectedOption, setSelectedOption] = React.useState<IOptionItem | null>(null)

  // ================= RECIPE =================
  const [recipeProducts, setRecipeProducts] = React.useState<any[]>([])
  const [recipeVariants, setRecipeVariants] = React.useState<any[]>([])
  const [recipeOptions, setRecipeOptions] = React.useState<any[]>([])

  // ================= ADD =================
  const [selectedIngredientId, setSelectedIngredientId] = React.useState("")
  const [amount, setAmount] = React.useState(0)

  const [deleteTarget, setDeleteTarget] = React.useState<any>(null)

  // ================= HELPER =================

  const canLoadMore = (page: number, total: number) => {
    return page <= Math.ceil(total / LIMIT)
  }

  // ================= LOAD =================

  const loadProducts = async (page = 1) => {
    if (!canLoadMore(page, totalProduct)) return

    const res = await getProducts({}, page, LIMIT)
    setProducts(prev => page === 1 ? res.data : [...prev, ...res.data])
    setTotalProduct(res.total)
  }

  const loadVariants = async (productId: string, page = 1) => {
    if (!canLoadMore(page, totalVariant)) return []

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
    if (!canLoadMore(page, totalIngredient)) return

    const res = await getIngredients(undefined, undefined, undefined, undefined, page, LIMIT)
    setIngredients(prev => page === 1 ? res.data : [...prev, ...res.data])
    setTotalIngredient(res.total)
  }

  React.useEffect(() => {
    if (mode === "product") loadProducts(1)
    else loadOptions(1)
  }, [mode])

  // ================= SELECT =================

  const handleProductSelect = async (p: any) => {
    setSelectedProduct(p)

    setVariantPage(1)
    setVariants([])
    setTotalVariant(0)

    const vs = await loadVariants(p.id, 1)

    const base = await getRecipes(undefined, undefined, p.id, undefined, undefined, 1, 100)
    setRecipeProducts(base.data)

    if (vs.length > 0) {
      setSelectedVariant(vs[0])
      const vr = await getRecipes(undefined, undefined, undefined, vs[0].id, undefined, 1, 100)
      setRecipeVariants(vr.data)
    }
  }

  const handleVariantSelect = async (v: any) => {
    setSelectedVariant(v)
    const res = await getRecipes(undefined, undefined, undefined, v.id, undefined, 1, 100)
    setRecipeVariants(res.data)
  }

  const handleOptionSelect = async (o: any) => {
    setSelectedOption(o)
    const res = await getRecipes(undefined, undefined, undefined, undefined, o.id, 1, 100)
    setRecipeOptions(res.data)
  }

  // ================= MERGE =================

  const merged = () => {
    const map = new Map()

    recipeProducts.forEach(r => {
      map.set(r.ingredientId, {
        ingredientName: r.ingredient?.name,
        base: r,
        variant: null
      })
    })

    recipeVariants.forEach(r => {
      const ex = map.get(r.ingredientId) || {}
      map.set(r.ingredientId, {
        ...ex,
        variant: r
      })
    })

    return Array.from(map.values())
  }

  // ================= ADD =================

  const openAddModal = () => {
    setIngredients([])
    setIngredientPage(1)
    setTotalIngredient(0)
    loadIngredients(1)

    ;(document.getElementById("add_modal") as HTMLDialogElement).showModal()
  }

  const handleAdd = async () => {
    try {
      if (mode === "product" && selectedProduct) {
        await createRecipe({
          ingredientId: selectedIngredientId,
          productId: selectedProduct.id,
          amount
        })

        await Promise.all(
          variants.map(v =>
            createRecipe({
              ingredientId: selectedIngredientId,
              variantId: v.id,
              amount: 0
            })
          )
        )

        handleProductSelect(selectedProduct)
      }

      if (mode === "option" && selectedOption) {
        await createRecipe({
          ingredientId: selectedIngredientId,
          optionItemId: selectedOption.id,
          amount
        })

        handleOptionSelect(selectedOption)
      }

      showToast("Add success", "success")
      ;(document.getElementById("add_modal") as HTMLDialogElement).close()

    } catch {
      showToast("Add failed", "error")
    }
  }

  // ================= UPDATE =================

  const handleUpdate = async (recipe: any, amount: number) => {
    if (!recipe?.id) return
    await updateRecipe(recipe.id, { amount })
  }

  // ================= DELETE =================

  const handleDelete = async () => {
    if (!deleteTarget) return

    if (mode === "product") {
      if (deleteTarget.base) await deleteRecipe(deleteTarget.base.id)
      if (deleteTarget.variant) await deleteRecipe(deleteTarget.variant.id)
      handleProductSelect(selectedProduct)
    }

    if (mode === "option") {
      await deleteRecipe(deleteTarget.base.id)
      handleOptionSelect(selectedOption)
    }

    showToast("Deleted", "success")
    ;(document.getElementById("delete_modal") as HTMLDialogElement).close()
  }

  // ================= SCROLL =================

  const useScroll = (ref: any, callback: () => void) => {
    React.useEffect(() => {
      const el = ref.current
      if (!el) return

      const handle = () => {
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
          callback()
        }
      }

      el.addEventListener("scroll", handle)
      return () => el.removeEventListener("scroll", handle)
    }, [callback])
  }

  function List({ items, onSelect, selected, onLoadMore }: any) {
    const ref = React.useRef(null)
    useScroll(ref, onLoadMore)

    return (
      <div ref={ref} className="card bg-white shadow p-3 h-[400px] overflow-auto">
        {items.map((i:any)=>(
          <div
            key={i.id}
            onClick={()=>onSelect(i)}
            className={`p-2 border rounded mb-2 cursor-pointer 
            ${selected?.id === i.id ? "bg-darkgrey text-white" : "hover:bg-gray-100"}`}
          >
            {i.name}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between">
        <div>
            <h1 className="text-3xl font-bold">Quản lý công thức</h1>
            <p className="text-base-content/70 text-sm">Trang chủ &gt; Công thức</p>
        </div>
        <div className="flex gap-8 items-center">
            <div className="flex gap-4">
                <button className={`${mode==="product"?"bg-darkgrey text-white px-2 btn":"btn"}`} onClick={()=>setMode("product")}>Món ăn</button>
                <button className={`${mode==="option"?"bg-darkgrey text-white px-2 btn":"btn"}`} onClick={()=>setMode("option")}>Tuỳ chọn</button>
            </div>
            <button className="btn bg-darkgrey text-white px-2" onClick={openAddModal}>
                <Plus size={16}/> Thêm công thức
            </button>
        </div>
      </div>

      {mode==="product" && (
        <div className="grid grid-cols-4 gap-4">
          <List items={products} selected={selectedProduct} onSelect={handleProductSelect}
            onLoadMore={()=>{
              const next = productPage + 1
              setProductPage(next)
              loadProducts(next)
            }} />

          <List items={variants} selected={selectedVariant} onSelect={handleVariantSelect}
            onLoadMore={()=>{
              if(selectedProduct){
                const next = variantPage + 1
                setVariantPage(next)
                loadVariants(selectedProduct.id, next)
              }
            }} />

          <Table rows={merged()} onUpdate={handleUpdate} onDelete={(r:any)=>setDeleteTarget(r)} mode="product"/>
        </div>
      )}

      {/* OPTION */}
      {mode==="option" && (
        <div className="grid grid-cols-2 gap-4">
          <List items={options} selected={selectedOption} onSelect={handleOptionSelect}
            onLoadMore={()=>{
              const next = optionPage + 1
              setOptionPage(next)
              loadOptions(next)
            }} />

          <Table rows={recipeOptions.map(r=>({ingredientId:r.ingredientId,ingredientName:r.ingredient?.name,base:r}))}
            onUpdate={handleUpdate}
            onDelete={(r:any)=>setDeleteTarget(r)} mode="option"/>
        </div>
      )}

      {/* ADD MODAL */}
      <dialog id="add_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold mb-2">Thêm Công Thức</h3>

          <IngredientDropdown
            value={selectedIngredientId}
            onChange={setSelectedIngredientId}
            items={ingredients}
            loadMore={()=>{
              const next = ingredientPage + 1
              setIngredientPage(next)
              loadIngredients(next)
            }}
          />

          <input type="number" className="input input-bordered w-full mt-2"
            onChange={(e)=>setAmount(Number(e.target.value))}/>

          <div className="modal-action">
            <form method="dialog"><button className="btn">Hủy</button></form>
            <button className="btn bg-darkgrey text-white px-2" onClick={handleAdd}>Lưu</button>
          </div>
        </div>
      </dialog>

    </div>
  )
}

// ================= DROPDOWN =================

function IngredientDropdown({ value, onChange, items, loadMore }: any) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<any>(null)
  const scrollRef = React.useRef<any>(null)

  React.useEffect(() => {
    const handle = (e:any)=>{
      if(!ref.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener("click", handle)
    return ()=>document.removeEventListener("click", handle)
  }, [])

  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const onScroll = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
        loadMore()
      }
    }

    el.addEventListener("scroll", onScroll)
    return () => el.removeEventListener("scroll", onScroll)
  }, [loadMore])

  const selected = items.find((i:any)=>i.id===value)

  return (
    <div ref={ref} className="relative">
      <div onClick={()=>setOpen(!open)}
        className="input input-bordered cursor-pointer">
        {selected?.name || "Chọn nguyên liệu"}
      </div>

      {open && (
        <div ref={scrollRef}
          className="absolute bg-white border w-full max-h-48 overflow-auto mt-1 rounded shadow z-50">
          {items.map((i:any)=>(
            <div key={i.id}
              onClick={()=>{onChange(i.id);setOpen(false)}}
              className={`p-2 cursor-pointer hover:bg-gray-100 
              ${value===i.id?"bg-primary text-white":""}`}>
              {i.name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ================= TABLE =================

function Table({ rows, onUpdate, onDelete, mode }: any) {
  return (
    <div className={`card bg-white shadow p-4 ${mode==="product"?"col-span-2":""} h-[400px] overflow-auto`}>
      <table className="table table-zebra h-[400px]">
        <thead>
          <tr>
            <th>Nguyên Liệu</th>
            <th>Cơ Sở</th>
            {mode==="product" && <th>Biến Thể</th>}
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody className="">
          {rows.map((r:any)=>(
            <tr key={r.ingredientId}>
              <td>{r.ingredientName}</td>

              <td>
                <input defaultValue={r.base?.amount}
                  onBlur={(e)=>onUpdate(r.base, Number(e.target.value))}
                  className="input input-sm w-20"/>
              </td>

              {mode==="product" && (
                <td>
                  {r.variant && (
                    <input defaultValue={r.variant.amount}
                      onBlur={(e)=>onUpdate(r.variant, Number(e.target.value))}
                      className="input input-sm w-20"/>
                  )}
                </td>
              )}

              <td>
                <button onClick={()=>onDelete(r)} className="text-error">
                  <Trash2 size={14}/>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}