export function tileHasBooking(prop: any) {
    if (
      prop.path
        .find((x: any) => x.tagName === "BUTTON")
        .classList.value.split(" ")
        .map((x: any) => {
          if (x.includes("booking_nr")) {
            return x;
          } else {
            return null;
          }
        })
        .filter((x: any) => x !== null)[0] !== undefined
    ) {
      return true;
    }
  }