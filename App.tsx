import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Inbound } from './pages/Inbound';
import { Outbound } from './pages/Outbound';
import { Inventory } from './pages/Inventory';
import { Login } from './pages/Login';
import { AdminUsers } from './pages/AdminUsers';
import { User, Permission } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Check for active session (simplified)
  useEffect(() => {
    const savedUser = sessionStorage.getItem('ombor_current_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    sessionStorage.setItem('ombor_current_user', JSON.stringify(user));
    // Redirect to the first permitted page or dashboard
    if (user.permissions.includes('dashboard')) setCurrentPage('dashboard');
    else if (user.permissions.length > 0) setCurrentPage(user.permissions[0]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('ombor_current_user');
    setCurrentPage('dashboard');
  };

  const hasPermission = (perm: string): boolean => {
    return currentUser?.permissions.includes(perm as Permission) || false;
  };

  const renderPage = () => {
    if (!currentUser) return <Login onLogin={handleLogin} />;

    switch(currentPage) {
      case 'dashboard': 
        return hasPermission('dashboard') ? <Dashboard /> : <div className="p-10">Ruxsat yo'q</div>;
      case 'kirim': 
        return hasPermission('kirim') ? <Inbound /> : <div className="p-10">Ruxsat yo'q</div>;
      case 'chiqim': 
        return hasPermission('chiqim') ? <Outbound /> : <div className="p-10">Ruxsat yo'q</div>;
      case 'inventory': 
        return hasPermission('inventory') ? <Inventory /> : <div className="p-10">Ruxsat yo'q</div>;
      case 'admin_users':
        return hasPermission('admin') ? <AdminUsers /> : <div className="p-10">Ruxsat yo'q</div>;
      default: 
        return hasPermission('dashboard') ? <Dashboard /> : <div className="p-10">Sahifa topilmadi</div>;
    }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        currentPage={currentPage} 
        setPage={setCurrentPage} 
        user={currentUser}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-auto h-screen">
        <div className="max-w-7xl mx-auto w-full">
           {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default App;