import React from 'react';
import Sidebar from '../components/sidebar/Sidebar.js';
import InspectorPanel from '../components/shared/InspectorPanel';

const HomePage = () => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar />
      <main className="flex-grow flex flex-col">
        <div className="p-8 flex-grow">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Welcome to your CMS.</p>
        </div>
      </main>
      <InspectorPanel />
    </div>
  );
};

export default HomePage;
