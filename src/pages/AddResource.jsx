import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'

export default function AddResource() {
    const [params] = useSearchParams()
    const navigate = useNavigate()
    const careerName = params.get('career') || 'Data Science'

    const [form, setForm] = useState({ title: '', url: '', desc: '' })
    const [errors, setErrors] = useState({})

    const setField = (key, value) => {
        setForm({ ...form, [key]: value })
        setErrors({ ...errors, [key]: '' })
    }

    const validate = () => {
        const newErrors = {}
        if (!form.title.trim()) newErrors.title = 'Title is required.'
        if (!form.url.trim()) newErrors.url = 'YouTube URL is required.'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const submit = () => {
        if (!validate()) return
        navigate(`/update-career?name=${encodeURIComponent(careerName)}`)
    }

    const addAnother = () => {
        if (!form.title.trim()) {
            setErrors({ title: 'Title is required.' })
            return
        }
        setForm({ title: '', url: '', desc: '' })
        setErrors({})
    }

    return (
        <AdminLayout>
            <div style={{ marginBottom: 22 }}>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate(-1) }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#666', textDecoration: 'none', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                    <i className="bi bi-arrow-left"></i> Back
                </a>
                <h2 style={{ fontWeight: 800, fontSize: 20, color: '#1A1A1A', letterSpacing: '-.3px' }}>Add YouTube Resource</h2>
            </div>

            <div style={{ maxWidth: 560 }}>
                <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8e8e8', padding: '24px 26px' }}>
                    <div className="adm-form-group">
                        <label className="adm-form-label">Resource Title</label>
                        <input
                            type="text"
                            className="adm-form-input"
                            placeholder="Enter resource title"
                            value={form.title}
                            onChange={(e) => setField('title', e.target.value)}
                            style={errors.title ? { borderColor: '#e74c3c' } : {}}
                        />
                        {errors.title && (
                            <div className="field-error" style={{ display: 'block', color: '#e74c3c', fontSize: 12 }}>{errors.title}</div>
                        )}
                    </div>

                    <div className="adm-form-group">
                        <label className="adm-form-label">YouTube URL</label>
                        <input
                            type="url"
                            className="adm-form-input"
                            placeholder="https://youtube.com/watch?v=..."
                            value={form.url}
                            onChange={(e) => setField('url', e.target.value)}
                            style={errors.url ? { borderColor: '#e74c3c' } : {}}
                        />
                        {errors.url && (
                            <div className="field-error" style={{ display: 'block', color: '#e74c3c', fontSize: 12 }}>{errors.url}</div>
                        )}
                    </div>

                    <div className="adm-form-group">
                        <label className="adm-form-label">Description</label>
                        <textarea
                            className="adm-form-input"
                            rows="3"
                            placeholder="Brief description"
                            style={{ resize: 'vertical', minHeight: 80 }}
                            value={form.desc}
                            onChange={(e) => setField('desc', e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                        <button
                            onClick={addAnother}
                            style={{ flex: 1, padding: 12, border: '1.5px solid #0B6BA0', color: '#0B6BA0', background: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                        >
                            <i className="bi bi-plus-lg me-1"></i> Add Another Resource
                        </button>
                        <button
                            onClick={submit}
                            style={{ flex: 1, padding: 12, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                        >
                            <i className="bi bi-youtube me-1"></i> Add Resource
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
