import Hero from '../components/portfolio/Hero';
import About from '../components/portfolio/About';
import Skills from '../components/portfolio/Skills';
import Projects from '../components/portfolio/Projects';

function TemplateOne({ portfolio }) {
    const { structuredData, portfolioContent, imageUrl } = portfolio;

    return (
        <div>
            <Hero
                name={structuredData.name}
                tagline={portfolioContent.tagline}
                imageUrl={imageUrl}
                theme={portfolioContent.themeColors}
            />
            <About bio={portfolioContent.bio} />
            <Skills skills={portfolioContent.topSkills} />
            <Projects projects={portfolioContent.polishedProjects} />
        </div>
    );
}

export default TemplateOne;
