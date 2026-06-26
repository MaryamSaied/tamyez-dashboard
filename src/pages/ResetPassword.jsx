import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { authAPI } from '../services/api'

export default function ResetPassword() {
    const navigate = useNavigate()
    const [form, setForm]     = useState({ password:'', confirmPassword:'' })
    const [show, setShow]     = useState({ p1:false, p2:false })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const up = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(er => ({ ...er, [k]:'' })) }

    const handle = async () => {
        const e = {}
        if (!form.password)               e.password = 'New password is required.'
        else if (form.password.length < 8) e.password = 'Minimum 8 characters.'
        if (!form.confirmPassword)         e.confirmPassword = 'Please confirm your password.'
        else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.'
        setErrors(e)
        if (Object.keys(e).length) return

        const email = sessionStorage.getItem('resetEmail') || ''
        setLoading(true)
        try {
            await authAPI.resetForgetPassword(email, form.password, form.confirmPassword)
            // Response: { success: true, message: "Password has been reset successfully" }
            sessionStorage.removeItem('resetEmail')
            navigate('/reset-success')
        } catch (err) {
            setErrors({ password: err.message || 'Failed to reset password.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthLayout>
            <div className="auth-card">
                <div className="auth-icon-wrap"><i className="bi bi-key"></i></div>
                <h1 className="auth-title">Reset Your Password</h1>
                <p className="auth-subtitle">Enter your new password below.</p>
                <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <div className="input-group">
                        <input type={show.p1 ? 'text' : 'password'} className="form-control" placeholder="Enter new password" value={form.password} onChange={up('password')} />
                        <button className="btn-eye" type="button" onClick={() => setShow(s=>({...s,p1:!s.p1}))}><i className={`bi ${show.p1?'bi-eye-slash':'bi-eye'}`}></i></button>
                    </div>
                    {errors.password && <div className="field-error" style={{ display:'block' }}>{errors.password}</div>}
                </div>
                <div className="mb-4">
                    <label className="form-label">Confirm Password</label>
                    <div className="input-group">
                        <input type={show.p2 ? 'text' : 'password'} className="form-control" placeholder="Confirm new password" value={form.confirmPassword} onChange={up('confirmPassword')} />
                        <button className="btn-eye" type="button" onClick={() => setShow(s=>({...s,p2:!s.p2}))}><i className={`bi ${show.p2?'bi-eye-slash':'bi-eye'}`}></i></button>
                    </div>
                    {errors.confirmPassword && <div className="field-error" style={{ display:'block' }}>{errors.confirmPassword}</div>}
                </div>
                <button className="btn-auth" onClick={handle} disabled={loading}>
                    {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Resetting...</> : 'Reset Password'}
                </button>
            </div>
        </AuthLayout>
    )
}
