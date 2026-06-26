import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { authAPI } from '../services/api'

export default function Verify() {
    const navigate = useNavigate()
    const location = useLocation()
    const [email, setEmail]   = useState(location.state?.email || '')
    const [error, setError]   = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent]     = useState(false)

    const handle = async () => {
        setError('')
        if (!email.trim()) { setError('Email address is required.'); return }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email address.'); return }
        setLoading(true)
        try {
            // POST auth/resend-email-verification → { email }
            // Response: { success: true, message: "Email verification link has been resent" }
            await authAPI.resendEmailVerification(email)
            setSent(true)
            sessionStorage.setItem('verifyEmail', email)
            setTimeout(() => navigate('/otp-verification'), 2000)
        } catch (err) {
            setError(err.message || 'Failed to send verification email.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthLayout>
            <div className="auth-card" style={{ maxWidth: 420 }}>
                <div className="verify-icon-wrap"><i className="bi bi-envelope-check"></i></div>
                <h1 className="auth-title">Verify your email</h1>
                <p className="auth-subtitle">Enter your email to resend the verification link.</p>

                {sent && (
                    <div style={{ background: 'rgba(39,174,96,.10)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, color: '#27ae60', fontSize: 13, fontWeight: 600, textAlign: 'center' }}>
                        <i className="bi bi-check-circle-fill me-2"></i>Verification email sent! Redirecting...
                    </div>
                )}

                <div className="mb-3">
                    <input type="email" className="form-control" placeholder="Email address"
                        value={email} onChange={(e) => { setEmail(e.target.value); setError('') }} />
                    {error && <div className="field-error" style={{ display: 'block' }}>{error}</div>}
                </div>
                <button className="btn-auth" onClick={handle} disabled={loading || sent}>
                    {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Sending...</> : 'Continue'}
                </button>
                <Link to="/login" className="back-link"><i className="bi bi-arrow-left"></i> Back to Login</Link>
            </div>
        </AuthLayout>
    )
}
