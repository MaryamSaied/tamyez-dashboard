import { NavLink, Link, useNavigate } from 'react-router-dom'
import { auth } from '../services/auth'

export default function Sidebar() {
    const activeClass = ({ isActive }) => isActive ? 'adm-nav-active' : ''
    const navigate = useNavigate()

    const handleSignOut = (e) => {
        e.preventDefault()
        auth.logout()
        navigate('/')
    }

    return (
        <aside className="adm-sidebar">
            <div className="adm-sidebar-brand">TAMYEZ Admin</div>
            <nav className="adm-sidebar-nav">
                <NavLink to="/dashboard" className={activeClass}>
                    <i className="bi bi-house-door"></i>Dashboard
                </NavLink>
                <NavLink to="/users" className={activeClass}>
                    <i className="bi bi-people"></i>Users
                </NavLink>
                <NavLink to="/careers" className={activeClass}>
                    <i className="bi bi-briefcase"></i>Careers
                </NavLink>
                <NavLink to="/roadmaps" className={activeClass}>
                    <i className="bi bi-map"></i>Roadmaps
                </NavLink>
                <NavLink to="/quizzes" className={activeClass}>
                    <i className="bi bi-patch-question"></i>Quizzes
                </NavLink>
                <NavLink to="/notifications" className={activeClass}>
                    <i className="bi bi-bell"></i>Notifications
                </NavLink>
                <NavLink to="/settings" className={activeClass}>
                    <i className="bi bi-gear"></i>Settings
                </NavLink>
            </nav>
            <div className="adm-signout-wrap">
                <a href="/" onClick={handleSignOut} className="adm-signout-link">
                    <i className="bi bi-box-arrow-right"></i>Sign Out
                </a>
            </div>
        </aside>
    )
}
