import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import Loader from '../components/Loader'
import { usersAPI } from '../services/api'

const USERS_PER_PAGE = 10

const ROLE_BADGE = {
    'User':        'adm-badge-user',
    'Admin':       'adm-badge-admin',
    'Super Admin': 'adm-badge-super',
}

export default function Users() {
    const [users,        setUsers]        = useState([])
    const [loading,      setLoading]      = useState(true)
    const [error,        setError]        = useState('')
    const [search,       setSearch]       = useState('')
    const [currentPage,  setCurrentPage]  = useState(1)
    const [totalPages,   setTotalPages]   = useState(1)
    const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'active' | 'frozen'

    const [delUser,       setDelUser]       = useState(null)
    const [restoreUser,   setRestoreUser]   = useState(null)
    const [actionLoading, setActionLoading] = useState(false)
    const [toast,         setToast]         = useState('')
    const [toastType,     setToastType]     = useState('success') // 'success' | 'error'

    const showToast = (msg, type = 'success') => { setToast(msg); setToastType(type); setTimeout(() => setToast(''), 3000) }

    const fetchUsers = (page = 1, searchKey = '', status = 'all') => {
        setLoading(true)
        setError('')
        const params = { page, size: USERS_PER_PAGE, ...(searchKey ? { searchKey } : {}) }
        const apiFn = status === 'frozen'
            ? usersAPI.getArchived(params)
            : usersAPI.getAll(params)
        apiFn
            .then((res) => {
                setUsers(res.body?.data || [])
                setTotalPages(res.body?.totalPages || 1)
            })
            .catch((err) => {
                setError(err.message || 'Failed to load users')
                setUsers([])
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchUsers(1, '', statusFilter) }, [])

    const handleSearch = (e) => {
        setSearch(e.target.value)
        setCurrentPage(1)
        fetchUsers(1, e.target.value, statusFilter)
    }

    const handlePage = (p) => {
        setCurrentPage(p)
        fetchUsers(p, search, statusFilter)
    }

    // 'Status' option shows all (active + frozen mixed as returned by getAll)
    // 'Active' shows only active users (getAll, which by API contract returns active users)
    // 'Frozen' shows only frozen/archived users (getArchived)
    const handleStatusChange = (e) => {
        const val = e.target.value
        const s = val === 'Frozen' ? 'frozen' : val === 'Active' ? 'active' : 'all'
        setStatusFilter(s)
        setCurrentPage(1)
        fetchUsers(1, search, s)
    }

    const statusLabel = statusFilter === 'frozen' ? 'Frozen' : statusFilter === 'active' ? 'Active' : 'Status'

    const handleFreeze = async () => {
        if (!delUser) return
        setActionLoading(true)
        try {
            await usersAPI.archive(delUser.id, delUser.v ?? 1)
            showToast('User frozen successfully')
            setDelUser(null)
            fetchUsers(currentPage, search, statusFilter)
        } catch (err) { showToast(err.message || 'Failed to freeze user', 'error') }
        finally { setActionLoading(false) }
    }

    const handleRestore = async () => {
        if (!restoreUser) return
        setActionLoading(true)
        try {
            await usersAPI.restore(restoreUser.id, restoreUser.v ?? 1)
            showToast('User restored successfully')
            setRestoreUser(null)
            fetchUsers(currentPage, search, statusFilter)
        } catch (err) { showToast(err.message || 'Failed to restore user', 'error') }
        finally { setActionLoading(false) }
    }

    const handleDelete = async () => {
        if (!delUser) return
        setActionLoading(true)
        try {
            await usersAPI.delete(delUser.id, delUser.v ?? 1)
            showToast('User deleted')
            setDelUser(null)
            fetchUsers(currentPage, search, statusFilter)
        } catch (err) { showToast(err.message || 'Failed to delete user', 'error') }
        finally { setActionLoading(false) }
    }

    const avatarSrc = (gender) =>
        gender === 'Female' ? '/images/users1.png' : '/images/users2.png'

    const buildProfileLink = (u) =>
        `/user-profile?name=${encodeURIComponent(u.fullName)}&email=${encodeURIComponent(u.email)}&role=${encodeURIComponent(u.role)}&gender=${u.gender}&id=${u.id}`

    return (
        <AdminLayout>
            {toast && (
                <div style={{ position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', background: toastType === 'error' ? '#e74c3c' : '#27ae60', color: '#fff', padding: '11px 22px', borderRadius: 10, fontSize: 13, fontWeight: 700, zIndex: 9999, boxShadow: '0 4px 16px rgba(0,0,0,.15)' }}>
                    <i className={`bi ${toastType === 'error' ? 'bi-exclamation-circle-fill' : 'bi-check-circle-fill'} me-2`}></i>{toast}
                </div>
            )}

            <h1 className="adm-page-title">Users</h1>

            <div className="adm-table-card">
                <div className="adm-table-header">
                    <h3>Manage all registered users</h3>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <input
                            className="adm-search"
                            placeholder="Search users..."
                            value={search}
                            onChange={handleSearch}
                        />
                        <div style={{ position: 'relative' }}>
                            <select className="adm-search"
                                style={{ paddingRight: 28, appearance: 'none', cursor: 'pointer' }}
                                value={statusLabel}
                                onChange={handleStatusChange}>
                                <option>Status</option>
                                <option>Active</option>
                                <option>Frozen</option>
                            </select>
                            <i className="bi bi-chevron-down" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: 11, pointerEvents: 'none' }}></i>
                        </div>
                    </div>
                </div>

                {error && (
                    <div style={{ color: '#e74c3c', padding: '12px 16px' }}>
                        <i className="bi bi-exclamation-circle me-2"></i>{error}
                    </div>
                )}

                {loading ? (
                    <Loader inline text="Loading users..." />
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="adm-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Registration Date</th>
                                    <th>Assessment Status</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', color: '#999', padding: 30 }}>
                                            {statusFilter === 'frozen' ? 'No archived users found' : 'No users found.'}
                                        </td>
                                    </tr>
                                )}
                                {users.map((u) => (
                                    <tr key={u.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <img
                                                    src={u.profilePicture || avatarSrc(u.gender)}
                                                    style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e8e8e8' }}
                                                    alt="avatar"
                                                    onError={(e) => { e.target.src = avatarSrc(u.gender) }}
                                                />
                                                {u.fullName}
                                            </div>
                                        </td>
                                        <td style={{ color: '#666' }}>{u.email}</td>
                                        <td style={{ color: '#666', fontSize: 12 }}>{u.createdAt ? u.createdAt.slice(0,10) : '—'}</td>
                                        <td style={{ fontSize: 12 }}>{u.assessmentStatus || '—'}</td>
                                        <td>
                                            <span className={`adm-badge ${ROLE_BADGE[u.role] || 'adm-badge-user'}`}>{u.role}</span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                                <Link to={buildProfileLink(u)} className="adm-act">View Profile</Link>
                                                <Link to={`/change-role?role=${encodeURIComponent(u.role)}&name=${encodeURIComponent(u.fullName)}&id=${u.id}&v=${u.v ?? 1}`} className="adm-act">Change Role</Link>
                                                {statusFilter === 'frozen' ? (
                                                    <>
                                                        <span className="adm-act" style={{ color: '#27ae60' }} onClick={() => setRestoreUser(u)}>Restore</span>
                                                        <span className="adm-act adm-act-red" onClick={() => setDelUser(u)}>Delete</span>
                                                    </>
                                                ) : (
                                                    <span className="adm-act" style={{ color: '#e67e22' }} onClick={() => setDelUser(u)}>Freeze</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="adm-pagination">
                        <div
                            className={`adm-pg-btn ${currentPage === 1 ? 'disabled' : ''}`}
                            onClick={() => currentPage > 1 && handlePage(currentPage - 1)}
                        >
                            <i className="bi bi-chevron-left"></i>
                        </div>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <div
                                key={p}
                                className={`adm-pg-btn ${p === currentPage ? 'active' : ''}`}
                                onClick={() => handlePage(p)}
                            >
                                {p}
                            </div>
                        ))}
                        <div
                            className={`adm-pg-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                            onClick={() => currentPage < totalPages && handlePage(currentPage + 1)}
                        >
                            <i className="bi bi-chevron-right"></i>
                        </div>
                    </div>
                )}
            </div>

            {/* Freeze / Delete Modal (only one action shown depending on context, but kept both for status=all/active) */}
            <div
                className={`adm-modal-overlay ${delUser && statusFilter !== 'frozen' ? 'show' : ''}`}
                onClick={(e) => e.target === e.currentTarget && setDelUser(null)}
            >
                <div className="adm-modal">
                    <h3 style={{ color: '#e67e22' }}><i className="bi bi-snow2 me-2"></i>Freeze User</h3>
                    <p style={{ color: '#666', fontSize: 13, marginBottom: 16 }}>
                        Are you sure you want to freeze <strong>{delUser?.fullName}</strong>'s account?
                    </p>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button
                            className="adm-btn-confirm"
                            style={{ flex: 1, background: '#e67e22', borderColor: '#e67e22' }}
                            onClick={handleFreeze}
                            disabled={actionLoading}
                        >
                            {actionLoading ? 'Processing...' : 'Freeze'}
                        </button>
                        <button className="adm-btn-cancel" onClick={() => setDelUser(null)}>Cancel</button>
                    </div>
                </div>
            </div>

            {/* Delete Modal (frozen status) */}
            <div
                className={`adm-modal-overlay ${delUser && statusFilter === 'frozen' ? 'show' : ''}`}
                onClick={(e) => e.target === e.currentTarget && setDelUser(null)}
            >
                <div className="adm-modal" style={{ borderTop: '4px solid #e74c3c' }}>
                    <h3 style={{ color: '#e74c3c' }}><i className="bi bi-exclamation-triangle me-2"></i>Delete User</h3>
                    <p style={{ color: '#666', fontSize: 13, marginBottom: 16 }}>
                        Permanently delete <strong>{delUser?.fullName}</strong>'s account? This cannot be undone.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <button
                            className="adm-btn-confirm adm-btn-danger"
                            style={{ width: '100%', justifyContent: 'center' }}
                            onClick={handleDelete}
                            disabled={actionLoading}
                        >
                            <i className="bi bi-trash me-1"></i>
                            {actionLoading ? 'Deleting...' : 'Delete User'}
                        </button>
                        <button className="adm-btn-cancel" style={{ width: '100%', textAlign: 'center' }} onClick={() => setDelUser(null)}>Cancel</button>
                    </div>
                </div>
            </div>

            {/* Restore Modal */}
            <div
                className={`adm-modal-overlay ${restoreUser ? 'show' : ''}`}
                onClick={(e) => e.target === e.currentTarget && setRestoreUser(null)}
            >
                <div className="adm-modal">
                    <h3 style={{ color: '#27ae60' }}><i className="bi bi-arrow-counterclockwise me-2"></i>Restore User</h3>
                    <p style={{ color: '#666', fontSize: 13, marginBottom: 16 }}>
                        Restore <strong>{restoreUser?.fullName}</strong>'s account to active?
                    </p>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button
                            className="adm-btn-confirm"
                            style={{ flex: 1, background: '#27ae60', borderColor: '#27ae60' }}
                            onClick={handleRestore}
                            disabled={actionLoading}
                        >
                            {actionLoading ? 'Processing...' : 'Restore'}
                        </button>
                        <button className="adm-btn-cancel" onClick={() => setRestoreUser(null)}>Cancel</button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
