import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { PublicAdminSidebar } from '../components/layout/PublicAdminSidebar';

export const PublicAdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} showMenuButton={true} />
      <div className="flex">
        <PublicAdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 sm:p-6 lg:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};