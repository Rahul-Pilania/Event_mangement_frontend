import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMoneyBillWave, FaTicketAlt, FaTimesCircle } from 'react-icons/fa';

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchBookings();
    }, [user, navigate]);

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/bookings/my');
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings', error);
        } finally {
            setLoading(false);
        }
    };

    const cancelBooking = async (id) => {
        if (window.confirm('Are you sure you want to cancel this booking request?')) {
            try {
                await api.delete(`/bookings/${id}`);
                fetchBookings();
            } catch (error) {
                alert(error.response?.data?.message || 'Error cancelling booking');
            }
        }
    };

    const getStatusClasses = (status) => {
        if (status === 'confirmed') return 'bg-emerald-400/15 text-emerald-200 border border-emerald-300/30';
        if (status === 'cancelled') return 'bg-red-400/15 text-red-200 border border-red-300/30';
        return 'bg-amber-400/15 text-amber-200 border border-amber-300/30';
    };

    const getPaymentClasses = (paymentStatus) => {
        if (paymentStatus === 'paid') return 'bg-cyan-300/15 text-cyan-100 border border-cyan-200/30';
        return 'bg-white/10 text-[#D3DEE7] border border-white/20';
    };

    if (loading) return <div className="text-center py-20 text-xl font-semibold">Loading dashboard...</div>;

    return (
        <div className="max-w-7xl mx-auto home-bg-glow" style={{ fontFamily: '"Sora", sans-serif' }}>
            <section className="relative overflow-hidden rounded-[2rem] border border-[#123244] bg-gradient-to-r from-[#0E2232] to-[#18384A] p-6 md:p-8 mb-8 shadow-[0_20px_65px_-40px_rgba(5,16,24,0.8)]">
                <div className="absolute -top-16 left-12 h-36 w-36 rounded-full bg-cyan-300/10 blur-2xl"></div>
                <div className="absolute -bottom-16 right-12 h-36 w-36 rounded-full bg-emerald-200/10 blur-2xl"></div>

                <div className="relative flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
                    <div className="w-20 h-20 bg-white/10 border border-white/15 text-white rounded-full flex items-center justify-center text-3xl font-bold uppercase tracking-widest shrink-0">
                        {user?.name.charAt(0)}
                    </div>
                    <div>
                        <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] font-semibold text-[#BFD0DE] mb-3">
                            User Dashboard
                        </p>
                        <h1 className="text-3xl md:text-4xl font-semibold text-white leading-tight">Welcome, {user?.name}!</h1>
                        <p className="mt-2 text-[#C9D9E4]">Manage your booking requests and track approval status.</p>
                    </div>
                </div>
            </section>

            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1F2D3A] flex items-center gap-2 sm:gap-3">
                    <FaTicketAlt className="text-[#2D5F66]" /> My Booking Requests
                </h2>
                <span className="rounded-full border border-[#D7E4E2] bg-[#F8FBFA] text-[#4A5A67] text-sm font-semibold px-3 py-1.5">
                    {bookings.length} total
                </span>
            </div>

            {bookings.length === 0 ? (
                <div className="rounded-2xl border border-[#D4E5E2] bg-[#F8FBFA] p-12 text-center">
                    <div className="w-20 h-20 bg-[#E8F3F1] border border-[#D4E5E2] rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaTicketAlt className="text-[#2F6A70] text-3xl" />
                    </div>
                    <p className="text-xl text-[#4A5A67] mb-6 mt-4 font-medium">You haven't booked any events yet.</p>
                    <Link to="/" className="inline-block bg-[#1F2D3A] hover:bg-[#16212A] text-white font-semibold py-3 px-8 rounded-xl transition">
                        Browse Events
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((booking) => (
                        <article key={booking._id} className="rounded-2xl border border-[#123244] bg-gradient-to-r from-[#0E2232] to-[#18384A] overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
                            <div className="p-6 border-b border-white/10 flex-grow">
                                {booking.eventId ? (
                                    <>
                                        <div className="flex justify-between items-start mb-4 gap-3">
                                            <h3 className="text-lg font-semibold text-white leading-tight">{booking.eventId.title}</h3>
                                            <div className="flex flex-col gap-1 items-end">
                                                <span className={`px-2.5 py-1 text-[10px] font-black rounded uppercase tracking-wider ${getStatusClasses(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                                {booking.status !== 'cancelled' && (
                                                    <span className={`px-2.5 py-1 text-[10px] font-black rounded uppercase tracking-wider ${getPaymentClasses(booking.paymentStatus)}`}>
                                                        {booking.paymentStatus.replace('_', ' ')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-sm text-[#C9D9E4] mb-4 space-y-2">
                                            <p className="flex items-center gap-2">
                                                <FaCalendarAlt className="text-[#96B1C4]" />
                                                <span><strong className="text-[#E5EEF3]">Date:</strong> {new Date(booking.eventId.date).toLocaleDateString()}</span>
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <FaMoneyBillWave className="text-[#96B1C4]" />
                                                <span><strong className="text-[#E5EEF3]">Amount:</strong> {booking.amount === 0 ? 'Free' : `₹${booking.amount}`}</span>
                                            </p>
                                            <p>
                                                <strong className="text-[#E5EEF3]">Requested:</strong> {new Date(booking.bookedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-red-200 italic">Event details unavailable (might have been deleted)</p>
                                )}
                            </div>

                            <div className="p-4 bg-[#102B3D]/70 border-t border-white/10 flex justify-between items-center shrink-0">
                                {booking.eventId && booking.status !== 'cancelled' ? (
                                    <>
                                        <Link to={`/events/${booking.eventId._id}`} className="text-[#9EE7DF] font-semibold text-sm hover:underline">View Event</Link>
                                        <button
                                            onClick={() => cancelBooking(booking._id)}
                                            className="text-red-200 font-semibold text-sm hover:text-red-100 transition flex items-center gap-1"
                                        >
                                            <FaTimesCircle /> Cancel
                                        </button>
                                    </>
                                ) : (
                                    <div className="w-full text-center text-sm text-[#BFD0DE] italic">Booking Cancelled</div>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
