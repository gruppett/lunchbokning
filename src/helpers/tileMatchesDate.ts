import moment from "moment";

export function tile_Matchesdate(tileDate: Date, fetch: Array<Object>, view: String) {
    if (
    view === "month" &&
    fetch
      .map((booking: any) => {
        return booking.date;
      })
      .find((x: any) => x === moment(tileDate).format("YYYY-MM-DD"))
    ) {
        return true;
    }
}