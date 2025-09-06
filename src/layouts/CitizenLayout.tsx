import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { CitizenSidebar } from '../components/layout/CitizenSidebar';

export const CitizenLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} showMenuButton={true} />
      <div className="flex">
        <CitizenSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 sm:p-6 lg:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};