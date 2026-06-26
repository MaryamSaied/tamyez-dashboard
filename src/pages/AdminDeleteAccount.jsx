import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProfileLayout from '../components/ProfileLayout'
import { auth } from '../services/auth'

export default function AdminDeleteAccount() {
    const [confirmType, setConfirmType] = useState(null)
    const navigate = useNavigate()

    const confirmConfig = {
        freeze: {
            title: 'Freeze Account?',
            desc: 'Your account will be paused. You can reactivate it anytime by logging back in.',
            btnText: 'Freeze Account',
            btnColor: '#f39c12',
        },
        delete: {
            title: 'Delete Account?',
            desc: 'This will permanently delete your account and all your data. This action cannot be undone.',
            btnText: 'Delete Account',
            btnColor: '#e74c3c',
        },
    }

    const handleConfirm = () => {
        setConfirmType(null)
        auth.logout()
        navigate('/')
    }

    const cfg = confirmType ? confirmConfig[confirmType] : null

    return (
        <ProfileLayout>
            <Link
                to="/admin-profile"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#666', textDecoration: 'none', fontSize: 14, fontWeight: 500, marginBottom: 24, transition: 'color .2s' }}
            >
                <i className="bi bi-arrow-left"></i> Back to Profile
            </Link>

            <h2 style={{ fontWeight: 800, fontSize: 22, color: '#1A1A1A', marginBottom: 8, letterSpacing: '-.3px' }}>
                Account Options
            </h2>
            <p style={{ fontSize: 14, color: '#666', marginBottom: 32 }}>
                Choose what you'd like to do with your account.
            </p>

            {/* Freeze option */}
            <div
                style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1.5px solid #f0f0f0', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 20, cursor: 'pointer', transition: 'all .2s' }}
                onClick={() => setConfirmType('freeze')}
            >
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(243,156,18,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                    <i className="bi bi-pause-circle" style={{ color: '#f39c12' }}></i>
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: '#1A1A1A', marginBottom: 4 }}>Freeze Account</div>
                    <div style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>
                        Temporarily pause your account. You can reactivate it anytime by logging in again.
                    </div>
                </div>
                <i className="bi bi-chevron-right" style={{ color: '#ccc', fontSize: 16 }}></i>
            </div>

            {/* Delete option */}
            <div
                style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1.5px solid #f0f0f0', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: 20, cursor: 'pointer', transition: 'all .2s' }}
                onClick={() => setConfirmType('delete')}
            >
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(231,76,60,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                    <i className="bi bi-trash" style={{ color: '#e74c3c' }}></i>
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: '#e74c3c', marginBottom: 4 }}>Delete Account</div>
                    <div style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>
                        Permanently delete your account and all data. This action cannot be undone.
                    </div>
                </div>
                <i className="bi bi-chevron-right" style={{ color: '#ccc', fontSize: 16 }}></i>
            </div>

            {/* Confirm modal */}
            {cfg && (
                <div
                    style={{ display: 'flex', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, alignItems: 'center', justifyContent: 'center' }}
                    onClick={(e) => e.target === e.currentTarget && setConfirmType(null)}
                >
                    <div style={{ background: '#fff', borderRadius: 20, padding: '36px 32px', maxWidth: 420, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
                        <h3 style={{ fontWeight: 800, fontSize: 20, color: '#1A1A1A', marginBottom: 10 }}>{cfg.title}</h3>
                        <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6, marginBottom: 28 }}>{cfg.desc}</p>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button
                                onClick={() => setConfirmType(null)}
                                style={{ flex: 1, padding: 12, border: '1.5px solid #e8e8e8', borderRadius: 10, background: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                style={{ flex: 1, padding: 12, border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif', color: '#fff', background: cfg.btnColor }}
                            >
                                {cfg.btnText}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ProfileLayout>
    )
}
