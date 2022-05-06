import React, { useState } from "react";
import HjortenCalendar from "../components/Calendar/calendar";
import ExternalGroupBooking from "../components/Booking/ExternalGroup";

function ExternalGroups() {
  const [booking, setBooking] = useState(null as any);
  const [bookings, setBookings] = useState(null as any);
  const [group, setGroup] = useState(null as any);

  return (
    <>
      <ExternalGroupBooking
        setBooking={setBooking}
        bookings={bookings}
        setGroup={setGroup}
      />
      <HjortenCalendar
        view="Groups"
        group={group}
        bookingID={booking}
        setBookings={setBookings}
      />
    </>
  );
}

export default ExternalGroups;
