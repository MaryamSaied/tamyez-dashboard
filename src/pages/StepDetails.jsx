import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import CareerLayout from '../components/CareerLayout'
import { stepDetailsData } from '../data/stepDetailsData'

function ResourceList({ items, iconClass, iconColorClass }) {
    return (
        <div className="sd-resource-list">
            {items.map((item, i) => (
                <div key={i} className="sd-resource-item">
                    <div className={`sd-resource-icon ${iconColorClass}`}>
                        <i className={`bi ${iconClass}`}></i>
                    </div>
                    <div className="sd-resource-info">
                        <div className="sd-resource-name">{item.name}</div>
                        <div className="sd-resource-sub">{item.sub}</div>
                    </div>
                    <i className="bi bi-chevron-right sd-chevron"></i>
                </div>
            ))}
        </div>
    )
}

export default function StepDetails() {
    const { id } = useParams()
    const stepId = parseInt(id) || 1
    const step = stepDetailsData[stepId] || stepDetailsData[1]

    useEffect(() => {
        document.title = `TAMYEZ - ${step.title}`
    }, [step.title])

    return (
        <CareerLayout>
            <div className="cp-wrapper">
                <div className="container">
                    <div className="cp-page-header">
                        <h1 className="cp-page-title">{step.title}</h1>
                        <p className="cp-page-sub">Master the essential skills to build a strong foundation for your career.</p>
                    </div>

                    <div className="sd-desc-card">
                        <h3 className="sd-section-title">Step Description</h3>
                        <p className="sd-desc-text">{step.description}</p>
                    </div>

                    <div className="sd-section-card">
                        <h3 className="sd-section-title">Available Courses</h3>
                        <ResourceList items={step.courses} iconClass="bi-play-circle-fill" iconColorClass="sd-icon-blue" />
                    </div>

                    <div className="sd-section-card">
                        <h3 className="sd-section-title">Recommended Books</h3>
                        <ResourceList items={step.books} iconClass="bi-book-fill" iconColorClass="sd-icon-orange" />
                    </div>

                    <div className="sd-section-card">
                        <h3 className="sd-section-title">YouTube Explanations</h3>
                        <ResourceList items={step.youtube} iconClass="bi-youtube" iconColorClass="sd-icon-red" />
                    </div>

                    <div className="sd-quiz-cta">
                        <Link to="/quiz-start" className="sd-btn-quiz">
                            <i className="bi bi-pencil-square me-2"></i> Take Quiz
                        </Link>
                    </div>
                </div>
            </div>
        </CareerLayout>
    )
}
