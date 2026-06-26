import { useState, useEffect, useCallback } from 'react'
import AdminLayout from '../components/AdminLayout'
import Loader from '../components/Loader'
import { feedbackAPI, notificationsAPI } from '../services/api'

const FB_PER_PAGE = 15
const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n)
const avatarForIdx = (i) => i % 2 === 0 ? '/images/users1.png' : '/images/users2.png'

export default function Notifications() {
    const [activeTab, setActiveTab] = useState('notif')

    // ── Notification state ──────────────────────────────────
    const [notifForm,   setNotifForm]   = useState({ title: '', body: '', imageUrl: '' })
    const [notifErrors, setNotifErrors] = useState({})
    const [notifSent,   setNotifSent]   = useState(false)
    const [notifLoading,setNotifLoading]= useState(false)

    // ── Feedback state ──────────────────────────────────────
    const [feedbacks,    setFeedbacks]    = useState([])
    const [fbLoading,    setFbLoading]    = useState(true)
    const [fbError,      setFbError]      = useState('')
    const [fbPage,       setFbPage]       = useState(1)
    const [fbTotalPages, setFbTotalPages] = useState(1)
    const [replyUserId,  setReplyUserId]  = useState(null)
    const [replyName,    setReplyName]    = useState('')
    const [replyText,    setReplyText]    = useState('')
    const [replyError,   setReplyError]   = useState(false)
    const [replyLoading, setReplyLoading] = useState(false)
    const [fbDelId,      setFbDelId]      = useState(null)
    const [fbDelLoading, setFbDelLoading] = useState(false)
    const [replyToast,   setReplyToast]   = useState(false)

    const fetchFeedbacks = useCallback((page = 1) => {
        setFbLoading(true)
        feedbackAPI.getAll({ page, size: FB_PER_PAGE })
            .then((res) => {
                setFeedbacks(res.body?.data || [])
                setFbTotalPages(res.body?.totalPages || 1)
            })
            .catch((err) => setFbError(err.message || 'Failed to load feedback'))
            .finally(() => setFbLoading(false))
    }, [])

    useEffect(() => { fetchFeedbacks(1) }, [fetchFeedbacks])

    // ── Send notification to ALL users ─────────────────────
    const sendNotification = async () => {
        const errors = {}
        if (!notifForm.title.trim()) errors.title = 'Please enter a notification title.'
        if (!notifForm.body.trim())  errors.body  = 'Please enter a message body.'
        setNotifErrors(errors)
        if (Object.keys(errors).length) return

        setNotifLoading(true)
        try {
            await notificationsAPI.sendToAll({
                title:    notifForm.title,
                body:     notifForm.body,
                imageUrl: notifForm.imageUrl || undefined,
            })
            setNotifSent(true)
            setNotifForm({ title: '', body: '', imageUrl: '' })
            setTimeout(() => setNotifSent(false), 3000)
        } catch (err) {
            alert(err.message || 'Failed to send notification')
        } finally {
            setNotifLoading(false)
        }
    }

    // ── Reply ───────────────────────────────────────────────
    const openReply = (userId, name) => {
        setReplyUserId(userId)
        setReplyName(name)
        setReplyText('')
        setReplyError(false)
    }
    const sendReply = async () => {
        if (!replyText.trim()) { setReplyError(true); return }
        setReplyLoading(true)
        try {
            await feedbackAPI.reply(replyUserId, replyText)
            setReplyUserId(null)
            setReplyToast(true)
            setTimeout(() => setReplyToast(false), 2500)
        } catch (err) {
            alert(err.message || 'Failed to send reply')
        } finally {
            setReplyLoading(false)
        }
    }

    // ── Delete feedback ─────────────────────────────────────
    const confirmFbDelete = async () => {
        setFbDelLoading(true)
        try {
            await feedbackAPI.delete(fbDelId)
            setFbDelId(null)
            fetchFeedbacks(fbPage)
        } catch (err) {
            alert(err.message || 'Failed to delete feedback')
        } finally {
            setFbDelLoading(false)
        }
    }

    const handleFbPage = (p) => {
        setFbPage(p)
        fetchFeedbacks(p)
    }

    return (
        <AdminLayout>
            <h1 className="adm-page-title">Notifications & Feedback</h1>
            <div className="ntab">
                <button className={`ntab-btn ${activeTab === 'notif' ? 'active' : ''}`} onClick={() => setActiveTab('notif')}>
                    Notifications to all users
                </button>
                <button className={`ntab-btn ${activeTab === 'feedback' ? 'active' : ''}`} onClick={() => setActiveTab('feedback')}>
                    User Feedback
                </button>
            </div>

            {/* ── Notifications Panel ── */}
            <div className={`ntab-panel ${activeTab === 'notif' ? 'active' : ''}`}>
                <div className="nf-card">
                    <label className="nf-label">Notification Title</label>
                    <input
                        className={`nf-input ${notifErrors.title ? 'error' : ''}`}
                        placeholder="Enter notification title"
                        value={notifForm.title}
                        onChange={(e) => { setNotifForm({ ...notifForm, title: e.target.value }); setNotifErrors({ ...notifErrors, title: '' }) }}
                    />
                    {notifErrors.title && <div className="nf-err" style={{ display: 'block' }}>{notifErrors.title}</div>}

                    <label className="nf-label">Message Body</label>
                    <textarea
                        className={`nf-input ${notifErrors.body ? 'error' : ''}`}
                        placeholder="Enter message body"
                        value={notifForm.body}
                        onChange={(e) => { setNotifForm({ ...notifForm, body: e.target.value }); setNotifErrors({ ...notifErrors, body: '' }) }}
                    />
                    {notifErrors.body && <div className="nf-err" style={{ display: 'block' }}>{notifErrors.body}</div>}

                    <label className="nf-label">Image URL (Optional)</label>
                    <input
                        className="nf-input"
                        type="url"
                        placeholder="Enter image URL"
                        value={notifForm.imageUrl}
                        onChange={(e) => setNotifForm({ ...notifForm, imageUrl: e.target.value })}
                    />

                    <button className="nf-send" onClick={sendNotification} disabled={notifLoading}
                        style={notifSent ? { background: '#27ae60' } : {}}>
                        {notifSent ? <><i className="bi bi-check-lg"></i> Sent!</> :
                         notifLoading ? 'Sending...' :
                         <><i className="bi bi-send"></i> Send to All Users</>}
                    </button>
                </div>
            </div>

            {/* ── Feedback Panel ── */}
            <div className={`ntab-panel ${activeTab === 'feedback' ? 'active' : ''}`}>
                {fbError && <div style={{ color: '#e74c3c', padding: '12px 0' }}>{fbError}</div>}
                {fbLoading ? <Loader inline text="Loading feedback..." /> : (
                    <div className="fb-table-wrap">
                        <table className="fb-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Feedback</th>
                                    <th>Rating</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feedbacks.length === 0 && (
                                    <tr><td colSpan="4" style={{ textAlign: 'center', color: '#999', padding: 30 }}>No feedback found.</td></tr>
                                )}
                                {feedbacks.map((f, i) => (
                                    <tr key={f.id || i}>
                                        <td>
                                            <div className="fb-user">
                                                <img src={f.profilePicture || avatarForIdx(i)} className="fb-ava" alt={f.fullName}
                                                    onError={(e) => { e.target.src = avatarForIdx(i) }} />
                                                <span className="fb-user-name">{f.fullName || f.name || 'User'}</span>
                                            </div>
                                        </td>
                                        <td><div className="fb-feedback-txt">{f.text || f.feedback}</div></td>
                                        <td><span className="fb-stars">{stars(f.stars || f.rating || 0)}</span></td>
                                        <td style={{ display: 'flex', gap: 8 }}>
                                            <button className="fb-reply-btn" onClick={() => openReply(f.userId || f.id, f.fullName || 'User')}>
                                                <i className="bi bi-reply me-1"></i>Reply
                                            </button>
                                            <button className="fb-del-btn" onClick={() => setFbDelId(f.userId || f.id)}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {fbTotalPages > 1 && (
                            <div className="fb-pagination">
                                <div className="adm-pg-btn" style={{ opacity: fbPage === 1 ? 0.4 : 1 }} onClick={() => fbPage > 1 && handleFbPage(fbPage - 1)}>
                                    <i className="bi bi-chevron-left"></i>
                                </div>
                                {Array.from({ length: fbTotalPages }, (_, i) => i + 1).map(p => (
                                    <div key={p} className={`adm-pg-btn ${p === fbPage ? 'active' : ''}`} onClick={() => handleFbPage(p)}>{p}</div>
                                ))}
                                <div className="adm-pg-btn" style={{ opacity: fbPage === fbTotalPages ? 0.4 : 1 }} onClick={() => fbPage < fbTotalPages && handleFbPage(fbPage + 1)}>
                                    <i className="bi bi-chevron-right"></i>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Reply Modal */}
            <div className={`reply-modal ${replyUserId !== null ? 'show' : ''}`} onClick={(e) => e.target === e.currentTarget && setReplyUserId(null)}>
                <div className="reply-box">
                    <h3>Reply to Feedback</h3>
                    <p>Replying to: <strong>{replyName}</strong></p>
                    <textarea className="reply-textarea" placeholder="Type your reply..." value={replyText}
                        onChange={(e) => { setReplyText(e.target.value); setReplyError(false) }}
                        style={replyError ? { borderColor: '#e74c3c' } : {}} />
                    <div className="reply-btns">
                        <button className="adm-btn-cancel" onClick={() => setReplyUserId(null)}>Cancel</button>
                        <button className="adm-btn-confirm" onClick={sendReply} disabled={replyLoading}>
                            {replyLoading ? 'Sending...' : 'Send Reply'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            <div className={`adm-modal-overlay ${fbDelId !== null ? 'show' : ''}`} onClick={(e) => e.target === e.currentTarget && setFbDelId(null)}>
                <div className="adm-modal" style={{ borderTop: '4px solid #e74c3c' }}>
                    <h3 style={{ color: '#e74c3c' }}><i className="bi bi-exclamation-triangle me-2"></i>Delete Feedback</h3>
                    <p style={{ color: '#666', fontSize: 13, marginBottom: 16 }}>Are you sure you want to delete this feedback?</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <button className="adm-btn-confirm adm-btn-danger" style={{ width: '100%', justifyContent: 'center' }}
                            onClick={confirmFbDelete} disabled={fbDelLoading}>
                            <i className="bi bi-trash me-1"></i>{fbDelLoading ? 'Deleting...' : 'Delete Feedback'}
                        </button>
                        <button className="adm-btn-cancel" style={{ width: '100%', textAlign: 'center' }} onClick={() => setFbDelId(null)}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>

            {replyToast && (
                <div style={{ position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', background: '#27ae60', color: '#fff', padding: '12px 24px', borderRadius: 10, fontSize: 13, fontWeight: 700, zIndex: 9999 }}>
                    <i className="bi bi-check-circle me-2"></i>Reply sent successfully!
                </div>
            )}
        </AdminLayout>
    )
}
