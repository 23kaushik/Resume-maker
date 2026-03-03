export default function ResumePreview({ data }) {
    const { personalInfo = {}, education = [], experience = [], skills = [], projects = [] } = data || {}

    // All colors are inline hex — html2canvas cannot parse Tailwind v4's oklch() format.
    const s = {
        page: {
            fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
            backgroundColor: '#ffffff',
            color: '#000000',
            padding: '0px 48px 10px 48px',
            maxWidth: '210mm',
            margin: '0 auto',
        },
        name: {
            fontSize: '26px',
            fontWeight: '700',
            color: '#000000',
            margin: '0 0 6px 0',
            letterSpacing: '-0.3px',
        },
        contact: {
            fontSize: '12px',
            color: '#111111',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '12px',
        },
        sectionHeading: {
            fontSize: '12px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            color: '#000000',
            borderBottom: '1.5px solid #000000',
            paddingBottom: '3px',
            marginBottom: '8px',
            marginTop: '0',
        },
        section: { marginBottom: '16px' },
        row: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' },
        jobTitle: { fontWeight: '700', fontSize: '13px', color: '#000000' },
        company: { fontSize: '13px', fontWeight: '500', color: '#000000', margin: '1px 0' },
        date: { fontSize: '11px', color: '#000000', whiteSpace: 'nowrap' },
        desc: { fontSize: '12px', color: '#000000', lineHeight: '1.55', marginTop: '2px' },
    }

    return (
        <div id="resume-preview" style={s.page}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '18px', paddingBottom: '14px', borderBottom: '2px solid #000000' }}>
                <h1 style={s.name}>{personalInfo.fullName || 'Your Name'}</h1>
                <div style={{ ...s.contact, color: '#000000' }}>
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span>| {personalInfo.phone}</span>}
                    {personalInfo.address && <span>| {personalInfo.address}</span>}
                    {personalInfo.linkedin && <span>| {personalInfo.linkedin}</span>}
                    {personalInfo.github && <span>| {personalInfo.github}</span>}
                </div>
            </div>

            {/* Summary */}
            {personalInfo.summary && (
                <div style={s.section}>
                    <h2 style={s.sectionHeading}>Professional Summary</h2>
                    <p style={s.desc}>{personalInfo.summary}</p>
                </div>
            )}

            {/* Experience */}
            {experience.some(e => e.title || e.company) && (
                <div style={s.section}>
                    <h2 style={s.sectionHeading}>Work Experience</h2>
                    {experience.map((exp, i) => (exp.title || exp.company) && (
                        <div key={i} style={{ marginBottom: '10px' }}>
                            <div style={s.row}>
                                <span style={s.jobTitle}>{exp.title}</span>
                                <span style={s.date}>{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}</span>
                            </div>
                            <p style={s.company}>{exp.company}</p>
                            {exp.description && <p style={s.desc}>{exp.description}</p>}
                        </div>
                    ))}
                </div>
            )}

            {/* Education */}
            {education.some(e => e.degree || e.institution) && (
                <div style={s.section}>
                    <h2 style={s.sectionHeading}>Education</h2>
                    {education.map((edu, i) => (edu.degree || edu.institution) && (
                        <div key={i} style={{ marginBottom: '10px' }}>
                            <div style={s.row}>
                                <span style={s.jobTitle}>{edu.degree}</span>
                                <span style={s.date}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}</span>
                            </div>
                            <p style={s.company}>{edu.institution}</p>
                            {edu.description && <p style={s.desc}>{edu.description}</p>}
                        </div>
                    ))}
                </div>
            )}

            {/* Skills — plain comma-separated text, no badges */}
            {skills.some(s => s.trim()) && (
                <div style={s.section}>
                    <h2 style={s.sectionHeading}>Skills</h2>
                    <p style={{ fontSize: '12px', color: '#000000', lineHeight: '1.6' }}>
                        {skills.filter(sk => sk.trim()).join('  •  ')}
                    </p>
                </div>
            )}

            {/* Projects */}
            {projects.some(p => p.title) && (
                <div style={s.section}>
                    <h2 style={s.sectionHeading}>Projects</h2>
                    {projects.map((proj, i) => proj.title && (
                        <div key={i} style={{ marginBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                <span style={s.jobTitle}>{proj.title}</span>
                                {proj.link && (
                                    <a href={proj.link} style={{ fontSize: '11px', color: '#000000', textDecoration: 'underline' }}
                                        target="_blank" rel="noreferrer">Link</a>
                                )}
                            </div>
                            {proj.description && <p style={s.desc}>{proj.description}</p>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
