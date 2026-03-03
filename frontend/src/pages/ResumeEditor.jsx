import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import API from '../api'
import ResumePreview from '../components/ResumePreview'

const TABS = [
    { key: 'personal', label: 'Personal', icon: '👤' },
    { key: 'education', label: 'Education', icon: '🎓' },
    { key: 'experience', label: 'Experience', icon: '💼' },
    { key: 'skills', label: 'Skills', icon: '⚡' },
    { key: 'projects', label: 'Projects', icon: '🚀' },
]

export default function ResumeEditor() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('personal')
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(true)
    const [showPreview, setShowPreview] = useState(false)

    const [resume, setResume] = useState({
        title: '',
        personalInfo: {
            fullName: '', email: '', phone: '', address: '', linkedin: '', github: '', summary: '',
        },
        education: [{ degree: '', institution: '', startDate: '', endDate: '', description: '' }],
        experience: [{ title: '', company: '', startDate: '', endDate: '', description: '' }],
        skills: [''],
        projects: [{ title: '', link: '', description: '' }],
    })

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const { data } = await API.get(`/resume/${id}`)
                setResume({
                    title: data.title || '',
                    personalInfo: { ...resume.personalInfo, ...data.personalInfo },
                    education: data.education?.length ? data.education : resume.education,
                    experience: data.experience?.length ? data.experience : resume.experience,
                    skills: data.skills?.length ? data.skills : resume.skills,
                    projects: data.projects?.length ? data.projects : resume.projects,
                })
            } catch (err) {
                toast.error('Failed to load resume')
                navigate('/dashboard')
            } finally {
                setLoading(false)
            }
        }
        fetchResume()
    }, [id])

    const handleSave = useCallback(async () => {
        setSaving(true)
        try {
            await API.put(`/resume/${id}`, resume)
            toast.success('Resume saved!')
        } catch (err) {
            toast.error('Failed to save')
        } finally {
            setSaving(false)
        }
    }, [id, resume])

    const updatePersonal = (field, value) => {
        setResume(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [field]: value },
        }))
    }

    const updateArrayField = (section, index, field, value) => {
        setResume(prev => ({
            ...prev,
            [section]: prev[section].map((item, i) => i === index ? { ...item, [field]: value } : item),
        }))
    }

    const addArrayItem = (section, template) => {
        setResume(prev => ({ ...prev, [section]: [...prev[section], template] }))
    }

    const removeArrayItem = (section, index) => {
        setResume(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index),
        }))
    }

    const updateSkill = (index, value) => {
        setResume(prev => ({
            ...prev,
            skills: prev.skills.map((s, i) => i === index ? value : s),
        }))
    }

    const addSkill = () => {
        setResume(prev => ({ ...prev, skills: [...prev.skills, ''] }))
    }

    const removeSkill = (index) => {
        setResume(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }))
    }

    const handleDownloadPDF = async () => {
        toast.loading('Generating PDF...', { id: 'pdf' })
        try {
            const [html2canvasModule, jspdfModule] = await Promise.all([
                import('html2canvas'),
                import('jspdf'),
            ])
            const html2canvas = html2canvasModule.default
            const jsPDF = jspdfModule.default || jspdfModule.jsPDF

            const element = document.getElementById('resume-preview')
            if (!element) {
                toast.error('Preview not found.', { id: 'pdf' })
                return
            }

            // Use onclone to force white background & black text in the clone
            // before html2canvas renders it — this overrides Tailwind's dark theme.
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                onclone: (clonedDoc) => {
                    // Force white background on <html> and <body>
                    clonedDoc.documentElement.style.setProperty('background', '#ffffff', 'important')
                    clonedDoc.body.style.setProperty('background', '#ffffff', 'important')

                    // Get the resume preview element
                    const resumePreview = clonedDoc.getElementById('resume-preview')
                    if (resumePreview) {
                        resumePreview.style.setProperty('background-color', '#ffffff', 'important')
                        resumePreview.style.setProperty('color', '#000000', 'important')
                        
                        // Force black text on ALL child elements inside resume-preview
                        const allChildren = resumePreview.querySelectorAll('*')
                        allChildren.forEach(el => {
                            el.style.setProperty('color', '#000000', 'important')
                            el.style.setProperty('background-color', 'transparent', 'important')
                        })
                    }

                    // Force every other element outside to have transparent background
                    const all = clonedDoc.querySelectorAll('*')
                    all.forEach(el => {
                        if (el.id !== 'resume-preview' && !el.closest('#resume-preview')) {
                            // Ancestors / siblings outside preview — make transparent
                            el.style.setProperty('background', 'transparent', 'important')
                            el.style.setProperty('background-color', 'transparent', 'important')
                            el.style.setProperty('box-shadow', 'none', 'important')
                        }
                    })
                },
            })

            const imgData = canvas.toDataURL('image/jpeg', 0.98)
            const pdf = new jsPDF('portrait', 'mm', 'a4')
            const pageW = pdf.internal.pageSize.getWidth()
            const pageH = pdf.internal.pageSize.getHeight()

            // Scale image to fit a single A4 page
            const margin = 10
            const maxW = pageW - margin * 2
            const maxH = pageH - margin * 2
            let imgW = maxW
            let imgH = (canvas.height * maxW) / canvas.width
            if (imgH > maxH) {
                imgH = maxH
                imgW = (canvas.width * maxH) / canvas.height
            }
            const x = (pageW - imgW) / 2
            const y = (pageH - imgH) / 2

            pdf.addImage(imgData, 'JPEG', x, y, imgW, imgH)
            pdf.save(`${resume.personalInfo.fullName || resume.title || 'resume'}.pdf`)

            toast.success('PDF downloaded!', { id: 'pdf' })
        } catch (err) {
            console.error('PDF generation error:', err)
            toast.error('Failed to generate PDF. Please try again.', { id: 'pdf' })
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-16">
                <svg className="animate-spin h-8 w-8 text-indigo-500" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            </div>
        )
    }

    return (
        <div className="pt-20 pb-12 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Top bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 animate-fade-in-up">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <input
                            type="text"
                            value={resume.title}
                            onChange={(e) => setResume(prev => ({ ...prev, title: e.target.value }))}
                            className="bg-transparent text-xl md:text-2xl font-bold text-white border-none outline-none focus:ring-0 w-full"
                            placeholder="Resume Title"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="lg:hidden px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-slate-300 transition-all"
                        >
                            {showPreview ? '✏️ Editor' : '👁 Preview'}
                        </button>
                        <button
                            onClick={handleDownloadPDF}
                            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-slate-300 transition-all flex items-center gap-2"
                            id="download-pdf-btn"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            PDF
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="btn-gradient !py-2 !px-6 flex items-center gap-2 disabled:opacity-60"
                            id="save-resume-btn"
                        >
                            {saving ? (
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : null}
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>

                {/* Main layout */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Editor panel */}
                    <div className={`${showPreview ? 'hidden lg:block' : ''} animate-fade-in`}>
                        {/* Tabs */}
                        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
                            {TABS.map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.key
                                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <span>{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="glass-card p-6">
                            {/* Personal Info Tab */}
                            {activeTab === 'personal' && (
                                <div className="space-y-4 animate-fade-in">
                                    <h2 className="text-lg font-semibold text-white mb-4">Personal Information</h2>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name</label>
                                            <input className="input-dark" value={resume.personalInfo.fullName}
                                                onChange={(e) => updatePersonal('fullName', e.target.value)} placeholder="John Doe" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
                                            <input className="input-dark" value={resume.personalInfo.email}
                                                onChange={(e) => updatePersonal('email', e.target.value)} placeholder="john@email.com" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Phone</label>
                                            <input className="input-dark" value={resume.personalInfo.phone}
                                                onChange={(e) => updatePersonal('phone', e.target.value)} placeholder="+1 234 567 890" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Address</label>
                                            <input className="input-dark" value={resume.personalInfo.address}
                                                onChange={(e) => updatePersonal('address', e.target.value)} placeholder="San Francisco, CA" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1.5">LinkedIn</label>
                                            <input className="input-dark" value={resume.personalInfo.linkedin}
                                                onChange={(e) => updatePersonal('linkedin', e.target.value)} placeholder="linkedin.com/in/johndoe" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1.5">GitHub</label>
                                            <input className="input-dark" value={resume.personalInfo.github}
                                                onChange={(e) => updatePersonal('github', e.target.value)} placeholder="github.com/johndoe" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1.5">Professional Summary</label>
                                        <textarea className="textarea-dark" value={resume.personalInfo.summary}
                                            onChange={(e) => updatePersonal('summary', e.target.value)}
                                            placeholder="Brief summary of your professional background and career goals..." rows={4} />
                                    </div>
                                </div>
                            )}

                            {/* Education Tab */}
                            {activeTab === 'education' && (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-semibold text-white">Education</h2>
                                        <button onClick={() => addArrayItem('education', { degree: '', institution: '', startDate: '', endDate: '', description: '' })}
                                            className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Add
                                        </button>
                                    </div>
                                    {resume.education.map((edu, i) => (
                                        <div key={i} className="p-4 rounded-lg bg-white/[0.02] border border-white/5 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-slate-500 font-medium">Education #{i + 1}</span>
                                                {resume.education.length > 1 && (
                                                    <button onClick={() => removeArrayItem('education', i)}
                                                        className="text-xs text-red-400/60 hover:text-red-400 transition-colors">Remove</button>
                                                )}
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-3">
                                                <input className="input-dark" placeholder="Degree" value={edu.degree}
                                                    onChange={(e) => updateArrayField('education', i, 'degree', e.target.value)} />
                                                <input className="input-dark" placeholder="Institution" value={edu.institution}
                                                    onChange={(e) => updateArrayField('education', i, 'institution', e.target.value)} />
                                                <input className="input-dark" placeholder="Start Date (e.g. 2020)" value={edu.startDate}
                                                    onChange={(e) => updateArrayField('education', i, 'startDate', e.target.value)} />
                                                <input className="input-dark" placeholder="End Date (e.g. 2024)" value={edu.endDate}
                                                    onChange={(e) => updateArrayField('education', i, 'endDate', e.target.value)} />
                                            </div>
                                            <textarea className="textarea-dark" placeholder="Description (optional)" value={edu.description}
                                                onChange={(e) => updateArrayField('education', i, 'description', e.target.value)} rows={2} />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Experience Tab */}
                            {activeTab === 'experience' && (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-semibold text-white">Work Experience</h2>
                                        <button onClick={() => addArrayItem('experience', { title: '', company: '', startDate: '', endDate: '', description: '' })}
                                            className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Add
                                        </button>
                                    </div>
                                    {resume.experience.map((exp, i) => (
                                        <div key={i} className="p-4 rounded-lg bg-white/[0.02] border border-white/5 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-slate-500 font-medium">Experience #{i + 1}</span>
                                                {resume.experience.length > 1 && (
                                                    <button onClick={() => removeArrayItem('experience', i)}
                                                        className="text-xs text-red-400/60 hover:text-red-400 transition-colors">Remove</button>
                                                )}
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-3">
                                                <input className="input-dark" placeholder="Job Title" value={exp.title}
                                                    onChange={(e) => updateArrayField('experience', i, 'title', e.target.value)} />
                                                <input className="input-dark" placeholder="Company" value={exp.company}
                                                    onChange={(e) => updateArrayField('experience', i, 'company', e.target.value)} />
                                                <input className="input-dark" placeholder="Start Date" value={exp.startDate}
                                                    onChange={(e) => updateArrayField('experience', i, 'startDate', e.target.value)} />
                                                <input className="input-dark" placeholder="End Date" value={exp.endDate}
                                                    onChange={(e) => updateArrayField('experience', i, 'endDate', e.target.value)} />
                                            </div>
                                            <textarea className="textarea-dark" placeholder="Describe your responsibilities and achievements..." value={exp.description}
                                                onChange={(e) => updateArrayField('experience', i, 'description', e.target.value)} rows={3} />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Skills Tab */}
                            {activeTab === 'skills' && (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-semibold text-white">Skills</h2>
                                        <button onClick={addSkill}
                                            className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Add
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {resume.skills.map((skill, i) => (
                                            <div key={i} className="relative group">
                                                <input className="input-dark pr-8" placeholder="e.g. React" value={skill}
                                                    onChange={(e) => updateSkill(i, e.target.value)} />
                                                {resume.skills.length > 1 && (
                                                    <button onClick={() => removeSkill(i)}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Projects Tab */}
                            {activeTab === 'projects' && (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-semibold text-white">Projects</h2>
                                        <button onClick={() => addArrayItem('projects', { title: '', link: '', description: '' })}
                                            className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Add
                                        </button>
                                    </div>
                                    {resume.projects.map((proj, i) => (
                                        <div key={i} className="p-4 rounded-lg bg-white/[0.02] border border-white/5 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-slate-500 font-medium">Project #{i + 1}</span>
                                                {resume.projects.length > 1 && (
                                                    <button onClick={() => removeArrayItem('projects', i)}
                                                        className="text-xs text-red-400/60 hover:text-red-400 transition-colors">Remove</button>
                                                )}
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-3">
                                                <input className="input-dark" placeholder="Project Name" value={proj.title}
                                                    onChange={(e) => updateArrayField('projects', i, 'title', e.target.value)} />
                                                <input className="input-dark" placeholder="Link (optional)" value={proj.link}
                                                    onChange={(e) => updateArrayField('projects', i, 'link', e.target.value)} />
                                            </div>
                                            <textarea className="textarea-dark" placeholder="Describe the project..." value={proj.description}
                                                onChange={(e) => updateArrayField('projects', i, 'description', e.target.value)} rows={2} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Preview panel */}
                    <div className={`${!showPreview ? 'max-lg:absolute max-lg:-left-[9999px] max-lg:opacity-0' : ''}`}>
                        <div className="sticky top-20">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-medium text-slate-400">Live Preview</h2>
                                <span className="text-xs text-slate-500">Updates in real-time</span>
                            </div>
                            <div className="glass-card p-4 overflow-auto max-h-[calc(100vh-8rem)]">
                                <ResumePreview data={resume} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
