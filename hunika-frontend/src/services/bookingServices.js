import API from './api';

export const createBooking = (payload) => API.post('/bookings', payload);
export const getBookings = () => API.get('/bookings');