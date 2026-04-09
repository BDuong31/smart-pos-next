"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Activity, Search, Filter, Download, AlertCircle, Info, AlertTriangle, 
  Terminal, Server, Clock, ShieldAlert, Eye, X
} from "lucide-react";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";

// ==========================================
// 1. MOCK DATA (Giả lập Dữ liệu Log hệ thống)
// ==========================================
const logLevels = ["INFO", "WARNING", "ERROR", "CRITICAL"];
const modules = ["AUTH", "DATABASE", "PAYMENT", "ORDER", "SYSTEM", "API"];

const generateMockLogs = (count: number) => {
  const logs = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getTime() - Math.floor(Math.random() * 86400000)); // Log trong 24h qua
    const level = logLevels[Math.floor(Math.random() * 100) > 85 ? (Math.floor(Math.random() * 2) + 2) : (Math.floor(Math.random() * 100) > 70 ? 1 : 0)];
    const module = modules[Math.floor(Math.random() * modules.length)];
    
    let message = "System operation completed normally.";
    let payload = { status: "success", duration: `${Math.floor(Math.random() * 100)}ms` };

    if (level === "ERROR") {
      message = module === "PAYMENT" ? "Momo API timeout after 5000ms" : "Failed to insert record into PostgreSQL";
      payload = { error_code: "504_GATEWAY_TIMEOUT", retry_count: 3 } as any;
    } else if (level === "CRITICAL") {
      message = "Database connection lost. Max pool size reached.";
      payload = { db_host: "10.0.0.5", pool_size: 100, active_connections: 100 } as any;
    } else if (level === "WARNING") {
      message = "High memory usage detected (85%)";
      payload = { memory_used: "3.4GB", total_memory: "4GB" } as any;
    } else if (module === "AUTH") {
      message = "User successfully logged in.";
      payload = { user_id: `usr_${Math.floor(Math.random() * 1000)}`, ip: "192.168.1.45" } as any;
    }

    logs.push({
      id: `log_${Date.now()}_${i}`,
      timestamp: d.toISOString(),
      level,
      module,
      message,
      ip: `113.${Math.floor(Math.random() * 255)}.12.${Math.floor(Math.random() * 255)}`,
      payload: JSON.stringify(payload, null, 2)
    });
  }
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// ==========================================
// 2. COMPONENTS PHỤ
// ==========================================
const LevelBadge = ({ level }: { level: string }) => {
  switch (level) {
    case "INFO": return <span className="badge badge-sm bg-blue-50 text-blue-600 border-blue-200 gap-1"><Info size={12}/> INFO</span>;
    case "WARNING": return <span className="badge badge-sm bg-amber-50 text-amber-600 border-amber-200 gap-1"><AlertTriangle size={12}/> WARN</span>;
    case "ERROR": return <span className="badge badge-sm bg-red-50 text-red-600 border-red-200 gap-1"><AlertCircle size={12}/> ERROR</span>;
    case "CRITICAL": return <span className="badge badge-sm bg-purple-100 text-purple-700 border-purple-300 font-bold gap-1 animate-pulse"><ShieldAlert size={12}/> CRITICAL</span>;
    default: return <span className="badge badge-sm">{level}</span>;
  }
};

const ITEMS_PER_PAGE = 15;
const getPaginationRange = (current: number, total: number) => {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, '...', total];
  if (current >= total - 2) return [1, '...', total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
};

