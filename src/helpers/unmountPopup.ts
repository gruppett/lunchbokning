import { unmountComponentAtNode } from "react-dom";

export function unmountPopup() {
    unmountComponentAtNode(document.getElementById("popup") as Element);
    let root = document.getElementById("root") as Element;
    let popupDiv = document.getElementById("popup");
    root.removeChild(popupDiv as Element);
}