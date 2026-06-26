import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { adminAPI } from '../services/api'
import { auth } from '../services/auth'

const ROLE_COLORS = {
    'Super Admin': '#0B6BA0',
    'Content Manager': '#27ae60',
    'User Support': '#e67e22',
    'Admin': '#9b59b6',
}

const inputStyle = {
    width: '100%', border: '1.5px solid #e8e8e8', borderRadius: 8,
    padding: '9px 12px', fontFamily: 'Inter, sans-serif',
    fontSize: 13, outline: 'none', transition: 'border .2s',
}

export default function Settings() {
    const [accountForm,   setAccountForm]   = useState({ name: '', email: '' })
    const [accountErrors, setAccountErrors] = useState({})
    const [accountToast,  setAccountToast]  = useState(false)
    const [accountLoading,setAccountLoading]= useState(false)

    const [platformForm,   setPlatformForm]   = useState({ siteName: '', contactEmail: '' })
    const [platformErrors, setPlatformErrors] = useState({})
    const [platformToast,  setPlatformToast]  = useState(false)

    useEffect(() => {
        adminAPI.getProfile()
            .then((res) => {
                const p = res.body || res
                setAccountForm({
                    name:  p.fullName || p.name  || auth.getUser()?.fullName || '',
                    email: p.email               || auth.getUser()?.email    || '',
                })
            })
            .catch(() => {
                const stored = auth.getUser()
                if (stored) setAccountForm({ name: stored.fullName || '', email: stored.email || '' })
            })
    }, [])

    const setAcct = (key, value) => {
        setAccountForm({ ...accountForm, [key]: value })
        setAccountErrors({ ...accountErrors, [key]: '' })
    }

    const saveAccount = async () => {
        const errors = {}
        if (!accountForm.name.trim())  errors.name  = 'Admin name is required.'
        if (!accountForm.email.trim()) errors.email = 'Email is required.'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accountForm.email)) errors.email = 'Enter a valid email.'
        setAccountErrors(errors)
        if (Object.keys(errors).length) return

        setAccountLoading(true)
        try {
            await adminAPI.updateProfile({ fullName: accountForm.name, email: accountForm.email })
            setAccountToast(true)
            setTimeout(() => setAccountToast(false), 2500)
        } catch (err) {
            setAccountErrors({ email: err.message || 'Failed to update profile.' })
        } finally {
            setAccountLoading(false)
        }
    }

    const savePlatform = () => {
        const errors = {}
        if (!platformForm.siteName.trim())    errors.siteName    = 'Site name is required.'
        if (!platformForm.contactEmail.trim()) errors.contactEmail = 'Contact email is required.'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(platformForm.contactEmail)) errors.contactEmail = 'Enter a valid email.'
        setPlatformErrors(errors)
        if (Object.keys(errors).length) return
        setPlatformToast(true)
        setTimeout(() => setPlatformToast(false), 2500)
    }

    return (
        <AdminLayout>
            {accountToast && (
                <div style={{ position:'fixed', top:24, left:'50%', transform:'translateX(-50%)',
                    background:'#27ae60', color:'#fff', padding:'12px 24px', borderRadius:10,
                    fontSize:13, fontWeight:700, zIndex:9999 }}>
                    <i className="bi bi-check-circle me-2"></i>Profile updated successfully!
                </div>
            )}
            {platformToast && (
                <div style={{ position:'fixed', top:24, left:'50%', transform:'translateX(-50%)',
                    background:'#27ae60', color:'#fff', padding:'12px 24px', borderRadius:10,
                    fontSize:13, fontWeight:700, zIndex:9999 }}>
                    <i className="bi bi-check-circle me-2"></i>Platform settings saved!
                </div>
            )}

            <h1 className="adm-page-title">Settings</h1>

            {/* Account Settings */}
            <div className="adm-table-card" style={{ marginBottom: 24 }}>
                <div className="adm-table-header"><h3>Account Settings</h3></div>
                <div style={{ padding: '0 20px 20px' }}>
                    <div style={{ marginBottom: 14 }}>
                        <label style={{ fontSize:13, fontWeight:600, display:'block', marginBottom:5, color:'#444' }}>Admin Name</label>
                        <input style={{ ...inputStyle, borderColor: accountErrors.name ? '#e74c3c' : '#e8e8e8' }}
                            placeholder="Enter admin name" value={accountForm.name}
                            onChange={(e) => setAcct('name', e.target.value)} />
                        {accountErrors.name && <div style={{ color:'#e74c3c', fontSize:12, marginTop:4 }}>{accountErrors.name}</div>}
                    </div>
                    <div style={{ marginBottom: 18 }}>
                        <label style={{ fontSize:13, fontWeight:600, display:'block', marginBottom:5, color:'#444' }}>Email Address</label>
                        <input style={{ ...inputStyle, borderColor: accountErrors.email ? '#e74c3c' : '#e8e8e8' }}
                            placeholder="Enter email address" value={accountForm.email}
                            onChange={(e) => setAcct('email', e.target.value)} />
                        {accountErrors.email && <div style={{ color:'#e74c3c', fontSize:12, marginTop:4 }}>{accountErrors.email}</div>}
                    </div>
                    <button className="adm-btn-add" onClick={saveAccount} disabled={accountLoading}>
                        {accountLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* Platform Settings */}
            <div className="adm-table-card" style={{ marginBottom: 24 }}>
                <div className="adm-table-header"><h3>Platform Settings</h3></div>
                <div style={{ padding: '0 20px 20px' }}>
                    <div style={{ marginBottom: 14 }}>
                        <label style={{ fontSize:13, fontWeight:600, display:'block', marginBottom:5, color:'#444' }}>Site Name</label>
                        <input style={{ ...inputStyle, borderColor: platformErrors.siteName ? '#e74c3c' : '#e8e8e8' }}
                            placeholder="e.g. TAMYEZ Dashboard" value={platformForm.siteName}
                            onChange={(e) => setPlatformForm({ ...platformForm, siteName: e.target.value })} />
                        {platformErrors.siteName && <div style={{ color:'#e74c3c', fontSize:12, marginTop:4 }}>{platformErrors.siteName}</div>}
                    </div>
                    <div style={{ marginBottom: 18 }}>
                        <label style={{ fontSize:13, fontWeight:600, display:'block', marginBottom:5, color:'#444' }}>Contact Email</label>
                        <input style={{ ...inputStyle, borderColor: platformErrors.contactEmail ? '#e74c3c' : '#e8e8e8' }}
                            placeholder="support@tamyez.com" value={platformForm.contactEmail}
                            onChange={(e) => setPlatformForm({ ...platformForm, contactEmail: e.target.value })} />
                        {platformErrors.contactEmail && <div style={{ color:'#e74c3c', fontSize:12, marginTop:4 }}>{platformErrors.contactEmail}</div>}
                    </div>
                    <button className="adm-btn-add" onClick={savePlatform}>Save Platform Settings</button>
                </div>
            </div>
        </AdminLayout>
    )
}
