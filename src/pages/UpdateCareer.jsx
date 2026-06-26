import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import Loader from '../components/Loader'
import { careersAPI } from '../services/api'

export default function UpdateCareer() {
    const [params]   = useSearchParams()
    const navigate   = useNavigate()
    const careerId   = params.get('id')

    const [career,   setCareer]   = useState(null)
    const [loading,  setLoading]  = useState(true)
    const [saving,   setSaving]   = useState(false)
    const [error,    setError]    = useState('')
    const [toast,    setToast]    = useState('')
    const [toastErr, setToastErr] = useState(false)

    const [title,    setTitle]    = useState('')
    const [desc,     setDesc]     = useState('')
    const [summary,  setSummary]  = useState('')
    const [picture,  setPicture]  = useState(null)
    const [preview,  setPreview]  = useState(null)
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
                setSummary(c.summary || '')
                setPreview(c.pictureUrl || null)
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

    const handleSave = async () => {
        if (!title.trim()) { showToast('Title is required', true); return }
        setSaving(true)
        try {
            await careersAPI.update(careerId, {
                title,
                description: desc,
                summary,
                v: career?.v ?? 1,
            })
            if (picture) {
                const fd = new FormData()
                fd.append('attachment', picture)
                fd.append('v', (career?.v ?? 1) + 1)
                await careersAPI.updatePicture(careerId, fd)
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
    if (error)   return <AdminLayout><div style={{ color:'#e74c3c', padding:32 }}>{error}</div></AdminLayout>

    return (
        <AdminLayout>
            <style>{`
                .uc-card { background:#fff; border-radius:12px; border:1px solid #e8e8e8; padding:20px 22px; margin-bottom:14px; }
                .uc-label { display:block; font-size:13px; font-weight:600; color:#333; margin-bottom:7px; }
                .uc-input { width:100%; border:1.5px solid #e8e8e8; border-radius:10px; padding:10px 13px; font-size:14px; color:#1A1A1A; outline:none; transition:border .2s; box-sizing:border-box; font-family:inherit; }
                .uc-input:focus { border-color:#0B6BA0; }
                textarea.uc-input { resize:vertical; min-height:90px; }
                .uc-img-wrap { width:100%; height:180px; border-radius:10px; overflow:hidden; cursor:pointer; position:relative; border:1.5px dashed #e8e8e8; }
                .uc-img-wrap img { width:100%; height:100%; object-fit:cover; display:block; }
                .uc-img-overlay { position:absolute; inset:0; background:rgba(0,0,0,.35); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .2s; }
                .uc-img-wrap:hover .uc-img-overlay { opacity:1; }
                .uc-img-overlay span { color:#fff; font-size:13px; font-weight:700; background:rgba(0,0,0,.35); padding:8px 16px; border-radius:8px; }
                .uc-placeholder { width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:#bbb; font-size:32px; background:#fafafa; }
                .uc-footer { display:flex; gap:12px; margin-top:8px; }
                .uc-back-btn { padding:10px 24px; border:1.5px solid #e8e8e8; border-radius:10px; font-size:14px; font-weight:600; color:#666; background:#fff; cursor:pointer; font-family:inherit; }
                .uc-save-btn { padding:10px 28px; border:none; border-radius:10px; background:#0B6BA0; color:#fff; font-size:14px; font-weight:700; cursor:pointer; font-family:inherit; box-shadow:0 4px 14px rgba(11,107,160,.25); }
                .uc-save-btn:disabled { opacity:.6; cursor:not-allowed; }
            `}</style>

            {toast && (
                <div style={{ position:'fixed', top:24, left:'50%', transform:'translateX(-50%)', background: toastErr ? '#e74c3c' : '#27ae60', color:'#fff', padding:'11px 22px', borderRadius:10, fontSize:13, fontWeight:700, zIndex:9999, boxShadow:'0 4px 16px rgba(0,0,0,.15)' }}>
                    <i className={`bi ${toastErr ? 'bi-exclamation-circle-fill' : 'bi-check-circle-fill'} me-2`}></i>{toast}
                </div>
            )}

            <div style={{ marginBottom:16 }}>
                <button onClick={() => navigate(-1)} style={{ background:'none', border:'none', color:'#0B6BA0', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:5, fontFamily:'inherit' }}>
                    <i className="bi bi-arrow-left"></i>Back
                </button>
            </div>

            <h2 style={{ fontWeight:800, fontSize:20, color:'#1A1A1A', marginBottom:18 }}>Update Career Path</h2>

            <div className="uc-card">
                <label className="uc-label">Career Title *</label>
                <input className="uc-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Mobile Developer (Android)" />
            </div>

            <div className="uc-card">
                <label className="uc-label">Career Image</label>
                <div className="uc-img-wrap" onClick={() => fileRef.current?.click()}>
                    {preview
                        ? <img src={preview} alt="career" onError={e => { e.target.style.display='none' }} />
                        : <div className="uc-placeholder"><i className="bi bi-image"></i></div>
                    }
                    <div className="uc-img-overlay">
                        <span><i className="bi bi-cloud-upload me-1"></i>Upload Image</span>
                    </div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handlePicture} />
            </div>

            <div className="uc-card">
                <label className="uc-label">Description</label>
                <textarea className="uc-input" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Career description" />
            </div>

            <div className="uc-card">
                <label className="uc-label">Summary (for AI)</label>
                <textarea className="uc-input" value={summary} onChange={e => setSummary(e.target.value)} placeholder="Short summary for AI model" />
            </div>

            <div className="uc-footer">
                <button className="uc-back-btn" onClick={() => navigate(-1)}>Back</button>
                <button className="uc-save-btn" onClick={handleSave} disabled={saving}>
                    {saving ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</> : 'Save Changes'}
                </button>
            </div>
        </AdminLayout>
    )
}
