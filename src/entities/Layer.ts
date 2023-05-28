import { Layer } from "@pixi/layers";
import { Tile } from "./Tiles";


export class MapLayer extends Layer{ 
    tiles : Array<Array <Tile | undefined>>;

    constructor( tiles : Array<Array <Tile | undefined>>) {
        super();
        this.tiles = tiles
    }
}