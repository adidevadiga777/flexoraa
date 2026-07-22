import { useState } from 'react';

function UploadForm() {
    const [resume, setResume] = useState(null);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); // stops the browser's default full-page-reload form behavior

        if (!resume || !image) {
            alert('Please select both a resume and a photo');
            return;
        }

        const formData = new FormData();
        // FormData is the browser's built-in way to package files for multipart upload
        formData.append('resume', resume);
        formData.append('image', image);

        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/upload', {
                method: 'POST',
                credentials: 'include', // This ensures cookies are sent
                body: formData
                // NOTE: do NOT set Content-Type header manually here — 
                // the browser sets it automatically with the correct multipart boundary
            });

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Resume (PDF)</label>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setResume(e.target.files[0])}
                />
            </div>
            <div>
                <label>Profile Photo</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Uploading...' : 'Upload'}
            </button>
        </form>
    );
}

export default UploadForm;
