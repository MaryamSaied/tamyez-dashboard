import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileLayout from '../components/ProfileLayout'
import { adminAPI } from '../services/api'

export default function AdminProfileSettings() {
    const [form,    setForm]    = useState({ current: '', newPass: '', confirm: '' })
    const [show,    setShow]    = useState({ current: false, newPass: false, confirm: false })
    const [errors,  setErrors]  = useState({})
    const [loading, setLoading] = useState(false)
    const [toast,   setToast]   = useState(false)
    const navigate = useNavigate()

    const setField = (key, value) => {
        setForm({ ...form, [key]: value })
        setErrors({ ...errors, [key]: '' })
    }

    const changePassword = async () => {
        const newErrors = {}
        if (!form.current.trim())  newErrors.current = 'Current password is required.'
        if (!form.newPass.trim())  newErrors.newPass  = 'New password is required.'
        else if (form.newPass.length < 8) newErrors.newPass = 'Minimum 8 characters.'
        if (!form.confirm.trim())  newErrors.confirm  = 'Please confirm your password.'
        else if (form.newPass && form.newPass !== form.confirm) newErrors.confirm = 'Passwords do not match.'

        setErrors(newErrors)
        if (Object.keys(newErrors).length) return

        setLoading(true)
        try {
            await adminAPI.changePassword(form.current, form.newPass)
            setToast(true)
            setForm({ current: '', newPass: '', confirm: '' })
            setTimeout(() => { setToast(false); navigate('/admin-profile') }, 1800)
        } catch (err) {
            setErrors({ current: err.message || 'Failed to change password. Check your current password.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <ProfileLayout>
            {toast && (
                <div style={{ position:'fixed', top:24, left:'50%', transform:'translateX(-50%)',
                    background:'#27ae60', color:'#fff', padding:'14px 28px', borderRadius:12,
                    fontSize:15, fontWeight:700, zIndex:9999, boxShadow:'0 8px 24px rgba(39,174,96,.30)',
                    fontFamily:'Inter,sans-serif', textAlign:'center', minWidth:260 }}>
                    <i className="bi bi-check-circle-fill me-2"></i>Password changed successfully ✓
                </div>
            )}

            <h2 style={{ fontWeight:800, fontSize:20, color:'#1A1A1A', marginBottom:24, letterSpacing:'-.3px' }}>
                Change Password
            </h2>

            <div className="pf-reset-card">
                {['current','newPass','confirm'].map((key) => (
                    <div key={key}>
                        <div className="pf-form-group pf-input-group">
                            <input
                                type={show[key] ? 'text' : 'password'}
                                className={`pf-form-input ${errors[key] ? 'is-invalid' : ''}`}
                                placeholder={key === 'current' ? 'Current password' : key === 'newPass' ? 'New password' : 'Confirm password'}
                                value={form[key]}
                                onChange={(e) => setField(key, e.target.value)}
                            />
                            <button className="pf-eye-btn" type="button"
                                onClick={() => setShow({ ...show, [key]: !show[key] })}>
                                <i className={`bi ${show[key] ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                            </button>
                        </div>
                        {errors[key] && <div className="field-error" style={{ display:'block', marginBottom:8 }}>{errors[key]}</div>}
                    </div>
                ))}

                <button className="pf-btn-update" style={{ width:'100%', marginTop:8 }}
                    onClick={changePassword} disabled={loading}>
                    {loading ? 'Changing...' : 'Change Password'}
                </button>
            </div>
        </ProfileLayout>
    )
}
