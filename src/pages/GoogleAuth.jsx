import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { authAPI } from '../services/api'
import { auth } from '../services/auth'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export default function GoogleAuth() {
    const navigate = useNavigate()
    const [loading,    setLoading]    = useState(false)
    const [error,      setError]      = useState('')
    const [gsiReady,   setGsiReady]   = useState(false)
    const btnRef = useRef(null)

    // Exchange the Google idToken with our backend.
    // Tries log-in first (existing account); if the backend reports the
    // account doesn't exist yet, falls back to sign-up automatically.
    const exchangeToken = async (idToken) => {
        setLoading(true)
        setError('')
        try {
            let res
            try {
                res = await authAPI.loginGmail(idToken)
            } catch (loginErr) {
                // Account not found yet → create it via sign-up-gmail, then we're done (no data entry needed)
                res = await authAPI.signUpGmail(idToken)
            }
            // Response: { success, message, body: { accessToken, user } }
            auth.login(res.body.accessToken, res.body.user)
            navigate('/dashboard')
        } catch (err) {
            setError(err.message || 'Google sign-in failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleCredentialResponse = (response) => {
        // response.credential is the Google ID token (JWT)
        exchangeToken(response.credential)
    }

    useEffect(() => {
        if (!GOOGLE_CLIENT_ID) {
            setError('Google sign-in is not configured.')
            return
        }

        const initGsi = () => {
            if (!window.google?.accounts?.id) return false
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback:  handleCredentialResponse,
            })
            if (btnRef.current) {
                window.google.accounts.id.renderButton(btnRef.current, {
                    type: 'standard',
                    theme: 'outline',
                    size: 'large',
                    width: 320,
                    text: 'continue_with',
                })
            }
            setGsiReady(true)
            return true
        }

        if (initGsi()) return

        // Script may still be loading (it's deferred in index.html) — poll briefly.
        const interval = setInterval(() => { if (initGsi()) clearInterval(interval) }, 200)
        const timeout = setTimeout(() => clearInterval(interval), 8000)
        return () => { clearInterval(interval); clearTimeout(timeout) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <AuthLayout>
            {loading && (
                <div className="loading-overlay" style={{ display: 'flex' }}>
                    <div className="spinner"></div>
                    <div className="loading-text">Signing you in with Google...</div>
                </div>
            )}

            <div className="auth-card">
                <div className="google-logo">
                    <svg width="32" height="32" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 19.001 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                    </svg>
                </div>
                <h1 className="auth-title">Sign in with Google</h1>
                <p className="auth-subtitle">to continue to TAMYEZ Admin</p>

                {error && (
                    <div style={{ background: 'rgba(231,76,60,.08)', border: '1px solid rgba(231,76,60,.25)', borderRadius: 10, padding: '10px 14px', margin: '16px 0', color: '#e74c3c', fontSize: 13, fontWeight: 600 }}>
                        <i className="bi bi-exclamation-circle me-2"></i>{error}
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                    {/* Google renders its own official button into this div */}
                    <div ref={btnRef}></div>
                    {!gsiReady && !error && (
                        <div style={{ color: '#999', fontSize: 13 }}>
                            <span className="spinner-border spinner-border-sm me-2"></span>Loading Google Sign-In...
                        </div>
                    )}
                </div>

                <a href="#" onClick={(e) => { e.preventDefault(); navigate(-1) }} className="back-link">
                    <i className="bi bi-arrow-left"></i> Go Back
                </a>
            </div>
        </AuthLayout>
    )
}
