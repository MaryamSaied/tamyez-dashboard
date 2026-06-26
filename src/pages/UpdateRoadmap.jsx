import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import Loader from '../components/Loader'
import { roadmapsAPI } from '../services/api'

export default function UpdateRoadmap() {
    const [params]  = useSearchParams()
    const navigate  = useNavigate()
    const stepId    = params.get('id')

    const [step,    setStep]    = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving,  setSaving]  = useState(false)
    const [error,   setError]   = useState('')
    const [toast,   setToast]   = useState('')
    const [toastErr,setToastErr]= useState(false)

    const [title,   setTitle]   = useState('')
    const [desc,    setDesc]    = useState('')
    const [order,   setOrder]   = useState('')
    const [courses, setCourses] = useState([])

    // Add new course modal
    const [showAddCourse, setShowAddCourse] = useState(false)
    const [newCourse, setNewCourse] = useState({ title:'', url:'', pricingType:'Free', language:'en' })
    const [courseLoading, setCourseLoading] = useState(false)

    const showToast = (msg, err=false) => {
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
                setCourses(s.youtubePlaylists || s.courses || [])
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
        } catch(err) { showToast(err.message || 'Failed to save', true) }
        finally { setSaving(false) }
    }

    const handleAddCourse = async () => {
        if (!newCourse.title.trim()) return
        setCourseLoading(true)
        try {
            // update first existing resource or just show locally
            const resourceId = courses[0]?.id || courses[0]?._id
            if (resourceId) {
                await roadmapsAPI.updateResource(stepId, resourceId, {
                    title: newCourse.title, url: newCourse.url,
                    pricingType: newCourse.pricingType, language: newCourse.language,
                    v: step?.v ?? 1,
                })
            }
            showToast('Course added!')
            setShowAddCourse(false)
            setNewCourse({ title:'', url:'', pricingType:'Free', language:'en' })
            fetchStep()
        } catch(err) { showToast(err.message || 'Failed', true) }
        finally { setCourseLoading(false) }
    }

    if (loading) return <AdminLayout><Loader text="Loading..." /></AdminLayout>
    if (error)   return <AdminLayout><div style={{color:'#e74c3c',padding:32}}>{error}</div></AdminLayout>

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
            `}</style>

            {toast && (
                <div style={{position:'fixed',top:24,left:'50%',transform:'translateX(-50%)',background:toastErr?'#e74c3c':'#27ae60',color:'#fff',padding:'11px 22px',borderRadius:10,fontSize:13,fontWeight:700,zIndex:9999,boxShadow:'0 4px 16px rgba(0,0,0,.15)'}}>
                    <i className={`bi ${toastErr?'bi-exclamation-circle-fill':'bi-check-circle-fill'} me-2`}></i>{toast}
                </div>
            )}

            <div className="ur-wrap">
                <button onClick={() => navigate('/roadmaps')} style={{background:'none',border:'none',color:'#0B6BA0',fontSize:13,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:5,fontFamily:'inherit',marginBottom:14}}>
                    <i className="bi bi-arrow-left"></i> Back
                </button>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
                    <h2 style={{fontWeight:800,fontSize:20,color:'#1A1A1A',margin:0}}>Update Career Roadmap</h2>
                    <button className="ur-add-step-btn">
                        <i className="bi bi-plus-lg"></i>+ Add new step
                    </button>
                </div>

                {/* Step Card */}
                <div className="ur-step-card">
                    <div className="ur-step-header">
                        <span className="ur-step-num">Step {step?.order || 1}</span>
                        <button className="ur-delete-step" onClick={() => { if(window.confirm('Delete this step?')) roadmapsAPI.delete(stepId).then(()=>navigate('/roadmaps')) }}>
                            delete step {step?.order || 1}
                        </button>
                    </div>

                    <div className="ur-field">
                        <label className="ur-label">Step Name</label>
                        <input className="ur-input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Step name..." />
                    </div>

                    <div className="ur-field">
                        <label className="ur-label">Step description</label>
                        <textarea className="ur-input" value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Step description..." />
                    </div>

                    {/* Step Courses */}
                    <div className="ur-section">
                        <div className="ur-section-header">
                            <span className="ur-section-title">Step Courses</span>
                            <button className="ur-add-link" onClick={()=>setShowAddCourse(true)}>Add new course</button>
                        </div>
                        {courses.filter(c=>c.type==='course'||!c.type).length===0 && courses.length===0 ? (
                            <div style={{color:'#bbb',fontSize:13}}>No courses added yet.</div>
                        ) : courses.map((c,i)=>(
                            <div key={c.id||i} className="ur-resource-row">
                                <span className="ur-resource-name"><i className="bi bi-journal-text" style={{color:'#0B6BA0'}}></i>{c.title||c.name}</span>
                                <button className="ur-resource-del"><i className="bi bi-trash"></i></button>
                            </div>
                        ))}
                    </div>

                    {/* Step Books */}
                    <div className="ur-section">
                        <div className="ur-section-header">
                            <span className="ur-section-title">Step Books</span>
                            <button className="ur-add-link">Add new book</button>
                        </div>
                        <div style={{color:'#bbb',fontSize:13}}>No books added yet.</div>
                    </div>

                    {/* Step YouTube Resources */}
                    <div className="ur-section">
                        <div className="ur-section-header">
                            <span className="ur-section-title">Step YouTube Resources</span>
                            <button className="ur-add-link">Add new resource</button>
                        </div>
                        {courses.length===0 ? (
                            <div style={{color:'#bbb',fontSize:13}}>No resources added yet.</div>
                        ) : courses.map((pl,i)=>(
                            <div key={pl.id||i} className="ur-resource-row">
                                <span className="ur-resource-name"><i className="bi bi-play-circle-fill" style={{color:'#e74c3c'}}></i>{pl.title||pl.name}
                                    {pl.url&&<a href={pl.url} target="_blank" rel="noreferrer" style={{marginLeft:6,fontSize:11,color:'#999'}}><i className="bi bi-box-arrow-up-right"></i></a>}
                                </span>
                                <button className="ur-resource-del"><i className="bi bi-trash"></i></button>
                            </div>
                        ))}
                    </div>

                    {/* Step Quizzes */}
                    <div className="ur-section">
                        <div className="ur-section-header">
                            <span className="ur-section-title">Step Quizzes</span>
                            <button className="ur-add-link">Add new quiz</button>
                        </div>
                        <div style={{color:'#bbb',fontSize:13}}>No quizzes added yet.</div>
                    </div>
                </div>

                <div className="ur-footer">
                    <button className="ur-back" onClick={()=>navigate('/roadmaps')}>Back</button>
                    <button className="ur-save" onClick={handleSave} disabled={saving}>
                        {saving?<><span className="spinner-border spinner-border-sm me-2"></span>Saving...</>:'Save Changes'}
                    </button>
                </div>
            </div>

            {/* Add Course Modal */}
            {showAddCourse && (
                <div className="adm-modal-overlay show" onClick={e=>e.target===e.currentTarget&&setShowAddCourse(false)}>
                    <div className="adm-modal" style={{maxWidth:400}}>
                        <h3>Add Course</h3>
                        <div style={{marginBottom:10}}>
                            <label style={{fontSize:13,fontWeight:600,display:'block',marginBottom:4}}>Title *</label>
                            <input className="adm-search" style={{width:'100%'}} value={newCourse.title} onChange={e=>setNewCourse({...newCourse,title:e.target.value})} placeholder="Course title" />
                        </div>
                        <div style={{marginBottom:10}}>
                            <label style={{fontSize:13,fontWeight:600,display:'block',marginBottom:4}}>URL</label>
                            <input className="adm-search" style={{width:'100%'}} value={newCourse.url} onChange={e=>setNewCourse({...newCourse,url:e.target.value})} placeholder="https://..." />
                        </div>
                        <div style={{marginBottom:10}}>
                            <label style={{fontSize:13,fontWeight:600,display:'block',marginBottom:4}}>Pricing</label>
                            <select className="adm-search" style={{width:'100%'}} value={newCourse.pricingType} onChange={e=>setNewCourse({...newCourse,pricingType:e.target.value})}>
                                <option>Free</option><option>Paid</option>
                            </select>
                        </div>
                        <div style={{display:'flex',gap:8,marginTop:12}}>
                            <button className="adm-btn-cancel" onClick={()=>setShowAddCourse(false)}>Cancel</button>
                            <button className="adm-btn-confirm" disabled={courseLoading} onClick={handleAddCourse}>
                                {courseLoading?'Saving...':'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}
