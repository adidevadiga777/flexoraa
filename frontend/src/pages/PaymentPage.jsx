import { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router';
import { Loader2, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';

function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const portfolio = location.state?.portfolio;

    const [isPublishing, setIsPublishing] = useState(false);

    // If accessed directly without portfolio state, redirect home
    if (!portfolio) {
        return <Navigate to="/" replace />;
    }

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) { resolve(true); return; }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleGoLive = async () => {
        setIsPublishing(true);
        try {
            const orderRes = await fetch('http://localhost:3000/api/payment/create-order', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ portfolioId: portfolio._id })
            });
            const orderData = await orderRes.json();

            if (!orderRes.ok) {
                alert(orderData.message || 'Failed to initialize payment');
                setIsPublishing(false);
                return;
            }

            if (orderData.alreadyPaid) {
                alert('This portfolio is already published!');
                navigate('/');
                return;
            }

            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                alert('Failed to load Razorpay payment SDK.');
                setIsPublishing(false);
                return;
            }

            const options = {
                key: orderData.keyId,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Flexoraa',
                description: 'Publish Portfolio Website (₹69)',
                order_id: orderData.orderId,
                handler: async function (response) {
                    try {
                        const verifyRes = await fetch('http://localhost:3000/api/payment/verify', {
                            method: 'POST', credentials: 'include',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ portfolioId: portfolio._id, ...response })
                        });
                        const verifyData = await verifyRes.json();
                        if (verifyRes.ok) {
                            // Navigate to the success page with the live URL
                            navigate('/success', { state: { portfolio: verifyData.portfolio, liveUrl: verifyData.liveUrl } });
                        } else {
                            alert(verifyData.message || 'Payment verification failed');
                        }
                    } catch {
                        alert('Error verifying payment. Please contact support.');
                    } finally {
                        setIsPublishing(false);
                    }
                },
                modal: { ondismiss: () => setIsPublishing(false) },
                theme: { color: '#1a1a1a' }
            };
            new window.Razorpay(options).open();
        } catch {
            alert('Something went wrong. Please try again.');
            setIsPublishing(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#f5f0eb] font-['Inter',sans-serif]">
            <Navbar
                onNewChat={() => navigate('/')}
                onOpenChats={() => navigate('/')}
            />

            {/* ── Body: Split Panel ── */}
            <div className="flex flex-1">
                <div className="justify-center mx-auto items-center w-full lg:w-[45%] my-auto">
                    <div />

                    {/* Center content */}
                    <div className="w-full max-w-[360px] mx-auto text-center">
                        <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] text-white flex items-center justify-center mx-auto mb-8 shadow-md">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h1 className="text-[2.5rem] font-bold text-[#1a1a1a] leading-tight tracking-tight mb-2">
                            Ready to go live?
                        </h1>
                        <p className="text-[16px] text-[#6b6b6b] mb-10 leading-relaxed">
                            Pay ₹69 to get your live URL and enjoy your beautiful, shareable AI portfolio.
                        </p>

                        <button
                            onClick={handleGoLive}
                            disabled={isPublishing}
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-[15px] font-bold transition-all disabled:opacity-70 bg-[#1a1a1a] text-white hover:bg-[#333] cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5 border-none"
                        >
                            {isPublishing ? (
                                <><Loader2 size={18} className="animate-spin" /> Processing Payment…</>
                            ) : (
                                <>Pay ₹69 via Razorpay</>
                            )}
                        </button>

                        <button
                            onClick={() => navigate('/')}
                            disabled={isPublishing}
                            className="mt-6 flex items-center justify-center gap-2 text-[14px] font-medium text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors w-full cursor-pointer bg-transparent border-none"
                        >
                            <ArrowLeft size={16} /> Back to Editor
                        </button>
                    </div>

                    {/* Footer */}
                    <p className="text-[12px] text-[#a0a0a0] text-center">
                        © 2026 Flexoraa. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PaymentPage;
