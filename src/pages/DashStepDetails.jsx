import { useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'

const STEP_DETAILS = {
    1: { name: 'Foundational Skills', desc: 'This step focuses on developing core competencies crucial for success. You will learn to communicate effectively, solve problems creatively, and collaborate seamlessly with others.', courses: ['Communication Skills', 'Problem Solving', 'Teamwork'], books: ['The Art of Communication', 'Creative Problem Solving', 'Teamwork Dynamics'], youtube: ['Communication Skills Explained', 'Problem Solving Techniques', 'Teamwork and Collaboration'] },
    2: { name: 'Industry Knowledge', desc: 'Gain a deep understanding of the industry, including key trends, technologies, and practices that shape modern teams.', courses: ['Industry Overview', 'Key Technologies', 'Market Trends'], books: ['Industry Handbook', 'Tech Landscape 2024', 'Market Intelligence'], youtube: ['Industry Deep Dive', 'Technology Overview', 'Market Analysis'] },
    3: { name: 'Advanced Techniques', desc: 'Master advanced methods and approaches used by professionals in the field. Build expertise that sets you apart from others.', courses: ['Advanced Methods', 'Expert Techniques', 'Professional Tools'], books: ['Advanced Practitioner', 'Expert Guide', 'Professional Methods'], youtube: ['Advanced Techniques Tutorial', 'Expert Walkthrough', 'Pro-Level Training'] },
    4: { name: 'Project & Portfolio Building', desc: 'Apply your skills to real projects and build a portfolio that showcases your abilities to potential employers.', courses: ['Project Management', 'Portfolio Building', 'Case Studies'], books: ['Portfolio Design', 'Project Mastery', 'Case Study Handbook'], youtube: ['Portfolio Tutorial', 'Project Walkthrough', 'Case Study Examples'] },
    5: { name: 'Career Preparation', desc: 'Prepare for the job market with resume writing, interview skills, and networking strategies tailored to your chosen career.', courses: ['Resume Writing', 'Interview Preparation', 'Networking Skills'], books: ['Career Launch', 'Interview Mastery', 'Networking for Professionals'], youtube: ['Resume Tips', 'Interview Prep Tutorial', 'Networking Strategies'] },
}

function ResourceList({ items, iconClass, iconColorClass, subText }) {
    return (
        <div className="sd-resource-list">
            {items.map((name, i) => (
                <div key={i} className="sd-resource-item">
                    <div className={`sd-resource-icon ${iconColorClass}`}>
                        <i className={`bi ${iconClass}`}></i>
                    </div>
                    <div className="sd-resource-info">
                        <div className="sd-resource-name">{name}</div>
                        <div className="sd-resource-sub">{subText}</div>
                    </div>
                    <i className="bi bi-chevron-right sd-chevron"></i>
                </div>
            ))}
        </div>
    )
}

export default function DashStepDetails() {
    const { id } = useParams()
    const [params] = useSearchParams()
    const navigate = useNavigate()
    const stepNum = parseInt(id) || 1
    const career = params.get('name') || 'Software Engineering'
    const step = STEP_DETAILS[stepNum] || STEP_DETAILS[1]

    useEffect(() => {
        document.title = 'TAMYEZ Admin - Step ' + stepNum
    }, [stepNum])

    return (
        <AdminLayout>
            <div style={{ marginBottom: 20 }}>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate(-1) }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#666', textDecoration: 'none', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                    <i className="bi bi-arrow-left"></i> Back
                </a>
                <h2 style={{ fontWeight: 800, fontSize: 20, color: '#1A1A1A', letterSpacing: '-.3px', margin: 0 }}>
                    Step {stepNum}: {step.name}
                </h2>
                <p style={{ fontSize: 13, color: '#999', marginTop: 2 }}>{career} Career Path</p>
            </div>

            <div className="sd-desc-card">
                <h3 className="sd-section-title">Step Description</h3>
                <p className="sd-desc-text">{step.desc}</p>
            </div>

            <div className="sd-section-card">
                <h3 className="sd-section-title">Available Courses</h3>
                <ResourceList items={step.courses} iconClass="bi-play-circle-fill" iconColorClass="sd-icon-blue" subText="Online course" />
            </div>

            <div className="sd-section-card">
                <h3 className="sd-section-title">Recommended Books</h3>
                <ResourceList items={step.books} iconClass="bi-book-fill" iconColorClass="sd-icon-orange" subText="Recommended reading" />
            </div>

            <div className="sd-section-card">
                <h3 className="sd-section-title">YouTube Explanations</h3>
                <ResourceList items={step.youtube} iconClass="bi-youtube" iconColorClass="sd-icon-red" subText="Video explanation" />
            </div>
        </AdminLayout>
    )
}
