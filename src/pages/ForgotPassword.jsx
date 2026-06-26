import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { authAPI } from '../services/api'

export default function ForgotPassword() {
    const navigate = useNavigate()
    const [email, setEmail]   = useState('')
    const [error, setError]   = useState('')
    const [loading, setLoading] = useState(false)

    const handle = async () => {
        setError('')
        if (!email.trim()) { setError('Email is required.'); return }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email.'); return }
        setLoading(true)
        try {
            await authAPI.forgetPassword(email)
            // Response: { success: true, message: "OTP has been sent to your email" }
            sessionStorage.setItem('resetEmail', email)
            navigate('/otp-verification')
        } catch (err) {
            setError(err.message || 'Something went wrong.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthLayout>
            <div className="auth-card">
                <div className="auth-icon-wrap"><i className="bi bi-lock"></i></div>
                <h1 className="auth-title">Forgot Password</h1>
                <p className="auth-subtitle">Enter your email and we'll send you an OTP code.</p>
                <div className="mb-4">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" placeholder="Enter your email address"
                        value={email} onChange={(e) => { setEmail(e.target.value); setError('') }} />
                    {error && <div className="field-error" style={{ display: 'block' }}>{error}</div>}
                </div>
                <button className="btn-auth" onClick={handle} disabled={loading}>
                    {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Sending...</> : 'Continue'}
                </button>
                <Link to="/login" className="back-link"><i className="bi bi-arrow-left"></i> Back to Login</Link>
            </div>
        </AuthLayout>
    )
}
