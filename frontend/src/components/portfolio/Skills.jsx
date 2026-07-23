function Skills({ skills }) {
    return (
        <section style={{ padding: '4rem 2rem', maxWidth: '700px', margin: '0 auto' }}>
            <h2>Top Skills</h2>
            <ul style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', listStyle: 'none', padding: 0 }}>
                {skills.map((skill) => (
                    <li key={skill} style={{ background: '#eee', padding: '0.5rem 1rem', borderRadius: '20px' }}>
                        {skill}
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default Skills;