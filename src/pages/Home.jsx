import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import {
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaRegClock,
    FaSearch,
    FaShieldAlt,
    FaTicketAlt,
    FaTimes
} from 'react-icons/fa';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [priceFilter, setPriceFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchEvents();
        }, 400); // 400ms debounce
        return () => clearTimeout(timeoutId);
    }, [search]);

    const fetchEvents = async () => {
        try {
            const { data } = await api.get(`/events?search=${search}`);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => setSearch('');

    const filteredEvents = events.filter((event) => {
        if (priceFilter === 'free') return event.ticketPrice === 0;
        if (priceFilter === 'paid') return event.ticketPrice > 0;
        return true;
    });

    return (
        <div className="relative min-h-screen home-bg-glow" style={{ fontFamily: '"Sora", sans-serif' }}>
            <section className="relative overflow-hidden rounded-[2rem] border border-[#123244] mb-14 home-fade-up shadow-[0_20px_65px_-40px_rgba(5,16,24,0.8)]">
                <div className="grid grid-cols-1 xl:grid-cols-[1.35fr_0.65fr] min-h-[520px]">
                    <div className="relative p-8 md:p-14 bg-gradient-to-br from-[#0E2232] to-[#18384A] text-white">
                        <div className="absolute top-0 right-0 h-52 w-52 bg-cyan-300/10 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-12 -left-10 h-60 w-60 bg-emerald-200/10 rounded-full blur-3xl"></div>

                        <div className="relative z-10 max-w-3xl">
                            <p className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] font-semibold text-white/90">
                                Welcome to EventX
                            </p>
                            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] text-white">
                                Find Your Next
                                <span className="block text-[#9EE7DF]">Unforgettable Experience</span>
                            </h1>
                            <p className="mt-6 text-lg text-[#D3DEE7] max-w-2xl leading-relaxed">
                                Discover the best tech conferences, late-night music festivals, and hands-on workshops happening directly in your area. Secure your spot today.
                            </p>

                           
                        </div>
                    </div>

                    <div className="relative p-8 md:p-10 bg-gradient-to-br from-[#0E2232] to-[#18384A] border-l border-[#123244] flex flex-col justify-center">
                        <div className="rounded-2xl border border-white/20 bg-[#102B3D]/85 p-6 shadow-sm">
                            <label className="text-xs uppercase tracking-[0.16em] font-semibold text-[#BFD0DE]">Search Events</label>
                            <div className="mt-3 relative">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#96B1C4]" />
                                <input
                                    type="text"
                                    placeholder="Search events by title..."
                                    className="w-full rounded-xl border border-white/20 bg-[#0F2535] py-3.5 pl-11 pr-12 text-white placeholder:text-[#8CA6BA] focus:outline-none focus:ring-2 focus:ring-[#9EE7DF]/30"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-[#1A3A4F] text-[#C7D8E5] hover:bg-[#24485F] transition"
                                        aria-label="Clear search"
                                    >
                                        <FaTimes className="mx-auto text-xs" />
                                    </button>
                                )}
                            </div>

                            <div className="mt-5">
                                <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#BFD0DE] mb-2">Filter by price</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { key: 'all', label: 'All' },
                                        { key: 'free', label: 'Free' },
                                        { key: 'paid', label: 'Paid' }
                                    ].map((option) => (
                                        <button
                                            key={option.key}
                                            type="button"
                                            onClick={() => setPriceFilter(option.key)}
                                            className={`rounded-lg border py-2 text-sm font-semibold transition ${priceFilter === option.key
                                                ? 'border-[#9EE7DF] bg-[#9EE7DF] text-[#0E2232]'
                                                : 'border-white/20 bg-[#0F2535] text-[#C7D8E5] hover:border-[#9EE7DF]/60'
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="rounded-xl border border-white/20 bg-[#102B3D]/85 p-4">
                                <p className="text-xs uppercase tracking-[0.14em] text-[#AFC4D6] font-semibold">Status</p>
                                <p className="mt-1 text-white font-semibold">Live Event Discovery</p>
                            </div>
                            <div className="rounded-xl border border-white/20 bg-[#102B3D]/85 p-4">
                                <p className="text-xs uppercase tracking-[0.14em] text-[#AFC4D6] font-semibold">Experience</p>
                                <p className="mt-1 text-white font-semibold">Fast & Simple Search</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mb-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {[
                    {
                        icon: <FaRegClock />,
                        title: 'Fast Booking',
                        text: 'Secure your tickets instantly with our fast streamlined booking infrastructure built for speed.'
                    },
                    {
                        icon: <FaTicketAlt />,
                        title: 'Seamless Access',
                        text: 'Download tickets instantly or manage them right from your personal dashboard with easily.'
                    },
                    {
                        icon: <FaShieldAlt />,
                        title: 'Secure Platform',
                        text: 'All transactions and registrations are bounded by cutting-edge security and 2FA OTP tech.'
                    }
                ].map((item, index) => (
                    <article
                        key={item.title}
                        className="home-fade-up rounded-2xl border border-[#ECE7DC] bg-white p-8 md:p-10"
                        style={{ animationDelay: `${(index + 1) * 110}ms` }}
                    >
                        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EDF5F3] text-[#2E6A70] text-xl mb-5">
                            {item.icon}
                        </div>
                        <h3 className="text-2xl font-semibold text-[#1F2D3A]">{item.title}</h3>
                        <p className="mt-3 text-[#5F6D79] text-base leading-relaxed max-w-xl">{item.text}</p>
                    </article>
                ))}
            </section>

            <section>
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
                    <div>
                        <p className="text-xs uppercase tracking-[0.16em] font-semibold text-[#7A7A6E]">Upcoming Events</p>
                        <h2 className="text-3xl md:text-4xl font-semibold text-[#1F2D3A] mt-2">Upcoming Events</h2>
                    </div>
                    <p className="rounded-full border border-[#E4DED0] bg-white px-4 py-2 text-sm text-[#667085] font-medium w-fit">
                        {filteredEvents.length} results found
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="rounded-2xl border border-[#ECE7DC] bg-white p-7 animate-pulse">
                                <div className="h-48 rounded-xl bg-[#F1EEE8]"></div>
                                <div className="h-5 w-1/3 rounded bg-[#F1EEE8] mt-5"></div>
                                <div className="h-5 w-2/3 rounded bg-[#F1EEE8] mt-2"></div>
                                <div className="h-3 w-full rounded bg-[#F1EEE8] mt-5"></div>
                                <div className="h-10 w-full rounded-xl bg-[#F1EEE8] mt-6"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#D6CFC0] bg-[#FFFEFB] py-20 px-6 text-center">
                        <p className="text-2xl text-[#495665] font-semibold">No events found matching your search.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredEvents.map((event, index) => (
                            <article
                                key={event._id}
                                className="home-fade-up rounded-2xl border border-[#ECE7DC] bg-white overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col"
                                style={{ animationDelay: `${(index + 1) * 90}ms` }}
                            >
                                <div className="h-48 overflow-hidden bg-[#EDE9DF] relative">
                                    {event.image ? (
                                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-[#717A85] text-2xl font-semibold px-6 text-center">
                                            {event.category || 'Event'}
                                        </div>
                                    )}
                                    <span className="absolute top-4 right-4 rounded-full border border-[#E4DDD0] bg-white px-3.5 py-1.5 text-sm font-semibold text-[#2B3947]">
                                        {event.ticketPrice === 0 ? 'FREE' : `₹${event.ticketPrice}`}
                                    </span>
                                </div>

                                <div className="p-6 flex-grow flex flex-col">
                                    <p className="text-xs uppercase tracking-[0.16em] font-semibold text-[#74808C]">{event.category || 'General'}</p>
                                    <h3 className="mt-2 text-xl font-semibold text-[#1F2D3A] leading-snug">{event.title}</h3>

                                    <div className="mt-4 space-y-2 text-[#556270] text-sm">
                                        <p className="flex items-center gap-2.5 text-[15px]">
                                            <FaCalendarAlt className="text-[#90A1AF]" />
                                            {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                        <p className="flex items-center gap-2.5 text-[15px]">
                                            <FaMapMarkerAlt className="text-[#90A1AF]" />
                                            {event.location}
                                        </p>
                                    </div>

                                    <div className="mt-5">
                                        <div className="h-2 w-full rounded-full bg-[#ECE8DF] overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-[#3B6E72]"
                                                style={{ width: `${(event.availableSeats / event.totalSeats) * 100}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-[#6B7280] mt-2">
                                            {event.availableSeats} of {event.totalSeats} seats remaining
                                        </p>
                                    </div>

                                    <Link
                                        to={`/events/${event._id}`}
                                        className="mt-6 inline-flex items-center justify-center gap-2 w-full rounded-xl bg-[#EFF3F2] hover:bg-[#E3EBE9] text-[#1F2D3A] font-semibold py-2.5 transition"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <footer className="mt-16 border-t border-[#E5E1D8] pt-10 pb-3 text-center">
                <div className="flex justify-center items-center gap-2 text-[#2A3B47]">
                    <FaTicketAlt className="text-lg" />
                    <span className="text-lg font-semibold">EventX</span>
                </div>
                <p className="mt-3 text-sm text-[#6B7280] max-w-md mx-auto">
                    The simplest, most dynamic way to manage, discover, and host world-class events in your local city. Let's make memories together.
                </p>
                <div className="mt-4 text-xs text-[#9AA2AB] font-medium uppercase tracking-wider">
                    &copy; {new Date().getFullYear()} EventX Platform. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Home;
