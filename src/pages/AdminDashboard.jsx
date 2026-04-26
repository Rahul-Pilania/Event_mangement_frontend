import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showEventForm, setShowEventForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', image: ''
    });

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            const [eventsRes, bookingsRes] = await Promise.all([
                api.get('/events'),
                api.get('/bookings/my') // Admin gets all bookings
            ]);
            setEvents(eventsRes.data);
            setBookings(bookingsRes.data);
        } catch (error) {
            console.error('Error fetching admin data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/events', formData);
            setShowEventForm(false);
            setFormData({ title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', image: '' });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating event');
        }
    };

    const handleDeleteEvent = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/events/${id}`);
                fetchData();
            } catch (error) {
                alert('Error deleting event');
            }
        }
    };

    const handleConfirmBooking = async (id, paymentStatus) => {
        try {
            await api.put(`/bookings/${id}/confirm`, { paymentStatus });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error confirming booking');
        }
    };

    const handleCancelBooking = async (id) => {
        if (window.confirm('Cancel this user\'s booking request?')) {
            try {
                await api.delete(`/bookings/${id}`);
                fetchData();
            } catch (error) {
                alert(error.response?.data?.message || 'Error cancelling booking');
            }
        }
    };

    const totalRevenue = bookings.reduce(
        (sum, b) => (b.paymentStatus === 'paid' && b.status === 'confirmed' ? sum + b.amount : sum),
        0
    );
    const paidClients = new Set(
        bookings
            .filter((b) => b.paymentStatus === 'paid' && b.status === 'confirmed')
            .map((b) => b.userId?._id)
    ).size;
    const pendingRequests = bookings.filter((b) => b.status === 'pending').length;

    const statusClasses = (status) => {
        if (status === 'confirmed') return 'bg-emerald-400/15 text-emerald-200 border border-emerald-300/30';
        if (status === 'cancelled') return 'bg-red-400/15 text-red-200 border border-red-300/30';
        return 'bg-amber-400/15 text-amber-200 border border-amber-300/30';
    };

    const paymentClasses = (paymentStatus) => {
        if (paymentStatus === 'paid') return 'bg-cyan-300/15 text-cyan-100 border border-cyan-200/30';
        return 'bg-white/10 text-[#D3DEE7] border border-white/20';
    };

    if (loading) return <div className="text-center py-20 text-xl font-semibold">Loading admin panel...</div>;

    return (
        <div className="max-w-7xl mx-auto home-bg-glow" style={{ fontFamily: '"Sora", sans-serif' }}>
            <section className="relative overflow-hidden rounded-[2rem] border border-[#123244] bg-gradient-to-r from-[#0E2232] to-[#18384A] p-6 sm:p-8 mb-8 shadow-[0_20px_65px_-40px_rgba(5,16,24,0.8)]">
                <div className="absolute -top-16 left-12 h-36 w-36 rounded-full bg-cyan-300/10 blur-2xl"></div>
                <div className="absolute -bottom-16 right-12 h-36 w-36 rounded-full bg-emerald-200/10 blur-2xl"></div>

                <div className="relative flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                    <div>
                        <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] font-semibold text-[#BFD0DE] mb-3">
                            Admin Control Center
                        </p>
                        <h1 className="text-3xl md:text-4xl font-semibold text-white mb-2">Admin Dashboard</h1>
                        <p className="text-[#C9D9E4]">Manage events and manually approve or reject booking requests.</p>
                    </div>
                    <button
                        onClick={() => setShowEventForm(!showEventForm)}
                        className="w-full md:w-auto bg-[#9EE7DF] text-[#0C2434] font-bold py-3 px-6 rounded-xl hover:bg-[#89d9d1] transition"
                    >
                        {showEventForm ? 'Close Form' : '+ Create New Event'}
                    </button>
                </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-[#0E2232] to-[#18384A] border border-[#123244] p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-[#BFD0DE] text-xs font-semibold uppercase tracking-[0.15em] mb-2">Total Revenue</p>
                        <h3 className="text-3xl font-black text-emerald-200">₹{totalRevenue}</h3>
                    </div>
                    <div className="w-12 h-12 bg-emerald-300/15 text-emerald-100 border border-emerald-200/25 rounded-full flex items-center justify-center text-lg font-bold">RV</div>
                </div>

                <div className="bg-gradient-to-r from-[#0E2232] to-[#18384A] border border-[#123244] p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-[#BFD0DE] text-xs font-semibold uppercase tracking-[0.15em] mb-2">Paid Clients</p>
                        <h3 className="text-3xl font-black text-cyan-100">{paidClients}</h3>
                    </div>
                    <div className="w-12 h-12 bg-cyan-300/15 text-cyan-100 border border-cyan-200/25 rounded-full flex items-center justify-center text-lg font-bold">CL</div>
                </div>

                <div className="bg-gradient-to-r from-[#0E2232] to-[#18384A] border border-[#123244] p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-[#BFD0DE] text-xs font-semibold uppercase tracking-[0.15em] mb-2">Pending Requests</p>
                        <h3 className="text-3xl font-black text-amber-200">{pendingRequests}</h3>
                    </div>
                    <div className="w-12 h-12 bg-amber-300/15 text-amber-100 border border-amber-200/25 rounded-full flex items-center justify-center text-lg font-bold">PD</div>
                </div>
            </div>

            {showEventForm && (
                <section className="bg-gradient-to-r from-[#0E2232] to-[#18384A] border border-[#123244] p-6 sm:p-8 rounded-2xl mb-8">
                    <h2 className="text-2xl font-semibold mb-6 text-white">Create New Event</h2>
                    <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <input required type="text" placeholder="Event Title" className="px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-[#AFC2D0] focus:ring-2 focus:ring-cyan-200/40 outline-none transition" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        <input required type="text" placeholder="Category (e.g., Tech, Music)" className="px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-[#AFC2D0] focus:ring-2 focus:ring-cyan-200/40 outline-none transition" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                        <input required type="date" className="px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white focus:ring-2 focus:ring-cyan-200/40 outline-none transition" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                        <input required type="text" placeholder="Location" className="px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-[#AFC2D0] focus:ring-2 focus:ring-cyan-200/40 outline-none transition" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                        <input required type="number" placeholder="Total Seats" className="px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-[#AFC2D0] focus:ring-2 focus:ring-cyan-200/40 outline-none transition" value={formData.totalSeats} onChange={e => setFormData({ ...formData, totalSeats: e.target.value })} />
                        <input required type="number" placeholder="Ticket Price (0 for free)" className="px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-[#AFC2D0] focus:ring-2 focus:ring-cyan-200/40 outline-none transition" value={formData.ticketPrice} onChange={e => setFormData({ ...formData, ticketPrice: e.target.value })} />

                        <div className="md:col-span-2">
                            <input type="text" placeholder="Image URL (Provide any direct link to an image)" className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-[#AFC2D0] focus:ring-2 focus:ring-cyan-200/40 outline-none transition" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                        </div>

                        <textarea required placeholder="Event Description" className="px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-[#AFC2D0] md:col-span-2 h-32 focus:ring-2 focus:ring-cyan-200/40 outline-none transition" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        <button type="submit" className="md:col-span-2 bg-[#9EE7DF] text-[#0C2434] font-bold py-3 mt-1 rounded-xl hover:bg-[#89d9d1] transition">Publish Event</button>
                    </form>
                </section>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="flex flex-col">
                    <h2 className="text-2xl font-semibold mb-5 text-[#1F2D3A] flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#DCEBEA] text-[#2D5F66] text-sm font-bold">{events.length}</span>
                        All Events
                    </h2>
                    <div className="rounded-2xl border border-[#123244] bg-gradient-to-r from-[#0E2232] to-[#18384A] overflow-hidden">
                        <ul className="divide-y divide-white/10 max-h-[620px] overflow-y-auto">
                            {events.length === 0 ? <li className="p-6 text-[#C9D9E4] text-center">No events created yet.</li> :
                                events.map(event => (
                                    <li key={event._id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-white/5 transition">
                                        <div>
                                            <h4 className="font-semibold text-white mb-1 leading-tight">{event.title}</h4>
                                            <div className="flex flex-wrap items-center gap-3 text-sm text-[#C9D9E4]">
                                                <span className="flex items-center gap-2 font-medium"><span className="w-2 h-2 rounded-full bg-cyan-300"></span> {new Date(event.date).toLocaleDateString()}</span>
                                                <span className="flex items-center gap-2 font-medium"><span className={`w-2 h-2 rounded-full ${event.availableSeats > 0 ? 'bg-emerald-300' : 'bg-red-300'}`}></span> {event.availableSeats}/{event.totalSeats} seats</span>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDeleteEvent(event._id)} className="w-full sm:w-auto text-red-200 hover:text-white hover:bg-red-500/70 border border-red-300/30 px-4 py-2 rounded-lg text-sm font-semibold transition shrink-0">
                                            Delete
                                        </button>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </section>

                <section className="flex flex-col">
                    <h2 className="text-2xl font-semibold mb-5 text-[#1F2D3A] flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F5EECF] text-[#826A00] text-sm font-bold">{bookings.length}</span>
                        Booking Requests
                    </h2>
                    <div className="rounded-2xl border border-[#123244] bg-gradient-to-r from-[#0E2232] to-[#18384A] overflow-hidden">
                        <ul className="divide-y divide-white/10 max-h-[620px] overflow-y-auto">
                            {bookings.length === 0 ? <li className="p-6 text-[#C9D9E4] text-center">No bookings yet.</li> :
                                bookings.map(booking => (
                                    <li key={booking._id} className="p-5 hover:bg-white/5 transition">
                                        <div className="flex justify-between items-start mb-3 gap-3">
                                            <h4 className="font-semibold text-white text-lg leading-tight">{booking.eventId?.title || 'Deleted Event'}</h4>
                                            <div className="flex flex-col gap-1 items-end shrink-0">
                                                <span className={`px-2.5 py-1 text-[10px] font-black rounded uppercase tracking-wider ${statusClasses(booking.status)}`}>{booking.status}</span>
                                                {booking.status !== 'cancelled' && <span className={`px-2.5 py-1 text-[10px] font-black rounded uppercase tracking-wider ${paymentClasses(booking.paymentStatus)}`}>{booking.paymentStatus.replace('_', ' ')}</span>}
                                            </div>
                                        </div>

                                        <div className="rounded-xl p-3 mb-3 border border-white/10 bg-white/5 text-sm">
                                            <p className="text-[#DCE8F0] flex items-center gap-2 mb-1">
                                                <span className="font-bold w-16 text-[#9FB6C7] uppercase text-xs">User:</span>
                                                <span className="font-semibold">{booking.userId?.name}</span>
                                                <span className="text-[#9FB6C7]">({booking.userId?.email})</span>
                                            </p>
                                            <p className="text-[#DCE8F0] flex items-center gap-2 mb-1">
                                                <span className="font-bold w-16 text-[#9FB6C7] uppercase text-xs">Amount:</span>
                                                <span className={`font-semibold ${booking.amount === 0 ? 'text-emerald-200' : ''}`}>{booking.amount === 0 ? 'Free' : `₹${booking.amount}`}</span>
                                            </p>
                                            <p className="text-[#DCE8F0] flex items-center gap-2 mb-1">
                                                <span className="font-bold w-16 text-[#9FB6C7] uppercase text-xs">Date:</span>
                                                <span>{new Date(booking.bookedAt).toLocaleString()}</span>
                                            </p>
                                            {booking.eventId && (
                                                <p className="text-[#DCE8F0] flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
                                                    <span className="font-bold w-16 text-[#9FB6C7] uppercase text-xs">Seats:</span>
                                                    <span className={`font-bold ${booking.eventId.availableSeats > 0 ? 'text-emerald-200' : 'text-red-200'}`}>{booking.eventId.availableSeats}</span> remaining of {booking.eventId.totalSeats}
                                                </p>
                                            )}
                                        </div>

                                        {booking.status === 'pending' && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                <button onClick={() => handleConfirmBooking(booking._id, 'paid')} className="flex-1 min-w-[130px] bg-emerald-300/15 text-emerald-100 hover:bg-emerald-400/25 border border-emerald-200/30 text-xs font-bold py-2.5 px-3 rounded-lg transition">
                                                    Approve as Paid
                                                </button>
                                                <button onClick={() => handleConfirmBooking(booking._id, 'not_paid')} className="flex-1 min-w-[130px] bg-white/10 text-[#D3DEE7] hover:bg-white/20 border border-white/20 text-xs font-bold py-2.5 px-3 rounded-lg transition">
                                                    Approve Undecided
                                                </button>
                                                <button onClick={() => handleCancelBooking(booking._id)} className="w-[90px] bg-red-300/15 text-red-100 hover:bg-red-400/25 border border-red-200/30 text-xs font-bold py-2.5 px-3 rounded-lg transition">
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;
