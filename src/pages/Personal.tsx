import React, { useState } from "react";
import HjortenCalendar from "../components/Calendar/calendar";
import PersonalBooking from "../components/Booking/Personal";

function Personal() {
  const [booking, setBooking] = useState(null as any);
  const [bookings, setBookings] = useState(null as any);

  return (
    <>
      <PersonalBooking setBooking={setBooking} bookings={bookings} />
      <HjortenCalendar
        view="Personal"
        bookingID={booking}
        setBookings={setBookings}
      />
    </>
  );
}

export default Personal;
