import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { authAPI } from '../services/api'

export default function OtpVerification() {
    const navigate = useNavigate()
    const [digits, setDigits]   = useState(['','','','','',''])
    const [error, setError]     = useState('')
    const [loading, setLoading] = useState(false)
    const r = [useRef(),useRef(),useRef(),useRef(),useRef(),useRef()]

    const [resendLoading, setResendLoading] = useState(false)
    const [resendError,   setResendError]   = useState('')
    const [cooldown,      setCooldown]      = useState(0) // seconds left before resend is allowed again

    useEffect(() => {
        if (cooldown <= 0) return
        const t = setInterval(() => setCooldown((c) => (c > 0 ? c - 1 : 0)), 1000)
        return () => clearInterval(t)
    }, [cooldown])

    const onChange = (i, v) => {
        if (!/^\d?$/.test(v)) return
        const d = [...digits]; d[i] = v; setDigits(d); setError('')
        if (v && i < 5) r[i+1].current?.focus()
    }
    const onKey = (i, e) => { if (e.key === 'Backspace' && !digits[i] && i > 0) r[i-1].current?.focus() }

    const verify = async () => {
        const otp   = digits.join('')
        const email = sessionStorage.getItem('resetEmail') || ''
        if (otp.length < 6) { setError('Please enter all 6 digits.'); return }
        setLoading(true)
        try {
            await authAPI.verifyForgetPassword(email, otp)
            // Response: { success: true, message: "OTP verified successfully" }
            navigate('/reset-password')
        } catch (err) {
            setError(err.message || 'Invalid OTP. Please try again.')
            setDigits(['','','','','',''])
            r[0].current?.focus()
        } finally {
            setLoading(false)
        }
    }

    const resend = async () => {
        const email = sessionStorage.getItem('resetEmail') || ''
        if (!email || cooldown > 0 || resendLoading) return
        setResendLoading(true)
        setResendError('')
        try {
            await authAPI.forgetPassword(email)
            setDigits(['','','','','','']); setError('')
            r[0].current?.focus()
            setCooldown(30)
        } catch (err) {
            setResendError(err.message || 'Failed to resend code. Please try again.')
        } finally {
            setResendLoading(false)
        }
    }

    return (
        <AuthLayout>
            <div className="auth-card">
                <div className="auth-icon-wrap"><i className="bi bi-shield-lock"></i></div>
                <h1 className="auth-title">Email Verification</h1>
                <p className="auth-subtitle">Enter the 6-digit OTP sent to your email.</p>
                <div className="otp-wrapper">
                    {digits.map((d,i) => (
                        <input key={i} ref={r[i]} className={`otp-input${error ? ' error' : ''}`}
                            type="text" maxLength={1} inputMode="numeric" value={d}
                            onChange={e => onChange(i, e.target.value)}
                            onKeyDown={e => onKey(i, e)} />
                    ))}
                </div>
                {error && <div style={{ color:'#e74c3c', fontSize:13, fontWeight:600, textAlign:'center', marginBottom:12 }}>{error}</div>}
                <button className="btn-auth" onClick={verify} disabled={loading}>
                    {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Verifying...</> : 'Verify Code'}
                </button>

                {resendError && (
                    <div style={{ color:'#e74c3c', fontSize:12, fontWeight:600, textAlign:'center', marginTop:10 }}>
                        <i className="bi bi-exclamation-circle me-1"></i>{resendError}
                    </div>
                )}

                <p style={{ textAlign:'center', fontSize:13, color:'#666', marginTop:14 }}>
                    Didn't receive the code?{' '}
                    {resendLoading ? (
                        <span style={{ color:'#999', fontWeight:600 }}>
                            <span className="spinner-border spinner-border-sm me-1" style={{ width:12, height:12 }}></span>
                            Sending...
                        </span>
                    ) : cooldown > 0 ? (
                        <span style={{ color:'#999', fontWeight:600 }}>Resend in {cooldown}s</span>
                    ) : (
                        <button style={{ background:'none', border:'none', color:'#0B6BA0', fontWeight:700, cursor:'pointer', fontSize:13, fontFamily:'inherit' }} onClick={resend}>
                            Resend
                        </button>
                    )}
                </p>
                <Link to="/forgot-password" className="back-link"><i className="bi bi-arrow-left"></i> Back</Link>
            </div>
        </AuthLayout>
    )
}
