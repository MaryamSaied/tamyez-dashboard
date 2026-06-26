import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import Loader from '../components/Loader'
import { usersAPI } from '../services/api'

export default function UserProfile() {
    const [params]  = useSearchParams()
    const navigate  = useNavigate()
    const userId    = params.get('id')

    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(!!userId)

    const nameParam   = params.get('name')   || ''
    const emailParam  = params.get('email')  || ''
    const roleParam   = params.get('role')   || 'User'
    const genderParam = params.get('gender') || 'Male'

    useEffect(() => {
        if (!userId) return
        usersAPI.getArchivedProfile(userId)
            .then(res => setProfile(res.body))
            .catch(() => setProfile(null))
            .finally(() => setLoading(false))
    }, [userId])

    const name    = profile?.fullName    || nameParam
    const email   = profile?.email       || emailParam
    const role    = profile?.role        || roleParam
    const gender  = profile?.gender      || genderParam
    const regDate = profile?.createdAt?.slice(0,10) || '—'
    const isFrozen        = profile?.isFrozen ?? false
    const currentStage    = profile?.currentStage ?? null
    const completedCourses= profile?.completedCoursesCount ?? profile?.completedCourses ?? null
    const currentCareer   = profile?.currentCareer?.title || profile?.career?.title || null

    const avatarSrc = gender === 'Female' ? '/images/users1.png' : '/images/users2.png'

    if (loading) return <AdminLayout><Loader text="Loading profile..." /></AdminLayout>

    return (
        <AdminLayout>
            <style>{`
                .vp-wrap { max-width: 600px; margin: 0 auto; padding: 8px 0 40px; }
                .vp-title { font-weight: 800; font-size: 22px; color: #1A1A1A; margin-bottom: 2px; }
                .vp-sub { font-size: 13px; color: #999; margin-bottom: 24px; }

                .vp-avatar-card { background:#fff; border:1px solid #e8e8e8; border-radius:14px; padding:28px 24px; display:flex; flex-direction:column; align-items:center; margin-bottom:16px; }
                .vp-avatar { width:80px; height:80px; border-radius:50%; object-fit:cover; border:3px solid #e8e8e8; margin-bottom:12px; }
                .vp-name { font-weight:800; font-size:18px; color:#1A1A1A; }
                .vp-email { font-size:13px; color:#0B6BA0; margin-top:3px; }
                .vp-status { margin-top:8px; font-size:12px; font-weight:700; padding:3px 14px; border-radius:100px; }
                .vp-status.frozen { background:rgba(231,76,60,.10); color:#e74c3c; }
                .vp-status.active { background:rgba(39,174,96,.10); color:#27ae60; }

                .vp-section { background:#fff; border:1px solid #e8e8e8; border-radius:14px; padding:22px 24px; margin-bottom:16px; }
                .vp-section-title { font-weight:700; font-size:15px; color:#1A1A1A; margin-bottom:16px; }
                .vp-row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #f5f5f5; }
                .vp-row:last-child { border-bottom:none; }
                .vp-key { font-size:13px; color:#999; font-weight:500; }
                .vp-val { font-size:13px; color:#1A1A1A; font-weight:600; }

                .vp-career-card { background:#0B6BA0; border-radius:10px; padding:14px 18px; color:#fff; margin-top:12px; font-weight:700; font-size:14px; display:flex; flex-direction:column; gap:4px; }
                .vp-career-sub { font-size:11px; font-weight:400; opacity:.8; }

                .vp-back { display:inline-flex; align-items:center; gap:6px; padding:8px 20px; border:1.5px solid #e8e8e8; border-radius:8px; font-size:13px; font-weight:600; color:#555; text-decoration:none; margin-top:8px; cursor:pointer; background:#fff; font-family:inherit; }
                .vp-back:hover { border-color:#0B6BA0; color:#0B6BA0; }
            `}</style>

            <div className="vp-wrap">
                <h1 className="vp-title">User Profile</h1>
                <p className="vp-sub">Detailed view of user's profile and progress</p>

                {/* Avatar */}
                <div className="vp-avatar-card">
                    <img
                        src={profile?.profilePicture || avatarSrc}
                        alt="avatar"
                        className="vp-avatar"
                        onError={e => { e.target.src = avatarSrc }}
                    />
                    <div className="vp-name">{name}</div>
                    <div className="vp-email">{email}</div>
                    <span className={`vp-status ${isFrozen ? 'frozen' : 'active'}`}>
                        {isFrozen ? 'Unfreezed' : 'Active'}
                    </span>
                </div>

                {/* Account Information */}
                <div className="vp-section">
                    <div className="vp-section-title">Account Information</div>
                    <div className="vp-row">
                        <span className="vp-key">Role</span>
                        <span className="vp-val">{role}</span>
                    </div>
                    <div className="vp-row">
                        <span className="vp-key">Registration Date</span>
                        <span className="vp-val">{regDate}</span>
                    </div>
                </div>

                {/* Learning Path Overview */}
                <div className="vp-section">
                    <div className="vp-section-title">Learning Path Overview</div>

                    <div style={{ display:'flex', gap:40 }}>
                        {currentStage !== null && (
                            <div>
                                <div className="vp-key">Current Stage</div>
                                <div className="vp-val" style={{ marginTop:4 }}>Stage {currentStage}</div>
                            </div>
                        )}
                        {completedCourses !== null && (
                            <div>
                                <div className="vp-key">Completed Courses</div>
                                <div className="vp-val" style={{ marginTop:4 }}>{completedCourses}</div>
                            </div>
                        )}
                    </div>

                    {currentCareer && (
                        <>
                            <div className="vp-key" style={{ marginTop:16 }}>Current Career</div>
                            <div className="vp-val" style={{ marginTop:4 }}>{currentCareer}</div>
                            <div className="vp-career-card">
                                {currentCareer}
                                <span className="vp-career-sub">Learn More</span>
                            </div>
                        </>
                    )}

                    {!currentCareer && currentStage === null && completedCourses === null && (
                        <div style={{ color:'#bbb', fontSize:13 }}>No learning data available yet.</div>
                    )}
                </div>

                <button className="vp-back" onClick={() => navigate(-1)}>
                    <i className="bi bi-arrow-left"></i> Back
                </button>
            </div>
        </AdminLayout>
    )
}
