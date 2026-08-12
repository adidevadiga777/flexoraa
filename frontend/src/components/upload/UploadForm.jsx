import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';

function UploadForm() {
    const [resume, setResume] = useState(null);
    const [image, setImage] = useState(null);
    const [template, setTemplate] = useState('TemplateOne');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!resume || !image) return alert('Please select both files');

        const formData = new FormData();
        formData.append('resume', resume);
        formData.append('image', image);
        formData.append('selectedTemplate', template);

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/upload`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
            const data = await response.json();

            if (response.ok) {
                navigate(`/editor/${data.portfolioId}`); // NEW — go to editor, not portfolio view
            } else {
                alert(data.message || 'Upload failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Choose a template</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="button" onClick={() => setTemplate('TemplateOne')}
                        style={{ border: template === 'TemplateOne' ? '2px solid #2563EB' : '1px solid #ccc', padding: '0.5rem 1rem' }}>
                        Classic
                    </button>
                    <button type="button" onClick={() => setTemplate('TemplateTwo')}
                        style={{ border: template === 'TemplateTwo' ? '2px solid #2563EB' : '1px solid #ccc', padding: '0.5rem 1rem' }}>
                        Modern
                    </button>
                </div>
            </div>

            <input type="file" accept="application/pdf" onChange={(e) => setResume(e.target.files[0])} />
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            <button type="submit" disabled={loading}>{loading ? 'Generating...' : 'Generate Portfolio'}</button>
        </form>
    );
}

export default UploadForm;