import { tile_Matchesdate } from "./tileMatchesDate";
import moment from "moment";

export function BookingClassNames(
  date: Date,
  view: String,
  personalData: any,
  groupBookingData: any
) {
  let booking_nrClassNames: Array<string> = [];
  if (tile_Matchesdate(date, personalData, view)) {
    booking_nrClassNames.push(
      personalData
        .map((booking: any) => {
          return [booking.date];
        })
        .find((x: any) => x[0] === moment(date).format("YYYY-MM-DD"))
        ? "personal_booking_nr" +
            personalData
              .map((booking: any) => {
                return [booking.date, booking.bookingID];
              })
              .find((x: any) => x[0] === moment(date).format("YYYY-MM-DD"))[1]
        : ""
    );
  }
  if (groupBookingData !== undefined) {
    if (tile_Matchesdate(date, groupBookingData, view)) {
      booking_nrClassNames.push(
        groupBookingData
          .map((booking: any) => {
            return [booking.date];
          })
          .find((x: any) => x[0] === moment(date).format("YYYY-MM-DD"))
          ? "group_booking_nr" +
              groupBookingData
                .map((booking: any) => {
                  return [booking.date, booking.bookingID];
                })
                .find((x: any) => x[0] === moment(date).format("YYYY-MM-DD"))[1]
          : ""
      );
    }
  }
  return booking_nrClassNames.filter((booking_nr) => booking_nr !== "");
}