// ==========================================
// 3. MAIN COMPONENT
// ==========================================
export default function SystemLogView() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<any | null>(null); // Để mở Modal chi tiết

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLogs(generateMockLogs(150)); // Generate 150 logs
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchLevel = filterLevel === "ALL" || log.level === filterLevel;
      const matchSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.ip.includes(searchQuery);
      return matchLevel && matchSearch;
    });
  }, [logs, searchQuery, filterLevel]);

  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const currentLogs = filteredLogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const errorCount = logs.filter(l => l.level === "ERROR").length;
  const criticalCount = logs.filter(l => l.level === "CRITICAL").length;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 min-h-screen bg-slate-50 font-sans">
      
      {/* 1. HEADER & LIVE INDICATOR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Terminal className="text-slate-700" /> Nhật ký Hệ thống (Logs)
          </h1>
          <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
            Theo dõi sự kiện, cảnh báo và lỗi từ các API, Database, và thao tác người dùng.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            SYSTEM IS LIVE
          </div>
          <button className="btn btn-sm bg-white border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg shadow-sm">
            <Download size={16} /> Xuất CSV
          </button>
        </div>
      </div>

      {/* 2. MINI KPIs (Cảnh báo nhanh) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Activity size={20}/></div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Tổng Logs (24h)</p>
            <h3 className="text-xl font-bold text-slate-800">{logs.length}</h3>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><AlertTriangle size={20}/></div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Cảnh báo (WARN)</p>
            <h3 className="text-xl font-bold text-amber-600">{logs.filter(l => l.level === "WARNING").length}</h3>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl"><AlertCircle size={20}/></div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Lỗi (ERROR)</p>
            <h3 className="text-xl font-bold text-red-600">{errorCount}</h3>
          </div>
        </div>
        <div className={`p-4 rounded-2xl shadow-sm border flex items-center gap-4 ${criticalCount > 0 ? 'bg-purple-50 border-purple-200' : 'bg-white border-slate-100'}`}>
          <div className={`p-3 rounded-xl ${criticalCount > 0 ? 'bg-purple-200 text-purple-700' : 'bg-slate-100 text-slate-400'}`}><ShieldAlert size={20}/></div>
          <div>
            <p className={`text-xs font-medium ${criticalCount > 0 ? 'text-purple-600' : 'text-slate-500'}`}>Nghiêm trọng (CRITICAL)</p>
            <h3 className={`text-xl font-bold ${criticalCount > 0 ? 'text-purple-700 animate-pulse' : 'text-slate-800'}`}>{criticalCount}</h3>
          </div>
        </div>
      </div>

      {/* 3. TOOLBAR LỌC */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 w-full sm:w-auto">
          <Filter size={18} className="text-slate-400" />
          <select 
            className="bg-transparent border-none focus:outline-none text-sm font-medium text-slate-700 w-full"
            value={filterLevel}
            onChange={(e) => { setFilterLevel(e.target.value); setCurrentPage(1); }}
          >
            <option value="ALL">Tất cả mức độ</option>
            <option value="INFO">Thông tin (INFO)</option>
            <option value="WARNING">Cảnh báo (WARNING)</option>
            <option value="ERROR">Lỗi (ERROR)</option>
            <option value="CRITICAL">Nghiêm trọng (CRITICAL)</option>
          </select>
        </div>

        <div className="relative w-full sm:w-96">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" placeholder="Tìm theo message, module hoặc IP..." 
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all"
            value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          />
        </div>
      </div>

      {/* 4. DATA TABLE - GIAO DIỆN NHƯ CONSOLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative min-h-[500px]">
        {loading && (
          <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <span className="loading loading-spinner text-slate-800"></span>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="table w-full text-sm">
            <thead className="bg-slate-800 text-slate-300 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 font-semibold w-40"><Clock size={14} className="inline mr-1 mb-0.5"/> Thời gian</th>
                <th className="px-4 py-3 font-semibold w-28">Mức độ</th>
                <th className="px-4 py-3 font-semibold w-32"><Server size={14} className="inline mr-1 mb-0.5"/> Module</th>
                <th className="px-4 py-3 font-semibold">Message (Nội dung)</th>
                <th className="px-4 py-3 font-semibold w-36 text-right">IP / Client</th>
                <th className="px-4 py-3 font-semibold w-16 text-center">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentLogs.length === 0 && !loading ? (
                <tr><td colSpan={6} className="text-center py-10 text-slate-400">Không tìm thấy log nào.</td></tr>
              ) : (
                currentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 font-mono text-xs transition-colors">
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(log.timestamp).toLocaleString('vi-VN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="px-4 py-3"><LevelBadge level={log.level} /></td>
                    <td className="px-4 py-3 font-semibold text-slate-600">{log.module}</td>
                    <td className={`px-4 py-3 truncate max-w-md ${log.level === 'ERROR' || log.level === 'CRITICAL' ? 'text-red-600 font-medium' : 'text-slate-700'}`}>
                      {log.message}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-400">{log.ip}</td>
                    <td className="px-4 py-3 text-center">
                      <button 
                        onClick={() => setSelectedLog(log)}
                        className="btn btn-xs btn-ghost btn-square text-blue-500 hover:bg-blue-50"
                        title="Xem Payload"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 border border-slate-200 rounded-xl disabled:opacity-50 hover:bg-slate-100 bg-white text-slate-600"><GrFormPrevious size={16} /></button>
          {getPaginationRange(currentPage, totalPages).map((item, idx) => (
            item === '...' ? <span key={idx} className="px-2 text-slate-400">...</span> :
            <button key={idx} onClick={() => setCurrentPage(item as number)} className={`w-8 h-8 rounded-lg text-sm font-semibold border ${currentPage === item ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}>
              {item}
            </button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 border border-slate-200 rounded-xl disabled:opacity-50 hover:bg-slate-100 bg-white text-slate-600"><GrFormNext size={16} /></button>
        </div>
      )}

      {/* 6. MODAL XEM CHI TIẾT LOG (RAW JSON) */}
      <dialog className={`modal ${selectedLog ? "modal-open" : ""}`}>
        <div className="modal-box max-w-2xl bg-slate-900 text-slate-300 p-0 overflow-hidden border border-slate-700 shadow-2xl rounded-xl">
          <div className="flex justify-between items-center px-4 py-3 border-b border-slate-800 bg-black/40">
            <h3 className="font-mono text-sm flex items-center gap-2">
              <Terminal size={16} className="text-emerald-500"/> 
              Log Detail: <span className="text-slate-400">{selectedLog?.id}</span>
            </h3>
            <button onClick={() => setSelectedLog(null)} className="text-slate-500 hover:text-white transition-colors"><X size={18} /></button>
          </div>
          
          <div className="p-4 overflow-y-auto max-h-[70vh] custom-scrollbar font-mono text-xs leading-relaxed">
            <div className="grid grid-cols-12 gap-2 mb-4 text-slate-400">
              <div className="col-span-3">Timestamp:</div><div className="col-span-9 text-emerald-400">{selectedLog?.timestamp}</div>
              <div className="col-span-3">Level:</div><div className="col-span-9"><LevelBadge level={selectedLog?.level || ""} /></div>
              <div className="col-span-3">Module:</div><div className="col-span-9 text-blue-400">{selectedLog?.module}</div>
              <div className="col-span-3">IP Address:</div><div className="col-span-9 text-amber-300">{selectedLog?.ip}</div>
              <div className="col-span-3">Message:</div><div className="col-span-9 text-white font-semibold">{selectedLog?.message}</div>
            </div>
            
            <div className="mt-4 border-t border-slate-800 pt-4">
              <span className="text-slate-500 block mb-2">Payload (JSON):</span>
              <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-emerald-300 shadow-inner">
                <code>{selectedLog?.payload}</code>
              </pre>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button onClick={() => setSelectedLog(null)}>close</button></form>
      </dialog>

    </div>
  );
}