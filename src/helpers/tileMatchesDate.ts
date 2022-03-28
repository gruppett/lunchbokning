import moment from "moment";

export function tile_Matchesdate(
  tileDate: Date,
  fetch: Array<Object>,
  view: String
) {
  if (fetch !== null) {
    if (
      view === "month" &&
      fetch
        .map((booking: any) => {
          return booking.date;
        })
        .find((x: any) => x === moment(tileDate).format("YYYY-MM-DD"))
    ) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
