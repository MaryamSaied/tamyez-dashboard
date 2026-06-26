import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileLayout from '../components/ProfileLayout'

export default function AdminProfileEdit() {
    const [form, setForm] = useState({
        firstName: 'Alex',
        lastName: 'Harper',
        email: 'alex.harper@tamyez.com',
        phone: '+20 100 000 0000',
        gender: 'male',
    })
    const [errors, setErrors] = useState({})
    const [avatarSrc, setAvatarSrc] = useState('/images/profile.png')
    const fileInputRef = useRef(null)
    const navigate = useNavigate()

    const setField = (key, value) => {
        setForm({ ...form, [key]: value })
        setErrors({ ...errors, [key]: '' })
    }

    const previewAvatar = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (ev) => setAvatarSrc(ev.target.result)
        reader.readAsDataURL(file)
    }

    const updateProfile = () => {
        const newErrors = {}
        if (!form.firstName.trim()) newErrors.firstName = 'This field is required.'
        if (!form.lastName.trim()) newErrors.lastName = 'This field is required.'
        if (!form.email.trim()) newErrors.email = 'This field is required.'
        if (!form.phone.trim()) newErrors.phone = 'This field is required.'

        setErrors(newErrors)
        if (Object.keys(newErrors).length) return

        navigate('/admin-profile')
    }

    return (
        <ProfileLayout>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div className="pf-avatar-edit">
                    <img src={avatarSrc} className="pf-edit-avatar" alt="Profile" />
                    <label className="pf-avatar-btn" onClick={() => fileInputRef.current?.click()}>
                        <i className="bi bi-camera-fill"></i>
                    </label>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={previewAvatar}
                    />
                </div>
                <div className="pf-edit-name">{form.firstName} {form.lastName}</div>
                <div className="pf-edit-date">Joined 2022</div>
            </div>

            <div className="pf-form-group">
                <input
                    type="text"
                    className={`pf-form-input ${errors.firstName ? 'is-invalid' : ''}`}
                    placeholder="First name"
                    value={form.firstName}
                    onChange={(e) => setField('firstName', e.target.value)}
                />
            </div>
            {errors.firstName && <div className="field-error" style={{ display: 'block' }}>{errors.firstName}</div>}

            <div className="pf-form-group">
                <input
                    type="text"
                    className={`pf-form-input ${errors.lastName ? 'is-invalid' : ''}`}
                    placeholder="Last name"
                    value={form.lastName}
                    onChange={(e) => setField('lastName', e.target.value)}
                />
            </div>
            {errors.lastName && <div className="field-error" style={{ display: 'block' }}>{errors.lastName}</div>}

            <div className="pf-form-group">
                <input
                    type="email"
                    className={`pf-form-input ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setField('email', e.target.value)}
                />
            </div>
            {errors.email && <div className="field-error" style={{ display: 'block' }}>{errors.email}</div>}

            <div className="pf-form-group">
                <input
                    type="tel"
                    className={`pf-form-input ${errors.phone ? 'is-invalid' : ''}`}
                    placeholder="Phone number"
                    value={form.phone}
                    onChange={(e) => setField('phone', e.target.value)}
                />
            </div>
            {errors.phone && <div className="field-error" style={{ display: 'block' }}>{errors.phone}</div>}

            <div className="pf-gender-row">
                <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', marginRight: 12 }}>Gender</span>
                <div className="pf-gender-opt">
                    <input
                        type="radio"
                        name="gender"
                        id="gFemale"
                        value="female"
                        checked={form.gender === 'female'}
                        onChange={() => setField('gender', 'female')}
                    />
                    <label htmlFor="gFemale">Female</label>
                </div>
                <div className="pf-gender-opt">
                    <input
                        type="radio"
                        name="gender"
                        id="gMale"
                        value="male"
                        checked={form.gender === 'male'}
                        onChange={() => setField('gender', 'male')}
                    />
                    <label htmlFor="gMale">Male</label>
                </div>
            </div>

            <button className="pf-btn-update" onClick={updateProfile}>Update</button>
        </ProfileLayout>
    )
}
