import { useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

export default function CareerLayout({ children, bodyClass = 'cp-body', active }) {
    const navigate = useNavigate()

    useEffect(() => {
        document.body.className = bodyClass
        return () => { document.body.className = '' }
    }, [bodyClass])

    return (
        <>
            <nav className="cp-nav">
                <div className="container">
                    <div className="cp-nav-inner">
                        <Link to="/">
                            <img src="/images/logo.png" className="cp-logo" alt="TAMYEZ" />
                        </Link>
                        <div className="cp-nav-right">
                            <ul className="cp-nav-links">
                                <li><NavLink to="/career-roadmap" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
                                <li><NavLink to="/career-path" className={({ isActive }) => isActive ? 'active' : ''}>Career path</NavLink></li>
                                <li><NavLink to="/career-roadmap" className={({ isActive }) => isActive ? 'active' : ''}>Career Roadmap</NavLink></li>
                                <li><a href="#">Taken quizzes</a></li>
                            </ul>
                            <img
                                src="/images/profile.png"
                                className="cp-profile-img"
                                alt="Profile"
                                onClick={() => navigate('/admin-profile')}
                                style={{ cursor: 'pointer' }}
                            />
                        </div>
                    </div>
                </div>
            </nav>
            {children}
        </>
    )
}
