import { Container, Graphics, Point, Polygon, Texture} from "pixi.js";
import { ITile, SpriteSize, Tile } from "./Tiles";
import { EditorManager } from "../core/EditorManager";
import { MapLayer } from "./Layer";
import { Layer } from "@pixi/layers";

export interface ITilemap {
    tilesetPath: string;
    mapSize: [number, number]; //Number of tiles in the map width x height
    tileSize: [number, number]; //Size of each tile
    layers: Array<MapLayer>;
}


export class TilemapFile extends Container implements ITilemap{
    tilesetPath: string;
    mapSize: [number, number];
    tileSize: [number, number];
    layers: Array<MapLayer>;
   
    private grid: Layer;
    private gridSquares: GridSquare[]; //easy access for the grid squares if size edit is necessary.

    constructor(path : string, numberOfTiles:[number,number], tilesize: [number,number]) {
        super();
        this.tilesetPath = path;
        this.mapSize = numberOfTiles
        this.tileSize = tilesize;
        this.layers = [];
        
        //TODO how to garanteee that the grid will always be over everything
        this.grid = new Layer();
        this.grid.zOrder = 1000;
        this.grid.group.enableSort = true;
        this.gridSquares = [];
        
        this.createGrid();
        this.sortChildren();
    }

    private createGrid() {
        const tileWidth = this.tileSize[0]; 
        const tileHeight = this.tileSize[1] / 2;

        for (let x = 0; x < this.mapSize[0]; x++) {
            for (let y = 0; y < this.mapSize[1]; y++) {

                const square: GridSquare = new GridSquare(new Point(x, y),
                    [0, 0, tileWidth / 2, tileHeight / 2, 0, tileHeight, -tileWidth / 2, tileHeight / 2]
                );
                square.position = new Point(
                    x * tileWidth / 2  - y  * tileWidth /2
                    , x * tileHeight / 2 + y * tileHeight / 2);
                
                
                this.grid.addChild(square);
                this.gridSquares.push(square);
            }
        } 
        this.addChild(this.grid);
        
    }

    public sortLayers() {
        
    }

    public createLayer() {
        const tiles : Array<Array< Tile | undefined>> = []
        let tempTileArray = []; //For filling each row of the array of tiles
        for (let x = 0; x < this.mapSize[0]; x++) {
            for (let y = 0; y < this.mapSize[1]; y++) {
                tempTileArray.push(undefined);
            }
            tiles[x] = tempTileArray;
            tempTileArray = [];
        }
        const layer: MapLayer = new MapLayer(tiles)
        this.layers.push(layer);
        layer.setLayerZRender(this.layers.length - 1);

        this.addChild(layer);
    }

    //TODO Refactor this cursed function
    public drawAndSaveTile(texture : Texture, gridPos : Point, zHeight : number , selectedTile: [number,number],selectedLayer: number) : void{
        if (this.layers[selectedLayer].tiles[gridPos.x][gridPos.y] === undefined) {
            const tile = new Tile(gridPos, zHeight ,texture, selectedTile, {w: this.tileSize[0], h: this.tileSize[1]} as SpriteSize);
            this.layers[selectedLayer].tiles[gridPos.x][gridPos.y] = tile;
            this.layers[selectedLayer].addChild(tile);
            this.layers[selectedLayer].sortChildren();
            
            this.layers[selectedLayer].tileDictonary.set(`${gridPos.x},${gridPos.y}`, {
                tilesetTile: [selectedTile[0], selectedTile[1]],
                isoPosition: tile.isoPosition,
                gridPosition: {x:gridPos.x ,y: gridPos.y},
                depth: tile.depth,
                zHeight: zHeight,
                tileType: tile.tileType
           } as ITile)
            
        } else {
            const tile = this.layers[selectedLayer].tileDictonary.get(`${gridPos.x},${gridPos.y}`);
            tile!.tilesetTile = [selectedTile[0], selectedTile[1]];
            this.layers[selectedLayer].tileDictonary.set(`${gridPos.x},${gridPos.y}`, tile!);
            
            this.layers[selectedLayer].tiles[gridPos.x][gridPos.y]!.recalculateHeight(zHeight);
            this.layers[selectedLayer].tiles[gridPos.x][gridPos.y]!.changeTexture(texture);
        }
    }

    public deleteTile(gridPos: Point, selectedLayer: number) : void {
        if (this.layers[selectedLayer].tiles[gridPos.x][gridPos.y]) {
            this.layers[selectedLayer].tiles[gridPos.x][gridPos.y] = undefined;
            this.layers[selectedLayer].removeChild(this.layers[selectedLayer].tiles[gridPos.x][gridPos.y]!)
        }
    }

    public toggleGrid(): void {
        this.grid.renderable = !this.grid.renderable;
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

    private onHover() {
        //Show the current sprite in the grid position 
        EditorManager.showCurrentTileOnGrid(this);
        this.clear();
        this.beginFill(0xFFFFFF);
        this.alpha = 0.5;
        this.lineStyle(1, 0x00000);
        this.drawPolygon(this.rectPos);
        this.endFill()
    }

    private outHover() {
        //hide it
        EditorManager.hideCurrentTileOnGrid();
        this.clear();
        this.alpha = 0.8;
        this.lineStyle(1, 0x00000);
        this.drawPolygon(this.rectPos);
        this.endFill();
    }

    private placeTile() {
        EditorManager.placeTile(this.gridPosition);
    }
}