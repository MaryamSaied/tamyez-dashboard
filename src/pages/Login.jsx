import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { authAPI } from '../services/api'
import { auth } from '../services/auth'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [emailError, setEmailError] = useState('')
    const [passError, setPassError] = useState('')
    const [apiError, setApiError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogin = async () => {
        let valid = true
        setEmailError(''); setPassError(''); setApiError('')

        if (!email.trim()) { setEmailError('Email is required.'); valid = false }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError('Enter a valid email.'); valid = false }
        if (!password.trim()) { setPassError('Password is required.'); valid = false }
        if (!valid) return

        setLoading(true)
        try {
            // POST admin/auth/log-in → { email, password }
            const res = await authAPI.adminLogin(email, password)
            // Response: { success, message, body: { accessToken, user } }
            auth.login(res.body.accessToken, res.body.user)
            const redirectTo = location.state?.from || '/dashboard'
            navigate(redirectTo)
        } catch (err) {
            setApiError(err.message || 'Login failed. Please check your credentials.')
        } finally {
            setLoading(false)
        }
    }
    const handleGoogleLogin = () => {
        window.location.href = "https://tamyez.mooo.com/api/v1/auth/google";
    };
    return (
        <AuthLayout>
            <div className="auth-card">
                <div className="auth-logo">
                    <img src="/images/logo.png" alt="TAMYEZ" onError={(e) => e.target.style.display = 'none'} />
                </div>
                <h1 className="auth-title">Welcome back to TAMYEZ</h1>
                <p className="auth-subtitle">Sign in to your admin account</p>

                {apiError && (
                    <div style={{ background: 'rgba(231,76,60,.08)', border: '1px solid rgba(231,76,60,.25)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, color: '#e74c3c', fontSize: 13, fontWeight: 600 }}>
                        <i className="bi bi-exclamation-circle me-2"></i>{apiError}
                    </div>
                )}

                <div className="mb-3">
                    <label className="form-label" htmlFor="adminEmail">Email or Username</label>
                    <input type="text" className="form-control" id="adminEmail"
                        placeholder="Enter your email or username"
                        value={email} onChange={(e) => setEmail(e.target.value)} />
                    {emailError && <div className="field-error" style={{ display: 'block' }}>{emailError}</div>}
                </div>

                <div className="mb-1">
                    <label className="form-label" htmlFor="adminPass">Password</label>
                    <div className="input-group">
                        <input type={showPass ? 'text' : 'password'} className="form-control" id="adminPass"
                            placeholder="Enter your password"
                            value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button className="btn-eye" type="button" onClick={() => setShowPass(!showPass)}>
                            <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </button>
                    </div>
                    {passError && <div className="field-error" style={{ display: 'block' }}>{passError}</div>}
                    <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
                </div>

                <Link to="/verify" className="resend-link">Resend verification email</Link>

                <button className="btn-auth" type="button" onClick={handleLogin} disabled={loading}>
                    {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Signing in...</> : 'Login'}
                </button>

                <div className="divider">Or continue with</div>
                <button className="btn-google" type="button" onClick={handleGoogleLogin}>
                    <svg width="18" height="18" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 19.001 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                    </svg>
                    Continue with Google
                </button>
            </div>
        </AuthLayout>
    )
}
