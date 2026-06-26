import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import Loader from '../components/Loader'
import { dashboardAPI } from '../services/api'

export default function Dashboard() {
    const [loading, setLoading] = useState(true)
    const [stats,   setStats]   = useState(null)
    const [error,   setError]   = useState('')

    useEffect(() => {
        dashboardAPI.getStats()
            .then((res) => setStats(res.body))
            .catch((err) => setError(err.message || 'Failed to load dashboard data'))
            .finally(() => setLoading(false))
    }, [])

    const statCards = stats ? [
        { key: 'Users',         num: stats.usersCount         ?? stats.users         ?? '—' },
        { key: 'Careers',       num: stats.careersCount       ?? stats.careers       ?? '—' },
        { key: 'Quizzes',       num: stats.quizzesCount       ?? stats.quizzes       ?? '—' },
        { key: 'Notifications', num: stats.notificationsCount ?? stats.notifications ?? '—' },
    ] : []

    const activity = stats?.recentActivity || stats?.latestActivities || []

    return (
        <AdminLayout>
            <style>{`
                .dash-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 28px; }
                @media(max-width:900px){.dash-stats{grid-template-columns:repeat(2,1fr)}}
                @media(max-width:480px){.dash-stats{grid-template-columns:1fr}}
                .dash-stat { background:#fff; border-radius:14px; border:1px solid #e8e8e8; padding:20px 22px; }
                .dash-stat-icon { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; margin-bottom:12px; font-size:18px; color:#fff; }
                .dash-stat-key { font-size:13px; color:#999; font-weight:600; margin-bottom:4px; }
                .dash-stat-num { font-size:28px; font-weight:800; color:#1A1A1A; }
                .dash-act-table th { font-size:11px; color:#999; font-weight:700; text-transform:uppercase; padding:10px 14px; background:#fafafa; }
                .dash-act-table td { padding:12px 14px; font-size:13px; border-bottom:1px solid #f5f5f5; }
                .dash-act-table tr:last-child td { border-bottom:none; }
                .dash-act-table .ts { color:#999; font-size:12px; }
                .dash-act-table .detail { color:#0B6BA0; }
            `}</style>

            <h1 className="adm-page-title">Admin Overview</h1>

            {loading && <Loader inline text="Loading dashboard..." />}

            {!loading && error && (
                <div style={{ background:'rgba(231,76,60,.08)', border:'1px solid rgba(231,76,60,.25)', borderRadius:10, padding:'12px 16px', color:'#e74c3c', marginBottom:20 }}>
                    <i className="bi bi-exclamation-circle me-2"></i>{error}
                </div>
            )}

            {!loading && (
                <>
                    <div className="adm-section-label">Overview</div>
                    <div className="dash-stats">
                        {statCards.length > 0 ? statCards.map((s) => (
                            <div className="dash-stat" key={s.key}>
                                <div className="dash-stat-key">{s.key}</div>
                                <div className="dash-stat-num">{s.num}</div>
                            </div>
                        )) : (
                            ['Users','Careers','Quizzes','Notifications'].map((k) => (
                                <div className="dash-stat" key={k}>
                                    <div className="dash-stat-key">{k}</div>
                                    <div className="dash-stat-num" style={{ color:'#ccc' }}>—</div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="adm-section-label" style={{ marginTop:8 }}>Recent Activity</div>
                    <div className="adm-table-card">
                        <div style={{ overflowX:'auto' }}>
                            <table className="adm-table dash-act-table" style={{ width:'100%' }}>
                                <thead>
                                    <tr>
                                        <th>Activity</th>
                                        <th>Timestamp</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activity.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" style={{ textAlign:'center', color:'#999', padding:28 }}>
                                                No recent activity yet.
                                            </td>
                                        </tr>
                                    ) : activity.map((a, i) => (
                                        <tr key={i}>
                                            <td style={{ fontWeight:600 }}>{a.activity ?? a.type ?? a.action ?? '—'}</td>
                                            <td className="ts">{a.timestamp ?? a.createdAt ?? '—'}</td>
                                            <td className="detail">{a.details ?? a.description ?? a.detail ?? '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </AdminLayout>
    )
}
