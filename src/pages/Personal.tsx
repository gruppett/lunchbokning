import React from "react";
import HjortenCalendar from "../components/Calendar/calendar";
import PersonalBooking from "../components/Booking/Personal";

function Personal() {
  return (
    <>
      <PersonalBooking />
      <HjortenCalendar view="Personal" />
    </>
  );
}

export default Personal;
