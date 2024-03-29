import { tileHasBooking } from "./tileHasBooking";

export function getIdFromProp(prop: any) {
  let booking_nr: any = {
    personal: "",
    group: "",
  };
  var path = prop.path || (prop.composedPath && prop.composedPath());
  if (tileHasBooking(prop)) {
    booking_nr.personal = path
      .find((x: any) => x.tagName === "BUTTON")
      .classList.value.split(" ")
      .map((x: any) => {
        if (x.includes("personal_booking_nr")) {
          return x;
        } else {
          return null;
        }
      })
      .filter((x: any) => x !== null)
      .map((x: any) => x.split("personal_booking_nr"));

    booking_nr.group = path
      .find((x: any) => x.tagName === "BUTTON")
      .classList.value.split(" ")
      .map((x: any) => {
        if (x.includes("group_booking_nr")) {
          return x;
        } else {
          return null;
        }
      })
      .filter((x: any) => x !== null)
      .map((x: any) => x.split("group_booking_nr"));
    if (booking_nr.personal.length !== 0) {
      booking_nr.personal = booking_nr.personal[0][1];
    }
    if (booking_nr.group.length !== 0) {
      booking_nr.group = booking_nr.group[0][1];
    }
    return booking_nr;
  }
}
