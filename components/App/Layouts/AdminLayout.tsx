/** biome-ignore-all lint/a11y/useKeyWithClickEvents: true */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: true */

import {Avatar} from "antd";
import {
  BarChart3,
  Bell,
  BookOpen,
  ChevronsUpDown,
  HelpCircle,
  List,
  LogOut,
  Menu,
  Settings,
  TrendingUp,
  User,
  Users,
  X,
} from 'lucide-react';
import Image from "next/image";
import {signOut, useSession} from "next-auth/react";
import type React from 'react';
import {useState} from 'react';
import {DEFAULT_AVATAR} from "@/lib/constants/user";
import {authUrl} from "@/lib/helpers/url";
import type {AuthUserData} from "@/lib/types/auth";
import Link from "next/link";
import {clearBearerToken} from "@/lib/helpers/auth";

interface IProps {
  children: React.ReactNode;
  currentPage?: CurrentPage;
}

export enum CurrentPage {
  Dashboard = 'dashboard',
  Users = 'users',
  Opportunities = 'opportunities',
  LoanList = 'loan-list',
  Resources = 'resources',
  Settings = 'settings',
}

const AdminLayout = (props: IProps) => {
  const {children, currentPage} = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const {data: session} = useSession({required: true});

  const user: AuthUserData = session?.user;

  const profilePicture = user?.profile_picture ? authUrl(user.profile_picture) : DEFAULT_AVATAR;

  const theCurrentPage = currentPage ?? CurrentPage.Dashboard;


  const logout = async () => {
    clearBearerToken()
    await signOut({redirect: true, callbackUrl: '/login'});
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Profile Dropdown Overlay */}
      {profileDropdownOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setProfileDropdownOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#006A4B] text-white 
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-200 ease-in-out
      `}>
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-lg lg:text-xl font-bold">
              <Image width={200} height={200} src="/images/financeher-white.png" alt="Financeher"/>
            </div>

            {/* Close button for mobile */}
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 hover:bg-emerald-700 rounded"
            >
              <X className="w-5 h-5"/>
            </button>
          </div>
        </div>

        <nav className="mt-4 lg:mt-8 px-2">
          <Link href="/admin" className="!text-white">
            <div
              className={`px-4 lg:px-6 py-3 mt-1 rounded-4xl ${theCurrentPage === CurrentPage.Dashboard ? 'bg-[#214F47]' : 'hover:bg-emerald-700'}`}>
              <div className="flex items-center gap-3">
                <BarChart3 className="w-4 h-4 lg:w-5 lg:h-5"/>
                <span className="text-sm lg:text-base">Dashboard</span>
              </div>
            </div>
          </Link>

          <Link href="/admin/opportunities" className="!text-white">
            <div
              className={`px-4 lg:px-6 py-3 mt-1 rounded-4xl  cursor-pointer ${theCurrentPage === CurrentPage.Opportunities ? 'bg-[#214F47]' : 'hover:bg-emerald-700'}`}>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5"/>
                <span className="text-sm lg:text-base">Opportunities</span>
              </div>
            </div>
          </Link>

          <div
            className={`px-4 lg:px-6 py-3 mt-1 rounded-4xl cursor-pointer ${theCurrentPage === CurrentPage.Users ? 'bg-[#214F47]' : 'hover:bg-emerald-700'}`}>
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 lg:w-5 lg:h-5"/>
              <span className="text-sm lg:text-base">Users</span>
            </div>
          </div>

          <Link href="/admin/loan-vcs" className="!text-white">
            <div
              className={`px-4 lg:px-6 py-3 mt-1 rounded-4xl cursor-pointer ${theCurrentPage === CurrentPage.LoanList ? 'bg-[#214F47]' : 'hover:bg-emerald-700'}`}>
              <div className="flex items-center gap-3">
                <List className="w-4 h-4 lg:w-5 lg:h-5"/>
                <span className="text-sm lg:text-base">Loans/VC List</span>
              </div>
            </div>
          </Link>

          <div
            className={`px-4 lg:px-6 py-3 mt-1 rounded-4xl cursor-pointer ${theCurrentPage === CurrentPage.Resources ? 'bg-[#214F47]' : 'hover:bg-emerald-700'}`}>
            <div className="flex items-center gap-3">
              <BookOpen className="w-4 h-4 lg:w-5 lg:h-5"/>
              <span className="text-sm lg:text-base">Resources</span>
            </div>
          </div>

          <div
            className={`px-4 lg:px-6 py-3 mt-1 rounded-4xl cursor-pointer ${theCurrentPage === CurrentPage.Settings ? 'bg-[#214F47]' : ''}`}>
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 lg:w-5 lg:h-5"/>
              <span className="text-sm lg:text-base">Settings</span>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <div className="bg-white border-b px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5"/>
              </button>


            </div>

            <div className="flex items-center gap-2 lg:gap-4">
              {/* Notifications */}
              <button type="button" className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-5 h-5 text-gray-600"/>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg border border-gray-200"
                >
                  <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center">
                    {/*<span className="text-white text-xs lg:text-sm font-semibold">NO</span>*/}
                    <Avatar size="large" src={profilePicture}/>
                  </div>
                  <span className="text-xs lg:text-sm font-medium hidden sm:inline">{user.full_name}</span>
                  <ChevronsUpDown className="ms-5 w-4 h-4 text-gray-500 hidden sm:inline"/>
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 mt-1 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <User className="w-4 h-4"/>
                        Your Profile
                      </button>
                      <button
                        type="button"
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Settings className="w-4 h-4"/>
                        Settings
                      </button>
                      <button
                        type="button"
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <HelpCircle className="w-4 h-4"/>
                        Help & Support
                      </button>
                    </div>

                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={logout}
                        type="button"
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        <LogOut className="w-4 h-4"/>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;