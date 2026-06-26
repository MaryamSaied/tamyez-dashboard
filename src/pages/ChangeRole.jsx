import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { usersAPI } from '../services/api'

const ROLES = [
    { key: 'User',        name: 'User',        desc: 'Standard user with basic access.' },
    { key: 'Admin',       name: 'Admin',        desc: 'Admin with elevated permissions.' },
    { key: 'Super Admin', name: 'Super Admin',  desc: 'Super Admin with full system control.' },
]

export default function ChangeRole() {
    const [params]   = useSearchParams()
    const navigate   = useNavigate()
    const userId     = params.get('id')
    const userV      = parseInt(params.get('v') || '1')
    const userName   = params.get('name') || 'this user'

    const [selected, setSelected] = useState('User')
    const [loading,  setLoading]  = useState(false)
    const [error,    setError]    = useState('')
    const [success,  setSuccess]  = useState(false)
    const [toast,    setToast]    = useState('')
    const [toastErr, setToastErr] = useState(false)
    const showToast = (msg, err=false) => { setToast(msg); setToastErr(err); setTimeout(()=>setToast(''), 3000) }

    useEffect(() => {
        const r = params.get('role') || 'User'
        setSelected(r)
    }, [params])

    const handleUpdate = async () => {
        if (!userId) { setError('User ID missing.'); return }
        setLoading(true); setError('')
        try {
            await usersAPI.changeRole(userId, selected, userV)
            showToast('Role updated successfully!')
            setTimeout(() => navigate('/users'), 1200)
        } catch (err) {
            setError(err.message || 'Failed to change role. Please try again.')
            showToast(err.message || 'Failed to change role', true)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AdminLayout>
            <style>{`
                .change-role-wrap { max-width: 560px; margin: 0 auto; padding: 10px 0 40px; }
                .change-role-title { font-weight: 800; font-size: 22px; color: #1A1A1A; margin-bottom: 8px; }
                .change-role-sub { font-size: 13px; color: #999; margin-bottom: 28px; }
                .role-option { display: flex; align-items: center; gap: 16px; background: #fff; border: 1.5px solid #e8e8e8; border-radius: 12px; padding: 18px 22px; margin-bottom: 12px; cursor: pointer; transition: all 0.2s; }
                .role-option:hover { border-color: #0B6BA0; }
                .role-option.selected { border-color: #0B6BA0; background: rgba(11,107,160,0.03); }
                .role-option input[type="radio"] { width: 18px; height: 18px; accent-color: #0B6BA0; flex-shrink: 0; cursor: pointer; }
                .role-option-text .role-name { font-weight: 700; font-size: 14px; color: #1A1A1A; }
                .role-option-text .role-desc { font-size: 12px; color: #999; margin-top: 2px; }
                .role-btn-group { display: flex; gap: 12px; margin-top: 28px; }
                .btn-cancel-role { padding: 11px 28px; border: 1.5px solid #e8e8e8; border-radius: 10px; background: #fff; font-size: 14px; font-weight: 600; color: #666; cursor: pointer; font-family: inherit; transition: all 0.2s; }
                .btn-cancel-role:hover { border-color: #0B6BA0; color: #0B6BA0; }
                .btn-update-role { padding: 11px 28px; border: none; border-radius: 10px; background: #0B6BA0; color: #fff; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; box-shadow: 0 4px 14px rgba(11,107,160,0.25); }
                .btn-update-role:hover:not(:disabled) { background: #0d83c4; }
                .btn-update-role:disabled { opacity: .6; cursor: not-allowed; }
            `}</style>

            {toast && (
                <div style={{ position:'fixed', top:24, left:'50%', transform:'translateX(-50%)', background: toastErr ? '#e74c3c' : '#27ae60', color:'#fff', padding:'11px 22px', borderRadius:10, fontSize:13, fontWeight:700, zIndex:9999, boxShadow:'0 4px 16px rgba(0,0,0,.15)' }}>
                    <i className={`bi ${toastErr ? 'bi-exclamation-circle-fill' : 'bi-check-circle-fill'} me-2`}></i>{toast}
                </div>
            )}

            <div className="change-role-wrap">
                <h1 className="change-role-title">Change User Role</h1>
                <p className="change-role-sub">Changing role for: <strong>{userName}</strong></p>

                {error && (
                    <div style={{ background:'rgba(231,76,60,.08)', border:'1px solid rgba(231,76,60,.25)', borderRadius:10, padding:'10px 14px', marginBottom:16, color:'#e74c3c', fontSize:13, fontWeight:600 }}>
                        <i className="bi bi-exclamation-circle me-2"></i>{error}
                    </div>
                )}

                {ROLES.map((role) => (
                    <label key={role.key} className={`role-option ${selected === role.key ? 'selected' : ''}`} onClick={() => setSelected(role.key)}>
                        <input type="radio" name="roleChoice" value={role.key} checked={selected === role.key} onChange={() => setSelected(role.key)} />
                        <div className="role-option-text">
                            <div className="role-name">{role.name}</div>
                            <div className="role-desc">{role.desc}</div>
                        </div>
                    </label>
                ))}

                <div className="role-btn-group">
                    <button className="btn-cancel-role" onClick={() => navigate(-1)}>Cancel</button>
                    <button className="btn-update-role" onClick={handleUpdate} disabled={loading}>
                        {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Updating...</> : 'Update Role'}
                    </button>
                </div>
            </div>
        </AdminLayout>
    )

}
