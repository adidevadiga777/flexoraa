import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { templates } from '../templates';
import { API_BASE_URL } from '../config';
import LoadingScreen from '../components/LoadingScreen';

function PortfolioPage() {
    const { slug } = useParams();
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/portfolio/${slug}`);
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

    if (loading) return <LoadingScreen />;
    if (error) return <div>Error: {error}</div>;

    const SelectedTemplate = portfolio
        ? (templates[portfolio.selectedTemplate] || templates.TemplateOne)
        : templates.TemplateOne;

    return <SelectedTemplate portfolio={portfolio} />;
}

export default PortfolioPage;