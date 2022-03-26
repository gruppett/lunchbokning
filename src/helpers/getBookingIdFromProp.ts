import { tileHasBooking } from "./tileHasBooking";

export function getIdFromProp(prop: any) {
    if (tileHasBooking(prop)) {
      let booking_nr = prop.path
        .find((x: any) => x.tagName === "BUTTON")
        .classList.value.split(" ")
        .map((x: any) => {
          if (x.includes("booking_nr")) {
            return x;
          } else {
            return null;
          }
        })
        .filter((x: any) =>
          x !== null
        ).map((x: any) => 
          x.split("booking_nr")
        )
      return booking_nr
    }
  }