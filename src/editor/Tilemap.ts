import { Container, Graphics, Point, Polygon, Sprite, Texture} from "pixi.js";
import { ITile, toScreenCoordinates } from "./Tiles";
import { EditorManager } from "../core/EditorManager";

//Export Json
export interface ITilemap {
    tilesetPath: string;
    mapSize: [number, number]; //Number of tiles in the map width x height
    tileSize: [number, number]; //Size of each tile
    tilesData : (ITile)[][]
}

export class TilemapFile extends Container implements ITilemap{
    //Only export the interface
    tilesetPath: string;
    mapSize: [number, number];
    tileSize: [number, number];

    //private tileset: Texture;
    //Represents which tile on the tileset(in thee position[0,0],[0,1]) will drawn where;
    //Should be store in a layer
    //tileMap: Array<[number, number]>;
    
    //This data will be responsible by each layer
    tilesData: Array<Array<ITile>>
    private tiles: Array<Array<Sprite>>; //representation on screen the layer will store each a widthxheight array 

    private grid: Container;
    private gridSquares: GridSquare[]; //easy access for the grid squares if size edit is necessary.

    constructor(path : string, numberOfTiles:[number,number], tilesize: [number,number] ) {
        super();
        this.tilesetPath = path;
        this.mapSize = numberOfTiles
        this.tileSize = tilesize;
        
        this.tiles =[];
        this.tilesData = [];

        this.grid = new Container();
        this.gridSquares = [];

        
        const tileWidth = tilesize[0]; 
        const tileHeight = tilesize[1] / 2; // The grid ALWAYS have half the size of the tile
        let tempSprArray = [];
        for (let x = 0; x < numberOfTiles[0]; x++) {
            for (let y = 0; y < numberOfTiles[1]; y++) {

                //TODO This is the most cursed thing that i have done. reformulate when inserting the LAYERS system from pixi layers
                const spr = new Sprite();
                const isoPos = toScreenCoordinates({ x, y } as Point);
                spr.position.x = isoPos.x;
                spr.position.y = isoPos.y;
                tempSprArray.push(spr);
                this.addChild(spr);

                //TODO STORE THIS WITH THE SPRITE IN CLASS TO NO INITIATE TWO ARRAYS THEN ONLY EXPORT IMPORTANT DATA
                /*this.tilesData[x][y] = {
                    tilesetTile: [-1, -1],x: -1,y:-1, isSpawner: false, isWalkable: false
                } as ITile;*/

                //grid draw
                const square: GridSquare = new GridSquare(new Point(x, y),
                    [0, 0, tileWidth / 2, tileHeight / 2, 0, tileHeight, -tileWidth / 2, tileHeight / 2]
                );
                square.position = new Point(
                    x * tileWidth / 2  - y  * tileWidth /2
                    , x * tileHeight / 2 + y * tileHeight / 2);
                
                
                this.grid.addChild(square);
                this.gridSquares.push(square);
            }
            this.tiles[x] = tempSprArray;
            tempSprArray = [];
        } 
        this.addChild(this.grid);
        console.log(this.tiles);
    }

    public drawAndSaveTile(texture : Texture, gridPos : Point , selectedTile: [number,number]) {
        this.tiles[gridPos.x][gridPos.y].texture = texture;
        //Storing data
        //this.tilesData[gridPos.x][gridPos.y].tilesetTile = selectedTile;
        //this.tilesData[gridPos.x][gridPos.y].x = spr.x;
        //this.tilesData[gridPos.x][gridPos.y].y = spr.y;
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