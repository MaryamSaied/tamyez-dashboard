import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import CareerLayout from '../components/CareerLayout'

// Question bank for the foundational skills quiz
const QUIZ_QUESTIONS = [
    { q: "What is the primary purpose of effective communication in the workplace?", opts: ["To impress colleagues", "To share information clearly and build understanding", "To avoid difficult conversations", "To dominate discussions"], correct: 1 },
    { q: "Which of the following is a key element of active listening?", opts: ["Interrupting frequently", "Multitasking while listening", "Focusing fully and giving feedback", "Planning your response first"], correct: 2 },
    { q: "What does 'teamwork' primarily require?", opts: ["Individual excellence only", "Competition among members", "Collaboration and shared goals", "Strict hierarchy"], correct: 2 },
    { q: "Which skill helps in breaking complex tasks into smaller parts?", opts: ["Analytical thinking", "Speed reading", "Memorization", "Physical endurance"], correct: 0 },
    { q: "Constructive feedback should be:", opts: ["Vague and general", "Specific and actionable", "Only positive", "Delivered publicly"], correct: 1 },
    { q: "What is a key characteristic of an effective team leader?", opts: ["Doing all work alone", "Micromanaging every task", "Inspiring and guiding the team", "Avoiding difficult decisions"], correct: 2 },
    { q: "Adaptability in the workplace means:", opts: ["Resisting change", "Adjusting to new situations effectively", "Following only old methods", "Avoiding new technologies"], correct: 1 },
    { q: "Which communication style is most effective in professional settings?", opts: ["Aggressive", "Passive", "Assertive", "Passive-aggressive"], correct: 2 },
    { q: "Time management primarily helps with:", opts: ["Avoiding work", "Completing tasks efficiently within deadlines", "Working longer hours", "Delegating everything"], correct: 1 },
    { q: "Critical thinking involves:", opts: ["Accepting information without question", "Analyzing and evaluating information objectively", "Following orders blindly", "Memorizing facts"], correct: 1 },
    { q: "What does 'growth mindset' mean?", opts: ["Believing abilities are fixed", "Avoiding challenges", "Believing skills can be developed through effort", "Only focusing on strengths"], correct: 2 },
    { q: "Conflict resolution works best when parties:", opts: ["Avoid the conflict", "Compete to win", "Seek a mutually beneficial solution", "Ignore each other's views"], correct: 2 },
    { q: "Which is a core component of emotional intelligence?", opts: ["Technical expertise", "Self-awareness", "Speed typing", "Physical fitness"], correct: 1 },
    { q: "Effective presentations require:", opts: ["Reading directly from slides", "Clear structure and engaging delivery", "Using complex vocabulary only", "Speaking as fast as possible"], correct: 1 },
    { q: "Decision making improves when you:", opts: ["Act impulsively", "Gather relevant information first", "Always follow others", "Ignore consequences"], correct: 1 },
    { q: "What is the benefit of setting SMART goals?", opts: ["They are vague and flexible", "They provide clear direction and measurability", "They avoid accountability", "They eliminate planning"], correct: 1 },
    { q: "Networking in a professional context means:", opts: ["Using social media for entertainment", "Building mutually beneficial relationships", "Collecting business cards only", "Avoiding colleagues"], correct: 1 },
    { q: "Continuous learning in a career means:", opts: ["Learning only during school", "Regularly updating knowledge and skills", "Avoiding new technologies", "Sticking to one method forever"], correct: 1 },
    { q: "Which best describes professional integrity?", opts: ["Doing the minimum required", "Honesty and strong ethical principles", "Saying what others want to hear", "Following rules only when watched"], correct: 1 },
    { q: "Effective collaboration requires:", opts: ["Working in isolation", "Open communication and mutual respect", "Competing with teammates", "Avoiding feedback"], correct: 1 },
]

const TOTAL_SECONDS = 30 * 60

