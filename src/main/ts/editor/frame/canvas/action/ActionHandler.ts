import { fabric } from "fabric";

export interface ActionHandler {

    readonly objects: fabric.Object[];
}
