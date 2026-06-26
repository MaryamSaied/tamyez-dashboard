import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'

const STEP_DATA = {
    'Software Engineering': [
        { name: 'Foundational Skills', status: 'completed' },
        { name: 'Industry Knowledge', status: 'inprogress' },
        { name: 'Advanced Techniques', status: 'upcoming' },
        { name: 'Project & Portfolio Building', status: 'upcoming' },
        { name: 'Career Preparation', status: 'upcoming' },
    ],
    'Data Science': [
        { name: 'Introduction to Data Analysis', status: 'completed' },
        { name: 'Data Visualization Techniques', status: 'inprogress' },
        { name: 'Machine Learning Fundamentals', status: 'upcoming' },
        { name: 'Data Wrangling and Cleaning', status: 'upcoming' },
        { name: 'Advanced Data Science Topics', status: 'upcoming' },
    ],
}

const STATUS_CONFIG = {
    completed: { circleClass: 'cr-circle-done', badgeClass: 'cr-badge-done', label: 'Completed', icon: 'bi-check-lg' },
    inprogress: { circleClass: 'cr-circle-inprogress', badgeClass: 'cr-badge-inprogress', label: 'In Progress', icon: 'bi-hourglass-split' },
    upcoming: { circleClass: 'cr-circle-upcoming', badgeClass: 'cr-badge-upcoming', label: 'Upcoming', icon: null },
}

export default function DashCareerRoadmap() {
    const [params] = useSearchParams()
    const roadmapName = params.get('name') || 'Software Engineering'
    const steps = STEP_DATA[roadmapName] || [
        { name: 'Step 1 — ' + roadmapName, status: 'completed' },
        { name: 'Step 2 — Advanced', status: 'inprogress' },
        { name: 'Step 3 — Expert', status: 'upcoming' },
        { name: 'Step 4 — Portfolio', status: 'upcoming' },
        { name: 'Step 5 — Career Ready', status: 'upcoming' },
    ]

    useEffect(() => {
        document.title = 'TAMYEZ Admin - ' + roadmapName + ' Roadmap'
    }, [roadmapName])

    return (
        <AdminLayout>
            <div style={{ marginBottom: 20 }}>
                <Link to="/roadmaps" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#666', textDecoration: 'none', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                    <i className="bi bi-arrow-left"></i> Back to Roadmaps
                </Link>
                <h2 style={{ fontWeight: 800, fontSize: 20, color: '#1A1A1A', letterSpacing: '-.3px', margin: 0 }}>
                    {roadmapName} Roadmap
                </h2>
                <p style={{ fontSize: 13, color: '#999', marginTop: 2 }}>{roadmapName} Career Path</p>
            </div>

            <div className="cr-progress-card">
                <div className="cr-progress-header">
                    <span className="cr-progress-title">Overall Progress</span>
                    <span className="cr-progress-pct">20%</span>
                </div>
                <div className="cr-progress-bar-track">
                    <div className="cr-progress-bar-fill" style={{ width: '20%' }}></div>
                </div>
            </div>

            <div className="cr-steps-list">
                {steps.map((step, i) => {
                    const num = i + 1
                    const cfg = STATUS_CONFIG[step.status]
                    const isLast = i === steps.length - 1
                    const href = `/dash-step-details/${num}?name=${encodeURIComponent(roadmapName)}&step=${num}`

                    return (
                        <Link
                            key={i}
                            to={href}
                            className={`cr-step cr-step-${step.status} cr-step-link`}
                            style={{ textDecoration: 'none' }}
                        >
                            <div className="cr-step-left">
                                <div className={`cr-step-circle ${cfg.circleClass}`}>
                                    {cfg.icon ? <i className={`bi ${cfg.icon}`}></i> : num}
                                </div>
                                {!isLast && <div className="cr-step-line"></div>}
                            </div>
                            <div className="cr-step-content">
                                <div className="cr-step-meta">Step {num}:</div>
                                <div className="cr-step-name">{step.name}</div>
                                <span className={`cr-step-badge ${cfg.badgeClass}`}>{cfg.label}</span>
                                {step.status === 'inprogress' && (
                                    <span className="cr-btn-continue">Continue</span>
                                )}
                            </div>
                        </Link>
                    )
                })}
            </div>
        </AdminLayout>
    )
}