export default function QuizQuestions() {
    const [params] = useSearchParams()
    const navigate = useNavigate()
    const quizName = params.get('quiz')

    const [currentQ, setCurrentQ] = useState(0)
    const [answers, setAnswers] = useState(() => new Array(QUIZ_QUESTIONS.length).fill(null))
    const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS)
    const timerRef = useRef(null)

    useEffect(() => {
        if (quizName) document.title = 'TAMYEZ - ' + quizName
    }, [quizName])

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setSecondsLeft((s) => {
                if (s <= 1) {
                    clearInterval(timerRef.current)
                    submitQuiz()
                    return 0
                }
                return s - 1
            })
        }, 1000)
        return () => clearInterval(timerRef.current)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const submitQuiz = () => {
        clearInterval(timerRef.current)
        // Calculate score
        let correct = 0
        QUIZ_QUESTIONS.forEach((q, i) => {
            if (answers[i] === q.correct) correct++
        })
        const score = Math.round((correct / QUIZ_QUESTIONS.length) * 100)
        // Store in sessionStorage to match original behavior
        try {
            sessionStorage.setItem('quizScore', score)
            sessionStorage.setItem('quizCorrect', correct)
            sessionStorage.setItem('quizWrong', QUIZ_QUESTIONS.length - correct)
        } catch (e) {
            // ignore storage errors
        }
        // For now, navigate back to roadmap since pass/fail pages aren't in scope
        navigate('/career-roadmap')
    }

    const selectOption = (optIdx) => {
        const next = [...answers]
        next[currentQ] = optIdx
        setAnswers(next)
    }

    const nextQuestion = () => {
        if (currentQ < QUIZ_QUESTIONS.length - 1) {
            setCurrentQ(currentQ + 1)
        } else {
            submitQuiz()
        }
    }
    const prevQuestion = () => {
        if (currentQ > 0) setCurrentQ(currentQ - 1)
    }

    const h = Math.floor(secondsLeft / 3600)
    const m = Math.floor((secondsLeft % 3600) / 60)
    const s = secondsLeft % 60
    const pad = (n) => String(n).padStart(2, '0')

    const q = QUIZ_QUESTIONS[currentQ]
    const isLast = currentQ === QUIZ_QUESTIONS.length - 1

    return (
        <CareerLayout>
            <div className="cp-wrapper">
                <div className="container">
                    <div className="qq-header">
                        <h1 className="qq-title">{quizName || 'Step 1: Foundational Skills Quiz'}</h1>
                        <p className="qq-subtitle">Test your knowledge of the essential skills covered in this stage.</p>
                    </div>

                    <div className="qq-timer-row">
                        <div className="qq-timer-block">
                            <div className="qq-timer-num">{pad(h)}</div>
                            <div className="qq-timer-label">Hours</div>
                        </div>
                        <div className="qq-timer-block qq-timer-highlight">
                            <div className="qq-timer-num">{pad(m)}</div>
                            <div className="qq-timer-label">Minutes</div>
                        </div>
                        <div className="qq-timer-block">
                            <div className="qq-timer-num">{pad(s)}</div>
                            <div className="qq-timer-label">Seconds</div>
                        </div>
                    </div>

                    <div className="qq-question-card">
                        <div className="qq-q-meta">Question {currentQ + 1} of {QUIZ_QUESTIONS.length}</div>
                        <div className="qq-q-text">{q.q}</div>

                        <div className="qq-options-list">
                            {q.opts.map((opt, i) => (
                                <button
                                    key={i}
                                    className={`qq-option ${answers[currentQ] === i ? 'selected' : ''}`}
                                    onClick={() => selectOption(i)}
                                >
                                    <span className="qq-option-radio"></span>{opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="qq-nav-row">
                        <button
                            className="qq-btn-prev"
                            onClick={prevQuestion}
                            disabled={currentQ === 0}
                        >
                            Previous
                        </button>
                        <button className="qq-btn-next" onClick={nextQuestion}>
                            {isLast ? 'Submit' : 'Next'}
                        </button>
                    </div>
                </div>
            </div>
        </CareerLayout>
    )
}
