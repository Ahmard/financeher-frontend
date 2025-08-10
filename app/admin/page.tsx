/** biome-ignore-all lint/a11y/useKeyWithClickEvents: true */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: true */
'use client';

import {Calendar, Clock, DollarSign, MessageSquare, MousePointer, TrendingUp, UserPlus, Users} from 'lucide-react';
import AdminLayout from "@/components/App/Layouts/AdminLayout";
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {useSession} from "next-auth/react";
import type {AuthUserData} from "@/lib/types/auth";

const Dashboard = () => {
  const {data: session} = useSession({required: true});

  const user: AuthUserData = session?.user;

  const chartData = [
    {month: 'Jan', registered: 125, active: 105},
    {month: 'Feb', registered: 45, active: 102},
    {month: 'Mar', registered: 85, active: 88},
    {month: 'Apr', registered: 205, active: 195},
    {month: 'May', registered: 105, active: 98},
    {month: 'Jun', registered: 85, active: 125},
    {month: 'Jul', registered: 45, active: 45},
    {month: 'Aug', registered: 145, active: 65},
    {month: 'Sep', registered: 65, active: 148},
  ];

  const maxValue = Math.max(...chartData.map(d => Math.max(d.registered, d.active)));

  return (
    <AdminLayout>
      <div className="flex justify-between mb-5">
        <div>
          <h1 className="text-xl lg:text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <span className="hidden sm:inline">Good Morning, {user.first_name}</span>
            <span className="sm:hidden">Dashboard</span>
            <span className="hidden sm:inline">🌻</span>
          </h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base hidden sm:block">
            Get a birds eye view of all the activities
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
          <Calendar className="w-4 h-4 text-gray-600"/>
          <span className="text-xs lg:text-sm text-gray-700">Jan 1, 2025 - Jul 30, 2025</span>
        </div>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">Total Registered Users</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">231</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <Users className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600"/>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">Monthly Active Users</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">201</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <Users className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600"/>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">Total Revenue (MTD)</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">$12,234</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <DollarSign className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600"/>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">Opportunities Listed</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">573</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600"/>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">Total AI Interactions</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">101</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <MessageSquare className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600"/>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">Average AI Chat Duration</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">4 Mins</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600"/>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">New Signups</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">20</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <UserPlus className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600"/>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1 truncate">
                  Click-Throughs to Application Links
                </p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">573</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
                <MousePointer className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600"/>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-base lg:text-lg font-semibold">Registered Users Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 lg:h-64 flex items-end justify-between gap-1 lg:gap-2 px-2 lg:px-4">
              {chartData.map((data, index) => (
                <div key={index} className="flex flex-col items-center gap-1 lg:gap-2 flex-1">
                  <div className="flex items-end gap-0.5 lg:gap-1 w-full justify-center h-32 lg:h-48">
                    <div
                      className="bg-[#006A4B] rounded-sm w-2 lg:w-4"
                      style={{height: `${(data.registered / maxValue) * 100}%`}}
                    ></div>
                    <div
                      className="bg-emerald-200 rounded-sm w-2 lg:w-4"
                      style={{height: `${(data.active / maxValue) * 100}%`}}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600">{data.month}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 lg:gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 lg:w-3 lg:h-3 bg-emerald-600 rounded"></div>
                <span className="text-xs lg:text-sm text-gray-600">Registered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 lg:w-3 lg:h-3 bg-emerald-200 rounded"></div>
                <span className="text-xs lg:text-sm text-gray-600">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Donut Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base lg:text-lg font-semibold">Total Opportunities by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 lg:w-40 lg:h-40 mb-4">
                <svg className="w-32 h-32 lg:w-40 lg:h-40 transform -rotate-90" viewBox="0 0 100 100">
                  {/* Outer circle - Investments (largest) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="12"
                    strokeDasharray="110 220"
                    strokeDashoffset="0"
                  />
                  {/* Loans */}
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="12"
                    strokeDasharray="55 275"
                    strokeDashoffset="-110"
                  />
                  {/* Grants */}
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#d1d5db"
                    strokeWidth="12"
                    strokeDasharray="35 295"
                    strokeDashoffset="-165"
                  />
                  {/* Accelerators */}
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#6b7280"
                    strokeWidth="12"
                    strokeDasharray="20 310"
                    strokeDashoffset="-200"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs text-gray-600">Opportunities Listed</span>
                  <span className="text-xl lg:text-2xl font-bold">573</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs w-full max-w-48">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 lg:w-3 lg:h-3 bg-gray-700 rounded-full flex-shrink-0"></div>
                  <span className="truncate">Accelerators</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 lg:w-3 lg:h-3 bg-gray-300 rounded-full flex-shrink-0"></div>
                  <span className="truncate">Grants</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 lg:w-3 lg:h-3 bg-emerald-600 rounded-full flex-shrink-0"></div>
                  <span className="truncate">Investments</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 lg:w-3 lg:h-3 bg-gray-600 rounded-full flex-shrink-0"></div>
                  <span className="truncate">Loans</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;