import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../services/auth'

export default function NotFound() {
    const navigate = useNavigate()
    const isLoggedIn = auth.isAuthenticated()

    return (
        <>
            <style>{`
                body { background: #f7f9fc; margin: 0; font-family: 'Inter', sans-serif; }
                .nf-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
                .nf-card { background: #fff; border-radius: 20px; padding: 56px 48px; max-width: 480px; width: 100%; text-align: center; box-shadow: 0 8px 32px rgba(0,0,0,0.06); border: 1px solid #f0f0f0; }
                .nf-logo { width: 72px; margin: 0 auto 22px; display: block; }
                .nf-code { font-weight: 800; font-size: 80px; color: #0B6BA0; line-height: 1; letter-spacing: -3px; margin-bottom: 8px; }
                .nf-title { font-weight: 800; font-size: 22px; color: #1A1A1A; margin-bottom: 10px; }
                .nf-desc { font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 28px; }
                .nf-btns { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
                .nf-btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 22px; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; text-decoration: none; font-family: 'Inter', sans-serif; border: none; transition: all 0.2s; }
                .nf-btn-primary { background: #0B6BA0; color: #fff; box-shadow: 0 4px 14px rgba(11,107,160,0.25); }
                .nf-btn-primary:hover { background: #0d83c4; }
                .nf-btn-ghost { background: #fff; color: #666; border: 1.5px solid #e8e8e8; }
                .nf-btn-ghost:hover { border-color: #0B6BA0; color: #0B6BA0; }
            `}</style>
            <div className="nf-wrap">
                <div className="nf-card">
                    <img src="/images/logo.png" className="nf-logo" alt="TAMYEZ" onError={(e) => e.target.style.display = 'none'} />
                    <div className="nf-code">404</div>
                    <h1 className="nf-title">Page Not Found</h1>
                    <p className="nf-desc">
                        The page you're looking for doesn't exist or has been moved.
                        Let's get you back on track.
                    </p>
                    <div className="nf-btns">
                        <button className="nf-btn nf-btn-ghost" onClick={() => navigate(-1)}>
                            <i className="bi bi-arrow-left"></i> Go Back
                        </button>
                        <Link to={isLoggedIn ? '/dashboard' : '/'} className="nf-btn nf-btn-primary">
                            <i className="bi bi-house"></i> {isLoggedIn ? 'Dashboard' : 'Login'}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
