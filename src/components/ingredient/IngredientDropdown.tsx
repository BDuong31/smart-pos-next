'use client';
import React from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
  getIngredientsApi: any;
}

const LIMIT = 10;

export default function IngredientDropdown({ value, onChange, getIngredientsApi }: Props) {

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [list, setList] = React.useState<any[]>([]);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);

  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(total / LIMIT);
  const hasMore = page < totalPages;

  // ===== FETCH =====
  const fetchIngredients = async (pageNumber: number) => {
    if (loading) return;

    setLoading(true);
    try {
      const res = await getIngredientsApi(undefined, undefined, undefined, undefined, pageNumber, LIMIT);

      setList(prev => {
        const map = new Map();
        [...prev, ...res.data].forEach(i => map.set(i.id, i));
        return Array.from(map.values());
      });

      setTotal(res.total);
      setPage(pageNumber);
    } finally {
      setLoading(false);
    }
  };

  // load lần đầu
  React.useEffect(() => {
    fetchIngredients(1);
  }, []);

  // ===== SCROLL LOAD =====
  const handleScroll = (e: any) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 20;

    if (bottom && hasMore && !loading) {
      fetchIngredients(page + 1);
    }
  };

  // ===== CLICK OUTSIDE =====
  React.useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = list.find(i => i.id === value);

  return (
    <div className="relative w-full" ref={dropdownRef}>

      {/* SELECT BOX */}
      <div
        className="input input-bordered w-full cursor-pointer flex items-center justify-between"
        onClick={() => setOpen(!open)}
      >
        <span className={value ? '' : 'text-gray-400'}>
          {selected?.name || "Chọn nguyên liệu"}
        </span>
        <span>▼</span>
      </div>

      {/* DROPDOWN */}
      {open && (
        <div
          className="absolute z-50 mt-2 w-full bg-white border rounded-xl shadow-lg max-h-60 overflow-auto"
          onScroll={handleScroll}
        >
          {list.map(i => (
            <div
              key={i.id}
              className={`p-2 cursor-pointer hover:bg-gray-100 ${
                value === i.id ? 'bg-gray-200' : ''
              }`}
              onClick={() => {
                onChange(i.id);
                setOpen(false);
              }}
            >
              {i.name}
            </div>
          ))}

          {loading && (
            <div className="p-2 text-center text-sm">Đang tải...</div>
          )}

          {!hasMore && (
            <div className="p-2 text-center text-xs text-gray-400">
              Hết dữ liệu
            </div>
          )}
        </div>
      )}
    </div>
  );
}