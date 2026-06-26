import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import Loader from '../components/Loader'
import { careersAPI } from '../services/api'

const CAREERS_PER_PAGE = 6

const CARD_COLORS = [
    { bg: '#0B6BA0' }, { bg: '#1a3a5c' }, { bg: '#2c7a4b' },
    { bg: '#5c3a7a' }, { bg: '#7a3a2c' }, { bg: '#2c5c7a' },
    { bg: '#4a7a2c' }, { bg: '#7a5c2c' },
]

const CAREER_IMAGES = {
    'Data Science': '/images/careers data science.png',
    'Software Engineering': '/images/careers software.png',
    'Product Management': '/images/careers product management.png',
    'UX/UI Design': '/images/careers UxUI.png',
    'Marketing': '/images/careersMarketing.png',
    'Sales': '/images/careers sales.png',
}

export default function Careers() {
    const [careers,      setCareers]      = useState([])
    const [loading,      setLoading]      = useState(true)
    const [error,        setError]        = useState('')
    const [search,       setSearch]       = useState('')
    const [page,         setPage]         = useState(1)
    const [delCareer,    setDelCareer]    = useState(null)
    const [delLoading,   setDelLoading]   = useState(false)
    const [statusFilter, setStatusFilter] = useState('all')

    const fetchCareers = useCallback((status = 'all', searchKey = '') => {
        setLoading(true)
        setError('')
        const params = { page: 1, size: 15 }
        if (searchKey) params.searchKey = searchKey
        const apiFn = status === 'frozen'
            ? careersAPI.getArchived(params)
            : careersAPI.getAll(params)
        apiFn
            .then((res) => setCareers(res.body?.data || res.body || []))
            .catch((err) => setError(err.message || 'Failed to load careers'))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => { fetchCareers(statusFilter) }, [fetchCareers])

    const handleStatusChange = (e) => {
        const val = e.target.value
        const s = val === 'Frozen' ? 'frozen' : val === 'Active' ? 'active' : 'all'
        setStatusFilter(s); setPage(1); fetchCareers(s, search)
    }

    const handleSearchChange = (e) => {
        setSearch(e.target.value); setPage(1); fetchCareers(statusFilter, e.target.value)
    }

    const filtered = careers.filter(c =>
        !search || (c.title || c.name || '').toLowerCase().includes(search.toLowerCase())
    )
    const totalPages = Math.ceil(filtered.length / CAREERS_PER_PAGE) || 1
    const pageItems  = filtered.slice((page - 1) * CAREERS_PER_PAGE, page * CAREERS_PER_PAGE)

    const confirmDelete = async () => {
        if (!delCareer) return
        setDelLoading(true)
        try {
            await careersAPI.delete(delCareer._id || delCareer.id)
            setDelCareer(null)
            fetchCareers()
        } catch (err) {
            alert(err.message || 'Failed to delete career')
        } finally {
            setDelLoading(false)
        }
    }

    return (
        <AdminLayout>
            <style>{`
                .careers-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-top: 18px; }
                @media (max-width:1100px){.careers-grid{grid-template-columns:repeat(3,1fr)}}
                @media (max-width:768px){.careers-grid{grid-template-columns:repeat(2,1fr)}}
                @media (max-width:480px){.careers-grid{grid-template-columns:1fr}}
                .career-card{background:#fff;border-radius:14px;border:1px solid #e8e8e8;overflow:hidden;cursor:pointer;transition:all .2s}
                .career-card:hover{box-shadow:0 6px 24px rgba(0,0,0,.10);transform:translateY(-2px)}
                .career-card-img{width:100%;height:110px;object-fit:cover;display:block}
                .career-card-placeholder{width:100%;height:110px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;color:#fff}
                .career-card-body{padding:12px 14px 14px}
                .career-card-name{font-weight:700;font-size:13px;color:#1A1A1A;margin-bottom:8px}
                .career-card-meta{display:flex;align-items:center;gap:14px;font-size:11px;color:#999}
                .career-card-actions{display:flex;gap:6px;margin-top:10px}
                .career-act{font-size:11px;font-weight:600;color:#0B6BA0;cursor:pointer;text-decoration:none}
                .career-act:hover{text-decoration:underline}
                .career-act-red{color:#e74c3c}
                .careers-header{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:4px}
                .careers-search-bar{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
            `}</style>

            <div className="careers-header">
                <h1 className="adm-page-title" style={{ marginBottom: 0 }}>Careers</h1>
                <div className="careers-search-bar">
                    <input
                        className="adm-search"
                        placeholder="Search careers..."
                        value={search}
                        onChange={handleSearchChange}
                        style={{ width: 200 }}
                    />
                    <div style={{ position: 'relative' }}>
                        <select className="adm-search"
                            style={{ paddingRight: 28, appearance: 'none', cursor: 'pointer' }}
                            value={statusFilter === 'frozen' ? 'Frozen' : statusFilter === 'active' ? 'Active' : 'Status'}
                            onChange={handleStatusChange}>
                            <option>Status</option>
                            <option>Active</option>
                            <option>Frozen</option>
                        </select>
                        <i className="bi bi-chevron-down" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: 11, pointerEvents: 'none' }}></i>
                    </div>
                    <Link to="/add-career" className="adm-btn-add">
                        <i className="bi bi-plus-lg me-1"></i>Add New Path
                    </Link>
                </div>
            </div>

            {loading && <Loader inline text="Loading careers..." />}

            {!loading && error && (
                <div style={{ color: '#e74c3c', padding: '12px 0' }}>{error}</div>
            )}

            {!loading && !error && (
                <>
                    <div className="careers-grid">
                        {pageItems.length === 0 ? (
                            <p style={{ color: '#999', gridColumn: '1/-1', textAlign: 'center', padding: 30 }}>No careers found.</p>
                        ) : (
                            pageItems.map((c, gi) => {
                                const name   = c.title || c.name || 'Career'
                                const imgSrc = CAREER_IMAGES[name] || ''
                                const color  = CARD_COLORS[gi % CARD_COLORS.length]
                                const id     = c._id || c.id
                                return (
                                    <div key={id || gi} className="career-card"
                                        onClick={(e) => {
                                            if (e.target.tagName === 'A' || e.target.tagName === 'SPAN') return
                                            window.location.href = `/career-detail?id=${id}`
                                        }}
                                    >
                                        {imgSrc
                                            ? <img src={imgSrc} className="career-card-img" alt={name}
                                                onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }} />
                                            : null
                                        }
                                        <div className="career-card-placeholder"
                                            style={{ background: color.bg, display: imgSrc ? 'none' : 'flex' }}>
                                            {name.toUpperCase()}
                                        </div>
                                        <div className="career-card-body">
                                            <div className="career-card-name">{name}</div>
                                            <div className="career-card-meta">
                                                <span><i className="bi bi-people"></i> {c.usersCount ?? c.users ?? 0} users</span>
                                                <span><i className="bi bi-list-check"></i> {c.stepsCount ?? c.steps ?? 0} steps</span>
                                            </div>
                                            <div className="career-card-actions">
                                                <Link to={`/career-detail?id=${id}`} className="career-act">View</Link>
                                                <span style={{ color: '#ddd' }}>|</span>
                                                <Link to={`/career-detail?id=${id}&edit=1`} className="career-act">Edit</Link>
                                                <span style={{ color: '#ddd' }}>|</span>
                                                <span className="career-act career-act-red"
                                                    onClick={(e) => { e.stopPropagation(); setDelCareer(c) }}>Delete</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="adm-pagination" style={{ marginTop: 20, justifyContent: 'center' }}>
                            <div className="adm-pg-btn" style={{ opacity: page===1?.4:1 }} onClick={() => page>1 && setPage(page-1)}>
                                <i className="bi bi-chevron-left"></i>
                            </div>
                            {Array.from({ length: totalPages }, (_,i) => i+1).map(p => (
                                <div key={p} className={`adm-pg-btn ${p===page?'active':''}`} onClick={() => setPage(p)}>{p}</div>
                            ))}
                            <div className="adm-pg-btn" style={{ opacity: page===totalPages?.4:1 }} onClick={() => page<totalPages && setPage(page+1)}>
                                <i className="bi bi-chevron-right"></i>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Delete Modal */}
            <div className={`adm-modal-overlay ${delCareer ? 'show' : ''}`}
                onClick={(e) => e.target === e.currentTarget && setDelCareer(null)}>
                <div className="adm-modal" style={{ borderTop: '4px solid #e74c3c' }}>
                    <h3 style={{ color: '#e74c3c' }}><i className="bi bi-exclamation-triangle me-2"></i>Delete Career</h3>
                    <p style={{ color: '#666', fontSize: 13, marginBottom: 16 }}>
                        Delete "<strong>{delCareer?.title || delCareer?.name}</strong>"? This cannot be undone.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <button className="adm-btn-confirm adm-btn-danger" style={{ width: '100%', justifyContent: 'center' }}
                            onClick={confirmDelete} disabled={delLoading}>
                            <i className="bi bi-trash me-1"></i>{delLoading ? 'Deleting...' : 'Delete Career'}
                        </button>
                        <button className="adm-btn-cancel" style={{ width: '100%', textAlign: 'center' }}
                            onClick={() => setDelCareer(null)}>Cancel</button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
