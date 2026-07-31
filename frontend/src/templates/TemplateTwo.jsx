import { motion } from 'framer-motion';
import {
    ArrowUpRight, FolderGit2, Code2,
    Layers, CheckCircle, ExternalLink, User, Briefcase, Sparkles
} from 'lucide-react';

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } } };

/* ─── Dark palette ─── */
const VOID = '#0A0A0A';       // page background
const SURFACE = '#151319';    // lifted card surface
const SURFACE2 = '#1C1A22';   // nested surface (one level up)
const BONE = '#F5F3EE';       // primary text
const MUTED = '#8B8790';      // secondary text
const BORDER = '#2A2730';     // hairline borders on dark
const LIME = '#D6FF3F';
const PINK = '#FF3EC8';

/* Offset shadows now GLOW in accent color instead of flat black — that's what reads as dark, not just inverted */
const glowShadow = (color, x = 6, y = 6, blur = 0) => `${x}px ${y}px ${blur}px 0px ${color}`;

function TemplateTwo({ portfolio }) {
    const { structuredData, portfolioContent, imageUrl } = portfolio;
    const displayName = portfolioContent?.name || structuredData?.name || 'Developer';
    const tagline = portfolioContent?.tagline || structuredData?.title || 'Full-Stack Developer';
    const heroBio = portfolioContent?.heroBio || portfolioContent?.summary || (
        portfolioContent?.bio && portfolioContent.bio.includes('.') && portfolioContent.bio.split('.').filter(Boolean).length > 1
            ? portfolioContent.bio.split('.').filter(Boolean)[0].trim() + '.'
            : portfolioContent?.bio || 'Passionate developer building high quality web applications.'
    );
    const aboutBio = portfolioContent?.aboutBio || portfolioContent?.bio || structuredData?.summary || 'Passionate developer building high quality web applications.';
    const skills = portfolioContent?.topSkills || structuredData?.skills || ['JavaScript', 'React', 'Node.js'];
    const projects = portfolioContent?.polishedProjects || structuredData?.projects || [];
    const experience = portfolioContent?.polishedExperience || structuredData?.experience || [];

    const nameParts = displayName.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const restName = nameParts.slice(1).join(' ');
    const yearsExp = experience.length > 0 ? `${experience.length}+` : '1+';
    const marqueeItems = [...skills, ...skills, ...skills, ...skills];

    // Dynamic styles and fonts setup
    const themeColors = portfolioContent?.themeColors || {};
    const VOID = themeColors.background || '#0A0A0A';
    const BONE = themeColors.text || '#F5F3EE';
    const LIME = themeColors.primary || '#D6FF3F';
    const PINK = themeColors.accent || '#FF3EC8';
    
    // Derived or specific surfaces
    const SURFACE = themeColors.secondary || '#151319';
    const SURFACE2 = themeColors.surfaceCard || '#1C1A22';
    const BORDER = themeColors.border || '#2A2730';
    const MUTED = themeColors.muted || '#8B8790';

    const chosenFont = portfolioContent?.fontFamily || 'Space Grotesk';
    const headerFont = portfolioContent?.headerFontFamily || portfolioContent?.fontFamily || 'Archivo Black';
    const fontUrl = `https://fonts.googleapis.com/css2?family=${chosenFont.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800;900&family=${headerFont.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800;900&display=swap`;
    const HEADER_FONT = `'${headerFont}', sans-serif`;

    return (
        <div className="min-h-screen relative overflow-x-hidden" style={{ fontFamily: `'${chosenFont}', system-ui, sans-serif`, backgroundColor: VOID, color: BONE }}>
            <link href={fontUrl} rel="stylesheet" />
            <style>{`
                @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                .marquee-track { animation: marquee 22s linear infinite; }
                @media (prefers-reduced-motion: reduce) { .marquee-track { animation: none; } }
            `}</style>

            {/* Ambient glow — gives the void some depth instead of flat black */}
            <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle, ${LIME}12, transparent 70%)` }} />

            <header className="sticky top-0 z-50" style={{ backgroundColor: `${VOID}E6`, backdropFilter: 'blur(12px)', borderBottom: `1px solid ${BORDER}` }}>
                <div className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 py-4">
                    <a href="#" className="flex items-center gap-2.5 no-underline">
                        <div className="w-9 h-9 flex items-center justify-center rounded-md" style={{ backgroundColor: LIME, boxShadow: glowShadow(`${LIME}55`, 0, 0, 16) }}>
                            <span className="font-black text-sm" style={{ fontFamily: HEADER_FONT, color: VOID }}>{firstName.charAt(0)}</span>
                        </div>
                        <span className="text-[15px] font-bold tracking-tight" style={{ color: BONE }}>{displayName}</span>
                    </a>
                    <nav className="hidden sm:flex items-center gap-2 text-[13px] font-semibold">
                        {['About', 'Skills', 'Work'].map((label) => (
                            <a key={label} href={`#${label.toLowerCase()}`} className="px-3 py-1.5 rounded-md no-underline hover:-translate-y-0.5 transition-transform" style={{ color: MUTED }}>{label}</a>
                        ))}
                        <a href="#contact" className="ml-2 px-4 py-2 rounded-md text-[12px] font-bold no-underline hover:-translate-y-0.5 transition-transform" style={{ backgroundColor: LIME, color: VOID, boxShadow: glowShadow(`${PINK}66`, 3, 3) }}>Hire Me</a>
                    </nav>
                </div>
            </header>

            <div className="overflow-hidden py-2.5" style={{ backgroundColor: SURFACE, borderBottom: `1px solid ${BORDER}` }}>
                <div className="flex whitespace-nowrap marquee-track w-max">
                    {marqueeItems.map((skill, i) => (
                        <span key={i} className="flex items-center gap-6 px-6 text-[13px] font-bold uppercase tracking-wide" style={{ color: MUTED }}>
                            {skill} <Sparkles className="w-3.5 h-3.5" style={{ color: LIME }} />
                        </span>
                    ))}
                </div>
            </div>

            <main className="relative z-10">
                <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
                        <motion.div variants={stagger} initial="hidden" animate="visible" className="lg:col-span-7 space-y-7">
                            <motion.div variants={fadeUp}>
                                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-[12px] font-bold uppercase" style={{ backgroundColor: SURFACE, border: `1px solid ${LIME}`, color: LIME }}>
                                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: LIME }} /> Open to work
                                </span>
                            </motion.div>
                            <motion.h1 variants={fadeUp} className="leading-[0.95]">
                                <span className="block text-lg sm:text-xl font-medium mb-2" style={{ color: MUTED }}>Hey, I'm</span>
                                <span className="block text-6xl sm:text-7xl lg:text-8xl" style={{ fontFamily: HEADER_FONT, color: BONE }}>{firstName}</span>
                                {restName && (
                                    <span className="block text-6xl sm:text-7xl lg:text-8xl" style={{ fontFamily: HEADER_FONT, color: LIME }}>{restName}</span>
                                )}
                            </motion.h1>
                            <motion.p variants={fadeUp} className="text-lg sm:text-xl font-semibold max-w-lg" style={{ color: BONE }}>{tagline}</motion.p>
                            <motion.p variants={fadeUp} className="text-[15px] leading-relaxed max-w-md" style={{ color: MUTED }}>
                                {heroBio}
                            </motion.p>
                            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 pt-1">
                                <a href="#projects" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-[14px] font-bold no-underline transition-all hover:translate-x-[3px] hover:translate-y-[3px]" style={{ backgroundColor: LIME, color: VOID, boxShadow: glowShadow(`${LIME}44`, 5, 5, 20) }}>
                                    View Work <ArrowUpRight className="w-4 h-4" />
                                </a>
                                <a href="#about" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-[14px] font-bold no-underline transition-all hover:translate-x-[3px] hover:translate-y-[3px]" style={{ backgroundColor: SURFACE, color: BONE, border: `1px solid ${BORDER}`, boxShadow: glowShadow(`${PINK}33`, 5, 5, 20) }}>
                                    About Me
                                </a>
                            </motion.div>
                            <motion.div variants={fadeUp} className="flex gap-3 pt-6 flex-wrap">
                                {[{ label: 'Projects', value: projects.length || '3' }, { label: 'Skills', value: skills.length }, { label: 'Years', value: yearsExp }].map((stat, i) => (
                                    <div key={stat.label} className="px-4 py-3 rounded-md" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, boxShadow: glowShadow(i === 1 ? `${PINK}22` : `${LIME}22`, 0, 0, 14) }}>
                                        <div className="text-xl font-black" style={{ fontFamily: HEADER_FONT, color: i === 1 ? PINK : LIME }}>{stat.value}</div>
                                        <div className="text-[10px] font-bold uppercase tracking-wide" style={{ color: MUTED }}>{stat.label}</div>
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, scale: 0.9, rotate: -2 }} animate={{ opacity: 1, scale: 1, rotate: -2 }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-5 flex justify-center">
                            <div className="relative w-full max-w-[340px]">
                                <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}`, boxShadow: glowShadow(`${LIME}33`, 10, 10, 40) }}>
                                    <img src={imageUrl} alt={displayName} className="w-full aspect-[3/4] object-cover" />
                                </div>
                                <motion.div initial={{ opacity: 0, rotate: -8, y: 10 }} animate={{ opacity: 1, rotate: -8, y: 0 }} transition={{ delay: 0.6 }} className="absolute -top-4 -left-5 px-3 py-1.5 rounded-md text-[11px] font-bold flex items-center gap-1.5" style={{ backgroundColor: PINK, color: VOID, boxShadow: glowShadow(`${PINK}66`, 0, 0, 16) }}>
                                    <Code2 className="w-3.5 h-3.5" /> {skills[0]}
                                </motion.div>
                                <motion.div initial={{ opacity: 0, rotate: 6, y: -10 }} animate={{ opacity: 1, rotate: 6, y: 0 }} transition={{ delay: 0.8 }} className="absolute -bottom-4 -right-5 px-3 py-1.5 rounded-md text-[11px] font-bold flex items-center gap-1.5" style={{ backgroundColor: LIME, color: VOID, boxShadow: glowShadow(`${LIME}66`, 0, 0, 16) }}>
                                    <Layers className="w-3.5 h-3.5" /> {skills[1] || 'Design'}
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <section id="about" className="scroll-mt-20 max-w-6xl mx-auto px-5 sm:px-8 pb-24">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl p-8 sm:p-12" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
                        <div className="flex items-center gap-3 pb-6 mb-6" style={{ borderBottom: `1px solid ${BORDER}` }}>
                            <User className="w-5 h-5" style={{ color: LIME }} />
                            <h2 className="text-2xl font-black" style={{ fontFamily: HEADER_FONT, color: BONE }}>About Me</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                            <p className="md:col-span-8 text-base sm:text-lg leading-relaxed" style={{ color: MUTED }}>{aboutBio}</p>
                            <div className="md:col-span-4 p-5 rounded-xl space-y-3" style={{ backgroundColor: `${LIME}0D`, border: `1px solid ${LIME}44` }}>
                                <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: LIME }}>Highlights</div>
                                {['Clean & Tested Code', 'Full-Stack Delivery', 'Fast & Optimized'].map((item) => (
                                    <div key={item} className="flex items-center gap-2 text-[13px]" style={{ color: BONE }}><CheckCircle className="w-4 h-4 shrink-0" style={{ color: LIME }} /> {item}</div>
                                ))}
                            </div>
                        </div>
                        {experience.length > 0 && (
                            <div className="pt-8 mt-8 space-y-4" style={{ borderTop: `1px solid ${BORDER}` }}>
                                <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: PINK }}>Experience</div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {experience.map((exp, idx) => (
                                        <div key={idx} className="p-5 rounded-xl" style={{ backgroundColor: SURFACE2, border: `1px solid ${BORDER}` }}>
                                            <div className="flex justify-between gap-2 mb-1">
                                                <span className="font-bold text-[14px]" style={{ color: BONE }}>{exp.role}</span>
                                                <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: `${PINK}1A`, color: PINK }}>{exp.duration}</span>
                                            </div>
                                            <div className="text-[12px] font-semibold mb-2" style={{ color: LIME }}>{exp.company}</div>
                                            <p className="text-[12px] leading-relaxed" style={{ color: MUTED }}>{exp.achievementDescription || exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </section>

                <section id="skills" className="scroll-mt-20 max-w-6xl mx-auto px-5 sm:px-8 pb-24">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-7">
                        <div className="flex items-center gap-3"><Code2 className="w-5 h-5" style={{ color: LIME }} /><h2 className="text-2xl font-black" style={{ fontFamily: HEADER_FONT, color: BONE }}>Skills</h2></div>
                        <div className="flex flex-wrap gap-3">
                            {skills.map((skill, idx) => {
                                const accent = idx % 3 === 0 ? LIME : idx % 3 === 1 ? PINK : BONE;
                                return (
                                    <span key={idx} className="px-4 py-2.5 rounded-lg text-[13px] font-bold" style={{ backgroundColor: SURFACE, border: `1px solid ${accent}55`, color: accent, boxShadow: glowShadow(`${accent}22`, 0, 0, 12), transform: `rotate(${(idx % 5) - 2}deg)` }}>
                                        {skill}
                                    </span>
                                );
                            })}
                        </div>
                    </motion.div>
                </section>

                <section id="projects" className="scroll-mt-20 max-w-6xl mx-auto px-5 sm:px-8 pb-24">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-7">
                        <div className="flex items-center gap-3"><Briefcase className="w-5 h-5" style={{ color: PINK }} /><h2 className="text-2xl font-black" style={{ fontFamily: HEADER_FONT, color: BONE }}>Featured Work</h2></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {projects.map((proj, idx) => (
                                <motion.div key={idx} whileHover={{ y: -4 }} className="rounded-xl p-6 sm:p-7 flex flex-col justify-between transition-all" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, boxShadow: glowShadow(idx % 2 === 0 ? `${LIME}22` : `${PINK}22`, 0, 8, 30) }}>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-[11px] font-bold">
                                            <span style={{ color: MUTED }}>PROJECT {String(idx + 1).padStart(2, '0')}</span>
                                            <span className="px-2 py-0.5 rounded" style={{ backgroundColor: `${LIME}1A`, color: LIME }}>DONE</span>
                                        </div>
                                        <h3 className="text-xl font-black" style={{ fontFamily: HEADER_FONT, color: BONE }}>{proj.name}</h3>
                                        <p className="text-[13px] leading-relaxed" style={{ color: MUTED }}>{proj.description || proj.achievementDescription}</p>
                                    </div>
                                    <div className="flex items-center gap-4 pt-4 mt-4 text-[12px] font-bold" style={{ borderTop: `1px solid ${BORDER}` }}>
                                        {proj.githubLink && <a href={proj.githubLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 no-underline" style={{ color: BONE }}><FolderGit2 className="w-4 h-4" /> Source</a>}
                                        {proj.liveLink && <a href={proj.liveLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 no-underline ml-auto" style={{ color: PINK }}>Live <ExternalLink className="w-4 h-4" /></a>}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </section>
            </main>

            <section id="contact" className="scroll-mt-20 max-w-6xl mx-auto px-5 sm:px-8 pb-24 pt-10 text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-7">
                    <h2 className="text-4xl sm:text-6xl font-black mb-6" style={{ fontFamily: HEADER_FONT, color: BONE }}>Let's Work Together</h2>
                    <p className="text-lg mb-8 max-w-md mx-auto" style={{ color: MUTED }}>
                        Currently open to new roles and freelance work.
                    </p>
                    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-6">
                        <a href={`mailto:${structuredData?.email || ''}`} className="px-8 py-4 rounded-xl text-[15px] font-bold no-underline transition-all hover:-translate-y-1" style={{ backgroundColor: LIME, color: VOID, boxShadow: glowShadow(`${LIME}44`, 0, 8, 30) }}>
                            {structuredData?.email || 'hello@example.com'}
                        </a>
                        {structuredData?.phone && (
                            <a href={`tel:${structuredData.phone}`} className="px-8 py-4 rounded-xl text-[15px] font-bold no-underline transition-all hover:-translate-y-1" style={{ backgroundColor: SURFACE, color: BONE, border: `1px solid ${BORDER}`, boxShadow: glowShadow(`${PINK}22`, 0, 8, 30) }}>
                                {structuredData.phone}
                            </a>
                        )}
                        {structuredData?.linkedin && (
                            <a href={structuredData.linkedin.startsWith('http') ? structuredData.linkedin : `https://${structuredData.linkedin}`} target="_blank" rel="noreferrer" className="px-8 py-4 rounded-xl text-[15px] font-bold no-underline transition-all hover:-translate-y-1" style={{ backgroundColor: SURFACE, color: BONE, border: `1px solid ${BORDER}`, boxShadow: glowShadow(`${LIME}22`, 0, 8, 30) }}>
                                LinkedIn
                            </a>
                        )}
                        {structuredData?.github && (
                            <a href={structuredData.github.startsWith('http') ? structuredData.github : `https://${structuredData.github}`} target="_blank" rel="noreferrer" className="px-8 py-4 rounded-xl text-[15px] font-bold no-underline transition-all hover:-translate-y-1" style={{ backgroundColor: SURFACE, color: BONE, border: `1px solid ${BORDER}`, boxShadow: glowShadow(`${PINK}22`, 0, 8, 30) }}>
                                GitHub
                            </a>
                        )}
                    </div>
                </motion.div>
            </section>

            <footer className="py-10 text-center text-[12px] font-bold" style={{ backgroundColor: SURFACE, color: MUTED, borderTop: `1px solid ${BORDER}` }}>
                © {new Date().getFullYear()} All rights reserved , Powered By Flexoraa.
            </footer>
        </div>
    );
}

export default TemplateTwo;