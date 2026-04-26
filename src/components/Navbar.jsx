import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaTicketAlt } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinkClasses = ({ isActive }) =>
        `px-3 py-2 rounded-lg text-sm font-medium transition ${isActive
            ? 'bg-white/15 text-white'
            : 'text-[#D5E4EE] hover:text-white hover:bg-white/10'
        }`;

    return (
        <nav className="sticky top-0 z-50 pt-4" style={{ fontFamily: '"Sora", sans-serif' }}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-2xl border border-[#123244] bg-gradient-to-r from-[#0E2232] to-[#18384A] shadow-[0_16px_40px_-28px_rgba(7,17,28,0.9)]">
                    <div className="absolute -top-16 left-12 h-36 w-36 rounded-full bg-cyan-300/15 blur-2xl"></div>
                    <div className="absolute -bottom-16 right-12 h-36 w-36 rounded-full bg-emerald-200/10 blur-2xl"></div>

                    <div className="relative flex flex-col md:flex-row justify-between items-center py-4 px-5 md:px-6 gap-4">
                        <Link to="/" className="text-white text-2xl font-semibold flex items-center gap-2.5 tracking-tight">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 border border-white/15">
                                <FaTicketAlt className="text-[#9EE7DF]" />
                            </span>
                            EventX
                        </Link>

                        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                            <NavLink to="/" className={navLinkClasses}>Events</NavLink>
                            {user ? (
                                <>
                                    <NavLink to={user.role === 'admin' ? '/admin' : '/dashboard'} className={navLinkClasses}>
                                        Dashboard
                                    </NavLink>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-white text-[#142736] hover:bg-[#EAF7F5] px-4 py-2 rounded-lg font-semibold text-sm transition"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <NavLink to="/login" className={navLinkClasses}>Login</NavLink>
                                    <Link
                                        to="/register"
                                        className="bg-[#9EE7DF] text-[#0E2232] hover:bg-[#83DDD3] px-4 py-2 rounded-lg font-semibold text-sm transition"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
