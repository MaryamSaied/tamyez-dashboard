import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function AuthLayout({ children }) {
    useEffect(() => {
        document.body.className = 'auth-wrapper'
        return () => { document.body.className = '' }
    }, [])

    return (
        <>
            <nav className="navbar navbar-expand-lg sticky-top">
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        <img src="/images/logo.png" alt="TAMYEZ" onError={(e) => e.target.style.display = 'none'} />
                    </Link>
                    <button
                        className="navbar-toggler border-0 shadow-none"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto align-items-center">
                            <li className="nav-item"><a className="nav-link" href="#">Welcome</a></li>
                            <li className="nav-item"><a className="nav-link" href="#">About</a></li>
                            <li className="nav-item"><a className="nav-link" href="#">Services</a></li>
                            <li className="nav-item"><a className="nav-link" href="#">Contact</a></li>

                            <li className="nav-item ms-lg-4 mt-3 mt-lg-0">
                                <Link to="/login" className="btn btn-get-started">Login</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="auth-body">
                {children}
            </div>
        </>
    )
}
