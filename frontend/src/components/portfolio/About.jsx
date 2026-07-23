function About({ bio }) {
    return (
        <section style={{ padding: '4rem 2rem', maxWidth: '700px', margin: '0 auto' }}>
            <h2>About Me</h2>
            <p>{bio}</p>
        </section>
    );
}

export default About;
