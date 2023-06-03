import { Container, Graphics, Point, Polygon, Texture} from "pixi.js";
import { ITile, SpriteSize, Tile, Vector2 } from "./Tiles";
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
        
        this.grid = new Layer();
        this.grid.zOrder = 1000;
        this.grid.group.enableSort = true;
        this.gridSquares = [];
        
        this.sortChildren();
    }

    public createGrid() {
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
        const layer: MapLayer = new MapLayer();
        this.layers.push(layer);
        layer.setLayerZRender(this.layers.length - 1);

        this.addChild(layer);
        this.sortChildren();
    }

    public drawAndSaveTile(texture : Texture, gridPos : Point, zHeight : number , selectedTile: [number,number],selectedLayer: number) : void{
        let tileInstance = this.layers[selectedLayer].tiles.get(`${gridPos.x},${gridPos.y}`);
        if (!tileInstance) {
            tileInstance  = new Tile(gridPos, zHeight, texture, selectedTile, { w: this.tileSize[0], h: this.tileSize[1] } as SpriteSize);
            this.layers[selectedLayer].tiles.set(`${gridPos.x},${gridPos.y}`, tileInstance);
            this.layers[selectedLayer].addChild(tileInstance);
            this.layers[selectedLayer].sortChildren();
            
            this.layers[selectedLayer].tileDictonary.set(`${gridPos.x},${gridPos.y}`, {
                tilesetTile: [selectedTile[0], selectedTile[1]],
                isoPosition: tileInstance.isoPosition,
                gridPosition: { x: gridPos.x, y: gridPos.y },
                depth: tileInstance.depth,
                zHeight: zHeight,
                tileType: tileInstance.tileType,
                neighbours: tileInstance.neighbours
            } as ITile);


        } else {
            const tile = this.layers[selectedLayer].tileDictonary.get(`${gridPos.x},${gridPos.y}`);
            tile!.tilesetTile = [selectedTile[0], selectedTile[1]];
            this.layers[selectedLayer].tileDictonary.set(`${gridPos.x},${gridPos.y}`, tile!);
            
            tileInstance!.recalculateHeight(zHeight);
            tileInstance!.changeTexture(texture);
        }

        this.sortChildren();
    }

    public deleteTile(gridPos: Point, selectedLayer: number) : void {
        /*if (this.layers[selectedLayer].tiles[gridPos.x][gridPos.y]) {
            this.layers[selectedLayer].tiles[gridPos.x][gridPos.y] = undefined;
            this.layers[selectedLayer].removeChild(this.layers[selectedLayer].tiles[gridPos.x][gridPos.y]!)
        }*/
    }

    public cacheNeighbours(): void {
        const tiles : Array<ITile> = Array.from(this.layers[1].tileDictonary.values());
        for (const tile of tiles) {
            tile.neighbours = [
                this.checkNeighbourAt({ x: tile.gridPosition.x - 1, y: tile.gridPosition.y}),
                this.checkNeighbourAt({ x: tile.gridPosition.x, y: tile.gridPosition.y + 1}),
                this.checkNeighbourAt({ x: tile.gridPosition.x + 1, y: tile.gridPosition.y }),
                this.checkNeighbourAt({ x: tile.gridPosition.x , y: tile.gridPosition.y - 1})
            ]
            this.layers[1].tileDictonary.set(`${tile.gridPosition.x},${tile.gridPosition.y}`, tile);
        }
    }

    private checkNeighbourAt(gridPosition: Vector2): Vector2 | undefined {
        return this.layers[1].tileDictonary.get(`${gridPosition.x},${gridPosition.y}`)?.gridPosition;
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