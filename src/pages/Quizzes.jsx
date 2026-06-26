import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import Loader from '../components/Loader'
import { quizzesAPI } from '../services/api'

const PER_PAGE = 10
const CAREER_ASSESSMENT_TYPE = 'CareerAssessment'

export default function Quizzes() {
    const navigate = useNavigate()
    const [quizzes, setQuizzes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'active' | 'frozen'

    const [showAdd, setShowAdd] = useState(false)
    const [addIsCareer, setAddIsCareer] = useState(false) // true = Career Assessment form
    const [addLoading, setAddLoading] = useState(false)
    const [addErr, setAddErr] = useState('')
    const [newQuiz, setNewQuiz] = useState({ title: '', description: '', questionsNumber: '', duration: '', tags: '' })

    const [editQuiz, setEditQuiz] = useState(null)
    const [editLoading, setEditLoading] = useState(false)

    const [delId, setDelId] = useState(null)
    const [delLoading, setDelLoading] = useState(false)

    const [archiveId, setArchiveId] = useState(null)
    const [archiveLoading, setArchiveLoading] = useState(false)

    const [restoreId, setRestoreId] = useState(null)
    const [restoreLoading, setRestoreLoading] = useState(false)

    const [toast, setToast] = useState('')
    const [toastType, setToastType] = useState('success')
    const showToast = (msg, type = 'success') => { setToast(msg); setToastType(type); setTimeout(() => setToast(''), 3000) }

    const fetchQuizzes = useCallback((p = 1, searchKey = '', status = 'all') => {
        setLoading(true)
        setError('')
        const params = { page: p, size: PER_PAGE }
        if (searchKey) params.searchKey = searchKey
        const apiFn = status === 'frozen'
            ? quizzesAPI.getArchived(params)
            : quizzesAPI.getAll(params)
        apiFn
            .then((res) => {
                setQuizzes(res.body?.data || res.body?.quizzes || [])
                setTotalPages(res.body?.totalPages || 1)
            })
            .catch((err) => {
                setError(err.message || 'Failed to load quizzes')
                setQuizzes([])
            })
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => { fetchQuizzes(1, '', statusFilter) }, [fetchQuizzes])

    const handleSearch = (e) => { setSearch(e.target.value); setPage(1); fetchQuizzes(1, e.target.value, statusFilter) }
    const handlePage = (p) => { setPage(p); fetchQuizzes(p, search, statusFilter) }
    const handleStatus = (e) => {
        const val = e.target.value
        const s = val === 'Frozen' ? 'frozen' : val === 'Active' ? 'active' : 'all'
        setStatusFilter(s); setPage(1); fetchQuizzes(1, search, s)
    }
    const statusLabel = statusFilter === 'frozen' ? 'Frozen' : statusFilter === 'active' ? 'Active' : 'Status'

    const openAddQuiz = () => { setAddIsCareer(false); setNewQuiz({ title: '', description: '', questionsNumber: '', duration: '', tags: '' }); setAddErr(''); setShowAdd(true) }
    const openAddCareerAssessment = () => { setAddIsCareer(true); setNewQuiz({ title: '', description: '', questionsNumber: '', duration: '', tags: '' }); setAddErr(''); setShowAdd(true) }

    const addQuiz = async () => {
        if (!newQuiz.title.trim()) { setAddErr('Title is required'); return }
        setAddErr('')
        setAddLoading(true)
        try {
            if (addIsCareer) {
                await quizzesAPI.create({
                    title: newQuiz.title,
                    description: newQuiz.description,
                    questionsNumber: parseInt(newQuiz.questionsNumber) || 20,
                    type: CAREER_ASSESSMENT_TYPE,
                })
            } else {
                await quizzesAPI.create({
                    title: newQuiz.title,
                    description: newQuiz.description,
                    questionsNumber: parseInt(newQuiz.questionsNumber) || 10,
                    duration: parseInt(newQuiz.duration) || 1000,
                    tags: newQuiz.tags.split(',').map(t => t.trim()).filter(Boolean),
                    type: 'StepQuiz',
                })
            }
            setShowAdd(false)
            fetchQuizzes(page, search, statusFilter)
            showToast(addIsCareer ? 'Career Assessment created!' : 'Quiz created!')
        } catch (err) { setAddErr(err.message || 'Failed to create quiz') }
        finally { setAddLoading(false) }
    }

    const saveEdit = async () => {
        if (!editQuiz) return
        setEditLoading(true)
        try {
            const isCareer = editQuiz.type === CAREER_ASSESSMENT_TYPE
            const updateData = isCareer
                ? { title: editQuiz.title, description: editQuiz.description, questionsNumber: parseInt(editQuiz.questionsNumber) || 20 }
                : {
                    title: editQuiz.title,
                    description: editQuiz.description,
                    questionsNumber: parseInt(editQuiz.questionsNumber) || 10,
                    duration: parseInt(editQuiz.duration) || 1000,
                    tags: typeof editQuiz.tags === 'string'
                        ? editQuiz.tags.split(',').map(t => t.trim()).filter(Boolean)
                        : editQuiz.tags || [],
                }
            await quizzesAPI.update(editQuiz.id, updateData)
            setEditQuiz(null)
            fetchQuizzes(page, search, statusFilter)
            showToast('Quiz updated!')
        } catch (err) { showToast(err.message || 'Failed to update quiz', 'error') }
        finally { setEditLoading(false) }
    }

    const confirmDelete = async () => {
        setDelLoading(true)
        try {
            await quizzesAPI.delete(delId)
            setDelId(null)
            fetchQuizzes(page, search, statusFilter)
            showToast('Quiz deleted')
        } catch (err) { showToast(err.message || 'Failed to delete quiz', 'error') }
        finally { setDelLoading(false) }
    }

    const confirmArchive = async () => {
        setArchiveLoading(true)
        try {
            await quizzesAPI.archive(archiveId?.id ?? archiveId, archiveId?.v ?? 1)
            setArchiveId(null)
            fetchQuizzes(page, search, statusFilter)
            showToast('Quiz frozen')
        } catch (err) { showToast(err.message || 'Failed to freeze quiz', 'error') }
        finally { setArchiveLoading(false) }
    }

    const confirmRestore = async () => {
        setRestoreLoading(true)
        try {
            await quizzesAPI.restore(restoreId?.id ?? restoreId, restoreId?.v ?? 1)
            setRestoreId(null)
            fetchQuizzes(page, search, statusFilter)
            showToast('Quiz restored')
        } catch (err) { showToast(err.message || 'Failed to restore quiz', 'error') }
        finally { setRestoreLoading(false) }
    }

    const editIsCareer = editQuiz?.type === CAREER_ASSESSMENT_TYPE

    return (
        <AdminLayout>
            {toast && (
                <div style={{ position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', background: toastType === 'error' ? '#e74c3c' : '#27ae60', color: '#fff', padding: '11px 22px', borderRadius: 10, fontSize: 13, fontWeight: 700, zIndex: 9999, boxShadow: '0 4px 16px rgba(0,0,0,.15)' }}>
                    <i className={`bi ${toastType === 'error' ? 'bi-exclamation-circle-fill' : 'bi-check-circle-fill'} me-2`}></i>{toast}
                </div>
            )}

            <h1 className="adm-page-title">Quizzes Management</h1>

            <div className="adm-table-card">
                <div className="adm-table-header">
                    <h3>Manage all quizzes</h3>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative' }}>
                            <i className="bi bi-search" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: 13 }}></i>
                            <input
                                className="adm-search"
                                placeholder="Search quizzes..."
                                value={search}
                                onChange={handleSearch}
                                style={{ paddingLeft: 32 }}
                            />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <select className="adm-search" style={{ paddingRight: 28, appearance: 'none', cursor: 'pointer' }}
                                value={statusLabel}
                                onChange={handleStatus}>
                                <option>Status</option>
                                <option>Active</option>
                                <option>Frozen</option>
                            </select>
                            <i className="bi bi-chevron-down" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: 11, pointerEvents: 'none' }}></i>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {statusFilter === 'frozen' ? (
                                <button className="adm-btn-add" onClick={openAddQuiz}>
                                    <i className="bi bi-plus-lg me-1"></i>Add New Quiz
                                </button>
                            ) : quizzes.some(q => q.type === CAREER_ASSESSMENT_TYPE) ? (
                                <button className="adm-btn-add" onClick={openAddQuiz}>
                                    <i className="bi bi-plus-lg me-1"></i>Add New Quiz
                                </button>
                            ) : (
                                <button className="adm-btn-add" onClick={openAddCareerAssessment}>
                                    <i className="bi bi-plus-lg me-1"></i>Add Career Assessment
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {error && <div style={{ color: '#e74c3c', padding: '12px 16px' }}>{error}</div>}

                {loading ? <Loader inline text="Loading quizzes..." /> : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="adm-table">
                            <thead>
                                <tr>
                                    <th>Quiz Title</th>
                                    <th>Details</th>
                                    <th>Questions</th>
                                    <th>Average Score</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quizzes.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', color: '#999', padding: 30 }}>
                                            {statusFilter === 'frozen' ? 'No archived quizzes found' : 'No quizzes found 🔍✖'}
                                        </td>
                                    </tr>
                                )}
                                {quizzes.map((q) => {
                                    const isCareer = q.type === CAREER_ASSESSMENT_TYPE
                                    return (
                                        <tr key={q.id}>
                                            <td>
                                                <div style={{ fontWeight: 600 }}>{q.title}</div>

                                            </td>
                                            <td style={{ color: '#0B6BA0', fontSize: 13 }}>
                                                {q.description || '—'}
                                            </td>
                                            <td style={{ textAlign: 'center', fontWeight: 600 }}>
                                                {q.questionsCount || q.questions?.length || '—'}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                {q.averageScore ? `${q.averageScore}%` : '—'}
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                                    <span className="adm-act" onClick={() => navigate(`/quiz-view?quiz=${encodeURIComponent(q.title)}&details=${encodeURIComponent(q.description || '')}&questions=${q.questionsCount || 0}&score=${q.averageScore || 0}`)}>
                                                        View
                                                    </span>
                                                    <span className="adm-act" onClick={() => setEditQuiz({ ...q })}>
                                                        Update
                                                    </span>
                                                    {statusFilter === 'frozen' ? (
                                                        <>
                                                            <span className="adm-act adm-act-red" onClick={() => setDelId(q.id)}>Delete</span>
                                                            <span className="adm-act" style={{ color: '#27ae60' }} onClick={() => setRestoreId({ id: q.id, v: q.v ?? 1 })}>Restore</span>
                                                        </>
                                                    ) : (
                                                        <span className="adm-act" style={{ color: '#e67e22' }} onClick={() => setArchiveId({ id: q.id, v: q.v ?? 1 })}>Freeze</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && totalPages > 1 && (
                    <div className="adm-pagination">
                        <div className={`adm-pg-btn ${page === 1 ? 'disabled' : ''}`} onClick={() => page > 1 && handlePage(page - 1)}>
                            <i className="bi bi-chevron-left"></i>
                        </div>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <div key={p} className={`adm-pg-btn ${p === page ? 'active' : ''}`} onClick={() => handlePage(p)}>{p}</div>
                        ))}
                        <div className={`adm-pg-btn ${page === totalPages ? 'disabled' : ''}`} onClick={() => page < totalPages && handlePage(page + 1)}>
                            <i className="bi bi-chevron-right"></i>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Quiz / Add Career Assessment Modal */}
            <div className={`adm-modal-overlay ${showAdd ? 'show' : ''}`} onClick={(e) => e.target === e.currentTarget && setShowAdd(false)}>
                <div className="adm-modal">
                    <h3>{addIsCareer ? 'Add Career Assessment' : 'Add New Quiz'}</h3>
                    {addIsCareer && (
                        <p style={{ fontSize: 12, color: '#999', marginBottom: 12 }}>
                            Questions, AI prompt and career mapping for this assessment are generated automatically by the AI on the backend.
                        </p>
                    )}

                    <div style={{ marginBottom: 12 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Title *</label>
                        <input className="adm-search" style={{ width: '100%' }} placeholder="Quiz title"
                            value={newQuiz.title} onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })} />
                    </div>

                    <div style={{ marginBottom: 12 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Description</label>
                        <input className="adm-search" style={{ width: '100%' }} placeholder="Quiz description"
                            value={newQuiz.description} onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })} />
                    </div>

                    <div style={{ marginBottom: 12 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Questions Number</label>
                        <input className="adm-search" style={{ width: '100%' }} placeholder={addIsCareer ? '20' : '10'} type="number"
                            value={newQuiz.questionsNumber} onChange={(e) => setNewQuiz({ ...newQuiz, questionsNumber: e.target.value })} />
                    </div>
                    {!addIsCareer && (
                        <>
                            <div style={{ marginBottom: 12 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Duration (seconds)</label>
                                <input className="adm-search" style={{ width: '100%' }} placeholder="1000" type="number"
                                    value={newQuiz.duration} onChange={(e) => setNewQuiz({ ...newQuiz, duration: e.target.value })} />
                            </div>
                            <div style={{ marginBottom: 12 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Tags (comma-separated)</label>
                                <input className="adm-search" style={{ width: '100%' }} placeholder="Android, Basic"
                                    value={newQuiz.tags} onChange={(e) => setNewQuiz({ ...newQuiz, tags: e.target.value })} />
                            </div>
                        </>
                    )}

                    {addErr && <div style={{ color: '#e74c3c', fontSize: 12, marginBottom: 10 }}>{addErr}</div>}

                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <button className="adm-btn-cancel" onClick={() => setShowAdd(false)}>Cancel</button>
                        <button className="adm-btn-confirm" onClick={addQuiz} disabled={addLoading}>
                            {addLoading ? 'Creating...' : (addIsCareer ? 'Create Assessment' : 'Create Quiz')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Quiz Modal */}
            <div className={`adm-modal-overlay ${editQuiz ? 'show' : ''}`} onClick={(e) => e.target === e.currentTarget && setEditQuiz(null)}>
                <div className="adm-modal">
                    <h3>Update {editIsCareer ? 'Career Assessment' : 'Quiz'}</h3>

                    <div style={{ marginBottom: 12 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Title</label>
                        <input className="adm-search" style={{ width: '100%' }}
                            value={editQuiz?.title || ''} onChange={(e) => setEditQuiz({ ...editQuiz, title: e.target.value })} />
                    </div>

                    <div style={{ marginBottom: 12 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Description</label>
                        <input className="adm-search" style={{ width: '100%' }}
                            value={editQuiz?.description || ''} onChange={(e) => setEditQuiz({ ...editQuiz, description: e.target.value })} />
                    </div>

                    <div style={{ marginBottom: 12 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Questions Number</label>
                        <input className="adm-search" style={{ width: '100%' }} type="number"
                            value={editQuiz?.questionsNumber || ''} onChange={(e) => setEditQuiz({ ...editQuiz, questionsNumber: e.target.value })} />
                    </div>

                    {!editIsCareer && (
                        <>
                            <div style={{ marginBottom: 12 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>AI Prompt</label>
                                <input className="adm-search" style={{ width: '100%' }}
                                    value={editQuiz?.aiPrompt || ''} onChange={(e) => setEditQuiz({ ...editQuiz, aiPrompt: e.target.value })} />
                            </div>
                            <div style={{ marginBottom: 12 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Duration (seconds)</label>
                                <input className="adm-search" style={{ width: '100%' }}
                                    value={editQuiz?.duration || ''} onChange={(e) => setEditQuiz({ ...editQuiz, duration: e.target.value })} />
                            </div>
                            <div style={{ marginBottom: 12 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Tags (comma-separated)</label>
                                <input className="adm-search" style={{ width: '100%' }}
                                    value={typeof editQuiz?.tags === 'string' ? editQuiz.tags : (editQuiz?.tags || []).join(', ')}
                                    onChange={(e) => setEditQuiz({ ...editQuiz, tags: e.target.value })} />
                            </div>
                        </>
                    )}

                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                        <button className="adm-btn-cancel" onClick={() => setEditQuiz(null)}>Cancel</button>
                        <button className="adm-btn-confirm" onClick={saveEdit} disabled={editLoading}>
                            {editLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            <div className={`adm-modal-overlay ${delId ? 'show' : ''}`} onClick={(e) => e.target === e.currentTarget && setDelId(null)}>
                <div className="adm-modal" style={{ borderTop: '4px solid #e74c3c' }}>
                    <h3 style={{ color: '#e74c3c' }}><i className="bi bi-exclamation-triangle me-2"></i>Delete Quiz</h3>
                    <p style={{ color: '#666', fontSize: 13, marginBottom: 16 }}>Are you sure? This cannot be undone.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <button className="adm-btn-confirm adm-btn-danger" style={{ width: '100%', justifyContent: 'center' }}
                            onClick={confirmDelete} disabled={delLoading}>
                            <i className="bi bi-trash me-1"></i>{delLoading ? 'Deleting...' : 'Delete Quiz'}
                        </button>
                        <button className="adm-btn-cancel" style={{ width: '100%', textAlign: 'center' }} onClick={() => setDelId(null)}>Cancel</button>
                    </div>
                </div>
            </div>

            {/* Freeze Modal */}
            <div className={`adm-modal-overlay ${archiveId?.id || archiveId ? 'show' : ''}`} onClick={(e) => e.target === e.currentTarget && setArchiveId(null)}>
                <div className="adm-modal">
                    <h3>Freeze Quiz</h3>
                    <p style={{ color: '#666', fontSize: 13, marginBottom: 16 }}>Are you sure you want to freeze this quiz?</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <button className="adm-btn-confirm" style={{ width: '100%', background: '#e67e22', justifyContent: 'center' }}
                            onClick={confirmArchive} disabled={archiveLoading}>
                            {archiveLoading ? 'Processing...' : 'Freeze Quiz'}
                        </button>
                        <button className="adm-btn-cancel" style={{ width: '100%', textAlign: 'center' }} onClick={() => setArchiveId(null)}>Cancel</button>
                    </div>
                </div>
            </div>

            {/* Restore Modal */}
            <div className={`adm-modal-overlay ${restoreId?.id || restoreId ? 'show' : ''}`} onClick={(e) => e.target === e.currentTarget && setRestoreId(null)}>
                <div className="adm-modal">
                    <h3>Restore Quiz</h3>
                    <p style={{ color: '#666', fontSize: 13, marginBottom: 16 }}>Are you sure you want to restore this quiz?</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <button className="adm-btn-confirm" style={{ width: '100%', background: '#27ae60', justifyContent: 'center' }}
                            onClick={confirmRestore} disabled={restoreLoading}>
                            {restoreLoading ? 'Processing...' : 'Restore Quiz'}
                        </button>
                        <button className="adm-btn-cancel" style={{ width: '100%', textAlign: 'center' }} onClick={() => setRestoreId(null)}>Cancel</button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
