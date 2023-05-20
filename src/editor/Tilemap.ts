import { Container, Graphics, Point, Polygon} from "pixi.js";
import { Tile } from "./Tiles";

//Export Json
export interface ITilemap {
    tilesetPath: string;
    mapSize: [number, number];
    gridSize: [number, number];
    tiles : Tile[]
}

export class Tilemap extends Container implements ITilemap{
    tilesetPath: string;
    mapSize: [number, number];
    gridSize: [number, number];
    tiles: Tile[];
    //gridSquares: Graphics[];
    grid: Container;

    constructor(path : string, numberOfTiles:[number,number], gridSizeMap: [number,number] ) {
        super();
        this.tilesetPath = path;
        this.mapSize = numberOfTiles
        this.gridSize = gridSizeMap;
        this.tiles = new Array<Tile>;
        //this.gridSquares = new Array<Graphics>;
        this.grid = new Container();
        //TODO Draw the grid with Graphics and where click fill with a Tile. not create all tiles ?

        //Draw array graphics retangles with one pixel inside of the formate of the isometric grid
        //check if mouse over each
        //click and fill with a Tile
            //if already filled ,change 
        //const tileTexture: Texture = Texture.from('/tileset/block_grid.png');
        const tileWidth = gridSizeMap[0];
        const tileHeight = gridSizeMap[1];
        for (let x = 0; x < numberOfTiles[0]; x++) {
            for (let y = 0; y < numberOfTiles[1]; y++) {
                const square: GridSquare = new GridSquare(new Point(x, y), tileWidth , tileHeight,
                    [0, 0, tileWidth / 2, tileHeight / 2, 0, tileHeight, -tileWidth / 2, tileHeight / 2]);
                
                square.position = new Point(
                    x * tileWidth / 2  - y  * tileWidth /2
                    , x * tileHeight / 2 + y * tileHeight / 2);
                
                //this.gridSquares.push(square);
                this.grid.addChild(square);
            }
        } 
        this.addChild(this.grid);
    }

    public drawGrid() {
        
    }
}

class GridSquare extends Graphics{
    gridPosition: Point
    rectPos: [number, number, number, number, number, number, number, number];
    tileWidth: number;
    tileHeight: number;

    constructor(gridPos : Point, tileWidth:number, tileHeight: number, rect : [number, number, number, number, number, number, number, number]) {
        super(); 
        this.gridPosition = gridPos;
        this.tileHeight = tileHeight;
        this.tileWidth = tileWidth;

        this.rectPos = rect;
        this.lineStyle(1, 0x00000);
        this.alpha = 0.8;

        this.drawPolygon([0, 0, tileWidth / 2, tileHeight / 2, 0, tileHeight, -tileWidth / 2, tileHeight / 2]);
        this.hitArea = new Polygon([0, 0, tileWidth / 2, tileHeight / 2, 0, tileHeight, -tileWidth / 2, tileHeight / 2]);
        
        this.eventMode = 'static';

        this.on('click', this.printSquare)
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
        console.log(`x:${this.gridPosition.x} y:${this.gridPosition.y}`);
    }
    reDraw() {
        this.clear();
        this.lineStyle(1, 0x00000);
        //this.drawPolygon()
    }
}