"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import SplashScreen from "@/components/loading/splash-sceen";

// interfaces
import { IOption, IOptionItem } from "@/interfaces/option";

// apis
import {
  getOptions,
  getOptionItems,
  createOption,
  updateOption,
  deleteOption,
  createOptionItem,
  updateOptionItem,
  deleteOptionItem,
} from "@/apis/option";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/toast-context";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import ImageRegular from "@/components/icons/image";

const MAX_IMAGES = 1;
interface FileWithPreview {
  file: File;
  preview: string;
}

export default function OptionsPage() {
  const [optionList, setOptionList] = useState<IOption[]>([]);
  const [optionItems, setOptionItems] = useState<IOptionItem[]>([]);
  const [selectedOption, setSelectedOption] = useState<IOption | null>(null);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setLoading] = useState(true);

  // ================= MODAL STATE =================
  const [editingOption, setEditingOption] = useState<IOption | null>(null);

  const [editingItem, setEditingItem] = useState<IOptionItem | null>(null);

  const [formOption, setFormOption] = useState({
    name: "",
    isMultiSelect: false,
  });

  const [formItem, setFormItem] = useState({
    name: "",
    priceExtra: 0,
  });

  // ================= FETCH =================
  const fetchOptions = async () => {
    const res = await getOptions(undefined, undefined, 1, 100);
    if (res) setOptionList(res.data);
  };

  const fetchItems = async () => {
    if (!selectedOption) return;
    const res = await getOptionItems(
      selectedOption.id,
      undefined,
      undefined,
      1,
      100
    );
    if (res) setOptionItems(res.data);
  };

  useEffect(() => {
    setLoading(true);
    fetchOptions().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchItems();
  }, [selectedOption]);

  // ================= OPTION =================
  const openCreateOption = () => {
    setFormOption({ name: "", isMultiSelect: false });
  };

  const openEditOption = (opt: IOption) => {
    setEditingOption(opt);
    setFormOption({
      name: opt.name,
      isMultiSelect: opt.isMultiSelect,
    });
  };

  const handleSaveOption = async () => {
    if (editingOption) {
      await updateOption(editingOption.id, formOption);
    } else {
      await createOption(formOption);
    }
    fetchOptions();
  };

  const handleDeleteOption = async (id: string) => {
    await deleteOption(id);
    setSelectedOption(null);
    fetchOptions();
  }

  // ================ Upload ================
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (files.length + acceptedFiles.length > MAX_IMAGES) {
      showToast(`Chỉ được chọn tối đa ${MAX_IMAGES} ảnh`, "error");
      return;
    }

    const newFilesMapped: FileWithPreview[] = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setFiles(prev => {
      const updated = [...prev, ...newFilesMapped];
      if (!coverImage && updated.length > 0) {
        setCoverImage(updated[0].preview);
      }

      return updated;
    })
  }, [files, showToast, coverImage]);

  const isGalleryFull = files.length >= MAX_IMAGES;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [],},
    disabled: isGalleryFull
  });

  const handleRemoveIamge = (e: React.MouseEvent, previewToRemove: string) => {
    e.stopPropagation();

    const newFilesList = files.filter(item => item.preview !== previewToRemove);
    setFiles(newFilesList);

    if (coverImage === previewToRemove) {
      setCoverImage(newFilesList.length > 0 ? newFilesList[0].preview : null);
    }

    URL.revokeObjectURL(previewToRemove);
  }

  const handleSetCoverImage = (imageToSet: string) => {
    setCoverImage(imageToSet);
  }

  // ================= ITEM =================
  const openCreateItem = () => {
    setFormItem({ name: "", priceExtra: 0 });
  };

  const openEditItem = (item: IOptionItem) => {
    setEditingItem(item);
    setFormItem({
      name: item.name,
      priceExtra: item.priceExtra,
    });
  };

  const handleSaveItem = async () => {
    if (!selectedOption) return;

    if (editingItem) {
      await updateOptionItem(editingItem.id, formItem);
    } else {
      await createOptionItem({
        ...formItem,
        groupId: selectedOption.id,
      });
    }

    fetchItems();
  };

  const handleDeleteItem = async (id: string) => {
    await deleteOptionItem(id);
    fetchItems();
  }

  // ================= LOADING =================
  if (isLoading) return <SplashScreen className="h-[100vh]" />;

  return (
    <div className="flex flex-col gap-6 p-6 max-h-[90vh] overflow-y-auto">
      {/* HEADER */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tùy chọn</h1>
          <p className="text-base-content/70 text-sm">Trang chủ &gt; Tùy chọn</p>
        </div>
        <button onClick={() => { 
          openCreateOption();
          (document.getElementById('add_option_modal') as HTMLDialogElement)?.showModal() 
        }} className="btn btn-neutral bg-darkgrey text-white px-2">
          <Plus size={18} /> Thêm Tùy chọn
        </button>
      </div>

      <div className="flex gap-6">
        {/* LEFT */}
        <div className="w-1/3 bg-white rounded-2xl shadow-sm p-4 space-y-3">
            <h2 className="font-semibold text-lg">Danh sách Tùy chọn</h2>

            {optionList.map((opt) => {
            const isActive = selectedOption?.id === opt.id;

            return (
                <div
                key={opt.id}
                onClick={() => setSelectedOption(opt)}
                className={`
                    p-4 rounded-xl border cursor-pointer transition-all
                    flex justify-between items-center
                    ${isActive 
                    ? "bg-darkgrey text-white shadow-md scale-[1.02]" 
                    : "hover:bg-base-200"}
                `}
                >
                <div>
                    <p className="font-medium">{opt.name}</p>
                    <p className="text-xs opacity-60">
                    {opt.isMultiSelect ? "Có nhiều lựa chọn" : "Chọn một"}
                    </p>
                </div>

                <div className="flex gap-1">
                    <button
                    onClick={(e) => {
                        e.stopPropagation();
                        openEditOption(opt);
                        (document.getElementById('edit_option_modal') as HTMLDialogElement)?.showModal()
                    }}
                    className="btn btn-xs btn-ghost"
                    >
                    Sửa
                    </button>
                    <button
                    onClick={(e) => {
                        e.stopPropagation();
                        (document.getElementById('delete_option_modal') as HTMLDialogElement)?.showModal()
                    }}
                    className="btn btn-xs btn-ghost text-error"
                    >
                    Xóa
                    </button>
                </div>
                </div>
            );
            })}
        </div>

        {/* RIGHT */}
        <div className="w-2/3 bg-white rounded-2xl shadow-sm p-5">
        {selectedOption ? (
            <>
            <div className="flex justify-between items-center mb-5">
                <div>
                <h2 className="text-xl font-semibold">
                    {selectedOption.name}
                </h2>
                <p className="text-sm text-base-content/60">
                    Quản lý mục
                </p>
                </div>

                <button
                onClick={() => {
                  openCreateItem();
                  (document.getElementById('add_item_modal') as HTMLDialogElement)?.showModal()
                }}
                className="btn btn-sm bg-darkgrey text-white px-2"
                >
                + Thêm Mục
                </button>
            </div>

            <div className="space-y-3">
                {optionItems.length > 0 ? (
                optionItems.map((item) => (
                    <div
                    key={item.id}
                    className="flex justify-between items-center border rounded-xl p-4 hover:shadow-sm transition"
                    >
                    <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-green-600">
                        +{item.priceExtra} VNĐ
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                        onClick={() => openEditItem(item)}
                        className="btn btn-xs btn-outline bg-graymain text-white px-2 py-4"
                        >
                        Sửa
                        </button>
                        <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="btn btn-xs btn-error bg-error text-white px-2 py-4"
                        >
                        Xóa
                        </button>
                    </div>
                    </div>
                ))
                ) : (
                <div className="text-center py-10 text-base-content/50">
                    Không có mục nào
                </div>
                )}
            </div>
            </>
        ) : (
            <div className="h-full flex items-center justify-center text-base-content/50">
            Chọn một option bên trái
            </div>
        )}
        </div>
      </div>

      {/* =================ADD OPTION MODAL ================= */}
      <dialog id="add_option_modal" className="modal">
        <div className="modal-box w-11/12 max-w-lg">
          <h3 className="font-bold text-lg">Thêm tùy chọn mới</h3>
          <div className="py-4 space-y-4">
            <div className="form-control">
              <label className="label w-full mb-1"><span className="label-text font-semibold">Tên tùy chọn</span></label>
              <input 
                name="name" 
                value={formOption.name} 
                onChange={(e) => setFormOption({ ...formOption, name: e.target.value })} 
                className="input input-bordered w-full" 
                placeholder="e.g., Topping" 
              />
            </div>
            <div className="form-control">
              <label className="label mb-1">
                <input
                  type="checkbox"
                  checked={formOption.isMultiSelect}
                  onChange={(e) =>
                    setFormOption({
                      ...formOption,
                      isMultiSelect: e.target.checked,
                    })
                  }
                />
                <span className="label-text font-semibold">Cho phép chọn nhiều mục</span>
              </label>
            </div>
          </div>
          <div className="modal-action">
            <form method="dialog"><button className="btn">Huỷ</button></form>
            <button className="btn btn-neutral bg-darkgrey text-white px-2" onClick={handleSaveOption}>Lưu</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button onClick={() => ('')}>close</button></form>
      </dialog>
      
      {/* =================EDIT OPTION MODAL ================= */}
      <dialog id="edit_option_modal" className="modal">
        <div className="modal-box w-11/12 max-w-lg">
          <h3 className="font-bold text-lg">Sửa tùy chọn</h3>
          <div className="py-4 space-y-4">
            <div className="form-control">
              <label className="label w-full mb-1"><span className="label-text font-semibold">Tên tùy chọn</span></label>
              <input 
                name="name"
                value={formOption.name}
                onChange={(e) => setFormOption({ ...formOption, name: e.target.value })}
                className="input input-bordered w-full"
                placeholder="e.g., Topping"
              />
            </div>
            <div className="form-control">
              <label className="label mb-1">
                <input
                  type="checkbox"
                  checked={formOption.isMultiSelect}
                  onChange={(e) =>
                    setFormOption({
                      ...formOption,
                      isMultiSelect: e.target.checked,
                    })
                  }
                />
                <span className="label-text font-semibold">Cho phép chọn nhiều mục</span>
              </label>
            </div>
          </div>
          <div className="modal-action">
            <form method="dialog"><button className="btn">Huỷ</button></form>
            <button className="btn btn-neutral bg-darkgrey text-white px-2" onClick={handleSaveOption}>Lưu</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button onClick={() => ('')}>close</button></form>
      </dialog>

      {/* =================ADD ITEM MODAL ================= */}
      <dialog id="add_item_modal" className="modal">
        <div className="modal-box w-11/12 max-w-lg">
          <h3 className="font-bold text-lg">Thêm mục mới</h3>
          <div className="py-4 space-y-4">
            <div className="form-control">
              <label className="label w-full mb-1"><span className="label-text font-semibold">Tên mục</span></label>
              <input
                name="name"
                value={formItem.name}
                onChange={(e) => setFormItem({ ...formItem, name: e.target.value })}
                className="input input-bordered w-full"
                placeholder="e.g., Phô mai"
              />
            </div>
            <div className="form-control">
              <label className="label w-full mb-1"><span className="label-text font-semibold">Giá thêm</span></label>
              <input
                type="number"
                name="priceExtra"
                value={formItem.priceExtra}
                onChange={(e) => setFormItem({ ...formItem, priceExtra: parseInt(e.target.value) })}
                className="input input-bordered w-full"
                placeholder="e.g., 5000"
              />
            </div>
            <div className="form-control">
              <label className="label w-full mb-1"><span className="label-text font-semibold">Ảnh minh họa</span></label>
              {coverImage ? (
                <div className='p-2 bg-gray rounded-2xl mb-4'>
                  <Image 
                    src={coverImage || "https://placehold.co/600x400?text=Cover+Image"}
                    alt="Product Cover Image"
                    width={500}
                    height={500}
                    className="w-full h-auto aspect-square object-cover rounded-lg bg-base-200"
                  />  
                </div>
              ) : (
                <div 
                  {...getRootProps()} 
                  className={`
                    border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center 
                    text-center h-48
                    ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'}
                    ${isGalleryFull || isLoading ? 'cursor-not-allowed bg-base-200 opacity-60' : 'cursor-pointer'}
                  `}
                >
                  <input {...getInputProps()} />
                  <ImageRegular width={48} height={48} className="text-base-content/50" />
                  <p className="mt-2 text-sm text-base-content/70">
                    {isGalleryFull ? `Đã đạt giới hạn (${MAX_IMAGES} ảnh)` : isDragActive ? 'Thả ảnh vào đây' : 'Kéo thả hoặc chọn ảnh'}
                  </p>
                  <p className="text-xs text-base-content/50">Max {MAX_IMAGES} images.</p>
                </div>
              )}
            </div>
          </div>
          <div className="modal-action">
            <form method="dialog"><button className="btn">Huỷ</button></form>
            <button className="btn btn-neutral bg-darkgrey text-white px-2" onClick={handleSaveItem}>Lưu</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button onClick={() => ('')}>close</button></form>
      </dialog>

      {/* =================EDIT ITEM MODAL ================= */}
      <dialog id="edit_item_modal" className="modal">
        <div className="modal-box w-11/12 max-w-lg">
          <h3 className="font-bold text-lg">Sửa mục</h3>
          <div className="py-4 space-y-4">
            <div className="form-control">
              <label className="label w-full mb-1"><span className="label-text font-semibold">Tên mục</span></label>
              <input
                name="name"
                value={formItem.name}
                onChange={(e) => setFormItem({ ...formItem, name: e.target.value })}
                className="input input-bordered w-full"
                placeholder="e.g., Phô mai"
              />
            </div>
            <div className="form-control">
              <label className="label w-full mb-1"><span className="label-text font-semibold">Giá thêm</span></label>
              <input
                type="number"
                name="priceExtra"
                value={formItem.priceExtra}
                onChange={(e) => setFormItem({ ...formItem, priceExtra: parseInt(e.target.value) })}
                className="input input-bordered w-full"
                placeholder="e.g., 5000"
              />
            </div>
          </div>
          <div className="modal-action">
            <form method="dialog"><button className="btn">Huỷ</button></form>
            <button className="btn btn-neutral bg-darkgrey text-white px-2" onClick={handleSaveItem}>Lưu</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button onClick={() => ('')}>close</button></form>
      </dialog>

      {/* ================= DELETE CONFIRMATION OPTION MODAL ================= */}
      <dialog id="delete_option_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Xác nhận Xóa!</h3>
          <p className="py-4">
            Bạn có chắc muốn xóa tùy chọn <strong className="text-error">{selectedOption?.name}</strong>?
            <br/>
            Hành động này không thể hoàn tác.
          </p>
          <div className="modal-action">
            <form method="dialog"><button className="btn">Huỷ</button></form>
            <button className="btn btn-error bg-error text-white px-2" onClick={() => handleDeleteOption(selectedOption!.id)}>Xóa</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button onClick={() => ('')}>close</button></form>
      </dialog>

      {/* ================= DELETE CONFIRMATION ITEM MODAL ================= */}
      <dialog id="delete_item_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Xác nhận Xóa!</h3>
          <p className="py-4">
            Bạn có chắc muốn xóa mục <strong className="text-error">{editingItem?.name}</strong>?
            <br/>
            Hành động này không thể hoàn tác.
          </p>
          <div className="modal-action">
            <form method="dialog"><button className="btn">Huỷ</button></form>
            <button className="btn btn-error bg-error text-white px-2" onClick={() => handleDeleteItem(editingItem!.id)}>Xóa</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button onClick={() => ('')}>close</button></form>
      </dialog>
    </div>
  );
}