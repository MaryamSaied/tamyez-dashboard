import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

import ProtectedRoute from './components/ProtectedRoute'

// Auth pages
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import ResetSuccess from './pages/ResetSuccess'
import Verify from './pages/Verify'
import OtpVerification from './pages/OtpVerification'
import GoogleAuth from './pages/GoogleAuth'

// Admin pages
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import UserProfile from './pages/UserProfile'
import ChangeRole from './pages/ChangeRole'
import Careers from './pages/Careers'
import CareerDetail from './pages/CareerDetail'
import AddCareer from './pages/AddCareer'
import UpdateCareer from './pages/UpdateCareer'
import CareerRoadmap from './pages/CareerRoadmap'
import DashCareerRoadmap from './pages/DashCareerRoadmap'
import Roadmaps from './pages/Roadmaps'
import UpdateRoadmap from './pages/UpdateRoadmap'
import StepDetails from './pages/StepDetails'
import DashStepDetails from './pages/DashStepDetails'
import AddCourse from './pages/AddCourse'
import AddBook from './pages/AddBook'
import AddResource from './pages/AddResource'
import Quizzes from './pages/Quizzes'
import QuizView from './pages/QuizView'
import QuizStart from './pages/QuizStart'
import QuizQuestions from './pages/QuizQuestions'
import Notifications from './pages/Notifications'
import Settings from './pages/Settings'
import AdminProfile from './pages/AdminProfile'
import AdminProfileEdit from './pages/AdminProfileEdit'
import AdminProfileSettings from './pages/AdminProfileSettings'
import AdminDeleteAccount from './pages/AdminDeleteAccount'

// 404
import NotFound from './pages/NotFound'

// Scroll to top on route change
function ScrollToTop() {
    const { pathname } = useLocation()
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])
    return null
}

// Helper to wrap a page in <ProtectedRoute>
const Protected = (PageComponent) => (
    <ProtectedRoute>
        <PageComponent />
    </ProtectedRoute>
)

export default function App() {
    return (
        <>
            <ScrollToTop />
            <Routes>
                {/* Public — Auth */}
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/reset-success" element={<ResetSuccess />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/otp-verification" element={<OtpVerification />} />
                <Route path="/google-auth" element={<GoogleAuth />} />

                {/* Protected — Dashboard */}
                <Route path="/dashboard" element={Protected(Dashboard)} />

                {/* Protected — Users */}
                <Route path="/users" element={Protected(Users)} />
                <Route path="/user-profile" element={Protected(UserProfile)} />
                <Route path="/change-role" element={Protected(ChangeRole)} />

                {/* Protected — Careers */}
                <Route path="/careers" element={Protected(Careers)} />
                <Route path="/add-career" element={Protected(AddCareer)} />
                <Route path="/career-detail" element={Protected(CareerDetail)} />
                <Route path="/update-career" element={Protected(UpdateCareer)} />
                <Route path="/career-roadmap" element={Protected(CareerRoadmap)} />
                <Route path="/dash-career-roadmap" element={Protected(DashCareerRoadmap)} />

                {/* Protected — Roadmaps */}
                <Route path="/roadmaps" element={Protected(Roadmaps)} />
                <Route path="/update-roadmap" element={Protected(UpdateRoadmap)} />
                <Route path="/step-details/:id" element={Protected(StepDetails)} />
                <Route path="/dash-step-details/:id" element={Protected(DashStepDetails)} />
                <Route path="/add-course" element={Protected(AddCourse)} />
                <Route path="/add-book" element={Protected(AddBook)} />
                <Route path="/add-resource" element={Protected(AddResource)} />

                {/* Protected — Quizzes */}
                <Route path="/quizzes" element={Protected(Quizzes)} />
                <Route path="/quiz-view" element={Protected(QuizView)} />
                <Route path="/quiz-start" element={Protected(QuizStart)} />
                <Route path="/quiz-questions" element={Protected(QuizQuestions)} />

                {/* Protected — Other */}
                <Route path="/notifications" element={Protected(Notifications)} />
                <Route path="/settings" element={Protected(Settings)} />

                {/* Protected — Admin profile */}
                <Route path="/admin-profile" element={Protected(AdminProfile)} />
                <Route path="/admin-profile-edit" element={Protected(AdminProfileEdit)} />
                <Route path="/admin-profile-settings" element={Protected(AdminProfileSettings)} />
                <Route path="/admin-delete-account" element={Protected(AdminDeleteAccount)} />

                {/* 404 — catches any unmatched URL */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    )
}
