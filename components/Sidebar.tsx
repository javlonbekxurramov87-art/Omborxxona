import React from 'react';
import { LayoutDashboard, ArrowDownToLine, ArrowUpFromLine, Package, LogOut, Users } from 'lucide-react';
import { Permission, User } from '../types';

interface SidebarProps {
  currentPage: string;
  setPage: (page: string) => void;
  user: User | null;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setPage, user, onLogout }) => {
  const permissions = user?.permissions || [];

  const allMenuItems = [
    { id: 'dashboard', label: 'Boshqaruv', icon: <LayoutDashboard size={20} />, permission: 'dashboard' },
    { id: 'kirim', label: 'Kirim (In)', icon: <ArrowDownToLine size={20} />, permission: 'kirim' },
    { id: 'chiqim', label: 'Chiqim (Out)', icon: <ArrowUpFromLine size={20} />, permission: 'chiqim' },
    { id: 'inventory', label: 'Mahsulotlar', icon: <Package size={20} />, permission: 'inventory' },
    { id: 'admin_users', label: 'Admin Panel', icon: <Users size={20} />, permission: 'admin' },
  ];

  const visibleItems = allMenuItems.filter(item => 
    permissions.includes(item.permission as Permission)
  );

  return (
    <div className="w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200 min-h-screen flex flex-col no-print shrink-0 z-10 sticky top-0 h-screen">
      <div className="p-8 pb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2 tracking-tight text-gray-900">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white shadow-green-200 shadow-lg">
             <Package size={20} />
          </div>
          OmborPro
        </h1>
        {user && (
            <div className="mt-6 flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-sm">
                    {user.fullName.charAt(0)}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-gray-800 truncate">{user.fullName}</p>
                    <p className="text-xs text-gray-500 truncate">@{user.username}</p>
                </div>
            </div>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4">
        {visibleItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              currentPage === item.id
                ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 text-gray-500 hover:text-red-500 hover:bg-red-50 px-4 py-3 rounded-xl w-full transition-colors font-medium"
        >
          <LogOut size={20} />
          <span>Chiqish</span>
        </button>
      </div>
    </div>
  );
};