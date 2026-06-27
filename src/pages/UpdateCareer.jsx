import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import Loader from '../components/Loader'
import { careersAPI } from '../services/api'

const IMG_BASE = import.meta.env.VITE_IMG_BASE_URL || ''

export default function UpdateCareer() {
    const [params] = useSearchParams()
    const navigate = useNavigate()
    const careerId = params.get('id')

    const [career, setCareer] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [toast, setToast] = useState('')
    const [toastErr, setToastErr] = useState(false)

    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [picture, setPicture] = useState(null)
    const [preview, setPreview] = useState(null)
    const [courses, setCourses] = useState([])
    const [books, setBooks] = useState([])
    const [youtube, setYoutube] = useState([])
    const fileRef = useRef(null)

    const showToast = (msg, err = false) => {
        setToast(msg); setToastErr(err)
        setTimeout(() => setToast(''), 3000)
    }

    useEffect(() => {
        if (!careerId) { setLoading(false); return }
        careersAPI.getById(careerId)
            .then(res => {
                const c = res.body || res
                setCareer(c)
                setTitle(c.title || '')
                setDesc(c.description || '')
                if (c.pictureUrl) setPreview(c.pictureUrl.startsWith('http') ? c.pictureUrl : `${IMG_BASE}${c.pictureUrl}`)
                setCourses(c.courses || [])
                setBooks(c.books || [])
                setYoutube(c.youtubePlaylists || [])
            })
            .catch(err => setError(err.message || 'Failed to load career'))
            .finally(() => setLoading(false))
    }, [careerId])

    const handlePicture = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setPicture(file)
        setPreview(URL.createObjectURL(file))
    }

    const handleDeleteCourse = (id) => setCourses(c => c.filter(x => x.id !== id))
    const handleDeleteBook = (id) => setBooks(b => b.filter(x => x.id !== id))
    const handleDeleteYoutube = (id) => setYoutube(y => y.filter(x => x.id !== id))

    const handleSave = async () => {
        if (!title.trim()) {
            showToast('Title is required', true)
            return
        }

        setSaving(true)

        try {
            await careersAPI.update(careerId, {
                title,
                description: desc,

                courses: courses.map(c => ({
                    title: c.title,
                    url: c.url || "",
                    pricingType: c.pricingType || "Free",
                    appliesTo: "All", // مهم جدًا
                    language: c.language || "en"
                    // ❌ متبعتيش specifiedSteps خالص دلوقتي
                })),

                books: books.map(b => ({
                    title: b.title,
                    url: b.url || "",
                    pricingType: b.pricingType || "Free",
                    appliesTo: "All",
                    language: b.language || "en"
                })),

                youtubePlaylists: youtube.map(y => ({
                    title: y.title,
                    url: y.url || "",
                    pricingType: y.pricingType || "Free",
                    appliesTo: "All",
                    language: y.language || "en"
                })),

                v: career?.v ?? 1,
            })

            if (picture) {
                const fd = new FormData()
                fd.append('attachment', picture)
                fd.append('v', (career?.v ?? 1) + 1)
                await careersAPI.uploadPicture(careerId, fd)
            }

            showToast('Career updated successfully!')

            setTimeout(() => navigate(`/career-detail?id=${careerId}`), 1200)

        } catch (err) {
            showToast(err.message || 'Failed to update career', true)
        } finally {
            setSaving(false)
        }
    }
    if (loading) return <AdminLayout><Loader text="Loading career..." /></AdminLayout>
    if (error) return <AdminLayout><div style={{ color: '#e74c3c', padding: 32 }}>{error}</div></AdminLayout>

    const rowStyle = { background: '#f8f9fa', borderRadius: 8, padding: '10px 14px', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #f0f0f0' }
    const delBtnStyle = { background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: 16, padding: '2px 6px', display: 'flex', alignItems: 'center' }
    const sectionHeader = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }
    const addBtnStyle = { background: 'none', border: '1.5px solid #0B6BA0', color: '#0B6BA0', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }

    return (
        <AdminLayout>
            {toast && (
                <div style={{ position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', background: toastErr ? '#e74c3c' : '#27ae60', color: '#fff', padding: '11px 22px', borderRadius: 10, fontSize: 13, fontWeight: 700, zIndex: 9999, boxShadow: '0 4px 16px rgba(0,0,0,.15)' }}>
                    <i className={`bi ${toastErr ? 'bi-exclamation-circle-fill' : 'bi-check-circle-fill'} me-2`}></i>{toast}
                </div>
            )}

            <div style={{ marginBottom: 16 }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#0B6BA0', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'inherit' }}>
                    <i className="bi bi-arrow-left"></i> Back
                </button>
            </div>
            <h2 style={{ fontWeight: 800, fontSize: 20, color: '#1A1A1A', marginBottom: 18 }}>Update Career Path</h2>

            {/* Career Name */}
            <div className="adm-form-card" style={{ marginBottom: 14 }}>
                <label className="adm-form-label">Career Name *</label>
                <input className="adm-form-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Data Science specialist.." />
            </div>

            {/* Career Image */}
            <div className="adm-form-card" style={{ marginBottom: 14 }}>
                <label className="adm-form-label">Career Image</label>
                <div onClick={() => fileRef.current?.click()}
                    style={{ width: '100%', height: 180, borderRadius: 10, overflow: 'hidden', cursor: 'pointer', position: 'relative', border: '1.5px dashed #e8e8e8', background: '#fafafa' }}>
                    {preview
                        ? <img src={preview} alt="career" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#bbb', gap: 6 }}>
                            <i className="bi bi-image" style={{ fontSize: 32 }}></i>
                            <span style={{ fontSize: 12 }}>Click to upload image</span>
                        </div>
                    }
                    {preview && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity .2s' }}
                            onMouseEnter={e => e.currentTarget.style.opacity = 1}
                            onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                            <span style={{ color: '#fff', fontSize: 12, fontWeight: 700, background: 'rgba(0,0,0,.3)', padding: '6px 14px', borderRadius: 8 }}>
                                <i className="bi bi-cloud-upload me-1"></i>Upload Image
                            </span>
                        </div>
                    )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePicture} />
            </div>

            {/* Career Details */}
            <div className="adm-form-card" style={{ marginBottom: 14 }}>
                <label className="adm-form-label">Career details</label>
                <textarea className="adm-form-input" rows={4} value={desc}
                    onChange={e => setDesc(e.target.value)}
                    placeholder="This page provides a comprehensive overview of the selected career..."
                    style={{ resize: 'vertical', minHeight: 80 }} />
            </div>

            {/* ── Courses ── */}
            {/* ───────────── Courses ───────────── */}

            {/* 🔵 الهيدر فوق */}
            <div style={sectionHeader}>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A' }}>
                    Courses
                </span>

                <button
                    style={addBtnStyle}
                    onClick={() =>
                        navigate(`/add-course?careerId=${careerId}&career=${encodeURIComponent(title)}`)
                    }
                >
                    <i className="bi bi-plus-lg"></i> Add new course
                </button>
            </div>

            {/* ⚪ الكارد الأبيض */}
            <div
                style={{
                    background: '#fff',
                    borderRadius: 12,
                    padding: '16px',
                    border: '1px solid #eee',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    marginBottom: 14
                }}
            >
                <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600, color: '#999' }}>
                    Courses
                </div>

                {courses.length === 0 ? (
                    <div style={{ color: '#bbb', fontSize: 13, textAlign: 'center', padding: '10px 0' }}>
                        No courses yet.
                    </div>
                ) : (
                    courses.map(c => (
                        <div key={c.id} style={rowStyle}>
                            <span style={{ fontSize: 13, color: '#333' }}>{c.title}</span>

                            <button
                                style={delBtnStyle}
                                onClick={() => handleDeleteCourse(c.id)}
                            >
                                <i className="bi bi-trash3"></i>
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* ── Books ── */}
            {/* ───────────── Books ───────────── */}

            {/* 🔵 الهيدر فوق */}
            <div style={sectionHeader}>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A' }}>
                    Books
                </span>

                <button
                    style={addBtnStyle}
                    onClick={() =>
                        navigate(`/add-book?careerId=${careerId}&career=${encodeURIComponent(title)}`)
                    }
                >
                    <i className="bi bi-plus-lg"></i> Add new book
                </button>
            </div>

            {/* ⚪ الكارد الأبيض */}
            <div
                style={{
                    background: '#fff',
                    borderRadius: 12,
                    padding: '16px',
                    border: '1px solid #eee',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    marginBottom: 14
                }}
            >
                <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600, color: '#999' }}>
                    Books
                </div>

                {books.length === 0 ? (
                    <div style={{ color: '#bbb', fontSize: 13, textAlign: 'center', padding: '10px 0' }}>
                        No books yet.
                    </div>
                ) : (
                    books.map(b => (
                        <div key={b.id} style={rowStyle}>
                            <span style={{ fontSize: 13, color: '#333' }}>{b.title}</span>

                            <button
                                style={delBtnStyle}
                                onClick={() => handleDeleteBook(b.id)}
                            >
                                <i className="bi bi-trash3"></i>
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* ── YouTube Resources ── */}
            {/* 🔵 الهيدر فوق */}
            <div style={sectionHeader}>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A' }}>
                    YouTube Resources
                </span>

                <button
                    style={addBtnStyle}
                    onClick={() =>
                        navigate(`/add-resource?careerId=${careerId}&career=${encodeURIComponent(title)}`)
                    }
                >
                    <i className="bi bi-plus-lg"></i> Add new resource
                </button>
            </div>

            {/* ⚪ الكارد الأبيض */}
            <div
                style={{
                    background: '#fff',
                    borderRadius: 12,
                    padding: '16px',
                    border: '1px solid #eee',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    marginBottom: 14
                }}
            >
                <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600, color: '#999' }}>
                    YouTube Resources
                </div>

                {youtube.length === 0 ? (
                    <div style={{ color: '#bbb', fontSize: 13, textAlign: 'center', padding: '10px 0' }}>
                        No YouTube resources yet.
                    </div>
                ) : (
                    youtube.map(y => (
                        <div key={y.id} style={rowStyle}>
                            <span style={{ fontSize: 13, color: '#333' }}>{y.title}</span>

                            <button
                                style={delBtnStyle}
                                onClick={() => handleDeleteYoutube(y.id)}
                            >
                                <i className="bi bi-trash3"></i>
                            </button>
                        </div>
                    ))
                )}
            </div>
            {/* Footer */}
            <div style={{ display: 'flex', gap: 12, marginTop: 8, marginBottom: 32 }}>
                <button onClick={() => navigate(-1)}
                    style={{ padding: '10px 24px', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: 14, fontWeight: 600, color: '#666', background: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
                    Back
                </button>
                <button onClick={handleSave} disabled={saving}
                    style={{ padding: '10px 28px', border: 'none', borderRadius: 10, background: '#0B6BA0', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(11,107,160,.25)', opacity: saving ? .6 : 1 }}>
                    {saving ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</> : 'Save Changes'}
                </button>
            </div>
        </AdminLayout>
    )
}


