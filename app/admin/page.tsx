'use client'

import { useState, useEffect } from 'react'

const API_BASE = '/api/v1'

type Metrics = {
  dau: number; wau: number; mau: number
  totalPageviews: number; totalUniques: number
  subscribers?: { verified?: number; pending?: number; unsubscribed?: number }
  verified?: number; pending?: number; unverified?: number
}

type DailyData = { date: string; views: number; unique_visitors: number }[]
type SubData = { date: string; new_subs: number }[]
type PageData = { page_url: string; views: number; uniques: number }[]
type RefData = { referrer: string; visits: number }[]
type DevData = { device_type: string; count: number }[]
type SubRow = { id: number; email: string; name: string; status: string; source: string; verified_at: string; subscribed_at: string }

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [daily, setDaily] = useState<DailyData>([])
  const [subGrowth, setSubGrowth] = useState<SubData>([])
  const [topPages, setTopPages] = useState<PageData>([])
  const [topRefs, setTopRefs] = useState<RefData>([])
  const [devices, setDevices] = useState<DevData>([])
  const [subscribers, setSubscribers] = useState<SubRow[]>([])

  useEffect(() => {
    fetch(`${API_BASE}/admin/check`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(() => { setLoggedIn(true); loadData() })
      .catch(() => {})
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })
    if (res.ok) {
      setLoggedIn(true)
      loadData()
    } else {
      setLoginError('Invalid credentials')
    }
  }

  const loadData = async () => {
    const opts = { credentials: 'include' as RequestCredentials }
    const [m, d, s, p, r, dev, sub] = await Promise.all([
      fetch(`${API_BASE}/admin/metrics`, opts).then(r => r.json()).catch(() => null),
      fetch(`${API_BASE}/admin/chart/daily`, opts).then(r => r.json()).catch(() => []),
      fetch(`${API_BASE}/admin/chart/subscribers`, opts).then(r => r.json()).catch(() => []),
      fetch(`${API_BASE}/admin/top-pages`, opts).then(r => r.json()).catch(() => []),
      fetch(`${API_BASE}/admin/top-referrers`, opts).then(r => r.json()).catch(() => []),
      fetch(`${API_BASE}/admin/devices`, opts).then(r => r.json()).catch(() => []),
      fetch(`${API_BASE}/admin/subscribers`, opts).then(r => r.json()).catch(() => []),
    ])
    setMetrics(m); setDaily(d); setSubGrowth(s)
    setTopPages(p); setTopRefs(r); setDevices(dev); setSubscribers(sub)
  }

  const exportCSV = () => {
    window.open(`${API_BASE}/admin/subscribers/export`, '_blank')
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center px-4">
        <div className="bg-white rounded-xl p-8 w-full max-w-sm">
          <h1 className="font-heading font-bold text-xl text-heading mb-6 text-center">Admin Dashboard</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email" placeholder="Email" value={email}
              onChange={e => setEmail(e.target.value)} required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-body focus:outline-none focus:border-lime"
            />
            <input
              type="password" placeholder="Password" value={password}
              onChange={e => setPassword(e.target.value)} required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-body focus:outline-none focus:border-lime"
            />
            <button type="submit" className="w-full bg-lime hover:bg-lime-dark text-white py-3 rounded-lg font-heading font-semibold transition-colors">
              Sign In
            </button>
            {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading font-bold text-2xl">architmittal.com — Admin Dashboard</h1>
          <button onClick={() => { fetch(`${API_BASE}/admin/logout`, { method: 'POST', credentials: 'include' }); setLoggedIn(false) }}
            className="text-subtle hover:text-white text-sm font-body transition-colors">Logout</button>
        </div>

        {/* Metric Cards */}
        {metrics && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <MetricCard label="DAU" value={metrics.dau} />
            <MetricCard label="WAU" value={metrics.wau} />
            <MetricCard label="MAU" value={metrics.mau} />
            <MetricCard label="Total Views" value={metrics.totalPageviews} />
            <MetricCard label="Uniques" value={metrics.totalUniques} />
            <MetricCard label="Subscribers" value={metrics.subscribers?.verified ?? metrics.verified ?? 0} sub={`${metrics.subscribers?.pending ?? metrics.pending ?? 0} pending`} />
          </div>
        )}

        {/* Charts placeholder — using simple bar visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="font-heading font-semibold text-sm mb-4">Daily Pageviews (30 days)</h3>
            <div className="flex items-end gap-1 h-32">
              {daily.map((d, i) => {
                const max = Math.max(...daily.map(x => x.views), 1)
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-lime/80 rounded-t" style={{ height: `${(d.views / max) * 100}%`, minHeight: '2px' }}
                      title={`${d.date}: ${d.views} views`} />
                  </div>
                )
              })}
            </div>
            {daily.length === 0 && <p className="text-subtle text-sm">No data yet</p>}
          </div>

          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="font-heading font-semibold text-sm mb-4">Subscriber Growth (30 days)</h3>
            <div className="flex items-end gap-1 h-32">
              {subGrowth.map((d, i) => {
                const max = Math.max(...subGrowth.map(x => x.new_subs), 1)
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-lime/80 rounded-t" style={{ height: `${(d.new_subs / max) * 100}%`, minHeight: '2px' }}
                      title={`${d.date}: ${d.new_subs} subs`} />
                  </div>
                )
              })}
            </div>
            {subGrowth.length === 0 && <p className="text-subtle text-sm">No data yet</p>}
          </div>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="font-heading font-semibold text-sm mb-4">Top Pages</h3>
            <div className="space-y-2">
              {topPages.slice(0, 10).map((p, i) => (
                <div key={i} className="flex justify-between text-xs font-body">
                  <span className="text-gray-300 truncate mr-2">{p.page_url}</span>
                  <span className="text-lime font-semibold whitespace-nowrap">{p.views}</span>
                </div>
              ))}
              {topPages.length === 0 && <p className="text-subtle text-xs">No data yet</p>}
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="font-heading font-semibold text-sm mb-4">Top Referrers</h3>
            <div className="space-y-2">
              {topRefs.slice(0, 10).map((r, i) => (
                <div key={i} className="flex justify-between text-xs font-body">
                  <span className="text-gray-300 truncate mr-2">{r.referrer}</span>
                  <span className="text-lime font-semibold whitespace-nowrap">{r.visits}</span>
                </div>
              ))}
              {topRefs.length === 0 && <p className="text-subtle text-xs">No data yet</p>}
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="font-heading font-semibold text-sm mb-4">Devices</h3>
            <div className="space-y-2">
              {devices.map((d, i) => (
                <div key={i} className="flex justify-between text-xs font-body">
                  <span className="text-gray-300">{d.device_type || 'unknown'}</span>
                  <span className="text-lime font-semibold">{d.count}</span>
                </div>
              ))}
              {devices.length === 0 && <p className="text-subtle text-xs">No data yet</p>}
            </div>
          </div>
        </div>

        {/* Subscribers table */}
        <div className="bg-white/5 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-sm">Subscribers</h3>
            <button onClick={exportCSV} className="bg-lime/20 hover:bg-lime/30 text-lime text-xs px-3 py-1 rounded font-heading transition-colors">
              Export CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-body">
              <thead>
                <tr className="text-subtle border-b border-white/10">
                  <th className="text-left py-2 pr-4">Email</th>
                  <th className="text-left py-2 pr-4">Name</th>
                  <th className="text-left py-2 pr-4">Status</th>
                  <th className="text-left py-2 pr-4">Source</th>
                  <th className="text-left py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((s, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-2 pr-4 text-gray-300">{s.email}</td>
                    <td className="py-2 pr-4 text-gray-400">{s.name || '-'}</td>
                    <td className="py-2 pr-4">
                      <span className={`px-2 py-0.5 rounded text-xs ${s.status === 'verified' ? 'bg-lime/20 text-lime' : s.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-gray-400">{s.source}</td>
                    <td className="py-2 text-gray-400">{new Date(s.subscribed_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {subscribers.length === 0 && (
                  <tr><td colSpan={5} className="py-4 text-center text-subtle">No subscribers yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="bg-white/5 rounded-xl p-4">
      <div className="text-subtle text-xs font-body mb-1">{label}</div>
      <div className="text-lime font-heading font-bold text-2xl">{value.toLocaleString()}</div>
      {sub && <div className="text-subtle text-xs font-body mt-1">{sub}</div>}
    </div>
  )
}
