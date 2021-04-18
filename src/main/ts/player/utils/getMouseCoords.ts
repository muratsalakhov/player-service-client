import {IPointCoords} from "../interfaces";
import React from "react";

export default (
    e:React.MouseEvent<HTMLElement>,
    canvas:HTMLCanvasElement | null,
    canvasZoom:number
):IPointCoords => {
    const rect = canvas!.getBoundingClientRect();
    const win = canvas!.ownerDocument?.defaultView;
    const offsetTop = rect.top + (win?.pageYOffset || 0);
    const offsetLeft = rect.left + (win?.pageXOffset || 0);
    const cssZoom = canvas!.offsetWidth / canvas!.width;
    return {
        x: (e.pageX - offsetLeft) * canvasZoom / cssZoom,
        y: (e.pageY - offsetTop) * canvasZoom / cssZoom
    };
};