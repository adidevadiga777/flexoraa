import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } };

// Clean, flat palette — deep ink text, warm off-white ground, single terracotta accent.
// No gradients, no glass, no shadows.
const PAPER = '#F6F3EC';
const INK = '#1B1B18';
const STONE = '#847F71';
const CLAY = '#B4522B';
const HAIRLINE = '#DEDACD';

function TemplateOne({ portfolio }) {
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

    // Dynamic styles and fonts setup
    const themeColors = portfolioContent?.themeColors || {};
    const PAPER = themeColors.background || '#F6F3EC';
    const INK = themeColors.text || '#1B1B18';
    const STONE = themeColors.secondary || '#847F71';
    const CLAY = themeColors.primary || '#B4522B';
    const HAIRLINE = themeColors.accent || '#DEDACD';

    const chosenFont = portfolioContent?.fontFamily || 'Inter';
    const headerFont = portfolioContent?.headerFontFamily || portfolioContent?.fontFamily || 'Fraunces';
    const fontUrl = `https://fonts.googleapis.com/css2?family=${chosenFont.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800;900&family=${headerFont.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800;900&display=swap`;
    const HEADER_FONT = `'${headerFont}', serif`;

    return (
        <div className="min-h-screen" style={{ fontFamily: `'${chosenFont}', system-ui, sans-serif`, backgroundColor: PAPER, color: INK }}>
            <link href={fontUrl} rel="stylesheet" />

            {/* ═══ HEADER ═══ */}
            <header className="max-w-4xl mx-auto px-6 sm:px-8 pt-10 pb-6 flex items-center justify-between">
                <span className="text-[13px] font-medium tracking-wide" style={{ color: STONE }}>{displayName}</span>
                <nav className="flex items-center gap-6 text-[13px]" style={{ color: STONE }}>
                    <a href="#about" className="no-underline" style={{ color: 'inherit' }}>About</a>
                    <a href="#work" className="no-underline" style={{ color: 'inherit' }}>Work</a>
                    <a href="#contact" className="no-underline" style={{ color: 'inherit' }}>Contact</a>
                </nav>
            </header>

            <main className="max-w-4xl mx-auto px-6 sm:px-8">

                {/* ═══ HERO — text left, photo right ═══ */}
                <motion.section
                    variants={stagger} initial="hidden" animate="visible"
                    className="pt-10 sm:pt-14 pb-20 grid grid-cols-1 sm:grid-cols-12 gap-10 sm:gap-8 items-center"
                >
                    <div className="sm:col-span-7">
                        <motion.div variants={fadeUp} className="flex items-center gap-2 mb-8">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CLAY }} />
                            <span className="text-[12px] uppercase tracking-[0.18em] font-medium" style={{ color: STONE }}>Available for work</span>
                        </motion.div>

                        <motion.h1 variants={fadeUp} className="leading-[1.05] mb-8" style={{ fontFamily: HEADER_FONT }}>
                            <span className="block text-[15px] font-normal mb-4" style={{ fontFamily: "'Inter', sans-serif", color: STONE }}>
                                Hello, my name is
                            </span>
                            <span className="text-4xl sm:text-5xl font-semibold" style={{ color: INK }}>{firstName} </span>
                            <span className="text-4xl sm:text-5xl italic font-normal" style={{ color: CLAY }}>{restName}</span>
                            <span className="block text-xl sm:text-2xl font-light mt-3" style={{ color: STONE }}>— {tagline}</span>
                        </motion.h1>

                        <motion.p variants={fadeUp} className="text-[16px] leading-[1.75] max-w-md mb-10" style={{ color: '#4A4838' }}>
                            {heroBio}
                        </motion.p>

                        <motion.div variants={fadeUp} className="flex items-center gap-8">
                            <a href="#work" className="inline-flex items-center gap-2 text-[14px] font-medium no-underline pb-1"
                                style={{ color: INK, borderBottom: `1px solid ${INK}` }}>
                                View my work <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                            <a href="#contact" className="text-[14px] font-medium no-underline pb-1"
                                style={{ color: STONE, borderBottom: `1px solid ${HAIRLINE}` }}>
                                Get in touch
                            </a>
                        </motion.div>
                    </div>

                    {/* Photo — right side, flat frame, no rotation, no glass card */}
                    <motion.div variants={fadeUp} className="sm:col-span-5 flex justify-center sm:justify-end">
                        <div
                            className="w-56 h-56 sm:w-64 sm:h-64 overflow-hidden"
                            style={{ border: `1px solid ${HAIRLINE}`, backgroundColor: '#EDE9DD' }}
                        >
                            <img
                                src={imageUrl}
                                alt={displayName}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>
                </motion.section>

                <div style={{ borderTop: `1px solid ${HAIRLINE}` }} />

                {/* ═══ ABOUT ═══ */}
                <section id="about" className="py-16">
                    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}>
                        <div className="flex items-baseline gap-4 mb-8">
                            <span className="text-[12px] font-medium" style={{ color: CLAY }}>01</span>
                            <h2 className="text-[13px] uppercase tracking-[0.18em] font-medium" style={{ color: STONE }}>About</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-8">
                            <p className="sm:col-span-8 text-[16px] leading-[1.8]" style={{ color: '#4A4838' }}>{aboutBio}</p>
                            <div className="sm:col-span-4">
                                <div className="text-[12px] uppercase tracking-[0.12em] font-medium mb-3" style={{ color: STONE }}>Focus areas</div>
                                <div className="space-y-1.5">
                                    {skills.slice(0, 5).map((s) => (
                                        <div key={s} className="text-[14px]" style={{ color: INK }}>{s}</div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {experience.length > 0 && (
                            <div className="mt-14 space-y-8">
                                {experience.map((exp, idx) => (
                                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-8 pb-8" style={{ borderBottom: idx < experience.length - 1 ? `1px solid ${HAIRLINE}` : 'none' }}>
                                        <div className="sm:col-span-3 text-[13px]" style={{ color: STONE }}>{exp.duration}</div>
                                        <div className="sm:col-span-9">
                                            <div className="flex items-baseline gap-2 mb-1.5">
                                                <span className="text-[15px] font-medium" style={{ color: INK }}>{exp.role}</span>
                                                <span className="text-[13px]" style={{ color: CLAY }}>· {exp.company}</span>
                                            </div>
                                            <p className="text-[14px] leading-relaxed" style={{ color: '#4A4838' }}>{exp.achievementDescription || exp.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </section>

                <div style={{ borderTop: `1px solid ${HAIRLINE}` }} />

                {/* ═══ WORK ═══ */}
                <section id="work" className="py-16">
                    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}>
                        <div className="flex items-baseline gap-4 mb-10">
                            <span className="text-[12px] font-medium" style={{ color: CLAY }}>02</span>
                            <h2 className="text-[13px] uppercase tracking-[0.18em] font-medium" style={{ color: STONE }}>Selected Work</h2>
                        </div>

                        <div className="space-y-0">
                            {projects.map((proj, idx) => (
                                <a
                                    key={idx}
                                    href={proj.liveLink || '#'}
                                    target={proj.liveLink ? '_blank' : undefined}
                                    rel="noreferrer"
                                    className="group block py-7 no-underline"
                                    style={{ borderBottom: `1px solid ${HAIRLINE}`, color: 'inherit' }}
                                >
                                    <div className="flex items-start justify-between gap-6">
                                        <div className="flex items-baseline gap-4">
                                            <span className="text-[12px] mt-1" style={{ color: STONE }}>{String(idx + 1).padStart(2, '0')}</span>
                                            <div>
                                                <h3 className="text-[19px] font-medium mb-2" style={{ fontFamily: HEADER_FONT, color: INK }}>
                                                    {proj.name}
                                                </h3>
                                                <p className="text-[14px] leading-relaxed max-w-md" style={{ color: '#4A4838' }}>
                                                    {proj.description || proj.achievementDescription}
                                                </p>
                                            </div>
                                        </div>
                                        <ArrowUpRight className="w-4 h-4 shrink-0 mt-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: CLAY }} />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </motion.div>
                </section>

                <div style={{ borderTop: `1px solid ${HAIRLINE}` }} />

                {/* ═══ CONTACT / FOOTER ═══ */}
                <footer id="contact" className="py-16">
                    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                        <div className="flex items-baseline gap-4 mb-6">
                            <span className="text-[12px] font-medium" style={{ color: CLAY }}>03</span>
                            <h2 className="text-[13px] uppercase tracking-[0.18em] font-medium" style={{ color: STONE }}>Contact</h2>
                        </div>
                        <p className="text-[15px] mb-2" style={{ color: '#4A4838' }}>
                            Currently open to new roles and freelance work.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 mt-2 flex-wrap">
                            <a href={`mailto:${structuredData?.email || ''}`} className="text-2xl sm:text-3xl font-medium no-underline inline-block"
                                style={{ fontFamily: HEADER_FONT, color: INK, borderBottom: `1px solid ${INK}` }}>
                                {structuredData?.email || 'hello@example.com'}
                            </a>
                            {structuredData?.phone && (
                                <a href={`tel:${structuredData.phone}`} className="text-2xl sm:text-3xl font-medium no-underline inline-block"
                                    style={{ fontFamily: HEADER_FONT, color: INK, borderBottom: `1px solid ${INK}` }}>
                                    {structuredData.phone}
                                </a>
                            )}
                            {structuredData?.linkedin && (
                                <a href={structuredData.linkedin.startsWith('http') ? structuredData.linkedin : `https://${structuredData.linkedin}`} target="_blank" rel="noreferrer" className="text-2xl sm:text-3xl font-medium no-underline inline-block"
                                    style={{ fontFamily: HEADER_FONT, color: INK, borderBottom: `1px solid ${INK}` }}>
                                    LinkedIn
                                </a>
                            )}
                            {structuredData?.github && (
                                <a href={structuredData.github.startsWith('http') ? structuredData.github : `https://${structuredData.github}`} target="_blank" rel="noreferrer" className="text-2xl sm:text-3xl font-medium no-underline inline-block"
                                    style={{ fontFamily: HEADER_FONT, color: INK, borderBottom: `1px solid ${INK}` }}>
                                    GitHub
                                </a>
                            )}
                        </div>
                        <div className="mt-16 pt-8 text-[12px]" style={{ borderTop: `1px solid ${HAIRLINE}`, color: STONE }}>
                            © {new Date().getFullYear()} All rights reserved , Powered By Flexoraa.
                        </div>
                    </motion.div>
                </footer>
            </main>
        </div >
    );
}

export default TemplateOne;