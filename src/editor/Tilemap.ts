import { Container, Graphics, Point, Polygon, Texture} from "pixi.js";
import { ITile } from "./Tiles";
import { EditorManager } from "../core/EditorManager";

//Export Json
export interface ITilemap {
    tilesetPath: string;
    mapSize: [number, number]; //Number of tiles in the map width x height
    tileSize: [number, number]; //Size of each tile
    tiles : ITile[][]
}

export class TilemapFile extends Container implements ITilemap{
    tilesetPath: string;
    mapSize: [number, number];
    tileSize: [number, number];

    //private tileset: Texture;
    //Represents which tile on the tilesetm(in thee position[0,0],[0,1]) will drawn where;
    //Should be store in a layer
    //tileMap: Array<[number, number]>;
    tiles: ITile[][]; //or store like this?
    //create a local variable only to show where the tiles will be.
    private grid: Container;

    constructor(path : string, numberOfTiles:[number,number], tilesize: [number,number] ) {
        super();
        this.tilesetPath = path;
        this.mapSize = numberOfTiles
        this.tileSize = tilesize;
        this.tiles = [];

        this.grid = new Container();
        //this.tileset = Texture.from(path);

        
        const tileWidth = tilesize[0]; 
        const tileHeight = tilesize[1] / 2 ; // The grid ALWAYS have half the size of the tile
        for (let x = 0; x < numberOfTiles[0]; x++) {
            for (let y = 0; y < numberOfTiles[1]; y++) {
                const square: GridSquare = new GridSquare(new Point(x, y), tileWidth , tileHeight,
                    [0, 0, tileWidth / 2, tileHeight / 2, 0, tileHeight, -tileWidth / 2, tileHeight / 2]);
                
                square.position = new Point(
                    x * tileWidth / 2  - y  * tileWidth /2
                    , x * tileHeight / 2 + y * tileHeight / 2);
                
                this.grid.addChild(square);
            }
        } 
        this.addChild(this.grid);
    }
}

//Class for the representation of the grid of the map
class GridSquare extends Graphics{
    gridPosition: Point
    rectPos: [number, number, number, number, number, number, number, number];
    tileWidth: number;
    tileHeight: number;

    constructor(gridPos : Point, tileWidth : number, tileHeight : number, rect : [number, number, number, number, number, number, number, number]) {
        super(); 
        this.gridPosition = gridPos;
        this.tileHeight = tileHeight;
        this.tileWidth = tileWidth;

        this.rectPos = rect;
        this.lineStyle(1, 0x00000);
        this.alpha = 0.8;

        this.drawPolygon(this.rectPos);
        //Region interactable by the user (mouse)
        this.hitArea = new Polygon(this.rectPos);
        this.eventMode = 'static';

        this.on('mousedown', this.printSquare); //Calls the fill square with tile function here
        //TODO on onHover check if holdbutton and place tile


        //For better UX
        this.on('mouseover', this.onHover); 
        this.on('mouseout', this.outHover);
    }

    onHover() {
        this.clear();
        this.beginFill(0xFFFFFF);
        this.alpha = 0.5;
        this.lineStyle(1, 0x00000);
        this.drawPolygon(this.rectPos);
        this.endFill()
    }

    outHover() {
        this.clear();
        this.alpha = 0.8;
        this.lineStyle(1, 0x00000);
        this.drawPolygon(this.rectPos);
        this.endFill();
    }

    printSquare() {
        EditorManager.placeTile(this.gridPosition);
        //console.log(`x:${this.gridPosition.x} y:${this.gridPosition.y}`);
    }

}