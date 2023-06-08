import { Application,  BaseTexture, DisplayObject, Point, Rectangle, SCALE_MODES, Sprite, Texture } from "pixi.js";
import { TilemapFile } from "../entities/Tilemap";
import { Stage } from "@pixi/layers";
import Input from "./Input";
import { UI} from "./UI";

//TODO Refactor this class to reduce the multiple functions that it makes
export default class EditorManager {
    constructor() { }

    private static app: Application;
    private static tilemap: TilemapFile;
    
    private static tileset: BaseTexture; //stores the atlas of tiles 

    //UI variables
    private static selectedTile: [number, number]; //top left position of the current tile from the tileset image in pixels
    private static selectedTileTexture: Texture; //Texture  for swap the sprite 
    private static selectedTileSprite? : Sprite; //Sprite that shows the current tile on the grid
    private static selectedLayer: number;
    
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

        EditorManager.app = new Application({
            view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            background: backgroundColor,
            width: width,
            height: height
        });
        EditorManager.app.stage = new Stage();

        Input.initialize();
        UI.initUIElements();
        //Pixel art style
        BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;
        EditorManager.app.ticker.add(EditorManager.update)
    }

    public static update(delta: number) : void{
        if (EditorManager.tilemap) {
            EditorManager.tilemap.update(delta);
            Input.update(delta);
        }

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
        EditorManager.tilemap = new TilemapFile(tilesetPath, numberOfTiles, tileSize)
        EditorManager.tilemap.position.x = EditorManager.app.screen.width / 2;
        EditorManager.tilemap.position.y = EditorManager.app.screen.height / 8;
        EditorManager.app.stage.addChild(EditorManager.tilemap);

        UI.initUITilemapFunctions();
        EditorManager.createTileset(tilesetPath)
    }


    public static get getTilemap(): TilemapFile {
        return EditorManager.tilemap;
    }
    public static get getCurrentLayer(): number {
        return EditorManager.selectedLayer;
    }
    public static set setCurrentLayer(value: number) {
        EditorManager.selectedLayer = value;
    }

    public static set setSelectedTile(values: [number, number]) {
        EditorManager.selectedTile = values;
    }
    public static set setSelectedTileTexture(texture: Texture) {
        EditorManager.selectedTileTexture = texture;
    }
    public static set setSpriteTexture(texture : Texture) {
        if (EditorManager.selectedTileSprite) EditorManager.selectedTileSprite.texture = texture;
    }
    
    public static get getTileset(): BaseTexture {
        return EditorManager.tileset;
    }

    public static createTileset(tilesetPath: string) : void {
        //TODO create separatly or use ONLY one atlas image for each tilemap?
        EditorManager.tileset = BaseTexture.from(tilesetPath);
        UI.initUITileset(tilesetPath);
       
        //getting the first tile texture from the tileset
        EditorManager.selectedTileTexture = new Texture(EditorManager.tileset,
            new Rectangle(0, 0, EditorManager.tilemap.tileSize[0], EditorManager.tilemap.tileSize[1]));
         //Creating sprite for UI
        EditorManager.selectedTileSprite = Sprite.from(EditorManager.selectedTileTexture);
          
        EditorManager.selectedTileSprite.alpha = 0.5;
        EditorManager.selectedTileSprite.renderable = false;
        EditorManager.app.stage.addChild(EditorManager.selectedTileSprite);
  
    }

    //GRID functions
    public static placeTile(gridPos: Point): void {
        const height = UI.getZHeight();
        EditorManager.tilemap.drawAndSaveTile(EditorManager.selectedTileTexture, gridPos, height
            , EditorManager.selectedTile, EditorManager.selectedLayer);
    }


    public static showCurrentTileOnGrid(gridRef: DisplayObject): void {
        if (EditorManager.selectedTileSprite) {
            EditorManager.selectedTileSprite.renderable = true;
            
            const heightOffset = -(EditorManager.tilemap.tileSize[1] / 2) * UI.getZHeight();
            //Why need divide by half the tile to center on the grid?
            const { x, y } = new Point(gridRef.parent.position.y - EditorManager.tilemap.tileSize[0] / 2
                                        , gridRef.parent.position.y - EditorManager.tilemap.tileSize[1] / 2 + heightOffset); //HALF the size to center
            EditorManager.selectedTileSprite.position = gridRef.toGlobal({x,y} as Point);
        }
    }

    public static hideCurrentTileOnGrid() {
        if (EditorManager.selectedTileSprite) {
            EditorManager.selectedTileSprite.renderable = false;
        }
    }

}