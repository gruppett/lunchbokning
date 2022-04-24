import React, { useState } from "react";
import HjortenCalendar from "../components/Calendar/calendar";
import PersonalBooking from "../components/Booking/Personal";

function Personal() {
  const [booking, setBooking] = useState(null);

  return (
    <>
      <PersonalBooking setBooking={setBooking} />
      <HjortenCalendar view="Personal" bookingID={booking} />
    </>
  );
}

export default Personal;
