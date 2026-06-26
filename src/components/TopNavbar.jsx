import { Link, NavLink, useNavigate } from 'react-router-dom'

export default function TopNavbar() {
    const navigate = useNavigate()

    return (
        <header className="adm-topnav">
            <div className="adm-topnav-inner">
                <div className="adm-topnav-logo" style={{ cursor: 'default' }}>
                    <img src="/images/logo.png" alt="TAMYEZ" style={{ pointerEvents: 'none' }} />
                </div>
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
    )
}
