import { Link } from 'react-router-dom'

export default function Home({ user }) {
    const features = [
        {
            icon: '✨',
            title: 'Beautiful Templates',
            desc: 'Professional, modern resume design that stands out from the crowd.',
        },
        {
            icon: '⚡',
            title: 'Real-Time Preview',
            desc: 'See changes instantly as you type — no waiting, no guessing.',
        },
        {
            icon: '📄',
            title: 'PDF Download',
            desc: 'Export your polished resume as a high-quality PDF in one click.',
        },
        {
            icon: '🔒',
            title: 'Secure & Private',
            desc: 'Your data is encrypted and accessible only to you.',
        },
        {
            icon: '🚀',
            title: 'Fast & Simple',
            desc: 'Build a complete resume in under 10 minutes.',
        },
        {
            icon: '💾',
            title: 'Cloud Storage',
            desc: 'Save multiple resumes and edit them from any device.',
        },
    ]

    return (
        <div className="pt-16">
            {/* Hero */}
            <section className="relative overflow-hidden">
                {/* Background decorations */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
                    <div className="text-center animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-indigo-300 mb-6">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                            Build your dream resume today
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
                            <span className="text-white">Craft Resumes That</span>
                            <br />
                            <span className="gradient-text">Land Interviews</span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Create stunning, professional resumes in minutes with our intuitive builder.
                            Real-time preview, beautiful design, and one-click PDF export.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to={user ? '/dashboard' : '/register'}
                                className="btn-gradient text-base px-8 py-4 rounded-xl inline-block text-center"
                            >
                                {user ? 'Go to Dashboard' : 'Start Building — It\'s Free'}
                            </Link>
                            {!user && (
                                <Link
                                    to="/login"
                                    className="px-8 py-4 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white transition-all text-base text-center"
                                >
                                    I have an account
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Floating preview mockup */}
                    <div className="mt-16 md:mt-24 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <div className="glass-card p-4 md:p-6 max-w-4xl mx-auto animate-float">
                            <div className="bg-white rounded-lg p-6 md:p-8 text-gray-900">
                                <div className="text-center border-b-2 border-indigo-500 pb-4 mb-4">
                                    <h2 className="text-xl font-bold">John Doe</h2>
                                    <p className="text-xs text-gray-500 mt-1">john@email.com · +1 234 567 890 · San Francisco, CA</p>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4 text-xs text-gray-600">
                                    <div>
                                        <h3 className="font-bold uppercase text-indigo-600 text-[10px] tracking-wider mb-1">Experience</h3>
                                        <p className="font-semibold text-gray-900">Senior Software Engineer</p>
                                        <p className="text-indigo-600">Google • 2021 – Present</p>
                                    </div>
                                    <div>
                                        <h3 className="font-bold uppercase text-indigo-600 text-[10px] tracking-wider mb-1">Education</h3>
                                        <p className="font-semibold text-gray-900">B.S. Computer Science</p>
                                        <p className="text-indigo-600">Stanford University • 2017 – 2021</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    {['React', 'Node.js', 'Python', 'AWS', 'TypeScript'].map(s => (
                                        <span key={s} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-medium">{s}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 md:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Everything You Need to <span className="gradient-text">Stand Out</span>
                        </h2>
                        <p className="text-slate-400 max-w-xl mx-auto">
                            Powerful features designed to make resume building effortless.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <div
                                key={i}
                                className="glass-card p-6 hover:scale-[1.02] transition-all duration-300 cursor-default animate-fade-in-up"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <div className="text-3xl mb-3">{f.icon}</div>
                                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="glass-card p-10 md:p-16 relative overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl"></div>
                        <div className="relative">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Ready to Build Your Resume?
                            </h2>
                            <p className="text-slate-400 mb-8 max-w-md mx-auto">
                                Join thousands of job seekers who've landed their dream jobs with ResumeForge.
                            </p>
                            <Link
                                to={user ? '/dashboard' : '/register'}
                                className="btn-gradient text-base px-10 py-4 rounded-xl inline-block"
                            >
                                {user ? 'Go to Dashboard' : 'Get Started for Free →'}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-sm text-slate-500">
                        © 2026 <span className="gradient-text font-semibold">ResumeForge</span>. Built with ❤️
                    </p>
                </div>
            </footer>
        </div>
    )
}
