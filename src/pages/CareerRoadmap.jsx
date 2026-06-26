import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import CareerLayout from '../components/CareerLayout'

const STEPS = [
    { id: 1, name: 'Foundational Skills', status: 'completed' },
    { id: 2, name: 'Industry Knowledge', status: 'inprogress' },
    { id: 3, name: 'Advanced Techniques', status: 'upcoming' },
    { id: 4, name: 'Industry Knowledge', status: 'upcoming' },
    { id: 5, name: 'Advanced Techniques', status: 'upcoming' },
]

const STATUS_CONFIG = {
    completed: { circleClass: 'cr-circle-done', badgeClass: 'cr-badge-done', label: 'Completed', icon: 'bi-check-lg' },
    inprogress: { circleClass: 'cr-circle-inprogress', badgeClass: 'cr-badge-inprogress', label: 'In Progress', icon: 'bi-hourglass-split' },
    upcoming: { circleClass: 'cr-circle-upcoming', badgeClass: 'cr-badge-upcoming', label: 'Upcoming', icon: null },
}

export default function CareerRoadmap() {
    const [params] = useSearchParams()
    const careerName = params.get('name')
    const title = careerName ? careerName + ' Roadmap' : 'Career Roadmap'

    useEffect(() => {
        document.title = careerName ? `TAMYEZ - ${careerName} Roadmap` : 'TAMYEZ - Career Roadmap'
    }, [careerName])

    return (
        <CareerLayout>
            <div className="cp-wrapper">
                <div className="container">
                    <div className="cp-page-header">
                        <h1 className="cp-page-title">{title}</h1>
                        <p className="cp-page-sub">Follow your personalized path to success</p>
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
                        {STEPS.map((s, i) => {
                            const cfg = STATUS_CONFIG[s.status]
                            const isLast = i === STEPS.length - 1
                            return (
                                <Link
                                    key={s.id}
                                    to={`/step-details/${s.id}`}
                                    className={`cr-step cr-step-${s.status} cr-step-link`}
                                >
                                    <div className="cr-step-left">
                                        <div className={`cr-step-circle ${cfg.circleClass}`}>
                                            {cfg.icon ? <i className={`bi ${cfg.icon}`}></i> : s.id}
                                        </div>
                                        <div className={`cr-step-line ${isLast ? 'cr-line-hidden' : ''}`}></div>
                                    </div>
                                    <div className="cr-step-content">
                                        <div className="cr-step-meta">Step {s.id}:</div>
                                        <div className="cr-step-name">{s.name}</div>
                                        <span className={`cr-step-badge ${cfg.badgeClass}`}>{cfg.label}</span>
                                        {s.status === 'inprogress' && <span className="cr-btn-continue">Continue</span>}
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
        </CareerLayout>
    )
}
