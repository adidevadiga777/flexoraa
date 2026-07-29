import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { templates } from '../templates';

function PortfolioPage() {
    const { slug } = useParams();
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/portfolio/${slug}`);
                if (!response.ok) throw new Error('Portfolio not found');
                const data = await response.json();
                setPortfolio(data.portfolio);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolio();
    }, [slug]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const SelectedTemplate = portfolio
        ? (templates[portfolio.selectedTemplate] || templates.TemplateOne)
        : templates.TemplateOne;

    return <SelectedTemplate portfolio={portfolio} />;
}

export default PortfolioPage;