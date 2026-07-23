function Hero({ name, tagline, imageUrl, theme }) {
    return (
        <section
            style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textAlign: 'center',
                padding: '2rem'
            }}
        >
            <img
                src={imageUrl}
                alt={name}
                style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '4px solid white',
                    marginBottom: '1.5rem'
                }}
            />
            <h1 style={{ fontSize: '2.5rem', margin: 0 }}>{name}</h1>
            <p style={{ fontSize: '1.2rem', marginTop: '0.5rem', maxWidth: '500px' }}>{tagline}</p>
        </section>
    );
}

export default Hero;