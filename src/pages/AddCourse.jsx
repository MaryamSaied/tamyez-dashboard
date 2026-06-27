import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'

export default function AddCourse() {
    const [params] = useSearchParams()
    const navigate = useNavigate()
    const careerName = params.get('career') || 'Data Science'

    const [form, setForm] = useState({
        title: '',
        desc: '',
        pricing: 'Free',
        applies: 'All',
        specSteps: '',
        duration: '',
        url: '',
        lang: 'English',
    })
    const [titleError, setTitleError] = useState('')
    const [tempCourses, setTempCourses] = useState([])

    const setField = (key, value) => setForm({ ...form, [key]: value })

    const validate = () => {
        if (!form.title.trim()) {
            setTitleError('Course title is required.')
            return false
        }
        setTitleError('')
        return true
    }

    const submit = () => {
        if (!validate()) return

        const newCourse = {
            title: form.title,
            url: form.url,
            pricingType: form.pricing,
            appliesTo: form.applies,
            language: form.lang === 'Arabic' ? 'ar' : 'en',
        }

        navigate(-1, {
            state: { newCourse }
        })
    }

    const addAnother = () => {
        if (!validate()) return

        const newCourse = {
            title: form.title,
            url: form.url,
            pricingType: form.pricing,
            appliesTo: form.applies,
            language: form.lang === 'Arabic' ? 'ar' : 'en',
        }

        // نخزن في local array مؤقت
        setTempCourses(prev => [...prev, newCourse])

        setForm({
            title: '',
            desc: '',
            pricing: 'Free',
            applies: 'All',
            specSteps: '',
            duration: '',
            url: '',
            lang: 'English',
        })
    }

    return (
        <AdminLayout>
            <div style={{ marginBottom: 22 }}>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate(-1) }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#666', textDecoration: 'none', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                    <i className="bi bi-arrow-left"></i> Back
                </a>
                <h2 style={{ fontWeight: 800, fontSize: 20, color: '#1A1A1A', letterSpacing: '-.3px' }}>Add New Course</h2>
            </div>

            <div style={{ maxWidth: 560 }}>
                <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8e8e8', padding: '24px 26px' }}>

                    <div className="adm-form-group">
                        <label className="adm-form-label">Course Title</label>
                        <input
                            type="text"
                            className="adm-form-input"
                            placeholder="Enter course title"
                            value={form.title}
                            onChange={(e) => { setField('title', e.target.value); setTitleError('') }}
                            style={titleError ? { borderColor: '#e74c3c' } : {}}
                        />
                        {titleError && (
                            <div className="field-error" style={{ display: 'block', color: '#e74c3c', fontSize: 12 }}>{titleError}</div>
                        )}
                    </div>

                    <div className="adm-form-group">
                        <label className="adm-form-label">Course Description</label>
                        <textarea
                            className="adm-form-input"
                            rows="3"
                            placeholder="Enter course description"
                            style={{ resize: 'vertical', minHeight: 80 }}
                            value={form.desc}
                            onChange={(e) => setField('desc', e.target.value)}
                        />
                    </div>

                    <div className="adm-form-group">
                        <label className="adm-form-label">Pricing type</label>
                        <div style={{ display: 'flex', gap: 20, marginTop: 6 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, cursor: 'pointer' }}>
                                <input type="radio" name="pricing" value="Free" checked={form.pricing === 'Free'} onChange={(e) => setField('pricing', e.target.value)} /> Free
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, cursor: 'pointer' }}>
                                <input type="radio" name="pricing" value="Paid" checked={form.pricing === 'Paid'} onChange={(e) => setField('pricing', e.target.value)} /> Paid
                            </label>
                        </div>
                    </div>

                    <div className="adm-form-group">
                        <label className="adm-form-label">Applies to</label>
                        <div style={{ display: 'flex', gap: 20, marginTop: 6 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, cursor: 'pointer' }}>
                                <input type="radio" name="applies" value="All" checked={form.applies === 'All'} onChange={(e) => setField('applies', e.target.value)} /> All
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, cursor: 'pointer' }}>
                                <input type="radio" name="applies" value="Specific" checked={form.applies === 'Specific'} onChange={(e) => setField('applies', e.target.value)} /> Specific
                            </label>
                        </div>
                    </div>

                    {form.applies === 'Specific' && (
                        <div className="adm-form-group">
                            <label className="adm-form-label">Specified Steps</label>
                            <input
                                type="text"
                                className="adm-form-input"
                                placeholder="Enter specified steps"
                                value={form.specSteps}
                                onChange={(e) => setField('specSteps', e.target.value)}
                            />
                        </div>
                    )}

                    <div className="adm-form-group">
                        <label className="adm-form-label">Course Duration (hours)</label>
                        <input
                            type="number"
                            className="adm-form-input"
                            placeholder="e.g., 10"
                            value={form.duration}
                            onChange={(e) => setField('duration', e.target.value)}
                        />
                    </div>

                    <div className="adm-form-group">
                        <label className="adm-form-label">Course URL</label>
                        <input
                            type="url"
                            className="adm-form-input"
                            placeholder="Enter the course URL"
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
                            <i className="bi bi-plus-lg me-1"></i> Add Another Course
                        </button>
                        <button
                            onClick={submit}
                            style={{ flex: 1, padding: 12, background: '#0B6BA0', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 12px rgba(11,107,160,.25)' }}
                        >
                            Add Course
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
