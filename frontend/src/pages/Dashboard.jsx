import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import API from '../api'

export default function Dashboard() {
    const navigate = useNavigate()
    const [resumes, setResumes] = useState([])
    const [loading, setLoading] = useState(true)
    const [creating, setCreating] = useState(false)

    useEffect(() => {
        fetchResumes()
    }, [])

    const fetchResumes = async () => {
        try {
            const { data } = await API.get('/resume')
            setResumes(data)
        } catch (err) {
            toast.error('Failed to load resumes')
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = async () => {
        setCreating(true)
        try {
            const { data } = await API.post('/resume', { title: 'My Resume' })
            toast.success('Resume created!')
            navigate(`/resume/${data._id}`)
        } catch (err) {
            toast.error('Failed to create resume')
        } finally {
            setCreating(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this resume?')) return
        try {
            await API.delete(`/resume/${id}`)
            setResumes(resumes.filter((r) => r._id !== id))
            toast.success('Resume deleted')
        } catch (err) {
            toast.error('Failed to delete resume')
        }
    }

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
    }

    return (
        <div className="pt-20 pb-12 min-h-screen">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 animate-fade-in-up">
                    <div>
                        <h1 className="text-3xl font-bold text-white">My Resumes</h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Create, edit, and manage your professional resumes
                        </p>
                    </div>
                    <button
                        onClick={handleCreate}
                        disabled={creating}
                        className="btn-gradient flex items-center gap-2 disabled:opacity-60"
                        id="create-resume-btn"
                    >
                        {creating ? (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        )}
                        New Resume
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex flex-col items-center gap-4">
                            <svg className="animate-spin h-8 w-8 text-indigo-500" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <p className="text-slate-400">Loading your resumes...</p>
                        </div>
                    </div>
                ) : resumes.length === 0 ? (
                    <div className="text-center py-20 animate-fade-in-up">
                        <div className="glass-card max-w-md mx-auto p-10">
                            <div className="text-5xl mb-4">📝</div>
                            <h2 className="text-xl font-semibold text-white mb-2">No Resumes Yet</h2>
                            <p className="text-slate-400 text-sm mb-6">
                                Create your first resume and start landing interviews!
                            </p>
                            <button onClick={handleCreate} disabled={creating} className="btn-gradient">
                                Create Your First Resume
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resumes.map((resume, index) => (
                            <div
                                key={resume._id}
                                className="glass-card p-6 hover:scale-[1.02] transition-all duration-300 animate-fade-in-up group"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Resume card header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                        {resume.title?.charAt(0)?.toUpperCase() || 'R'}
                                    </div>
                                    <button
                                        onClick={() => handleDelete(resume._id)}
                                        className="text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-1"
                                        title="Delete resume"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Title & info */}
                                <h3 className="font-semibold text-white text-lg mb-1 truncate">
                                    {resume.title || 'Untitled Resume'}
                                </h3>
                                <p className="text-xs text-slate-500 mb-1">
                                    {resume.personalInfo?.fullName && (
                                        <span className="text-slate-400">{resume.personalInfo.fullName}</span>
                                    )}
                                </p>
                                <p className="text-xs text-slate-500 mb-4">
                                    Updated {formatDate(resume.updatedAt)}
                                </p>

                                {/* Sections preview */}
                                <div className="flex flex-wrap gap-1.5 mb-5">
                                    {resume.personalInfo?.fullName && (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">Personal</span>
                                    )}
                                    {resume.education?.length > 0 && resume.education.some(e => e.degree) && (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">Education</span>
                                    )}
                                    {resume.experience?.length > 0 && resume.experience.some(e => e.title) && (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300">Experience</span>
                                    )}
                                    {resume.skills?.length > 0 && (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">Skills</span>
                                    )}
                                </div>

                                {/* Edit button */}
                                <button
                                    onClick={() => navigate(`/resume/${resume._id}`)}
                                    className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-slate-300 hover:text-white transition-all font-medium"
                                >
                                    Edit Resume →
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
