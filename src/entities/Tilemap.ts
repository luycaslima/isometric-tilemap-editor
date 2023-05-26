import { Container, Graphics, Point, Polygon, Texture} from "pixi.js";
import { SpriteSize, Tile } from "./Tiles";
import { EditorManager } from "../core/EditorManager";
import { Layer } from "@pixi/layers";
import { MapLayer } from "./Layer";

//Export Json
export interface ITilemap {
    tilesetPath: string;
    mapSize: [number, number]; //Number of tiles in the map width x height
    tileSize: [number, number]; //Size of each tile
    tiles: Array<Array< Tile | undefined>>
}


export class TilemapFile extends Container implements ITilemap{
    //Only export the interface
    tilesetPath: string;
    mapSize: [number, number];
    tileSize: [number, number];
    private layers: Array<MapLayer>;
    tiles: Array<Array <Tile | undefined>>; //representation on screen the layer will store each a widthxheight array 

    private grid: Container;
    private gridSquares: GridSquare[]; //easy access for the grid squares if size edit is necessary.

    constructor(path : string, numberOfTiles:[number,number], tilesize: [number,number]) {
        super();
        this.tilesetPath = path;
        this.mapSize = numberOfTiles
        this.tileSize = tilesize;
        this.tiles =[];
        
        this.layers = [];
        
        this.grid = new Container();
        this.grid.zIndex = 1000;
        this.gridSquares = [];

        const tileWidth = tilesize[0]; 
        const tileHeight = tilesize[1] / 2; // The grid ALWAYS have half the size of the tile
        let tempTileArray = []; //For filling each row of the array of tiles
        
        for (let x = 0; x < numberOfTiles[0]; x++) {
            for (let y = 0; y < numberOfTiles[1]; y++) {
                tempTileArray.push(undefined);

                const square: GridSquare = new GridSquare(new Point(x, y),
                    [0, 0, tileWidth / 2, tileHeight / 2, 0, tileHeight, -tileWidth / 2, tileHeight / 2]
                );
                square.position = new Point(
                    x * tileWidth / 2  - y  * tileWidth /2
                    , x * tileHeight / 2 + y * tileHeight / 2);
                
                
                this.grid.addChild(square);
                this.gridSquares.push(square);
            }
            this.tiles[x] = tempTileArray;
            tempTileArray = [];
        } 
        this.addChild(this.grid);
        //console.log(this.tiles);
    }

    public drawAndSaveTile(texture : Texture, gridPos : Point , selectedTile: [number,number]) : void{
        if (this.tiles[gridPos.x][gridPos.y] === undefined) {
            const tile = new Tile(gridPos, texture, selectedTile, {w: this.tileSize[0], h: this.tileSize[1]} as SpriteSize);
            this.tiles[gridPos.x][gridPos.y] = tile;
            this.addChild(tile);
            this.sortChildren();
        
        } else {
            this.tiles[gridPos.x][gridPos.y]!.changeTexture(texture);
        }
    }

    public ToggleGrid() : void {
        
    }
}

//Class for the representation of the grid of the map
class GridSquare extends Graphics{
    private readonly gridPosition: Point
    private rectPos: [number, number, number, number, number, number, number, number];

    constructor(gridPos : Point, rect : [number, number, number, number, number, number, number, number]) {
        super(); 
        this.gridPosition = gridPos;
        
        this.rectPos = rect;
        this.lineStyle(1, 0x00000);
        this.alpha = 0.8;

        this.drawPolygon(this.rectPos);
        //Region interactable by the user (mouse)
        this.hitArea = new Polygon(this.rectPos);
        this.eventMode = 'static';

        this.on('mousedown', this.placeTile); //Calls the fill square with tile function here
        //TODO on onHover check if holdbutton and place tile automatically

        //For better UX
        this.on('mouseover', this.onHover); 
        this.on('mouseout', this.outHover);
    }

    onHover() {

        //Show the current sprite in the grid position 
        EditorManager.showCurrentTileOnGrid(this);

        this.clear();
        this.beginFill(0xFFFFFF);
        this.alpha = 0.5;
        this.lineStyle(1, 0x00000);
        this.drawPolygon(this.rectPos);
        this.endFill()
    }

    outHover() {
        //hide it
        EditorManager.hideCurrentTileOnGrid();
        this.clear();
        this.alpha = 0.8;
        this.lineStyle(1, 0x00000);
        this.drawPolygon(this.rectPos);
        this.endFill();
    }

    placeTile() {
        EditorManager.placeTile(this.gridPosition); //TODO pass the square reference to calculate the real position
        //console.log(`x:${this.gridPosition.x} y:${this.gridPosition.y}`);
    }
}