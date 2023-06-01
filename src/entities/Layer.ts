import { Layer } from "@pixi/layers";
import { ITile, Tile } from "./Tiles";

//TODO Have a flag to set the layers as walkable and others for scenario decoration only? ( high side walls, diferent ground on tile?)
///TODO transform those decorative layers in one texture?
export interface ILayer {
    renderOrder: number;
    name: string;
    createdTiles: Array<ITile>;
}

//TODO refactor and see if only a map is necessary
export class MapLayer extends Layer { 
    tiles: Array<Array<Tile | undefined>>; 
    //Create map 
    tileDictonary: Map<string, ITile>;
    renderOrder: number = 0;
    name: string;

    constructor(tiles : Array<Array <Tile | undefined>>) {
        super();
        this.name = `Layer`;
        this.tiles = tiles
        this.group.enableSort = true;
        this.tileDictonary = new Map();
    }

    setLayerZRender(value: number) {
        this.zOrder = value;
        this.renderOrder = value;
    }
}