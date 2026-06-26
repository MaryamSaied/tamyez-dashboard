import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { careersAPI } from '../services/api'

export default function AddCareer() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ title: '', description: '', summary: '' })
    const [picture, setPicture] = useState(null)
    const [preview, setPreview] = useState(null)
    const [errors,  setErrors]  = useState({})
    const [loading, setLoading] = useState(false)
    const [toast,   setToast]   = useState('')

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setErrors({ ...errors, [e.target.name]: '' })
    }

    const handlePicture = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setPicture(file)
        setPreview(URL.createObjectURL(file))
    }

    const validate = () => {
        const e = {}
        if (!form.title.trim())       e.title       = 'Career title is required'
        if (!form.description.trim()) e.description = 'Description is required'
        if (!form.summary.trim())     e.summary     = 'Summary is required'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleSubmit = async () => {
        if (!validate()) return
        setLoading(true)
        try {
            const res = await careersAPI.create({
                title:            form.title,
                description:      form.description,
                summary:          form.summary,
                youtubePlaylists: [],
            })
            const careerId = res.body?.career?.id || res.body?.id || res.body?._id
            if (picture && careerId) {
                const fd = new FormData()
                fd.append('attachment', picture)
                fd.append('v', '1')
                await careersAPI.updatePicture(careerId, fd)
            }
            setToast('Career created successfully!')
            setTimeout(() => navigate('/careers'), 1200)
        } catch (err) {
            alert(err.message || 'Failed to create career')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AdminLayout>
            <style>{`
                .ac-wrap { max-width: 680px; padding: 8px 0 32px; }
                .ac-title { font-size: 24px; font-weight: 700; color: #1A1A1A; margin-bottom: 28px; }

                .ac-pic-section { margin-bottom: 28px; }
                .ac-pic-label { font-size: 13px; font-weight: 600; color: #333; margin-bottom: 10px; display: block; }
                .ac-pic-row { display: flex; align-items: center; gap: 20px; }
                .ac-pic-preview {
                    width: 80px; height: 80px; border-radius: 10px; object-fit: cover;
                    background: #e8f4f0; border: none; display: flex; align-items: center;
                    justify-content: center; overflow: hidden; flex-shrink: 0;
                }
                .ac-pic-preview img { width: 100%; height: 100%; object-fit: cover; border-radius: 10px; }
                .ac-upload-btn {
                    display: inline-flex; align-items: center; gap: 6px;
                    padding: 9px 18px; border: 1.5px solid #0B6BA0; color: #0B6BA0;
                    border-radius: 8px; background: #fff; font-size: 13px; font-weight: 600;
                    cursor: pointer; transition: background .15s;
                }
                .ac-upload-btn:hover { background: #f0f7fc; }
                .ac-upload-hint { font-size: 12px; color: #999; margin-top: 5px; }

                .ac-field { margin-bottom: 20px; }
                .ac-label { font-size: 13px; font-weight: 600; color: #333; display: block; margin-bottom: 7px; }
                .ac-input {
                    width: 100%; padding: 11px 14px; border: 1.5px solid #e0e0e0;
                    border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box;
                    transition: border .2s; background: #fff; color: #1a1a1a;
                }
                .ac-input:focus { border-color: #0B6BA0; }
                .ac-input.err { border-color: #e74c3c; }
                .ac-textarea { resize: vertical; min-height: 100px; font-family: inherit; }
                .ac-err { color: #e74c3c; font-size: 12px; margin-top: 4px; }

                .ac-actions { display: flex; gap: 12px; margin-top: 28px; }
                .ac-btn-cancel {
                    padding: 11px 28px; border: 1.5px solid #ddd; color: #555;
                    background: #fff; border-radius: 8px; font-size: 14px; font-weight: 600;
                    cursor: pointer; transition: background .15s;
                }
                .ac-btn-cancel:hover { background: #f5f5f5; }
                .ac-btn-submit {
                    padding: 11px 32px; background: #0B6BA0; color: #fff; border: none;
                    border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;
                    transition: background .15s;
                }
                .ac-btn-submit:hover:not(:disabled) { background: #095a87; }
                .ac-btn-submit:disabled { opacity: .6; cursor: not-allowed; }
            `}</style>

            {toast && (
                <div style={{
                    position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)',
                    background: '#27ae60', color: '#fff', padding: '12px 24px',
                    borderRadius: 10, fontSize: 13, fontWeight: 700, zIndex: 9999,
                    boxShadow: '0 4px 16px rgba(0,0,0,.15)'
                }}>
                    <i className="bi bi-check-circle-fill me-2"></i>{toast}
                </div>
            )}

            <div className="ac-wrap">
                <div className="ac-title">Add New Career Path</div>

                {/* Career Picture */}
                <div className="ac-pic-section">
                    <label className="ac-pic-label">Career Picture</label>
                    <div className="ac-pic-row">
                        <div className="ac-pic-preview">
                            {preview
                                ? <img src={preview} alt="preview" />
                                : <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#aaa', gap: 4 }}>
                                    <i className="bi bi-image" style={{ fontSize: 28 }}></i>
                                    <span style={{ fontSize: 10 }}>No image</span>
                                  </div>
                            }
                        </div>
                        <div>
                            <input type="file" id="career-pic" accept="image/jpeg,image/png,image/webp"
                                style={{ display: 'none' }} onChange={handlePicture} />
                            <label htmlFor="career-pic" className="ac-upload-btn">
                                <i className="bi bi-upload"></i>Upload Picture
                            </label>
                            <div className="ac-upload-hint">JPG, PNG or WEBP</div>
                        </div>
                    </div>
                </div>

                {/* Career Title */}
                <div className="ac-field">
                    <label className="ac-label">Career Title *</label>
                    <input
                        className={`ac-input ${errors.title ? 'err' : ''}`}
                        name="title"
                        placeholder="e.g. Mobile Developer (Android)"
                        value={form.title}
                        onChange={handleChange}
                    />
                    {errors.title && <div className="ac-err"><i className="bi bi-exclamation-circle me-1"></i>{errors.title}</div>}
                </div>

                {/* Description */}
                <div className="ac-field">
                    <label className="ac-label">Description *</label>
                    <textarea
                        className={`ac-input ac-textarea ${errors.description ? 'err' : ''}`}
                        name="description"
                        placeholder="Career description"
                        value={form.description}
                        onChange={handleChange}
                    />
                    {errors.description && <div className="ac-err"><i className="bi bi-exclamation-circle me-1"></i>{errors.description}</div>}
                </div>

                {/* Summary */}
                <div className="ac-field">
                    <label className="ac-label">Summary (for AI) *</label>
                    <textarea
                        className={`ac-input ac-textarea ${errors.summary ? 'err' : ''}`}
                        name="summary"
                        placeholder="Short summary for AI model"
                        value={form.summary}
                        onChange={handleChange}
                    />
                    {errors.summary && <div className="ac-err"><i className="bi bi-exclamation-circle me-1"></i>{errors.summary}</div>}
                </div>

                {/* Actions */}
                <div className="ac-actions">
                    <button className="ac-btn-cancel" onClick={() => navigate('/careers')}>Cancel</button>
                    <button className="ac-btn-submit" onClick={handleSubmit} disabled={loading}>
                        {loading
                            ? <><i className="bi bi-hourglass-split me-1"></i>Creating...</>
                            : 'Create Career'
                        }
                    </button>
                </div>
            </div>
        </AdminLayout>
    )
}
