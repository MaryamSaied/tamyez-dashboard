import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'

export default function AddBook() {
    const [params] = useSearchParams()
    const navigate = useNavigate()
    const careerName = params.get('career') || 'Data Science'

    const [form, setForm] = useState({ title: '', desc: '', url: '', lang: 'English' })
    const [titleError, setTitleError] = useState('')

    const setField = (key, value) => setForm({ ...form, [key]: value })

    const validate = () => {
        if (!form.title.trim()) {
            setTitleError('Book title is required.')
            return false
        }
        setTitleError('')
        return true
    }

    const submit = () => {
        if (!validate()) return
        navigate(`/update-career?name=${encodeURIComponent(careerName)}`)
    }

    const addAnother = () => {
        if (!validate()) return
        setForm({ ...form, title: '', desc: '', url: '' })
    }

    return (
        <AdminLayout>
            <div style={{ marginBottom: 22 }}>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate(-1) }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#666', textDecoration: 'none', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                    <i className="bi bi-arrow-left"></i> Back
                </a>
                <h2 style={{ fontWeight: 800, fontSize: 20, color: '#1A1A1A', letterSpacing: '-.3px' }}>Add New Book</h2>
            </div>

            <div style={{ maxWidth: 560 }}>
                <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8e8e8', padding: '24px 26px' }}>
                    <div className="adm-form-group">
                        <label className="adm-form-label">Book Title</label>
                        <input
                            type="text"
                            className="adm-form-input"
                            placeholder="Enter book title"
                            value={form.title}
                            onChange={(e) => { setField('title', e.target.value); setTitleError('') }}
                            style={titleError ? { borderColor: '#e74c3c' } : {}}
                        />
                        {titleError && (
                            <div className="field-error" style={{ display: 'block', color: '#e74c3c', fontSize: 12 }}>{titleError}</div>
                        )}
                    </div>

                    <div className="adm-form-group">
                        <label className="adm-form-label">Book Description</label>
                        <textarea
                            className="adm-form-input"
                            rows="3"
                            placeholder="Brief description"
                            style={{ resize: 'vertical', minHeight: 80 }}
                            value={form.desc}
                            onChange={(e) => setField('desc', e.target.value)}
                        />
                    </div>

                    <div className="adm-form-group">
                        <label className="adm-form-label">Book URL / ISBN</label>
                        <input
                            type="text"
                            className="adm-form-input"
                            placeholder="Enter URL or ISBN"
                            value={form.url}
                            onChange={(e) => setField('url', e.target.value)}
                        />
                    </div>

                    <div className="adm-form-group">
                        <label className="adm-form-label">Language</label>
                        <div style={{ display: 'flex', gap: 20, marginTop: 6 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, cursor: 'pointer' }}>
                                <input type="radio" name="lang" value="Arabic" checked={form.lang === 'Arabic'} onChange={(e) => setField('lang', e.target.value)} /> Arabic
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, cursor: 'pointer' }}>
                                <input type="radio" name="lang" value="English" checked={form.lang === 'English'} onChange={(e) => setField('lang', e.target.value)} /> English
                            </label>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                        <button
                            onClick={addAnother}
                            style={{ flex: 1, padding: 12, border: '1.5px solid #0B6BA0', color: '#0B6BA0', background: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                        >
                            <i className="bi bi-plus-lg me-1"></i> Add Another Book
                        </button>
                        <button
                            onClick={submit}
                            style={{ flex: 1, padding: 12, background: '#0B6BA0', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                        >
                            Add Book
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
