export function tileHasBooking(prop: any) {
  var path = prop.path || (prop.composedPath && prop.composedPath());
  if (
      path
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