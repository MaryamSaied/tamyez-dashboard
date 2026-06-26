import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'

const LETTERS = ['A', 'B', 'C', 'D', 'E']

const BANKS = {
    'Career Interests': [
        { q: 'Which of the following best describes your preferred work style?', opts: ['Working independently on focused tasks', 'Collaborating in team projects', 'Managing and leading a team', 'Advising and consulting others'], correct: 0 },
        { q: 'What type of problems do you enjoy solving most?', opts: ['Analytical and data-driven problems', 'Creative and design challenges', 'People and communication issues', 'Technical and engineering problems'], correct: 0 },
        { q: 'In a work environment, you feel most motivated when:', opts: ['Given clear structure and guidelines', 'Allowed creative freedom', 'Recognized for your achievements', 'Working in a fast-paced environment'], correct: 2 },
        { q: 'Which skill do you consider your strongest?', opts: ['Critical thinking', 'Communication', 'Leadership', 'Technical expertise'], correct: 0 },
        { q: 'Your ideal career environment would be:', opts: ['A startup with rapid growth', 'A large established corporation', 'A non-profit or social impact org', 'A research or academic setting'], correct: 0 },
    ],
    'Aptitude Test': [
        { q: 'If a dataset has values [2, 4, 6, 8, 10], what is the mean?', opts: ['5', '6', '7', '8'], correct: 1 },
        { q: 'Which chart type is best for showing trends over time?', opts: ['Pie chart', 'Bar chart', 'Line chart', 'Scatter plot'], correct: 2 },
        { q: 'What does SQL stand for?', opts: ['Simple Query Language', 'Structured Query Language', 'Standard Query Logic', 'System Query Language'], correct: 1 },
        { q: 'Which of the following is a measure of data spread?', opts: ['Mean', 'Median', 'Standard deviation', 'Mode'], correct: 2 },
        { q: 'In data analysis, "outlier" refers to:', opts: ['The most common value', 'A value far from others', 'The middle value', 'The average value'], correct: 1 },
    ],
    'Personality Assessment': [
        { q: 'When facing a conflict at work, you typically:', opts: ['Address it directly and immediately', 'Seek compromise and middle ground', 'Avoid conflict when possible', 'Involve a neutral third party'], correct: 1 },
        { q: 'How do you approach a new challenging project?', opts: ['Jump in and figure it out as you go', 'Plan thoroughly before starting', 'Seek guidance from others first', 'Break it into small manageable parts'], correct: 3 },
        { q: 'Your colleagues would describe you as:', opts: ['Detail-oriented and precise', 'Creative and innovative', 'Empathetic and supportive', 'Strategic and goal-focused'], correct: 0 },
        { q: 'When receiving critical feedback, you:', opts: ['Feel defensive initially', 'Welcome it and use it to improve', 'Ask for specific examples', 'Share your perspective first'], correct: 1 },
        { q: 'In a group decision-making scenario, you tend to:', opts: ['Take charge and lead the discussion', "Listen and support others' ideas", 'Analyze all options before deciding', 'Build consensus among the group'], correct: 2 },
    ],
    'Skills Evaluation': [
        { q: 'Which digital marketing channel typically has the highest ROI?', opts: ['Social media advertising', 'Email marketing', 'Pay-per-click advertising', 'Influencer marketing'], correct: 1 },
        { q: 'What is the primary goal of SEO?', opts: ['Increase paid traffic', 'Improve organic search rankings', 'Run social media campaigns', 'Create email campaigns'], correct: 1 },
        { q: 'A/B testing is used to:', opts: ['Test two versions of content', 'Analyze competitor data', 'Track user behavior', 'Measure email open rates'], correct: 0 },
        { q: 'Which metric measures the percentage of visitors who take a desired action?', opts: ['Bounce rate', 'Click-through rate', 'Conversion rate', 'Engagement rate'], correct: 2 },
        { q: 'Content marketing primarily aims to:', opts: ['Drive immediate sales', 'Build brand awareness and trust', 'Generate paid leads', 'Improve technical SEO'], correct: 1 },
    ],
    'Knowledge Check': [
        { q: 'What does ROI stand for in finance?', opts: ['Return on Investment', 'Rate of Inflation', 'Revenue Over Income', 'Risk of Investment'], correct: 0 },
        { q: "Which financial statement shows a company's assets and liabilities?", opts: ['Income statement', 'Cash flow statement', 'Balance sheet', 'Profit & loss report'], correct: 2 },
        { q: 'Diversification in investing means:', opts: ['Putting all funds in one stock', 'Spreading investments across assets', 'Investing only in bonds', 'Keeping money in savings only'], correct: 1 },
        { q: 'What is compound interest?', opts: ['Interest paid only on principal', 'Interest paid on principal and accumulated interest', 'A fixed monthly payment', 'Annual interest rate only'], correct: 1 },
        { q: 'A bull market refers to:', opts: ['Declining stock prices', 'Rising stock prices', 'Stable commodity prices', 'High inflation period'], correct: 1 },
    ],
}

