import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import { FaCalendarAlt, FaMapMarkerAlt, FaChair, FaMoneyBillWave } from 'react-icons/fa';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [existingBookingStatus, setExistingBookingStatus] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);
            } catch (err) {
                setError('Failed to load event details.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    useEffect(() => {
        const fetchMyBookingForEvent = async () => {
            if (!user) {
                setExistingBookingStatus('');
                return;
            }

            try {
                const { data } = await api.get('/bookings/my');
                const bookingForEvent = data.find(
                    (booking) => booking.eventId?._id === id && booking.status !== 'cancelled'
                );

                if (bookingForEvent) {
                    setExistingBookingStatus(bookingForEvent.status);
                    if (bookingForEvent.status === 'confirmed') {
                        setSuccessMsg('Your request is approved and you are already registered.');
                    }
                } else {
                    setExistingBookingStatus('');
                }
            } catch {
                setExistingBookingStatus('');
            }
        };

        fetchMyBookingForEvent();
    }, [id, user]);

    const handleBooking = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setBookingLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            if (!showOTP) {
                await api.post('/bookings/send-otp');
                setShowOTP(true);
                setSuccessMsg('OTP sent to your email. Please verify to confirm booking.');
            } else {
                await api.post('/bookings', { eventId: event._id, otp });
                setSuccessMsg('Booking requested! Awaiting admin confirmation.');
                setExistingBookingStatus('pending');
                setShowOTP(false);
                setEvent({ ...event, availableSeats: event.availableSeats - 1 });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-20 text-xl font-semibold">Loading...</div>;
    }

    if (error && !event) {
        return <div className="text-center py-20 text-xl text-red-500">{error || 'Event not found'}</div>;
    }

    const isSoldOut = event.availableSeats <= 0;
    const isApproved = existingBookingStatus === 'confirmed';
    const isPending = existingBookingStatus === 'pending';
    const seatProgress = event.totalSeats > 0
        ? Math.max(0, Math.min(100, (event.availableSeats / event.totalSeats) * 100))
        : 0;

    const formattedDate = new Date(event.date).toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="max-w-7xl mx-auto" style={{ fontFamily: '"Sora", sans-serif' }}>
            <section className="relative overflow-hidden rounded-[2rem] border border-[#123244] bg-gradient-to-r from-[#0E2232] to-[#18384A] shadow-[0_20px_65px_-40px_rgba(5,16,24,0.8)] mt-8">
                <div className="grid grid-cols-1 md:grid-cols-[1.38fr_0.62fr] min-h-[600px]">
                    <div className="p-8 md:p-11 border-r border-white/10">
                        <div className="h-[300px] md:h-[350px] rounded-3xl overflow-hidden bg-[#0B1E2C] border border-white/10">
                            {event.image ? (
                                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="h-full w-full bg-gradient-to-br from-[#1B3344] to-[#244D62] flex items-center justify-center text-white/60 text-5xl font-bold uppercase tracking-widest px-6 text-center">
                                    {event.category}
                                </div>
                            )}
                        </div>

                        <div className="mt-6 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.18em] font-semibold text-white">
                            {event.category}
                        </div>

                        <h1 className="mt-4 text-4xl md:text-[64px] font-semibold leading-[1.03] text-white drop-shadow-[0_1px_0_rgba(0,0,0,0.2)] max-w-4xl">
                            {event.title}
                        </h1>

                        <p className="mt-5 text-[#D3DEE7] text-lg leading-relaxed max-w-3xl">
                            {event.description}
                        </p>
                    </div>

                    <div className="flex items-start justify-center p-6 md:p-8 pt-10 md:pt-24">
                        <aside className="w-full max-w-[340px] rounded-2xl border border-white/15 bg-[#102B3D]/85 p-5 md:p-6 shadow-sm">
                            <h3 className="text-sm uppercase tracking-[0.16em] font-semibold text-[#BFD0DE] mb-5">Booking Details</h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-start gap-3 text-[#D6E2EB]">
                                    <div className="w-10 h-10 rounded-full bg-[#1A3A4F] border border-white/15 flex items-center justify-center text-[#9EE7DF] shrink-0">
                                        <FaMoneyBillWave />
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.12em] text-[#AFC4D6] font-semibold">Ticket Price</p>
                                        <p className="font-semibold text-[28px] text-white leading-tight">{event.ticketPrice === 0 ? 'Free' : `₹${event.ticketPrice}`}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 text-[#D6E2EB]">
                                    <div className="w-10 h-10 rounded-full bg-[#1A3A4F] border border-white/15 flex items-center justify-center text-[#9EE7DF] shrink-0">
                                        <FaChair />
                                    </div>
                                    <div className="w-full">
                                        <p className="text-xs uppercase tracking-[0.12em] text-[#AFC4D6] font-semibold">Availability</p>
                                        <p className="font-semibold text-white text-[28px] mb-2 leading-tight">{event.availableSeats} / {event.totalSeats}</p>
                                        <div className="h-2.5 w-full rounded-full bg-[#0F2535] overflow-hidden">
                                            <div className="h-full rounded-full bg-[#9EE7DF]" style={{ width: `${seatProgress}%` }}></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 text-[#D6E2EB]">
                                    <div className="w-10 h-10 rounded-full bg-[#1A3A4F] border border-white/15 flex items-center justify-center text-[#9EE7DF] shrink-0">
                                        <FaCalendarAlt />
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.12em] text-[#AFC4D6] font-semibold">Date</p>
                                        <p className="font-semibold text-white text-[16px] leading-tight whitespace-nowrap">{formattedDate}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 text-[#D6E2EB]">
                                    <div className="w-10 h-10 rounded-full bg-[#1A3A4F] border border-white/15 flex items-center justify-center text-[#9EE7DF] shrink-0">
                                        <FaMapMarkerAlt />
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.12em] text-[#AFC4D6] font-semibold">Location</p>
                                        <p className="font-semibold text-white text-[16px] leading-tight">{event.location}</p>
                                    </div>
                                </div>
                            </div>

                            {showOTP && !isApproved && !isPending && (
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-[#BFD0DE] mb-2">Enter OTP to Confirm</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="6-digit code"
                                        className="w-full px-4 py-3 rounded-xl border border-white/20 bg-[#0F2535] focus:ring-2 focus:ring-[#9EE7DF]/30 focus:outline-none transition font-semibold tracking-widest text-center text-lg text-white placeholder:text-[#8CA6BA]"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        maxLength="6"
                                    />
                                </div>
                            )}

                            {!isApproved && !isPending && (
                                <button
                                    onClick={handleBooking}
                                    disabled={isSoldOut || bookingLoading || (showOTP && !otp)}
                                    className={`w-full py-3.5 px-5 rounded-xl font-semibold text-base transition ${isSoldOut || (successMsg && !showOTP)
                                        ? 'bg-[#385B70] text-[#AFC4D6] cursor-not-allowed'
                                        : 'bg-[#9EE7DF] hover:bg-[#83DDD3] text-[#0E2232]'
                                        }`}
                                >
                                    {bookingLoading ? 'Processing...' : (showOTP ? 'Verify OTP & Confirm' : (successMsg && !showOTP ? 'Request Sent' : (isSoldOut ? 'Sold Out' : 'Confirm Registration')))}
                                </button>
                            )}

                            {isPending && (
                                <p className="text-[#F2D66E] mt-3 text-center font-semibold bg-[#9D8A2A]/18 border border-[#D6C16A]/30 p-3 rounded-xl text-[16px]">
                                    Your request is pending.
                                </p>
                            )}

                            {isApproved && (
                                <p className="text-emerald-200 mt-3 text-center font-semibold bg-emerald-400/10 border border-emerald-200/20 p-3 rounded-xl">
                                    Your request is approved and you are already registered.
                                </p>
                            )}

                            {error && (
                                <p className="text-red-200 mt-4 text-center font-medium bg-red-400/10 border border-red-200/20 p-2.5 rounded-xl">
                                    {error}
                                </p>
                            )}

                            {successMsg && !isApproved && !isPending && (
                                <p className="text-emerald-200 mt-4 text-center font-medium bg-emerald-400/10 border border-emerald-200/20 p-2.5 rounded-xl">
                                    {successMsg}
                                </p>
                            )}
                        </aside>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default EventDetail;
