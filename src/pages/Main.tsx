import { useState } from "react";
import Header from "@/common/Header";
import { Sidebar } from "@/dashboard/component/Sidebar";

const DefaultLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="flex h-screen overflow-hidden fixed top-0 left-0">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden z-999999">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>
    </div>
  );
};

export default DefaultLayout;
