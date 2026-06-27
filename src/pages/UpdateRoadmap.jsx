import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import Loader from '../components/Loader'
import { roadmapsAPI } from '../services/api'

export default function UpdateRoadmap() {
    const [params] = useSearchParams()
    const navigate = useNavigate()
    const stepId = params.get('id')
    // Add new Step modal
    const [step, setStep] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [toast, setToast] = useState('')
    const [toastErr, setToastErr] = useState(false)
    // Add new Book modal
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [order, setOrder] = useState('')
    const [courses, setCourses] = useState([])
    const [showAddBook, setShowAddBook] = useState(false)
    const [newBook, setNewBook] = useState({ title: '', url: '' })
    const [bookTitle, setBookTitle] = useState('')
    const [bookAuthor, setBookAuthor] = useState('')
    const [bookLink, setBookLink] = useState('')
    const [bookPricing, setBookPricing] = useState('Free')
    // Add new Resource modal
    const [showAddResource, setShowAddResource] = useState(false)
    const [resourceTitle, setResourceTitle] = useState('')
    const [resourceLink, setResourceLink] = useState('')
    const [resourcePricing, setResourcePricing] = useState('Free')
    const [showAddYTResource, setShowAddYTResource] = useState(false)
    const [ytTitle, setYtTitle] = useState('')
    const [ytLink, setYtLink] = useState('')
    // Add new quiz modal
    const [showAddQuiz, setShowAddQuiz] = useState(false)
    const [quizTitle, setQuizTitle] = useState('')
    const [quizDescription, setQuizDescription] = useState('')
    const [quizQuestions, setQuizQuestions] = useState(10)
    const [quizDuration, setQuizDuration] = useState(1000)
    const [quizTags, setQuizTags] = useState('')
    const [books, setBooks] = useState([])
    const [resources, setResources] = useState([])
    const [quizzes, setQuizzes] = useState([])
    const [stepNameModal, setStepNameModal] = useState('')
    const [stepDescModal, setStepDescModal] = useState('')
    const [stepLanguage, setStepLanguage] = useState('en')
    const [language, setLanguage] = useState("en")

    // Add new course modal
    const [showAddCourse, setShowAddCourse] = useState(false)
    const [newCourse, setNewCourse] = useState({ title: '', url: '', pricingType: 'Free', language: 'en' })
    const [courseLoading, setCourseLoading] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [itemToDelete, setItemToDelete] = useState(null)
    const [showAddStepModal, setShowAddStepModal] = useState(false)
    const [stepCourses, setStepCourses] = useState([{ title: '', url: '' }])
    const [stepBooks, setStepBooks] = useState([{ title: '', url: '' }])
    const [stepResources, setStepResources] = useState([{ title: '', url: '' }])
    const [stepQuizzes, setStepQuizzes] = useState([{ title: '', description: '' }])


    const showToast = (msg, err = false) => {
        setToast(msg); setToastErr(err)
        setTimeout(() => setToast(''), 3000)
    }

    const fetchStep = useCallback(() => {
        if (!stepId) { setLoading(false); return }

        roadmapsAPI.getById(stepId)
            .then(res => {
                const s = res.body || res

                setStep(s)
                setTitle(s.title || '')
                setDesc(s.description || '')
                setOrder(String(s.order || ''))

                // 👇 أهم تعديل هنا
                setCourses(s.courses || [])
                setResources(s.youtubePlaylists || [])
                setCourses(s.courses || [])
                setBooks(s.books || [])
                setQuizzes(s.quizzes || [])

                setLanguage(s.language || 'en')
            })
            .catch(err => setError(err.message || 'Failed to load'))
            .finally(() => setLoading(false))
    }, [stepId])
    useEffect(() => { fetchStep() }, [fetchStep])

    const handleSave = async () => {
        if (!title.trim()) { showToast('Step name is required', true); return }
        setSaving(true)
        try {
            await roadmapsAPI.update(stepId, {
                title, description: desc, order: parseInt(order) || 1, v: step?.v ?? 1,
            })
            showToast('Roadmap step updated!')
            setTimeout(() => navigate('/roadmaps'), 1200)
        } catch (err) { showToast(err.message || 'Failed to save', true) }
        finally { setSaving(false) }
    }

    const handleAddCourse = async () => {
        if (!newCourse.title.trim() || !newCourse.url.trim()) return

        setCourseLoading(true)

        try {
            await roadmapsAPI.update(stepId, {
                courses: [
                    {
                        title: newCourse.title, // ✅ بدل "Course"
                        url: newCourse.url,
                        pricingType: newCourse.pricingType,
                        language: newCourse.language
                    }
                ],
                v: step?.v ?? 0
            })

            showToast('Course added! ✅')
            setShowAddCourse(false)

            setNewCourse({
                title: '',
                url: '',
                pricingType: 'Free',
                language: 'en'
            })

            fetchStep()

        } catch (err) {
            showToast(err.message || 'Failed', true)
        } finally {
            setCourseLoading(false)
        }
    }
    const handleAddResource = async () => {
        if (!ytTitle.trim() || !ytLink.trim()) return

        try {
            await roadmapsAPI.update(stepId, {
                youtubePlaylists: [
                    {
                        title: ytTitle,
                        url: ytLink,
                        pricingType: 'Free',
                        language: 'en'
                    }
                ],
                v: step?.v ?? 0
            })

            showToast('Resource added ✅')

            setShowAddYTResource(false)
            setYtTitle('')
            setYtLink('')

            fetchStep()

        } catch (err) {
            console.log(err) // 👈 مهم
            showToast(err.message || 'Failed ❌', true)
        }
    }
    const handleAddBook = async () => {
        if (!bookTitle.trim()) return

        try {
            await roadmapsAPI.update(stepId, {
                books: [
                    {
                        title: bookTitle,
                        url: bookLink,
                        pricingType: bookPricing,
                        language: language
                    }
                ],
                v: step?.v ?? 0
            })

            showToast('Book added ✅')

            setShowAddBook(false)

            setBookTitle('')
            setBookLink('')
            setBookPricing('Free')

            fetchStep()

        } catch (err) {
            showToast(err.message || 'Failed', true)
        }
    }
    const handleAddQuiz = async () => {
        if (!quizTitle.trim()) return

        try {
            await roadmapsAPI.update(stepId, {
                quizzesIds: [quizTitle], // ✅ ده الصح
                v: step?.v ?? 0
            })

            showToast('Quiz added ✅')

            setQuizTitle('')
            setShowAddQuiz(false)

            fetchStep()

        } catch (err) {
            showToast(err.message || 'Failed', true)
        }
    }
    const handleDeleteResource = async (id) => {
        try {
            await roadmapsAPI.update(stepId, {
                removeYoutubePlaylists: [id],
                v: step?.v ?? 0
            })

            showToast('Deleted ✅')
            fetchStep()

        } catch (err) {
            showToast(err.message || 'Failed ❌', true)
        }
    }
    const handleDeleteCourse = async (id) => {
        try {
            await roadmapsAPI.update(stepId, {
                removeCourses: [id],
                v: step?.v ?? 0
            })

            showToast('Deleted ✅')
            fetchStep()

        } catch (err) {
            showToast(err.message || 'Failed ❌', true)
        }
    }
    const handleDeleteBook = async (id) => {
        try {
            await roadmapsAPI.update(stepId, {
                removeBooks: [id],
                v: step?.v ?? 0
            })

            showToast('Deleted ✅')
            fetchStep()

        } catch (err) {
            showToast(err.message || 'Failed ❌', true)
        }
    }
    const handleDeleteQuiz = async (id) => {
        try {
            await roadmapsAPI.update(stepId, {
                removeQuizzesIds: [id],
                v: step?.v ?? 0
            })

            showToast('Deleted ✅')
            fetchStep()

        } catch (err) {
            showToast(err.message || 'Failed ❌', true)
        }
    }


    if (loading) return <AdminLayout><Loader text="Loading..." /></AdminLayout>
    if (error) return <AdminLayout><div style={{ color: '#e74c3c', padding: 32 }}>{error}</div></AdminLayout>

    return (
        <AdminLayout>
            <style>{`
                .ur-wrap { max-width: 860px; }
                .ur-step-card { background:#fff; border:1px solid #e8e8e8; border-radius:12px; padding:22px 24px; margin-bottom:16px; }
                .ur-step-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; }
                .ur-step-num { font-size:13px; font-weight:700; color:#999; }
                .ur-delete-step { font-size:12px; color:#e74c3c; font-weight:600; cursor:pointer; background:none; border:none; font-family:inherit; }
                .ur-label { font-size:13px; font-weight:600; color:#1A1A1A; display:block; margin-bottom:6px; }
                .ur-input { width:100%; border:1.5px solid #e8e8e8; border-radius:8px; padding:9px 13px; font-size:14px; outline:none; box-sizing:border-box; font-family:inherit; color:#1A1A1A; transition:border .2s; }
                .ur-input:focus { border-color:#0B6BA0; }
                textarea.ur-input { resize:vertical; min-height:90px; }
                .ur-field { margin-bottom:14px; }
                .ur-section { margin-top:18px; }
                .ur-section-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
                .ur-section-title { font-size:13px; font-weight:700; color:#1A1A1A; }
                .ur-add-link { font-size:12px; font-weight:700; color:#0B6BA0; cursor:pointer; background:none; border:none; font-family:inherit; display:flex; align-items:center; gap:4px; }
                .ur-resource-row { display:flex; align-items:center; justify-content:space-between; background:#f8f9fc; border-radius:8px; padding:9px 13px; margin-bottom:7px; }
                .ur-resource-name { font-size:13px; font-weight:500; color:#1A1A1A; display:flex; align-items:center; gap:8px; }
                .ur-resource-del { color:#e74c3c; cursor:pointer; font-size:14px; background:none; border:none; }
                .ur-footer { display:flex; justify-content:space-between; align-items:center; margin-top:20px; }
                .ur-back { padding:9px 22px; border:1.5px solid #e8e8e8; border-radius:8px; background:#fff; font-size:14px; font-weight:600; color:#555; cursor:pointer; font-family:inherit; }
                .ur-save { padding:9px 26px; border:none; border-radius:8px; background:#0B6BA0; color:#fff; font-size:14px; font-weight:700; cursor:pointer; font-family:inherit; box-shadow:0 4px 12px rgba(11,107,160,.22); }
                .ur-save:disabled { opacity:.6; cursor:not-allowed; }
                .ur-add-step-btn { display:flex; align-items:center; gap:6px; padding:8px 16px; background:#0B6BA0; color:#fff; border:none; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer; font-family:inherit; }
                .adm-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 99999;
                }

                .adm-modal {
                background: #fff;
                padding: 20px;
                border-radius: 10px;
                width: 400px;
                max-width: 90%;
                }

                .adm-form-group {
                margin-bottom: 10px;
                }

                .adm-form-group input {
                width: 100%;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 6px;
                }

                .adm-form-row {
                display: flex;
                gap: 10px;
                }

                .adm-modal-actions {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                margin-top: 15px;
                }
                .add-step-modal {
                max-width: 650px;
                width: 100%;

                max-height: 85vh;
                overflow-y: auto;

                display: flex;
                flex-direction: column;
            }
            `}</style>

            {toast && (
                <div style={{ position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', background: toastErr ? '#e74c3c' : '#27ae60', color: '#fff', padding: '11px 22px', borderRadius: 10, fontSize: 13, fontWeight: 700, zIndex: 9999, boxShadow: '0 4px 16px rgba(0,0,0,.15)' }}>
                    <i className={`bi ${toastErr ? 'bi-exclamation-circle-fill' : 'bi-check-circle-fill'} me-2`}></i>{toast}
                </div>
            )}

            <div className="ur-wrap">
                <button onClick={() => navigate('/roadmaps')} style={{ background: 'none', border: 'none', color: '#0B6BA0', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'inherit', marginBottom: 14 }}>
                    <i className="bi bi-arrow-left"></i> Back
                </button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h2 style={{ fontWeight: 800, fontSize: 20, color: '#1A1A1A', margin: 0 }}>Update Career Roadmap</h2>
                    <button
                        className="ur-add-step-btn"
                        onClick={() => setShowAddStepModal(true)}
                    >
                        <i className="bi bi-plus-lg"></i>
                        Add new step
                    </button>
                </div>

                {/* Step Card */}
                <div className="ur-step-card">
                    <div className="ur-step-header">
                        <span className="ur-step-num">Step {step?.order || 1}</span>
                        <button className="ur-delete-step" onClick={() => { if (window.confirm('Delete this step?')) roadmapsAPI.delete(stepId).then(() => navigate('/roadmaps')) }}>
                            delete step {step?.order || 1}
                        </button>
                    </div>

                    <div className="ur-field">
                        <label className="ur-label">Step Name</label>
                        <input className="ur-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Step name..." />
                    </div>

                    <div className="ur-field">
                        <label className="ur-label">Step description</label>
                        <textarea className="ur-input" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Step description..." />
                    </div>


                    {/* Step Courses */}
                    <div className="ur-section">
                        <div className="ur-section-header">
                            <span className="ur-section-title">Step Courses</span>
                            <button className="ur-add-link" onClick={() => setShowAddCourse(true)}>Add new course</button>
                        </div>
                        {courses.filter(c => c.type === 'course' || !c.type).length === 0 && courses.length === 0 ? (
                            <div style={{ color: '#bbb', fontSize: 13 }}>No courses added yet.</div>
                        ) : courses.map((c, i) => (
                            <div key={c.id || i} className="ur-resource-row">
                                <span className="ur-resource-name"><i className="bi bi-journal-text" style={{ color: '#0B6BA0' }}></i>{c.title || c.name}</span>
                                <button
                                    className="ur-resource-del"
                                    onClick={() => {
                                        setItemToDelete({
                                            data: c,
                                            type: 'course'
                                        })
                                        setShowDeleteModal(true)
                                    }}
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Step Books */}
                    <div className="ur-section">
                        <div className="ur-section-header">
                            <span className="ur-section-title">Step Books</span>
                            <button
                                className="ur-add-link"
                                onClick={() => {
                                    console.log("CLICKED")
                                    setShowAddBook(true)
                                }}
                            >
                                Add new book
                            </button>
                        </div>
                        {books.length === 0 ? (
                            <div style={{ color: '#bbb', fontSize: 13 }}>
                                No books added yet.
                            </div>
                        ) : books.map((b, i) => (
                            <div key={i} className="ur-resource-row">
                                <span className="ur-resource-name">
                                    <i className="bi bi-book" style={{ color: '#0B6BA0' }}></i>
                                    {b.title}
                                </span>

                                <button
                                    className="ur-resource-del"
                                    onClick={() => {
                                        setItemToDelete({
                                            data: b, // أو b أو q أو pl
                                            type: 'book'
                                        })
                                        setShowDeleteModal(true)
                                    }}
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                    {/* Add Book Modal */}
                    {showAddBook && (
                        <div
                            className="adm-modal-overlay show"
                            onClick={e => e.target === e.currentTarget && setShowAddBook(false)}
                        >
                            <div className="adm-modal" style={{ maxWidth: 400 }}>
                                <h3>Add Book</h3>

                                {/* Title */}
                                <div style={{ marginBottom: 10 }}>
                                    <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                                        Title *
                                    </label>
                                    <input
                                        className="adm-search"
                                        style={{ width: '100%' }}
                                        value={bookTitle}
                                        onChange={e => setBookTitle(e.target.value)}
                                        placeholder="Book title"
                                    />
                                </div>

                                {/* URL */}
                                <div style={{ marginBottom: 10 }}>
                                    <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                                        URL
                                    </label>
                                    <input
                                        className="adm-search"
                                        style={{ width: '100%' }}
                                        value={bookLink}
                                        onChange={e => setBookLink(e.target.value)}
                                        placeholder="https://..."
                                    />
                                </div>
                                {/* Pricing */}
                                <div style={{ marginBottom: 10 }}>
                                    <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                                        Pricing
                                    </label>

                                    <select
                                        className="adm-search"
                                        style={{ width: '100%' }}
                                        value={bookPricing}
                                        onChange={(e) => setBookPricing(e.target.value)}
                                    >
                                        <option value="Free">Free</option>
                                        <option value="Paid">Paid</option>
                                    </select>
                                </div>
                                {/* Language */}
                                <div style={{ marginBottom: 10 }}>
                                    <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                                        Language
                                    </label>

                                    <select
                                        className="adm-search"
                                        style={{ width: '100%' }}
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                    >
                                        <option value="en">English</option>
                                        <option value="ar">Arabic</option>
                                    </select>
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                                    <button
                                        className="adm-btn-cancel"
                                        onClick={() => setShowAddBook(false)}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        className="adm-btn-confirm"
                                        onClick={handleAddBook}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step YouTube Resources */}
                    <div className="ur-section">
                        <div className="ur-section-header">
                            <span className="ur-section-title">Step YouTube Resources</span>
                            <button
                                className="ur-add-link"
                                onClick={() => setShowAddYTResource(true)}
                            >
                                Add new resource
                            </button>
                        </div>
                        {resources.length === 0 ? (
                            <div style={{ color: '#bbb', fontSize: 13 }}>
                                No resources added yet.
                            </div>
                        ) : resources.map((pl, i) => (
                            <div key={pl.id || i} className="ur-resource-row">
                                <span className="ur-resource-name"><i className="bi bi-play-circle-fill" style={{ color: '#e74c3c' }}></i>{pl.title || pl.name}
                                    {pl.url && <a href={pl.url} target="_blank" rel="noreferrer" style={{ marginLeft: 6, fontSize: 11, color: '#999' }}><i className="bi bi-box-arrow-up-right"></i></a>}
                                </span>
                                <button
                                    className="ur-resource-del"
                                    onClick={() => {
                                        setItemToDelete({
                                            data: pl,
                                            type: 'resource'
                                        })
                                        setShowDeleteModal(true)
                                    }}
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                    {/* Add YouTube Resource Modal */}
                    {showAddYTResource && (
                        <div
                            className="adm-modal-overlay show"
                            onClick={e => e.target === e.currentTarget && setShowAddYTResource(false)}
                        >
                            <div className="adm-modal" style={{ maxWidth: 400 }}>
                                <h3>Add YouTube Resource</h3>

                                <div style={{ marginBottom: 10 }}>
                                    <label>Title *</label>
                                    <input
                                        className="adm-search"
                                        value={ytTitle}
                                        onChange={e => setYtTitle(e.target.value)}
                                        placeholder="Playlist title"
                                    />
                                </div>

                                <div style={{ marginBottom: 10 }}>
                                    <label>YouTube URL</label>
                                    <input
                                        className="adm-search"
                                        value={ytLink}
                                        onChange={e => setYtLink(e.target.value)}
                                        placeholder="https://youtube.com/..."
                                    />

                                    {/* Pricing */}
                                    <div style={{ marginBottom: 10 }}>
                                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                                            Pricing
                                        </label>

                                        <select
                                            className="adm-search"
                                            style={{ width: '100%' }}
                                            value={bookPricing}
                                            onChange={(e) => setBookPricing(e.target.value)}
                                        >
                                            <option value="Free">Free</option>
                                            <option value="Paid">Paid</option>
                                        </select>
                                    </div>
                                    {/* Language */}
                                    <div style={{ marginBottom: 10 }}>
                                        <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                                            Language
                                        </label>

                                        <select
                                            className="adm-search"
                                            style={{ width: '100%' }}
                                            value={language}
                                            onChange={(e) => setLanguage(e.target.value)}
                                        >
                                            <option value="en">English</option>
                                            <option value="ar">Arabic</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button
                                        className="adm-btn-cancel"
                                        onClick={() => setShowAddYTResource(false)}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        className="adm-btn-confirm"
                                        onClick={handleAddResource}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step Quizzes */}
                    <div className="ur-section">
                        <div className="ur-section-header">
                            <span className="ur-section-title">Step Quizzes</span>
                            <button
                                className="ur-add-link"
                                onClick={() => setShowAddQuiz(true)}
                            >
                                Add new quiz
                            </button>
                        </div>
                        {quizzes.length === 0 ? (
                            <div style={{ color: '#bbb', fontSize: 13 }}>
                                No quizzes added yet.
                            </div>
                        ) : quizzes.map((q, i) => (
                            <div key={i} className="ur-resource-row">
                                <span className="ur-resource-name">
                                    <i className="bi bi-journal-check" style={{ color: '#0B6BA0' }}></i>
                                    {q.title}
                                </span>

                                <button
                                    className="ur-resource-del"
                                    onClick={() => {
                                        setItemToDelete({
                                            data: q,
                                            type: 'quiz'
                                        })
                                        setShowDeleteModal(true)
                                    }}
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="ur-footer">
                    <button className="ur-back" onClick={() => navigate('/roadmaps')}>Back</button>
                    <button className="ur-save" onClick={handleSave} disabled={saving}>
                        {saving ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</> : 'Save Changes'}
                    </button>
                </div>
            </div>
            {/* AddQuiz Modal */}
            {/* Add Quiz Modal */}
            {showAddQuiz && (
                <div
                    className="adm-modal-overlay show"
                    onClick={e => e.target === e.currentTarget && setShowAddQuiz(false)}
                >
                    <div className="adm-modal" style={{ maxWidth: 400 }}>
                        <h3>Add Quiz</h3>

                        {/* Quiz ID */}
                        <div style={{ marginBottom: 10 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                                Quiz ID *
                            </label>

                            <input
                                className="adm-search"
                                style={{ width: '100%' }}
                                value={quizTitle} // هنستخدمه كـ id
                                onChange={e => setQuizTitle(e.target.value)}
                                placeholder="Enter quiz ID"
                            />
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                            <button
                                className="adm-btn-cancel"
                                onClick={() => setShowAddQuiz(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="adm-btn-confirm"
                                onClick={handleAddQuiz}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Add Course Modal */}
            {showAddCourse && (
                <div className="adm-modal-overlay show" onClick={e => e.target === e.currentTarget && setShowAddCourse(false)}>
                    <div className="adm-modal" style={{ maxWidth: 400 }}>
                        <h3>Add Course</h3>
                        <div style={{ marginBottom: 10 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Title *</label>
                            <input className="adm-search" style={{ width: '100%' }} value={newCourse.title} onChange={e => setNewCourse({ ...newCourse, title: e.target.value })} placeholder="Course title" />
                        </div>
                        <div style={{ marginBottom: 10 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>URL</label>
                            <input className="adm-search" style={{ width: '100%' }} value={newCourse.url} onChange={e => setNewCourse({ ...newCourse, url: e.target.value })} placeholder="https://..." />
                        </div>
                        <div style={{ marginBottom: 10 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Pricing</label>
                            <select className="adm-search" style={{ width: '100%' }} value={newCourse.pricingType} onChange={e => setNewCourse({ ...newCourse, pricingType: e.target.value })}>
                                <option>Free</option><option>Paid</option>
                            </select>
                        </div>
                        {/* Language */}
                        <div style={{ marginBottom: 10 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                                Language
                            </label>

                            <select
                                className="adm-search"
                                style={{ width: '100%' }}
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                            >
                                <option value="en">English</option>
                                <option value="ar">Arabic</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                            <button className="adm-btn-cancel" onClick={() => setShowAddCourse(false)}>Cancel</button>
                            <button className="adm-btn-confirm" disabled={courseLoading} onClick={handleAddCourse}>
                                {courseLoading ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showDeleteModal && (
                <div
                    className="adm-modal-overlay show"
                    onClick={e => e.target === e.currentTarget && setShowDeleteModal(false)}
                >
                    <div
                        className="adm-modal"
                        style={{
                            maxWidth: 350,
                            textAlign: 'center'
                        }}
                    >
                        <h3 style={{ marginBottom: 10 }}>Delete Item</h3>

                        <p style={{ fontSize: 13, color: '#666', marginBottom: 20 }}>
                            Are you sure you want to delete this item?
                        </p>

                        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                            <button
                                className="adm-btn-cancel"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="adm-btn-confirm"
                                style={{ background: '#e74c3c' }}
                                onClick={async () => {
                                    if (!itemToDelete) return

                                    try {
                                        const { type, data } = itemToDelete
                                        const itemId = data?.id || data?._id

                                        if (!itemId) {
                                            showToast('Invalid item ❌', true)
                                            return
                                        }

                                        if (type === 'resource') {
                                            await roadmapsAPI.update(stepId, {
                                                removeYoutubePlaylists: [itemId],
                                                v: step?.v ?? 0
                                            })
                                        }

                                        if (type === 'course') {
                                            await roadmapsAPI.update(stepId, {
                                                removeCourses: [itemId],
                                                v: step?.v ?? 0
                                            })
                                        }

                                        if (type === 'book') {
                                            await roadmapsAPI.update(stepId, {
                                                removeBooks: [itemId],
                                                v: step?.v ?? 0
                                            })
                                        }

                                        if (type === 'quiz') {
                                            await roadmapsAPI.update(stepId, {
                                                removeQuizzesIds: [itemId],
                                                v: step?.v ?? 0
                                            })
                                        }

                                        setShowDeleteModal(false)
                                        setItemToDelete(null)

                                        showToast('Deleted ✅')
                                        fetchStep()

                                    } catch (err) {
                                        console.log(err)
                                        showToast(err.message || 'Failed ❌', true)
                                    }
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAddStepModal && (
                <div
                    className="adm-modal-overlay show"
                    onClick={e => e.target === e.currentTarget && setShowAddStepModal(false)}
                >
                    <div className="adm-modal add-step-modal">

                        <h3>Add New Step</h3>

                        {/* Step Name */}
                        <div className="adm-form-group">
                            <label>Step Name *</label>
                            <input
                                className="adm-search"
                                value={stepNameModal}
                                onChange={e => setStepNameModal(e.target.value)}
                                placeholder="Enter step name"
                            />
                        </div>

                        {/* Step Description */}
                        <div className="adm-form-group">
                            <label>Step Description</label>
                            <textarea
                                className="adm-search"
                                value={stepDescModal}
                                onChange={e => setStepDescModal(e.target.value)}
                                placeholder="Enter description"
                            />
                        </div>

                        {/* Language */}
                        <div className="adm-form-group">
                            <label>Language</label>
                            <select
                                className="adm-search"
                                value={stepLanguage}
                                onChange={e => setStepLanguage(e.target.value)}
                            >
                                <option value="en">English</option>
                                <option value="ar">Arabic</option>
                            </select>
                        </div>

                        {/* Course URL */}
                        <div className="adm-form-group">
                            <label>Step Course URL</label>
                            <input
                                className="adm-search"
                                placeholder="Course URL"
                                value={newCourse.url}
                                onChange={e => setNewCourse({ ...newCourse, url: e.target.value })}
                            />
                        </div>

                        {/* Book URL */}
                        <div className="adm-form-group">
                            <label>Step Book URL</label>
                            <input
                                className="adm-search"
                                placeholder="Book URL"
                                value={bookLink}
                                onChange={e => setBookLink(e.target.value)}
                            />
                        </div>

                        {/* YouTube URL */}
                        <div className="adm-form-group">
                            <label>Step YouTube Resource</label>
                            <input
                                className="adm-search"
                                placeholder="YouTube URL"
                                value={ytLink}
                                onChange={e => setYtLink(e.target.value)}
                            />
                        </div>

                        {/* Quiz Title */}
                        <div className="adm-form-group">
                            <label>Quiz Title</label>
                            <input
                                className="adm-search"
                                placeholder="Quiz title"
                                value={quizTitle}
                                onChange={e => setQuizTitle(e.target.value)}
                            />
                        </div>

                        {/* Actions */}
                        <div className="adm-modal-actions">
                            <button
                                className="adm-btn-cancel"
                                onClick={() => setShowAddStepModal(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="adm-btn-confirm"
                                onClick={() => {
                                    if (!stepNameModal.trim()) return

                                    console.log("STEP DATA:", {
                                        stepNameModal,
                                        stepDescModal,
                                        stepLanguage,
                                        courseURL: newCourse.url,
                                        bookURL: bookLink,
                                        youtubeURL: ytLink,
                                        quizTitle: quizTitle
                                    })

                                    setShowAddStepModal(false)
                                }}
                            >
                                Save
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </AdminLayout>
    )
}

