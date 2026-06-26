import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProfileLayout from '../components/ProfileLayout'
import { auth } from '../services/auth'
import { adminAPI } from '../services/api'

const LANGUAGES = [
    { name: 'English', flag: '🇬🇧' }, { name: 'العربية', flag: '🇪🇬' },
]

export default function AdminProfile() {
    const [profile,       setProfile]       = useState(null)
    const [selectedLang,  setSelectedLang]  = useState('English')
    const [showLangMenu,  setShowLangMenu]  = useState(false)
    const langRowRef = useRef(null)
    const [menuPosition, setMenuPosition]   = useState({ top: 0, left: 0 })
    const navigate = useNavigate()

    useEffect(() => {
        adminAPI.getProfile()
            .then((res) => setProfile(res.body || res))
            .catch(() => {
                const stored = auth.getUser()
                if (stored) setProfile(stored)
            })
    }, [])

    const openLangMenu = () => {
        if (langRowRef.current) {
            const rect = langRowRef.current.getBoundingClientRect()
            setMenuPosition({ top: rect.bottom + 6, left: rect.left })
        }
        setShowLangMenu(true)
    }

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') setShowLangMenu(false) }
        if (showLangMenu) window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [showLangMenu])

    const displayEmail = profile?.email || auth.getUser()?.email || '—'
    const displayName  = profile?.fullName || profile?.name || auth.getUser()?.fullName || 'Admin'

    return (
        <ProfileLayout>
            {/* Account */}
            <div className="pf-section-title">Account</div>
            <div className="pf-row-item">
                <span className="pf-row-label">Name</span>
                <span className="pf-row-value">{displayName}</span>
            </div>
            <Link to="/admin-profile-edit" className="pf-row-item">
                <span className="pf-row-label">Email</span>
                <span className="pf-row-value">{displayEmail}</span>
                <i className="bi bi-chevron-right pf-row-arrow"></i>
            </Link>
            <Link to="/admin-profile-settings" className="pf-row-item">
                <span className="pf-row-label">Password</span>
                <span className="pf-row-value">••••••••</span>
                <i className="bi bi-chevron-right pf-row-arrow"></i>
            </Link>
            <a href="/" className="pf-row-item pf-logout"
                onClick={(e) => { e.preventDefault(); auth.logout(); navigate('/') }}>
                <span className="pf-row-label">Log Out</span>
                <i className="bi bi-chevron-right pf-row-arrow"></i>
            </a>
            <div className="pf-row-item pf-delete"
                onClick={() => navigate('/admin-delete-account')}
                style={{ cursor: 'pointer' }}>
                <span className="pf-row-label">Delete Account</span>
                <i className="bi bi-chevron-right pf-row-arrow"></i>
            </div>

            {/* Settings */}
            <div className="pf-section-title">Settings</div>
            <div ref={langRowRef} className="pf-row-item"
                onClick={openLangMenu} style={{ cursor: 'pointer' }}>
                <span className="pf-row-label">Language</span>
                <span className="pf-row-value">{selectedLang}</span>
                <i className="bi bi-chevron-down pf-row-arrow"></i>
            </div>
            <div className="pf-row-item"><span className="pf-row-label">Privacy</span><i className="bi bi-chevron-right pf-row-arrow"></i></div>
            <div className="pf-row-item"><span className="pf-row-label">About</span><i className="bi bi-chevron-right pf-row-arrow"></i></div>

            {/* Support */}
            <div className="pf-section-title">Support</div>
            <div className="pf-row-item"><span className="pf-row-label">Help Center</span><i className="bi bi-chevron-right pf-row-arrow"></i></div>
            <div className="pf-row-item"><span className="pf-row-label">Contact Us</span><i className="bi bi-chevron-right pf-row-arrow"></i></div>
            <div className="pf-row-item"><span className="pf-row-label">Terms of Service</span><i className="bi bi-chevron-right pf-row-arrow"></i></div>
            <div className="pf-row-item"><span className="pf-row-label">Privacy Policy</span><i className="bi bi-chevron-right pf-row-arrow"></i></div>

            {/* Language Menu */}
            {showLangMenu && (
                <>
                    <div onClick={() => setShowLangMenu(false)}
                        style={{ position: 'fixed', inset: 0, zIndex: 998 }} />
                    <style>{`.lang-check-item{display:flex!important;align-items:center;gap:10px}.lang-option.lang-selected{background:rgba(11,107,160,.06);font-weight:700;color:#0B6BA0}`}</style>
                    <div style={{ position:'fixed', top:menuPosition.top, left:menuPosition.left, zIndex:999,
                        background:'#fff', borderRadius:14, boxShadow:'0 8px 32px rgba(0,0,0,.14)',
                        border:'1px solid #f0f0f0', minWidth:230, overflow:'hidden', fontFamily:'Inter,sans-serif' }}>
                        <div style={{ padding: '10px 0' }}>
                            {LANGUAGES.map((lang) => (
                                <div key={lang.name}
                                    className={`lang-option lang-check-item ${lang.name===selectedLang?'lang-selected':''}`}
                                    onClick={() => { setSelectedLang(lang.name); setShowLangMenu(false) }}>
                                    <span style={{ fontSize:18 }}>{lang.flag}</span>
                                    <span style={{ flex:1 }}>{lang.name}</span>
                                    {lang.name===selectedLang && <i className="bi bi-check2" style={{ color:'#0B6BA0', marginLeft:'auto' }}></i>}
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </ProfileLayout>
    )
}
