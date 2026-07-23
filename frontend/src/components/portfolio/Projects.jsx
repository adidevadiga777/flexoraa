function Projects({ projects }) {
    return (
        <section style={{ padding: '4rem 2rem', maxWidth: '700px', margin: '0 auto' }}>
            <h2>Projects</h2>
            {projects.map((project) => (
                <div key={project.name} style={{ marginBottom: '2rem' }}>
                    <h3>{project.name}</h3>
                    <p>{project.description || project.achievementDescription}</p>
                </div>
            ))}
        </section>
    );
}

export default Projects;