import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import Loader from '../components/Loader'
import { roadmapsAPI, careersAPI } from '../services/api'

const PER_PAGE = 10

export default function Roadmaps() {
    const navigate = useNavigate()
    const [roadmaps, setRoadmaps] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'frozen'

    const [delId, setDelId] = useState(null)
    const [delLoading, setDelLoading] = useState(false)
    const [archiveId, setArchiveId] = useState(null)
    const [archiveLoading, setArchiveLoading] = useState(false)
    const [restoreId, setRestoreId] = useState(null)
    const [restoreLoading, setRestoreLoading] = useState(false)

    // Add New Roadmap modal
    const [showAdd, setShowAdd] = useState(false)
    const [addLoading, setAddLoading] = useState(false)
    const [addErr, setAddErr] = useState('')
    const [careers, setCareers] = useState([])
    const [newRoadmap, setNewRoadmap] = useState({ careerId: '', title: '', order: '', description: '' })

    const [toast, setToast] = useState('')
    const [toastType, setToastType] = useState('success')
    const showToast = (msg, type = 'success') => { setToast(msg); setToastType(type); setTimeout(() => setToast(''), 3000) }

    const statusLabel = statusFilter === 'frozen' ? 'Frozen' : statusFilter === 'active' ? 'Active' : 'Status'

    const fetchRoadmaps = useCallback((p = 1, searchKey = '', status = 'all') => {
        setLoading(true)
        setError('')

        const params = { page: p, size: PER_PAGE }

        if (searchKey) params.searchKey = searchKey

        const apiFn = status === 'frozen'
            ? roadmapsAPI.getArchived(params)
            : roadmapsAPI.getAll(params)

        apiFn
            .then((res) => {
                let data = res.body?.data || []

                console.log('DATA:', data) // 👈 شوفي شكل الداتا

                // ✅ فلترة حسب الحالة
                if (statusFilter === 'frozen') {
                    data = data.filter(item => item?.isArchived === true)
                }

                if (statusFilter === 'active') {
                    data = data.filter(item => item?.isArchived === false)
                }

                setRoadmaps(data)
                setTotalPages(res.body?.totalPages || 1)
            })
            .catch((err) => {
                setError(err.message || 'Failed to load roadmaps')
            })
            .finally(() => {
                setLoading(false)
            })

    }, [statusFilter])

    useEffect(() => { fetchRoadmaps(1, '', statusFilter) }, [fetchRoadmaps])

    const handleSearch = (e) => { setSearch(e.target.value); setPage(1); fetchRoadmaps(1, e.target.value, statusFilter) }
    const handlePage = (p) => { setPage(p); fetchRoadmaps(p, search, statusFilter) }
    const handleStatus = (e) => {
        const val = e.target.value
        const s = val === 'Frozen' ? 'frozen' : val === 'Active' ? 'active' : 'all'
        setStatusFilter(s); setPage(1); fetchRoadmaps(1, search, s)
    }

    const openAdd = () => {
        setAddErr('')
        setNewRoadmap({ careerId: '', title: '', order: '', description: '' })
        // Load careers for dropdown
        careersAPI.getAll({ page: 1, size: 10 })
            .then(res => setCareers(res.body?.data || []))
            .catch(() => setCareers([]))
        setShowAdd(true)
    }

    const handleAdd = async () => {
        if (!newRoadmap.title.trim()) { setAddErr('Title is required'); return }
        if (!newRoadmap.careerId) { setAddErr('Please select a Career'); return }
        if (!newRoadmap.order) { setAddErr('Order is required'); return }
        setAddErr('')
        setAddLoading(true)
        try {
            await roadmapsAPI.create({
                careerId: newRoadmap.careerId,
                title: newRoadmap.title,
                order: parseInt(newRoadmap.order),
                description: newRoadmap.description,
                courses: [],
            })
            setShowAdd(false)
            fetchRoadmaps(page, search, statusFilter)
            showToast('Roadmap step added successfully!')
        } catch (err) {
            setAddErr(err.message || 'Failed to add roadmap step')
        } finally {
            setAddLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!delId) return
        setDelLoading(true)
        try {
            await roadmapsAPI.delete(delId)
            setDelId(null)
            fetchRoadmaps(page, search, statusFilter)
            showToast('Roadmap step deleted')
        } catch (err) { showToast(err.message || 'Failed to delete', 'error') }
        finally { setDelLoading(false) }
    }

    const handleArchive = async () => {
        if (!archiveId) return

        setArchiveLoading(true)

        try {

            await roadmapsAPI.archive(archiveId.id, {
                v: archiveId.v
            })

            showToast('Frozen successfully ✅')

        } catch (err) {
            showToast(err.message || 'Failed to freeze', 'error')
        } finally {
            setArchiveId(null)
            fetchRoadmaps(page, search, statusFilter)
            setArchiveLoading(false)
        }
    }
    const handleRestore = async () => {
        if (!restoreId) return

        setRestoreLoading(true)

        try {
            await roadmapsAPI.restore(restoreId.id, {
                v: restoreId.v
            })

            showToast('Roadmap step restored')

        } catch (err) {
            showToast(err.message || 'Failed to restore', 'error')
        } finally {
            setRestoreId(null)
            fetchRoadmaps(page, search, statusFilter)
            setRestoreLoading(false)
        }
    }
    return (
        <AdminLayout>
            {toast && (
                <div style={{ position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', background: toastType === 'error' ? '#e74c3c' : '#27ae60', color: '#fff', padding: '11px 22px', borderRadius: 10, fontSize: 13, fontWeight: 700, zIndex: 9999, boxShadow: '0 4px 16px rgba(0,0,0,.15)' }}>
                    <i className={`bi ${toastType === 'error' ? 'bi-exclamation-circle-fill' : 'bi-check-circle-fill'} me-2`}></i>{toast}
                </div>
            )}

            <h1 className="adm-page-title">Roadmaps Management</h1>
            <div className="adm-table-card">
                <div className="adm-table-header">
                    <h3>All Roadmap Steps</h3>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                        <input className="adm-search" placeholder="Search roadmaps..."
                            value={search} onChange={handleSearch} />
                        <div style={{ position: 'relative' }}>
                            <select className="adm-search"
                                style={{ paddingRight: 28, appearance: 'none', cursor: 'pointer' }}
                                value={statusLabel}
                                onChange={handleStatus}>
                                <option>Status</option>
                                <option>Active</option>
                                <option>Frozen</option>
                            </select>
                            <i className="bi bi-chevron-down" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: 11, pointerEvents: 'none' }}></i>
                        </div>
                        <button className="adm-btn-add" onClick={openAdd}>
                            <i className="bi bi-plus-lg me-1"></i>Add New Roadmap
                        </button>
                    </div>
                </div>

                {error && <div style={{ color: '#e74c3c', padding: '12px 16px' }}>{error}</div>}

                {loading ? <Loader inline text="Loading roadmaps..." /> : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="adm-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Title</th>
                                    <th>Career Path</th>
                                    <th>Total Steps</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roadmaps.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', color: '#999', padding: 30 }}>
                                            {statusFilter === 'frozen' ? 'No archived roadmap steps found 🔍' : 'No roadmap steps found'}
                                        </td>
                                    </tr>
                                ) : roadmaps.map((r, i) => (
                                    <tr key={r.id || r._id}>
                                        <td>{(page - 1) * PER_PAGE + i + 1}</td>
                                        <td style={{ fontWeight: 600 }}>{r.title || '—'}</td>
                                        <td style={{ color: '#666' }}>{r.careerId?.title || r.careerTitle || r.career || '—'}</td>
                                        <td style={{ textAlign: 'center' }}>{r.courses?.length ?? r.stepsCount ?? '—'}</td>
                                        <td style={{ color: '#999', fontSize: 12, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {r.description || '—'}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                                                <span className="adm-act" onClick={() => navigate(`/update-roadmap?id=${r.id || r._id}`)}>Edit Roadmap</span>
                                                <span style={{ color: '#ddd' }}>|</span>
                                                <span className="adm-act" onClick={() => navigate(`/career-detail?id=${r.careerId?._id || r.careerId || ''}`)}>View Details</span>
                                                <span style={{ color: '#ddd' }}>|</span>
                                                {statusFilter === 'frozen' ? (
                                                    <>
                                                        <span className="adm-act" style={{ color: '#27ae60' }} onClick={() => setRestoreId({ id: r.id, v: r.v })}>Restore</span>
                                                        <span style={{ color: '#ddd' }}>|</span>
                                                        <span className="adm-act adm-act-red" onClick={() => setDelId({ id: r.id, v: r.v })}>Delete</span>
                                                    </>
                                                ) : (
                                                    <span className="adm-act" style={{ color: '#e67e22' }} onClick={() => setArchiveId({ id: r.id, v: r.v })}>Freeze</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && totalPages > 1 && (
                    <div className="adm-pagination">
                        <div className="adm-pg-btn" onClick={() => page > 1 && handlePage(page - 1)}><i className="bi bi-chevron-left"></i></div>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <div key={p} className={`adm-pg-btn ${p === page ? 'active' : ''}`} onClick={() => handlePage(p)}>{p}</div>
                        ))}
                        <div className="adm-pg-btn" onClick={() => page < totalPages && handlePage(page + 1)}><i className="bi bi-chevron-right"></i></div>
                    </div>
                )}
            </div>

            {/* Add New Roadmap Modal */}
            <div className={`adm-modal-overlay ${showAdd ? 'show' : ''}`} onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
                <div className="adm-modal" style={{ maxWidth: 440 }}>
                    <h3>Add New Roadmap Step</h3>
                    <div style={{ marginBottom: 12 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Career *</label>
                        <select className="adm-search" style={{ width: '100%', appearance: 'none' }}
                            value={newRoadmap.careerId} onChange={e => setNewRoadmap({ ...newRoadmap, careerId: e.target.value })}>
                            <option value="">Select Career...</option>
                            {careers.map(ca => <option key={ca.id || ca._id} value={ca.id || ca._id}>{ca.title}</option>)}
                        </select>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Title *</label>
                        <input className="adm-search" style={{ width: '100%' }} placeholder="e.g. Fundamentals"
                            value={newRoadmap.title} onChange={e => setNewRoadmap({ ...newRoadmap, title: e.target.value })} />
                    </div>
                    <div style={{ marginBottom: 12 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Order *</label>
                        <input className="adm-search" style={{ width: '100%' }} placeholder="1" type="number"
                            value={newRoadmap.order} onChange={e => setNewRoadmap({ ...newRoadmap, order: e.target.value })} />
                    </div>
                    <div style={{ marginBottom: 12 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Description</label>
                        <input className="adm-search" style={{ width: '100%' }} placeholder="Step description..."
                            value={newRoadmap.description} onChange={e => setNewRoadmap({ ...newRoadmap, description: e.target.value })} />
                    </div>
                    {addErr && <div style={{ color: '#e74c3c', fontSize: 12, marginBottom: 10 }}>{addErr}</div>}
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <button className="adm-btn-cancel" onClick={() => setShowAdd(false)}>Cancel</button>
                        <button className="adm-btn-confirm" onClick={handleAdd} disabled={addLoading}>
                            {addLoading ? 'Adding...' : 'Add Roadmap Step'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            <div className={`adm-modal-overlay ${delId ? 'show' : ''}`} onClick={e => e.target === e.currentTarget && setDelId(null)}>
                <div className="adm-modal" style={{ borderTop: '4px solid #e74c3c' }}>
                    <h3 style={{ color: '#e74c3c' }}><i className="bi bi-exclamation-triangle me-2"></i>Delete Roadmap Step</h3>
                    <p style={{ color: '#666', fontSize: 13, marginBottom: 16 }}>Are you sure you want to permanently delete this roadmap step?</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <button className="adm-btn-confirm adm-btn-danger" style={{ width: '100%', justifyContent: 'center' }} disabled={delLoading} onClick={handleDelete}>
                            {delLoading ? 'Deleting...' : 'Delete'}
                        </button>
                        <button className="adm-btn-cancel" style={{ width: '100%', textAlign: 'center' }} onClick={() => setDelId(null)}>Cancel</button>
                    </div>
                </div>
            </div>

            {/* Freeze Modal */}
            <div className={`adm-modal-overlay ${archiveId ? 'show' : ''}`} onClick={e => e.target === e.currentTarget && setArchiveId(null)}>
                <div className="adm-modal">
                    <h3>Freeze Roadmap Step</h3>
                    <p style={{ color: '#666', fontSize: 13, marginBottom: 16 }}>Are you sure you want to freeze this roadmap step?</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button className="adm-btn-confirm" style={{ flex: 1, background: '#e67e22' }} disabled={archiveLoading} onClick={handleArchive}>
                            {archiveLoading ? 'Processing...' : 'Freeze'}
                        </button>
                        <button className="adm-btn-cancel" onClick={() => setArchiveId(null)}>Cancel</button>
                    </div>
                </div>
            </div>

            {/* Restore Modal */}
            <div className={`adm-modal-overlay ${restoreId ? 'show' : ''}`} onClick={e => e.target === e.currentTarget && setRestoreId(null)}>
                <div className="adm-modal">
                    <h3 style={{ color: '#27ae60' }}>Restore Roadmap Step</h3>
                    <p style={{ color: '#666', fontSize: 13, marginBottom: 16 }}>Restore this roadmap step to active?</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button className="adm-btn-confirm" style={{ flex: 1, background: '#27ae60' }} disabled={restoreLoading} onClick={handleRestore}>
                            {restoreLoading ? 'Restoring...' : 'Restore'}
                        </button>
                        <button className="adm-btn-cancel" onClick={() => setRestoreId(null)}>Cancel</button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
