import { Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'

export default function ResetSuccess() {
    return (
        <AuthLayout>
            <div className="auth-card" style={{ textAlign: 'center' }}>
                <div className="success-circle"><i className="bi bi-check-lg"></i></div>
                <h1 className="auth-title">Password Reset Successful</h1>
                <p className="auth-subtitle">Your password has been successfully reset. You can now log in.</p>
                <Link to="/login" className="btn-auth" style={{ display: 'block', marginTop: 8 }}>Return to Login</Link>
            </div>
        </AuthLayout>
    )
}
