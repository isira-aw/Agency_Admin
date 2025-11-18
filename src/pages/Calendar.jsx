import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { calendarAPI, bookingAPI } from '../services/api';

export default function CalendarView() {
  const [events, setEvents] = useState([]);
  const [todayEvents, setTodayEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCalendar();
  }, []);

  const loadCalendar = async () => {
    try {
      // Try calendar API first, fallback to bookings if not available
      try {
        const [upcomingRes, todayRes] = await Promise.all([
          calendarAPI.getUpcoming(),
          calendarAPI.getToday()
        ]);
        setEvents(upcomingRes.data);
        setTodayEvents(todayRes.data);
      } catch (error) {
        // Fallback to bookings API
        const bookingsRes = await bookingAPI.getAll();
        const bookings = bookingsRes.data;
        
        const today = new Date().toISOString().split('T')[0];
        const todayBookings = bookings.filter(b => b.date === today);
        const upcomingBookings = bookings
          .filter(b => new Date(b.date) >= new Date())
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 7);
        
        setTodayEvents(todayBookings);
        setEvents(upcomingBookings);
      }
    } catch (error) {
      console.error('Error loading calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Calendar</h1>
        <p className="text-gray-600 mt-2">View upcoming events and bookings</p>
      </div>

      {/* Today's Events */}
      {todayEvents.length > 0 && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <CalendarIcon size={24} />
            <h2 className="text-2xl font-bold">Today's Events</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {todayEvents.map((event, idx) => (
              <EventCard key={idx} event={event} isToday />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Events */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center space-x-2 mb-6">
          <CalendarIcon size={24} className="text-gray-700" />
          <h2 className="text-2xl font-bold text-gray-800">Upcoming Events (Next 7 Days)</h2>
        </div>
        
        {events.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No upcoming events</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event, idx) => (
              <EventCard key={idx} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EventCard({ event, isToday = false }) {
  const statusColors = {
    pending: 'border-yellow-400 bg-yellow-50',
    confirmed: 'border-green-400 bg-green-50',
    rejected: 'border-red-400 bg-red-50',
    completed: 'border-blue-400 bg-blue-50'
  };

  const statusBadgeColors = {
    pending: 'bg-yellow-500',
    confirmed: 'bg-green-500',
    rejected: 'bg-red-500',
    completed: 'bg-blue-500'
  };

  const borderColor = isToday 
    ? 'border-white bg-white/90' 
    : statusColors[event.status] || 'border-gray-300 bg-white';

  return (
    <div className={`border-l-4 ${borderColor} p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className={`font-bold ${isToday ? 'text-gray-800' : 'text-gray-700'}`}>
          {event.title || event.name}
        </h3>
        {event.status && (
          <span className={`${statusBadgeColors[event.status]} ${isToday ? 'text-white' : 'text-white'} text-xs px-2 py-1 rounded-full capitalize`}>
            {event.status}
          </span>
        )}
      </div>
      
      <div className="space-y-2 text-sm">
        <div className={`flex items-center space-x-2 ${isToday ? 'text-gray-700' : 'text-gray-600'}`}>
          <CalendarIcon size={14} />
          <span>{event.event_date || event.date}</span>
        </div>
        
        <div className={`flex items-center space-x-2 ${isToday ? 'text-gray-700' : 'text-gray-600'}`}>
          <Clock size={14} />
          <span>{event.event_time || event.time}</span>
        </div>
        
        {(event.location || event.email) && (
          <div className={`flex items-center space-x-2 ${isToday ? 'text-gray-700' : 'text-gray-600'}`}>
            <MapPin size={14} />
            <span className="truncate">{event.location || event.email}</span>
          </div>
        )}
      </div>
    </div>
  );
}
