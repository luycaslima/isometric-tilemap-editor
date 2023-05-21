import { Application, BaseTexture, Point, Rectangle, SCALE_MODES, Texture } from "pixi.js";
import { TilemapFile } from "../editor/Tilemap";

export class EditorManager {
    constructor() { }

    private static app: Application;
    private static tilemap: TilemapFile;
    
    //TODO Separate this in a other class?
    private static tileset: BaseTexture;

    //UI variables
    private static selectedTile: [number, number];
    private static selectedTileTexture: Texture;
    private static selectedLayer: number;
    
    //UI elements

    //TODO check which dont need to be called here an move to main.ts
    private static tilesetImgElement: HTMLImageElement;
    private static layerContainer: HTMLDivElement;
    private static selectedTileElement: HTMLDivElement;

    private static _width: number;
    private static _height: number;

    public static get width(): number{
        return EditorManager._width;
    }
    public static get heigth(): number{
        return EditorManager._height;
    }
    
    public static initialize(width: number, height: number, backgroundColor: number): void {
        EditorManager._width = width;
        EditorManager._height = height;

        EditorManager.selectedTile = [0, 0];
        EditorManager.selectedLayer = 0;
        
        EditorManager.tilesetImgElement = document.querySelector('.tileset') as HTMLImageElement;
        EditorManager.layerContainer = document.querySelector('.layers') as HTMLDivElement;
        EditorManager.selectedTileElement = document.querySelector('.selected-tile-container') as HTMLDivElement;

        EditorManager.app = new Application({
            view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            background: backgroundColor,
            width: width,
            height: height
        });
        //Pixel art style
        BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;

        EditorManager.app.ticker.add(EditorManager.update)
    }

    /*
    //Used when mouse pan
    public static setCameraPosition(x: number, y: number): void{
        EditorManager.app.stage.pivot.x = x;
        EditorManager.app.stage.pivot.y = y;
    }
    
    //used when mouse wheel 
    public static setCameraZoom(zoom: number) : void {
        EditorManager.app.stage.scale.set(zoom);
    }
    */

    public static createTileMap(tilesetPath: string, numberOfTiles: [number,number], tileSize : [number,number]): void {
        //TODO create separatly or use ONLY one atlas image for each tilemap?
        EditorManager.tileset = BaseTexture.from(tilesetPath);
        EditorManager.tilesetImgElement.src = tilesetPath;

        //getting the first tile texture from the tileset
        EditorManager.selectedTileTexture = new Texture(EditorManager.tileset, new Rectangle(0, 0, tileSize[0], tileSize[1]));
        
        //TODO fz essa chamada de evento em outro lugar
        EditorManager.tilesetImgElement.addEventListener('mousedown', (e :MouseEvent) => {
            const {x,y} = EditorManager.tilesetImgElement.getBoundingClientRect();
            const mouseX = e.clientX - x;
            const mouseY = e.clientY - y;
            
            //get the grid value
            const [resultx, resulty] = [Math.floor(mouseX / tileSize[0]), Math.floor(mouseY / tileSize[1])]

            EditorManager.selectedTileElement.style.left = resultx * tileSize[0] + "px";
            EditorManager.selectedTileElement.style.top = resulty * tileSize[1] + "px";

            EditorManager.selectedTile = [resultx * tileSize[0],resulty * tileSize[1]]
            EditorManager.changeCurrentTileTexture();
        })

        //Tileset editor
        const cssParam: string = `outline: 3px solid cyan; left:0; top:0; width:${tileSize[0]}px; height:${tileSize[1]}px;`;
        EditorManager.selectedTileElement.setAttribute('style', cssParam);

        //Creating the tilemapobject
        EditorManager.tilemap = new TilemapFile(tilesetPath, numberOfTiles, tileSize)
        EditorManager.tilemap.position.x = EditorManager.app.screen.width / 2;
        EditorManager.tilemap.position.y = EditorManager.app.screen.height / 8;
        EditorManager.app.stage.addChild(EditorManager.tilemap);
    }


    public static placeTile(position: Point) : void {
        //check the tool (select, place, erase)
        console.log(`x:${position.x} y:${position.y}`);
        //check the position on the tile element
        //use this data to fill the gridsquare with a tile 
        
    }

    private static changeCurrentTileTexture() {
        //TODO check if im clicking at the same tile to not make this event 
        EditorManager.selectedTileTexture = new Texture(EditorManager.tileset, new Rectangle(0, 0, EditorManager.selectedTile[0], EditorManager.selectedTile[1]));
    }

    public static update(_delta: number) : void{
        
    }



}