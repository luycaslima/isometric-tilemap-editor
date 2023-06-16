import { Container, Point, Texture} from "pixi.js";
import { ITile, SpriteSize, Tile, Vector3 } from "./Tiles";
import { GridSquare } from './GridSquare'
import { MapLayer } from "./Layer";
import { Layer } from "@pixi/layers";
import Stats from "stats.js";


export interface ITilemap {
    tilesetName: string;
    mapSize: [number, number]; //Number of tiles in the map width x height
    tileSize: [number, number]; //Size of each tile
    layers: Array<MapLayer>;
}


export class TilemapFile extends Container implements ITilemap{
    name: string;
    tilesetName: string;
    mapSize: [number, number];
    tileSize: [number, number];
    layers: Array<MapLayer>;
   
    private stats: Stats;
    private grid: Layer;
    private gridSquares: GridSquare[]; //easy access for the grid squares if size edit is necessary.

    constructor(path : string, name :string, numberOfTiles:[number,number], tilesize: [number,number]) {
        super();
        this.stats = new Stats();
        this.stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( this.stats.dom );
        
        this.name = name; // TODO set this when created in UI ONLY FOR the name of the exporting file
        this.tilesetName = path; //TODO set the name of the tileset, when loaded on pixi that nam will call the texture on cache
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
                gridPosition: { x: gridPos.x, y: gridPos.y, z: zHeight } as Vector3,
                depth: tileInstance.depth,
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

    public deleteTile(gridPos: Point, selectedLayer: number): void {
        let tileInstance = this.layers[selectedLayer].tiles.get(`${gridPos.x},${gridPos.y}`);
        if (tileInstance) {
            this.layers[selectedLayer].tiles.delete(`${gridPos.x},${gridPos.y}`);
            this.layers[selectedLayer].tileDictonary.delete(`${gridPos.x},${gridPos.y}`);
            this.layers[selectedLayer].removeChild(tileInstance);
        }
        /*if (this.layers[selectedLayer].tiles[gridPos.x][gridPos.y]) {
            this.layers[selectedLayer].tiles[gridPos.x][gridPos.y] = undefined;
            this.layers[selectedLayer].removeChild(this.layers[selectedLayer].tiles[gridPos.x][gridPos.y]!)
        }*/
    }

    public cacheNeighbours(): void {
        const tiles : Array<ITile> = Array.from(this.layers[1].tileDictonary.values()); //layer do meio é o ground
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

    private checkNeighbourAt(gridPosition: Vector3): Vector3 | undefined {
        return this.layers[1].tileDictonary.get(`${gridPosition.x},${gridPosition.y}`)?.gridPosition;
    }

    public toggleGrid(): void {
        this.grid.renderable = !this.grid.renderable;
    }

    public update(_delta: number) {
        this.stats.begin();
        this.stats.end();
    }
}
