import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import Loader from '../components/Loader'
import { careersAPI, roadmapsAPI as roadmapStepsAPI } from '../services/api'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://tamyez.mooo.com/api/v1'
const IMG_BASE  = BASE_URL.replace('/api/v1', '')

export default function CareerDetail() {
    const [params]   = useSearchParams()
    const navigate   = useNavigate()
    const careerId   = params.get('id')

    // Career data
    const [career,        setCareer]        = useState(null)
    const [careerLoading, setCareerLoading] = useState(true)
    const [careerError,   setCareerError]   = useState('')

    // Roadmap steps
    const [steps,         setSteps]         = useState([])
    const [stepsLoading,  setStepsLoading]  = useState(true)

    // Modals
    const [showFreeze,    setShowFreeze]    = useState(false)
    const [showRestore,   setShowRestore]   = useState(false)
    const [showDelete,    setShowDelete]    = useState(false)
    const [showAddStep,   setShowAddStep]   = useState(false)
    const [actionLoading, setActionLoading] = useState(false)

    // Add Step form
    const [newStep, setNewStep] = useState({ title: '', order: '', description: '' })
    const [stepErr, setStepErr] = useState('')

    // Toast
    const [toast,     setToast]     = useState('')
    const [toastType, setToastType] = useState('success')
    const showToast = (msg, type = 'success') => { setToast(msg); setToastType(type); setTimeout(() => setToast(''), 3000) }

    // Fetch career
    const fetchCareer = useCallback(() => {
        if (!careerId) return
        setCareerLoading(true)
        careersAPI.getById(careerId)
            .then(res => setCareer(res.body || res))
            .catch(err => setCareerError(err.message || 'Failed to load career'))
            .finally(() => setCareerLoading(false))
    }, [careerId])

    // Fetch roadmap steps
    const fetchSteps = useCallback(() => {
        if (!careerId) return
        setStepsLoading(true)
        roadmapStepsAPI.getAll({ belongToCareers: careerId, size: 30, page: 1 })
            .then(res => setSteps(res.body?.data || []))
            .catch(() => setSteps([]))
            .finally(() => setStepsLoading(false))
    }, [careerId])

    useEffect(() => { fetchCareer(); fetchSteps() }, [fetchCareer, fetchSteps])

    // Actions
    const handleFreeze = async () => {
        setActionLoading(true)
        try {
            await careersAPI.archive(careerId, career?.v ?? 1)
            showToast('Career frozen successfully')
            setShowFreeze(false)
            fetchCareer()
        } catch (err) { showToast(err.message || 'Failed to freeze', 'error') }
        finally { setActionLoading(false) }
    }

    const handleRestore = async () => {
        setActionLoading(true)
        try {
            await careersAPI.restore(careerId, career?.v ?? 1)
            showToast('Career restored successfully')
            setShowRestore(false)
            fetchCareer()
        } catch (err) { showToast(err.message || 'Failed to restore', 'error') }
        finally { setActionLoading(false) }
    }

    const handleDelete = async () => {
        setActionLoading(true)
        try {
            await careersAPI.delete(careerId)
            showToast('Career deleted')
            setTimeout(() => navigate('/careers'), 1000)
        } catch (err) { showToast(err.message || 'Failed to delete', 'error') }
        finally { setActionLoading(false) }
    }

    const handleAddStep = async () => {
        if (!newStep.title.trim()) { setStepErr('Title is required'); return }
        if (!newStep.order)        { setStepErr('Order is required'); return }
        setStepErr('')
        setActionLoading(true)
        try {
            await roadmapStepsAPI.create({
                careerId,
                title:       newStep.title,
                order:       parseInt(newStep.order),
                description: newStep.description,
                courses:     [],
            })
            showToast('Step added successfully!')
            setShowAddStep(false)
            setNewStep({ title: '', order: '', description: '' })
            fetchSteps()
        } catch (err) { setStepErr(err.message || 'Failed to add step') }
        finally { setActionLoading(false) }
    }

    const handleDeleteStep = async (stepId) => {
        if (!window.confirm('Delete this step?')) return
        try {
            await roadmapStepsAPI.delete(stepId)
            showToast('Step deleted')
            fetchSteps()
        } catch (err) { showToast(err.message || 'Failed', 'error') }
    }

    const handleArchiveStep = async (stepId) => {
        try {
            await roadmapStepsAPI.archive(stepId)
            showToast('Step frozen')
            fetchSteps()
        } catch (err) { showToast(err.message || 'Failed', 'error') }
    }

    const imgSrc = career?.pictureUrl
        ? (career.pictureUrl.startsWith('http') ? career.pictureUrl : `${IMG_BASE}${career.pictureUrl}`)
        : null

    if (careerLoading) return <AdminLayout><Loader text="Loading career..." /></AdminLayout>
    if (careerError)   return <AdminLayout><div style={{ color: '#e74c3c', padding: 32 }}>{careerError}</div></AdminLayout>
    if (!career)       return <AdminLayout><div style={{ padding: 32, color: '#999' }}>Career not found.</div></AdminLayout>

    return (
        <AdminLayout>
            <style>{`
                .cd-wrap { display: grid; grid-template-columns: 1fr 260px; gap: 20px; align-items: start; }
                @media(max-width:900px){ .cd-wrap { grid-template-columns: 1fr } }
                .cd-card { background:#fff; border-radius:12px; border:1px solid #e8e8e8; padding:18px 20px; margin-bottom:14px; }
                .cd-section-title { font-size:14px; font-weight:700; color:#1A1A1A; margin-bottom:12px; }
                .cd-badge { display:inline-block; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700; }
                .cd-badge-active { background:#e8f8f0; color:#27ae60; }
                .cd-badge-frozen { background:#fef0e7; color:#e67e22; }
                .cd-step-row { display:flex; align-items:center; justify-content:space-between; padding:10px 0; border-bottom:1px solid #f5f5f5; }
                .cd-step-row:last-child { border-bottom:none; }
                .cd-step-title { font-size:13px; font-weight:600; color:#1A1A1A; }
                .cd-step-order { font-size:11px; color:#999; margin-top:2px; }
                .cd-act { font-size:12px; font-weight:600; color:#0B6BA0; cursor:pointer; text-decoration:none; background:none; border:none; padding:0; }
                .cd-act:hover { text-decoration:underline; }
                .cd-act-red { color:#e74c3c; }
                .cd-act-orange { color:#e67e22; }
                .cd-right-img { width:100%; height:160px; object-fit:cover; border-radius:10px; display:block; margin-bottom:12px; }
                .cd-right-placeholder { width:100%; height:160px; background:#f0f7ff; border-radius:10px; display:flex; align-items:center; justify-content:center; color:#bbb; font-size:32px; margin-bottom:12px; }
                .cd-action-btn { width:100%; padding:10px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer; border:1.5px solid; margin-bottom:8px; transition:all .15s; }
                .cd-info-row { display:flex; gap:8px; margin-bottom:8px; font-size:13px; }
                .cd-info-key { color:#999; font-weight:500; min-width:90px; }
                .cd-info-val { color:#1A1A1A; font-weight:600; }
            `}</style>

            {/* Toast */}
            {toast && (
                <div style={{ position:'fixed', top:24, left:'50%', transform:'translateX(-50%)', background: toastType==='error' ? '#e74c3c' : '#27ae60', color:'#fff', padding:'11px 22px', borderRadius:10, fontSize:13, fontWeight:700, zIndex:9999, boxShadow:'0 4px 16px rgba(0,0,0,.15)' }}>
                    <i className={`bi ${toastType==='error' ? 'bi-exclamation-circle-fill' : 'bi-check-circle-fill'} me-2`}></i>{toast}
                </div>
            )}

            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
                <button onClick={() => navigate('/careers')} style={{ background:'none', border:'none', cursor:'pointer', color:'#0B6BA0', fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:4 }}>
                    <i className="bi bi-arrow-left"></i> Back to Careers
                </button>
                <h1 style={{ fontSize:22, fontWeight:800, color:'#1A1A1A', margin:0 }}>{career.title}</h1>
                <span className={`cd-badge ${career.isActive ? 'cd-badge-active' : 'cd-badge-frozen'}`}>
                    {career.isActive ? 'Active' : 'Frozen'}
                </span>
            </div>

            <div className="cd-wrap">
                {/* LEFT */}
                <div>
                    {/* Career Info */}
                    <div className="cd-card">
                        <div className="cd-section-title">Career Information</div>
                        <div className="cd-info-row"><span className="cd-info-key">Career Name</span><span className="cd-info-val">{career.title}</span></div>
                        <div className="cd-info-row"><span className="cd-info-key">Total Steps</span><span className="cd-info-val">{career.stepsCount ?? steps.length}</span></div>
                        {career.description && (
                            <div style={{ marginTop:10, fontSize:13, color:'#555', lineHeight:1.6 }}>{career.description}</div>
                        )}
                    </div>

                    {/* Roadmap Steps */}
                    <div className="cd-card">
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                            <div className="cd-section-title" style={{ marginBottom:0 }}>Career Roadmap</div>
                            <button className="adm-btn-add" style={{ fontSize:12, padding:'6px 14px' }} onClick={() => setShowAddStep(true)}>
                                <i className="bi bi-plus-lg me-1"></i>Add Roadmap Step
                            </button>
                        </div>

                        {stepsLoading ? (
                            <Loader inline text="Loading steps..." />
                        ) : steps.length === 0 ? (
                            <div style={{ color:'#999', fontSize:13, textAlign:'center', padding:'20px 0' }}>
                                No roadmap steps yet. Click "Add Roadmap Step" to get started.
                            </div>
                        ) : (
                            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                                <thead>
                                    <tr style={{ borderBottom:'2px solid #e8e8e8' }}>
                                        <th style={{ textAlign:'left', padding:'8px 10px', color:'#999', fontSize:11, fontWeight:700 }}>STEP</th>
                                        <th style={{ textAlign:'left', padding:'8px 10px', color:'#999', fontSize:11, fontWeight:700 }}>TITLE</th>
                                        <th style={{ textAlign:'left', padding:'8px 10px', color:'#999', fontSize:11, fontWeight:700 }}>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {steps.map((s, i) => (
                                        <tr key={s.id || s._id} style={{ borderBottom:'1px solid #f5f5f5' }}>
                                            <td style={{ padding:'10px', color:'#999', fontWeight:600 }}>Step {s.order ?? i+1}</td>
                                            <td style={{ padding:'10px', fontWeight:600, color:'#1A1A1A' }}>{s.title}</td>
                                            <td style={{ padding:'10px' }}>
                                                <div style={{ display:'flex', gap:10 }}>
                                                    <button className="cd-act" onClick={() => navigate(`/update-roadmap?id=${s.id || s._id}`)}>Edit</button>
                                                    <button className="cd-act cd-act-orange" onClick={() => handleArchiveStep(s.id || s._id)}>Freeze</button>
                                                    <button className="cd-act cd-act-red" onClick={() => handleDeleteStep(s.id || s._id)}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* RIGHT */}
                <div>
                    {imgSrc
                        ? <img src={imgSrc} className="cd-right-img" alt={career.title} onError={e => { e.target.style.display='none' }} />
                        : <div className="cd-right-placeholder"><i className="bi bi-image"></i></div>
                    }

                    <button className="cd-action-btn" style={{ borderColor:'#0B6BA0', color:'#0B6BA0', background:'#fff' }}
                        onClick={() => navigate(`/update-career?id=${careerId}`)}>
                        <i className="bi bi-pencil me-2"></i>Update Career
                    </button>

                    {career.isActive
                        ? <button className="cd-action-btn" style={{ borderColor:'#e67e22', color:'#e67e22', background:'#fff' }}
                            onClick={() => setShowFreeze(true)}>
                            <i className="bi bi-snow2 me-2"></i>Freeze Career
                          </button>
                        : <button className="cd-action-btn" style={{ borderColor:'#27ae60', color:'#27ae60', background:'#fff' }}
                            onClick={() => setShowRestore(true)}>
                            <i className="bi bi-arrow-counterclockwise me-2"></i>Restore Career
                          </button>
                    }

                    <button className="cd-action-btn" style={{ borderColor:'#e74c3c', color:'#e74c3c', background:'#fff' }}
                        onClick={() => setShowDelete(true)}>
                        <i className="bi bi-trash me-2"></i>Delete Career
                    </button>
                </div>
            </div>

            {/* Add Step Modal */}
            <div className={`adm-modal-overlay ${showAddStep ? 'show' : ''}`} onClick={e => e.target===e.currentTarget && setShowAddStep(false)}>
                <div className="adm-modal" style={{ maxWidth:440 }}>
                    <h3>Add Roadmap Step</h3>
                    {[
                        ['Title *', 'title', 'e.g. Pre-Fundamentals', 'input'],
                        ['Order *', 'order', 'e.g. 1', 'input'],
                        ['Description', 'description', 'Step description...', 'textarea'],
                    ].map(([label, key, ph, type]) => (
                        <div key={key} style={{ marginBottom:12 }}>
                            <label style={{ fontSize:12, color:'#666', display:'block', marginBottom:4 }}>{label}</label>
                            {type === 'textarea'
                                ? <textarea className="adm-input" placeholder={ph} style={{ minHeight:70, resize:'vertical', fontFamily:'inherit' }}
                                    value={newStep[key]} onChange={e => setNewStep({...newStep, [key]: e.target.value})} />
                                : <input className="adm-input" placeholder={ph} type={key==='order'?'number':'text'}
                                    value={newStep[key]} onChange={e => setNewStep({...newStep, [key]: e.target.value})} />
                            }
                        </div>
                    ))}
                    {stepErr && <div style={{ color:'#e74c3c', fontSize:12, marginBottom:10 }}>{stepErr}</div>}
                    <div style={{ display:'flex', gap:8 }}>
                        <button className="adm-btn-confirm" style={{ flex:1 }} disabled={actionLoading} onClick={handleAddStep}>
                            {actionLoading ? 'Adding...' : 'Add Step'}
                        </button>
                        <button className="adm-btn-cancel" onClick={() => { setShowAddStep(false); setStepErr('') }}>Cancel</button>
                    </div>
                </div>
            </div>

            {/* Freeze Modal */}
            <div className={`adm-modal-overlay ${showFreeze ? 'show' : ''}`} onClick={e => e.target===e.currentTarget && setShowFreeze(false)}>
                <div className="adm-modal">
                    <h3 style={{ color:'#e67e22' }}><i className="bi bi-snow2 me-2"></i>Freeze Career</h3>
                    <p style={{ color:'#666', fontSize:13, marginBottom:16 }}>Are you sure you want to freeze "<strong>{career.title}</strong>"?</p>
                    <div style={{ display:'flex', gap:8 }}>
                        <button className="adm-btn-confirm" style={{ flex:1, background:'#e67e22', borderColor:'#e67e22' }} disabled={actionLoading} onClick={handleFreeze}>
                            {actionLoading ? 'Processing...' : 'Freeze'}
                        </button>
                        <button className="adm-btn-cancel" onClick={() => setShowFreeze(false)}>Cancel</button>
                    </div>
                </div>
            </div>

            {/* Restore Modal */}
            <div className={`adm-modal-overlay ${showRestore ? 'show' : ''}`} onClick={e => e.target===e.currentTarget && setShowRestore(false)}>
                <div className="adm-modal">
                    <h3 style={{ color:'#27ae60' }}><i className="bi bi-arrow-counterclockwise me-2"></i>Restore Career</h3>
                    <p style={{ color:'#666', fontSize:13, marginBottom:16 }}>Restore "<strong>{career.title}</strong>" to active?</p>
                    <div style={{ display:'flex', gap:8 }}>
                        <button className="adm-btn-confirm" style={{ flex:1, background:'#27ae60', borderColor:'#27ae60' }} disabled={actionLoading} onClick={handleRestore}>
                            {actionLoading ? 'Processing...' : 'Restore'}
                        </button>
                        <button className="adm-btn-cancel" onClick={() => setShowRestore(false)}>Cancel</button>
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            <div className={`adm-modal-overlay ${showDelete ? 'show' : ''}`} onClick={e => e.target===e.currentTarget && setShowDelete(false)}>
                <div className="adm-modal" style={{ borderTop:'4px solid #e74c3c' }}>
                    <h3 style={{ color:'#e74c3c' }}><i className="bi bi-exclamation-triangle me-2"></i>Delete Career</h3>
                    <p style={{ color:'#666', fontSize:13, marginBottom:16 }}>Permanently delete "<strong>{career.title}</strong>"? This cannot be undone.</p>
                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                        <button className="adm-btn-confirm adm-btn-danger" style={{ width:'100%', justifyContent:'center' }} disabled={actionLoading} onClick={handleDelete}>
                            {actionLoading ? 'Deleting...' : <><i className="bi bi-trash me-1"></i>Delete Career</>}
                        </button>
                        <button className="adm-btn-cancel" style={{ width:'100%', textAlign:'center' }} onClick={() => setShowDelete(false)}>Cancel</button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
