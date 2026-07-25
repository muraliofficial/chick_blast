import { useState, useEffect } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts'
import { dashboardApi } from '../../shared/api'
import ModernDatePicker from '../../shared/components/ModernDatePicker'
import ModernSelect from '../../shared/components/ModernSelect'
import { TrendingUp, ShoppingBag, PieChart as PieIcon } from 'lucide-react'

const COLORS = ['#ff6b35', '#ffc857', '#3b82f6', '#22c55e', '#8b5cf6', '#ef4444', '#06b6d4']

export default function Dashboard() {
  const today = new Date().toISOString().split('T')[0]
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  const [itemDate, setItemDate] = useState(today)
  const [itemData, setItemData] = useState([])
  const [growthMonth, setGrowthMonth] = useState(currentMonth)
  const [growthYear, setGrowthYear] = useState(currentYear)
  const [growthData, setGrowthData] = useState([])

  useEffect(() => {
    dashboardApi.itemCounts(itemDate).then(setItemData).catch(console.error)
  }, [itemDate])

  useEffect(() => {
    dashboardApi.orderGrowth(growthMonth, growthYear).then(setGrowthData).catch(console.error)
  }, [growthMonth, growthYear])

  const totalOrdersThisDate = itemData.reduce((s, i) => s + i.count, 0)
  const totalOrders = growthData.reduce((s, d) => s + d.count, 0)
  const activeDays = growthData.filter((d) => d.count > 0).length

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(2000, i).toLocaleString('default', { month: 'long' }),
  }))

  const yearOptions = [currentYear - 1, currentYear, currentYear + 1].map((y) => ({
    value: y,
    label: String(y),
  }))

  return (
    <div className="space-y-6">
      <div className="admin-page-header">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 m-0">Dashboard Overview</h2>
          <p className="text-xs text-gray-500 mt-1">Real-time metrics & analytics</p>
        </div>
      </div>

      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-2xl p-5 shadow-lg shadow-orange-500/20 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs font-medium text-orange-100 uppercase tracking-wider">Total Monthly Orders</p>
            <h3 className="text-3xl font-black mt-1 m-0">{totalOrders}</h3>
            <p className="text-xs text-orange-100/90 mt-2 flex items-center gap-1">
              <TrendingUp size={14} /> {activeDays} active sales days
            </p>
          </div>
          <ShoppingBag className="absolute right-3 bottom-2 w-20 h-20 text-white/10" />
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Selected Date Sales</p>
          <h3 className="text-3xl font-black text-gray-900 mt-1 m-0">{totalOrdersThisDate}</h3>
          <p className="text-xs text-gray-500 mt-2">Items ordered on {itemDate}</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Top Performing Category</p>
          <h3 className="text-xl font-bold text-gray-900 mt-1 m-0 truncate">
            {itemData[0]?.name || 'N/A'}
          </h3>
          <p className="text-xs text-emerald-600 font-semibold mt-2">
            {itemData[0] ? `${itemData[0].count} orders` : 'No data'}
          </p>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Item-wise Donut Card */}
        <div className="admin-stat-card bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-orange-50 text-orange-500">
                <PieIcon size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 m-0">Item Distribution</h3>
                <span className="text-xs text-gray-400">Sales share per item</span>
              </div>
            </div>
            <div className="w-48">
              <ModernDatePicker value={itemDate} onChange={(d) => d && setItemDate(d)} />
            </div>
          </div>

          {itemData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <p className="text-3xl mb-2">📊</p>
              <p className="text-sm font-medium">No orders recorded for this date</p>
            </div>
          ) : (
            <div className="relative">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={itemData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={105}
                    paddingAngle={4}
                    cornerRadius={6}
                  >
                    {itemData.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={COLORS[idx % COLORS.length]}
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-slate-900/90 text-white px-3 py-2 rounded-xl text-xs font-semibold shadow-xl border border-white/20">
                            <p className="m-0 text-amber-400">{data.name}</p>
                            <p className="m-0 text-white font-bold">{data.count} items sold</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Inner Radial Stat */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-gray-900">{totalOrdersThisDate}</span>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total</span>
              </div>
            </div>
          )}

          {/* Custom Pill Legends */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {itemData.map((item, idx) => (
              <div
                key={item.name}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-xs font-medium text-gray-700"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: COLORS[idx % COLORS.length] }}
                />
                <span className="truncate max-w-[120px]">{item.name}</span>
                <span className="font-bold text-gray-900 bg-white px-1.5 py-0.5 rounded-md shadow-2xs">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Growth Card */}
        <div className="admin-stat-card bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-orange-50 text-orange-500">
                <TrendingUp size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 m-0">Monthly Sales Trend</h3>
                <span className="text-xs text-gray-400">Daily order volume</span>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-36">
                <ModernSelect
                  options={monthOptions}
                  value={growthMonth}
                  onChange={(v) => setGrowthMonth(Number(v))}
                />
              </div>
              <div className="w-28">
                <ModernSelect
                  options={yearOptions}
                  value={growthYear}
                  onChange={(v) => setGrowthYear(Number(v))}
                />
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff6b35" stopOpacity={1} />
                  <stop offset="100%" stopColor="#ffc857" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => d.split('-')[2]}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#94a3b8' }}
              />
              <YAxis allowDecimals={false} fontSize={11} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-slate-900/90 text-white px-3 py-2 rounded-xl text-xs font-semibold shadow-xl border border-white/20">
                        <p className="m-0 text-orange-400">{data.date}</p>
                        <p className="m-0 text-white font-bold">{data.count} Orders</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="count" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
