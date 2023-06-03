import { Layer } from "@pixi/layers";
import { ITile, Tile } from "./Tiles";

//TODO Have a flag to set as ground or under or over the ground(both only decorative)
//TODO transform those decorative layers in one texture?
//TODO set only 3 layers by default and no add more
export interface ILayer {
    renderOrder: number;
    name: string;
    createdTiles?: Array<ITile>;
}

export class MapLayer extends Layer implements ILayer { 
    //Create map 
    tiles: Map<string, Tile>; //instances on the screen
    tileDictonary: Map<string, ITile>; //data that will be exported

    renderOrder: number = 0;
    name: string;

    constructor() {
        super();
        this.name = `Layer`;
        this.group.enableSort = true;
        this.tiles = new Map();
        this.tileDictonary = new Map();
    }

    setLayerZRender(value: number) {
        this.zOrder = value;
        this.renderOrder = value;
    }
}