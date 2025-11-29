// DashboardLayout.jsx
import React from 'react'
import SidebarComponent from '../components/DashboardComponents/SidebarComponent'
import { Outlet } from 'react-router-dom'

const DashboardLayout = () => {
  return (
    <>
      <SidebarComponent />
            <div className=" md:ml-64 lg:ml-64 min-h-screen p-4 bg-gray-100">
        <Outlet />
      </div>
    </>
  )
}

export default DashboardLayout
