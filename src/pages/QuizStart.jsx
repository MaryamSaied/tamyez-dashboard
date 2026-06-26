import { Link } from 'react-router-dom'
import CareerLayout from '../components/CareerLayout'

export default function QuizStart() {
    return (
        <CareerLayout>
            <div className="cp-wrapper">
                <div className="container">
                    <div className="qs-center-wrap">
                        <h1 className="qs-main-title">Ready to Begin Your Quiz?</h1>
                        <p className="qs-main-sub">
                            This quiz will help us determine your level. Please read the instructions carefully before starting.
                        </p>

                        <div className="qs-details-card">
                            <h3 className="qs-details-heading">Quiz Details</h3>
                            <div className="qs-divider"></div>

                            <div className="qs-detail-row">
                                <span className="qs-detail-label">Number of Questions</span>
                                <span className="qs-detail-val">20</span>
                            </div>
                            <div className="qs-divider"></div>

                            <div className="qs-detail-row">
                                <span className="qs-detail-label">Time Limit</span>
                                <span className="qs-detail-val">30 minutes</span>
                            </div>
                            <div className="qs-divider"></div>

                            <div className="qs-detail-row qs-detail-col">
                                <span className="qs-detail-label">Instructions</span>
                                <span className="qs-detail-text">
                                    Answer honestly and do the best of your ability, and review before submitting.
                                </span>
                            </div>
                        </div>

                        <Link to="/quiz-questions" className="qs-btn-start-centered">
                            Start Quiz
                        </Link>
                    </div>
                </div>
            </div>
        </CareerLayout>
    )
}
