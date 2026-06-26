import { useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

export default function ProfileLayout({ children }) {
    const navigate = useNavigate()

    useEffect(() => {
        document.body.className = 'cp-body'
        return () => { document.body.className = '' }
    }, [])

    return (
        <>
            <header className="adm-topnav">
                <div className="adm-topnav-inner">
                    <Link to="/" className="adm-topnav-logo">
                        <img src="/images/logo.png" alt="TAMYEZ" />
                    </Link>
                    <nav className="adm-topnav-links" style={{ justifyContent: 'flex-end' }}>
                        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
                        <NavLink to="/users" className={({ isActive }) => isActive ? 'active' : ''}>Users</NavLink>
                        <NavLink to="/careers" className={({ isActive }) => isActive ? 'active' : ''}>Careers</NavLink>
                        <NavLink to="/roadmaps" className={({ isActive }) => isActive ? 'active' : ''}>Roadmaps</NavLink>
                        <NavLink to="/quizzes" className={({ isActive }) => isActive ? 'active' : ''}>Quizzes</NavLink>
                        <NavLink to="/notifications" className={({ isActive }) => isActive ? 'active' : ''}>Notifications</NavLink>
                    </nav>
                    <img
                        src="/images/profile.png"
                        className="adm-topnav-avatar"
                        alt="Admin"
                        onClick={() => navigate('/admin-profile')}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
            </header>

            <div className="pf-layout">
                <aside className="pf-sidebar">
                    <div className="pf-user-block">
                        <img src="/images/profile.png" className="pf-user-avatar" alt="Admin" />
                        <div>
                            <div className="pf-user-name">Alex Harper</div>
                            <div className="pf-user-date">Joined 2022</div>
                        </div>
                    </div>
                    <nav className="pf-nav">
                        <NavLink to="/admin-profile" end className={({ isActive }) => `pf-nav-item ${isActive ? 'active' : ''}`}>
                            <i className="bi bi-person"></i>Profile
                        </NavLink>
                        <NavLink to="/admin-profile-edit" className={({ isActive }) => `pf-nav-item ${isActive ? 'active' : ''}`}>
                            <i className="bi bi-pencil"></i>Edit profile
                        </NavLink>
                        <NavLink to="/admin-profile-settings" className={({ isActive }) => `pf-nav-item ${isActive ? 'active' : ''}`}>
                            <i className="bi bi-gear"></i>Settings
                        </NavLink>
                    </nav>
                </aside>

                <main className="pf-main">
                    {children}
                </main>
            </div>
        </>
    )
}