const getBank = (title) => {
    for (const key of Object.keys(BANKS)) {
        if (title.toLowerCase().includes(key.toLowerCase())) return BANKS[key]
    }
    return BANKS['Career Interests']
}

export default function QuizView() {
    const [params] = useSearchParams()
    const navigate = useNavigate()
    const qTitle = params.get('quiz') || 'Quiz 1: Career Interests'
    const qDetail = params.get('details') || 'Core logic and problem-solving focus'
    const qCount = parseInt(params.get('questions')) || 20
    const qScore = params.get('score') || '75'

    const [questions, setQuestions] = useState(() => {
        const bank = getBank(qTitle)
        const list = []
        for (let i = 0; i < qCount; i++) list.push({ ...bank[i % bank.length] })
        return list
    })

    const [delIdx, setDelIdx] = useState(null)
    const [showAddPanel, setShowAddPanel] = useState(false)
    const [newQuestion, setNewQuestion] = useState({ q: '', opts: ['', '', '', ''], correct: 0 })
    const [addError, setAddError] = useState('')
    const [toast, setToast] = useState(false)

    useEffect(() => { document.title = 'TAMYEZ Admin - ' + qTitle }, [qTitle])

    const updateQuestionText = (qi, value) => {
        const next = [...questions]
        next[qi] = { ...next[qi], q: value }
        setQuestions(next)
    }
    const updateOption = (qi, oi, value) => {
        const next = [...questions]
        const opts = [...next[qi].opts]
        opts[oi] = value
        next[qi] = { ...next[qi], opts }
        setQuestions(next)
    }
    const setCorrect = (qi, oi) => {
        const next = [...questions]
        next[qi] = { ...next[qi], correct: oi }
        setQuestions(next)
    }

    const confirmDelete = () => {
        if (delIdx === null) return
        setQuestions(questions.filter((_, i) => i !== delIdx))
        setDelIdx(null)
    }

    const submitNewQuestion = () => {
        if (!newQuestion.q.trim()) { setAddError('Question text is required.'); return }
        if (newQuestion.opts.some(o => !o.trim())) { setAddError('All 4 options are required.'); return }
        setAddError('')
        setQuestions([...questions, { ...newQuestion }])
        setShowAddPanel(false)
        setNewQuestion({ q: '', opts: ['', '', '', ''], correct: 0 })
    }

    const saveAll = () => {
        setToast(true)
        setTimeout(() => navigate('/quizzes'), 1800)
    }

    return (
        <AdminLayout>
            <style>{`
                .qv-wrap { max-width: 800px; margin: 0 auto; }
                .qv-header { background: #fff; border-radius: 14px; border: 1px solid #e8e8e8; padding: 22px 26px; margin-bottom: 20px; }
                .qv-title { font-weight: 800; font-size: 20px; color: #1A1A1A; margin-bottom: 6px; }
                .qv-meta { display: flex; gap: 20px; flex-wrap: wrap; }
                .qv-meta-item { font-size: 13px; color: #666; display: flex; align-items: center; gap: 6px; }
                .qv-meta-item i { color: #0B6BA0; }
                .qv-badge { background: rgba(11,107,160,0.10); color: #0B6BA0; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
                .qv-q-card { background: #fff; border-radius: 14px; border: 1px solid #e8e8e8; padding: 20px 24px; margin-bottom: 14px; }
                .qv-q-num { font-size: 11px; font-weight: 700; color: #0B6BA0; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
                .qv-letter { width: 26px; height: 26px; border-radius: 6px; background: #f5f6fa; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; color: #666; flex-shrink: 0; }
                .qv-letter.correct { background: #27ae60; color: #fff; }
                .qv-back { display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px; border: 1.5px solid #e8e8e8; border-radius: 8px; font-size: 13px; font-weight: 600; color: #666; text-decoration: none; margin-bottom: 18px; }
                .qv-back:hover { border-color: #0B6BA0; color: #0B6BA0; }
                .qv-admin-notice { background: rgba(39,174,96,0.06); border: 1.5px solid rgba(39,174,96,0.2); color: #27ae60; border-radius: 10px; padding: 10px 16px; font-size: 12px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
            `}</style>

            <div className="qv-wrap">
                <Link to="/quizzes" className="qv-back"><i className="bi bi-arrow-left"></i> Back to Quizzes</Link>

                <div className="qv-admin-notice">
                    <i className="bi bi-pencil-square"></i>
                    Admin Edit Mode — You can edit questions, options, and correct answers below.
                    <button onClick={saveAll} style={{ marginLeft: 'auto', background: '#27ae60', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                        Save All Changes
                    </button>
                </div>

                <div className="qv-header">
                    <div className="qv-title">{qTitle}</div>
                    <div style={{ marginBottom: 12 }}><span className="qv-badge">{qDetail}</span></div>
                    <div className="qv-meta">
                        <div className="qv-meta-item"><i className="bi bi-question-circle"></i><span>{qCount} Questions</span></div>
                        <div className="qv-meta-item"><i className="bi bi-bar-chart"></i><span>Avg Score: {qScore}%</span></div>
                    </div>
                </div>

                <div>
                    {questions.map((q, qi) => (
                        <div key={qi} className="qv-q-card">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                                <div className="qv-q-num">Question {qi + 1} of {questions.length}</div>
                                <button
                                    onClick={() => setDelIdx(qi)}
                                    style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: 4 }}
                                >
                                    <i className="bi bi-trash"></i> Delete
                                </button>
                            </div>
                            <div style={{ marginBottom: 12 }}>
                                <label style={{ fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '.5px', display: 'block', marginBottom: 5 }}>Question Text</label>
                                <textarea
                                    value={q.q}
                                    onChange={(e) => updateQuestionText(qi, e.target.value)}
                                    style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #e8e8e8', borderRadius: 8, fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif', color: '#1A1A1A', resize: 'vertical', minHeight: 60, outline: 'none' }}
                                />
                            </div>
                            <div style={{ marginBottom: 6 }}>
                                <label style={{ fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '.5px', display: 'block', marginBottom: 8 }}>
                                    Options <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(click radio to mark correct answer)</span>
                                </label>
                                {q.opts.map((opt, oi) => {
                                    const isCorrect = oi === q.correct
                                    return (
                                        <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                            <input
                                                type="radio"
                                                name={`correct_${qi}`}
                                                checked={isCorrect}
                                                onChange={() => setCorrect(qi, oi)}
                                                style={{ accentColor: '#27ae60', width: 16, height: 16, cursor: 'pointer' }}
                                            />
                                            <div className={`qv-letter ${isCorrect ? 'correct' : ''}`}>{LETTERS[oi]}</div>
                                            <input
                                                type="text"
                                                value={opt}
                                                onChange={(e) => updateOption(qi, oi, e.target.value)}
                                                style={{
                                                    flex: 1,
                                                    padding: '8px 12px',
                                                    border: '1.5px solid #e8e8e8',
                                                    borderRadius: 8,
                                                    fontSize: 13,
                                                    fontFamily: 'Inter, sans-serif',
                                                    color: '#1A1A1A',
                                                    outline: 'none',
                                                    borderColor: isCorrect ? '#27ae60' : '#e8e8e8',
                                                    background: isCorrect ? 'rgba(39,174,96,0.05)' : '#fff',
                                                }}
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={() => setShowAddPanel(true)}
                        style={{ width: '100%', padding: 12, border: '2px dashed #0B6BA0', borderRadius: 10, background: 'rgba(11,107,160,.04)', color: '#0B6BA0', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 }}
                    >
                        <i className="bi bi-plus-circle"></i> Add New Question
                    </button>
                </div>

                {showAddPanel && (
                    <div style={{ background: '#fff', borderRadius: 14, border: '2px solid #0B6BA0', padding: 24, marginTop: 16, maxWidth: 800, marginLeft: 'auto', marginRight: 'auto' }}>
                        <h4 style={{ fontWeight: 800, fontSize: 16, color: '#1A1A1A', marginBottom: 18 }}>
                            <i className="bi bi-plus-circle me-2" style={{ color: '#0B6BA0' }}></i>Add New Question
                        </h4>

                        <div style={{ marginBottom: 14 }}>
                            <label style={{ fontSize: 12, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '.5px', display: 'block', marginBottom: 6 }}>Question Text</label>
                            <textarea
                                rows="2"
                                placeholder="Enter your question here..."
                                value={newQuestion.q}
                                onChange={(e) => setNewQuestion({ ...newQuestion, q: e.target.value })}
                                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e8e8e8', borderRadius: 8, fontSize: 14, fontFamily: 'Inter, sans-serif', color: '#1A1A1A', resize: 'vertical', outline: 'none' }}
                            />
                        </div>

                        <label style={{ fontSize: 12, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '.5px', display: 'block', marginBottom: 8 }}>
                            Options <span style={{ fontWeight: 400, textTransform: 'none' }}>(radio = correct answer)</span>
                        </label>

                        <div>
                            {[0, 1, 2, 3].map(oi => (
                                <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: oi === 3 ? 14 : 8 }}>
                                    <input
                                        type="radio"
                                        name="newCorrect"
                                        checked={newQuestion.correct === oi}
                                        onChange={() => setNewQuestion({ ...newQuestion, correct: oi })}
                                        style={{ accentColor: '#27ae60', width: 16, height: 16, cursor: 'pointer' }}
                                    />
                                    <div className="qv-letter">{LETTERS[oi]}</div>
                                    <input
                                        type="text"
                                        placeholder={`Option ${LETTERS[oi]}`}
                                        value={newQuestion.opts[oi]}
                                        onChange={(e) => {
                                            const opts = [...newQuestion.opts]
                                            opts[oi] = e.target.value
                                            setNewQuestion({ ...newQuestion, opts })
                                        }}
                                        style={{ flex: 1, padding: '8px 12px', border: '1.5px solid #e8e8e8', borderRadius: 8, fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none' }}
                                    />
                                </div>
                            ))}
                        </div>

                        {addError && <div style={{ color: '#e74c3c', fontSize: 12, fontWeight: 600, marginBottom: 10 }}>{addError}</div>}

                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => { setShowAddPanel(false); setAddError('') }}
                                style={{ padding: '9px 20px', border: '1.5px solid #e8e8e8', borderRadius: 8, background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitNewQuestion}
                                style={{ padding: '9px 22px', background: '#0B6BA0', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                            >
                                Add Question
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete question modal */}
            {delIdx !== null && (
                <div style={{ display: 'flex', position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 1001, alignItems: 'center', justifyContent: 'center' }} onClick={(e) => e.target === e.currentTarget && setDelIdx(null)}>
                    <div style={{ background: '#fff', borderRadius: 16, padding: '28px 26px', maxWidth: 400, width: '90%', boxShadow: '0 16px 48px rgba(0,0,0,.14)' }}>
                        <h3 style={{ fontWeight: 800, fontSize: 17, color: '#1A1A1A', marginBottom: 8 }}>Delete Question?</h3>
                        <p style={{ fontSize: 13, color: '#666', marginBottom: 6 }}>Are you sure you want to delete <strong>Question {delIdx + 1}</strong>?</p>
                        <p style={{ fontSize: 12, color: '#e74c3c', fontWeight: 600, marginBottom: 20 }}>This action cannot be undone.</p>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                            <button onClick={() => setDelIdx(null)} style={{ padding: '9px 20px', border: '1.5px solid #e8e8e8', borderRadius: 8, background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Cancel</button>
                            <button onClick={confirmDelete} style={{ padding: '9px 20px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {toast && (
                <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', background: '#27ae60', color: '#fff', padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700, zIndex: 9999, boxShadow: '0 4px 16px rgba(39,174,96,.3)', fontFamily: 'Inter, sans-serif' }}>
                    Quiz saved successfully ✓
                </div>
            )}
        </AdminLayout>
    )
}
