import { Navigate, useLocation } from 'react-router-dom'
import { auth } from '../services/auth'

// ============================================================
// ProtectedRoute — wraps routes that require login.
// Redirects to /login if not authenticated.
// Usage:
//   <Route path="/dashboard" element={
//     <ProtectedRoute><Dashboard /></ProtectedRoute>
//   } />
// ============================================================

export default function ProtectedRoute({ children }) {
    const location = useLocation()

    if (!auth.isAuthenticated()) {
        // Save where the user wanted to go so we can return there after login
        return <Navigate to="/" state={{ from: location.pathname }} replace />
    }

    return children
}
