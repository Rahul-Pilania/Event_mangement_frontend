import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (!showOTP) {
                const data = await login(email, password);
                if (data.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            } else {
                const data = await verifyOTP(email, otp);
                if (data.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            }
        } catch (err) {
            if (err.needsVerification) {
                setShowOTP(true);
                setError('Account not verified. A new OTP has been sent to your email.');
            } else {
                setError(err.message || err);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ fontFamily: '"Sora", sans-serif' }}>
            <section className="relative overflow-hidden rounded-[2rem] border border-[#123244] bg-gradient-to-r from-[#0E2232] to-[#18384A] p-5 sm:p-7 md:p-8 shadow-[0_20px_65px_-40px_rgba(5,16,24,0.8)]">
                <div className="absolute -top-14 left-16 h-36 w-36 rounded-full bg-cyan-300/10 blur-2xl"></div>
                <div className="absolute -bottom-14 right-16 h-36 w-36 rounded-full bg-emerald-200/10 blur-2xl"></div>

                <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_430px] gap-6 items-stretch">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 hidden lg:flex flex-col justify-between">
                        <div>
                            <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] font-semibold text-[#BFD0DE] mb-4">
                                EventX Access
                            </p>
                            <h1 className="text-3xl xl:text-4xl font-semibold text-white leading-tight">Welcome back to your events workspace.</h1>
                            <p className="mt-3 text-[#C9D9E4] max-w-lg">Sign in to manage bookings, approvals, and all your upcoming events from one place.</p>
                        </div>
                        <div className="flex items-center gap-3 mt-8 text-sm text-[#C9D9E4]">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300"></span>
                            Secure login with OTP verification support
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/15 bg-[#0F2738]/85 backdrop-blur-md p-6 sm:p-7">
                        <div className="mb-7 text-center lg:text-left">
                            <h2 className="text-3xl font-semibold text-white mb-2">Sign In</h2>
                            <p className="text-[#C9D9E4]">Access your EventX account</p>
                        </div>

                        {error && (
                            <div className="bg-red-300/10 text-red-100 p-3 rounded-lg mb-6 text-center border border-red-200/30">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {!showOTP ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#D7E4EE] mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-[#AFC2D0] focus:ring-2 focus:ring-cyan-200/40 focus:border-cyan-200/40 transition"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#D7E4EE] mb-2">Password</label>
                                        <input
                                            type="password"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-[#AFC2D0] focus:ring-2 focus:ring-cyan-200/40 focus:border-cyan-200/40 transition"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <label className="block text-sm font-semibold text-[#D7E4EE] mb-2">Verification Code (OTP)</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="6-digit code"
                                        className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-[#AFC2D0] focus:ring-2 focus:ring-cyan-200/40 transition font-bold tracking-widest text-center text-lg"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        maxLength="6"
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#9EE7DF] text-[#0C2434] font-bold py-3 rounded-xl hover:bg-[#89d9d1] transition"
                            >
                                {loading ? 'Processing...' : (showOTP ? 'Verify OTP & Log In' : 'Sign In')}
                            </button>
                        </form>

                        <p className="text-center mt-7 text-[#C9D9E4]">
                            Don't have an account? <Link to="/register" className="text-[#9EE7DF] font-semibold hover:underline">Sign up</Link>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Login;
