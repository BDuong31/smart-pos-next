"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import SplashScreen from "@/components/loading/splash-sceen";

// interfaces
import { IOption, IOptionItem, IOptionItemCreate } from "@/interfaces/option";

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
import { IImage, IImageCreate } from "@/interfaces/image";
import { deleteImage, uploadImage } from "@/apis/image";
import { set } from "zod";
import BinRegular from "@/components/icons/bin";

export default function OptionsPage() {
  const [optionList, setOptionList] = useState<IOption[]>([]);
  const [optionItems, setOptionItems] = useState<IOptionItem[]>([]);
  const [selectedOption, setSelectedOption] = useState<IOption | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setLoading] = useState(true);

  // ================= MODAL STATE =================
  const [existingImages, setExistingImages] = useState<IImage>();
  const [imageToDelete, setImageToDelete] = useState<string>();
  const [newImageFiles, setNewImageFiles] = useState<File>();
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
    (document.getElementById('delete_option_modal') as HTMLDialogElement)?.close()
  }

  // ================ Upload ================
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];

    setNewImageFiles(file);
    setCoverImage(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [],},
  });

  const handleSetCoverImage = (imageToSet: string) => {
    setCoverImage(imageToSet);
  }

  const handleRemoveImage = (e: React.MouseEvent, ref: string, type: 'existing' | 'new') => {
    e.stopPropagation();

    if (type === 'existing') {
      // xóa ảnh đã tồn tại
      setImageToDelete(existingImages?.id);
      setExistingImages(undefined);
      setCoverImage(null);
    } else {
      // xóa ảnh mới chọn
      setNewImageFiles(undefined);
      setCoverImage(null);
    }
  }

  // ================= ITEM =================
  const openCreateItem = () => {
    setFormItem({ name: "", priceExtra: 0 });
    setExistingImages(undefined);
    setNewImageFiles(undefined);
    setCoverImage(null);
  };

  const openEditItem = (item: IOptionItem) => {
    setEditingItem(item);
    setFormItem({
      name: item.name,
      priceExtra: item.priceExtra,
    });
    setExistingImages(item.images?.find(img => img.isMain));
    setNewImageFiles(undefined);
    setCoverImage(item.images?.find(img => img.isMain)?.url || null);
  };

  const handleCreateItem = async () => {
    setLoading(true);

    if (formItem.name === ''){
      showToast("Tên mục không được để trống", "error");
      setLoading(false);
      return;
    }

    if (!coverImage) {
      showToast("Vui lòng chọn ảnh minh họa cho mục", "error");
      setLoading(false);
      return;
    }

    if (!selectedOption) return;

    let newItemId: string | undefined = undefined;
    try {
      const itemPayload: IOptionItemCreate = {
        name: formItem.name,
        priceExtra: formItem.priceExtra,
        groupId: selectedOption.id,
      };

      const itemResponse = await createOptionItem(itemPayload);
      // if (!itemResponse) {
      //   showToast("Có lỗi xảy ra khi tạo mục", "error");
      // };

      newItemId = itemResponse.id;

      const imagePayload: IImageCreate = {
        isMain: true,
        refId: newItemId,
        type: "option",
      }

      await uploadImage(imagePayload, newImageFiles as File);

      showToast("Tạo mục thành công", "success");
    } catch (error) {
      showToast("Có lỗi xảy ra khi tạo mục", "error");
      console.error("Failed to create item:", error);
    } finally {
      setLoading(false);
    }
    fetchItems();
  };

  const handleUpdateItem = async () => {
    setLoading(true);

    if (formItem.name === ''){  
      showToast("Tên mục không được để trống", "error");
      setLoading(false);
      return;
    }

    if (!coverImage) {
      showToast("Vui lòng chọn ảnh minh họa cho mục", "error");
      setLoading(false);
      return;
    }

    if (!editingItem) return;

    try {
      const itemPayload = {
        name: formItem.name,
        priceExtra: formItem.priceExtra,
      };

      await updateOptionItem(editingItem.id, itemPayload);

      if (newImageFiles) {  
        const imagePayload: IImageCreate = {
          isMain: true, 
          refId: editingItem.id,
          type: "option",
        } 

        await uploadImage(imagePayload, newImageFiles as File);
        
        if (imageToDelete) {
          await deleteImage(imageToDelete);
          setImageToDelete(undefined);
        }
      } else if (existingImages && existingImages.url !== coverImage) {
        // trường hợp chỉ đổi ảnh cover giữa các ảnh đã tồn tại
      }
    } catch (error) {
      showToast("Có lỗi xảy ra khi cập nhật mục", "error");
    } finally {
      setLoading(false);
    }

    fetchItems();
  }

  const handleDeleteItem = async (id: string, imageId: string) => {
    console.log("Deleting item with id:", id, "and imageId:", imageId);
    await deleteOptionItem(id);
    if (imageId && imageId !== ''){
      await deleteImage(imageId);
    }

    (document.getElementById('delete_item_modal') as HTMLDialogElement)?.close()
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

      <div className="flex gap-6 max-h-[80vh] overflow-hidden">
        {/* LEFT */}
        <div className="w-1/3 bg-white rounded-2xl shadow-sm p-4 space-y-3">
            <h2 className="font-semibold text-lg">Danh sách Tùy chọn</h2>
            <div className="overflow-auto max-h-[70vh] pr-2 flex flex-col gap-2">
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

            <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-2">
                {optionItems.length > 0 ? (
                optionItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border rounded-xl p-4 hover:shadow-sm transition"
                  >
                    <div className="flex items-center gap-6">
                      <div className="rounded-2xl">
                        <Image
                          src={item.images?.[0]?.url || "https://placehold.co/600x400?text=No+Image"}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover w-20 h-20"
                        />
                      </div>
                      <div className="flex flex-col gap-4">
                          <div><p className="font-medium">{item.name}</p></div>
                          <div><p className="text-sm text-success">
                          +{item.priceExtra} VNĐ
                          </p></div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                        onClick={(e) => {
                          openEditItem(item);
                          (document.getElementById('edit_item_modal') as HTMLDialogElement)?.showModal()
                        }}
                        className="btn btn-xs btn-outline bg-graymain text-white px-2 py-4"
                        >
                        Sửa
                        </button>
                        <button
                        onClick={() => {
                          setEditingItem(item);
                          (document.getElementById('delete_item_modal') as HTMLDialogElement)?.showModal()
                        }}
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
            <div className="form-control relative">
              { coverImage && (
                <button type="button" className="btn btn-sm absolute bg-error px-2 py-4 w-8 rounded-full right-0 top-0" onClick={() => {
                  if (existingImages || newImageFiles) {
                    setExistingImages(undefined);
                    setNewImageFiles(undefined);
                    setCoverImage(null);
                  } else {
                    (document.getElementById('image_upload_modal') as HTMLDialogElement)?.showModal();
                  } 
                }}>
                  <BinRegular />
                </button>
              )}
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
                  `}
                >
                  <input {...getInputProps()} />
                  <ImageRegular width={48} height={48} className="text-base-content/50" />
                  <p className="mt-2 text-sm text-base-content/70">
                    {isDragActive ? 'Thả ảnh vào đây' : 'Kéo thả hoặc chọn ảnh'}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="modal-action">
            <form method="dialog"><button className="btn">Huỷ</button></form>
            <button className="btn btn-neutral bg-darkgrey text-white px-2" onClick={handleCreateItem}>Lưu</button>
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
            <div className="form-control relative">
              { coverImage && (
                <button type="button" className="btn btn-sm absolute bg-error px-2 py-4 w-8 rounded-full right-0 top-0" onClick={() => {
                  if (existingImages || newImageFiles) {
                    setExistingImages(undefined);
                    setNewImageFiles(undefined);
                    setCoverImage(null);
                  } else {
                    (document.getElementById('image_upload_modal') as HTMLDialogElement)?.showModal();
                  } 
                }}>
                  <BinRegular />
                </button>
              )}
              <label className="label w-full mb-1"><span className="label-text font-semibold">Ảnh minh họa</span></label>
              {coverImage ? (
                <div className='bg-gray rounded-2xl'>
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
                  `}
                >
                  <input {...getInputProps()} />
                  <ImageRegular width={48} height={48} className="text-base-content/50" />
                  <p className="mt-2 text-sm text-base-content/70">
                    {isDragActive ? 'Thả ảnh vào đây' : 'Kéo thả hoặc chọn ảnh'}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="modal-action">
            <form method="dialog"><button className="btn">Huỷ</button></form>
            <button className="btn btn-neutral bg-darkgrey text-white px-2" onClick={handleCreateItem}>Lưu</button>
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
            <button className="btn btn-error bg-error text-white px-2" onClick={() => { 
              handleDeleteOption(selectedOption!.id)
            }}>Xóa</button>
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
            <button className="btn btn-error bg-error text-white px-2" onClick={() => { 
              handleDeleteItem(editingItem!.id, editingItem!.images[0]?.id || '')
            }}>Xóa</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button onClick={() => ('')}>close</button></form>
      </dialog>
    </div>
  );
}