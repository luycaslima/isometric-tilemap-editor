import { Application,  BaseTexture, Container, DisplayObject, Point, Rectangle, SCALE_MODES, Sprite, Texture } from "pixi.js";
import { TilemapFile } from "../entities/Tilemap";
import { Stage } from "@pixi/layers";
import Input from "./Input";
import { UI} from "./UI";

//TODO Refactor this class to reduce the multiple functions that it makes
export default class Editor {
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
        return Editor._width;
    }
    public static get heigth(): number{
        return Editor._height;
    }
    public static get getAppStage(): Container {
        return Editor.app.stage;
    }
    public static get getCurrentTilemapFile(): TilemapFile{
        return Editor.tilemap;
    }
    
    public static initialize(width: number, height: number, backgroundColor: number): void {
        Editor._width = width;
        Editor._height = height;

        Editor.selectedTile = [0, 0];
        Editor.selectedLayer = 0;

        Editor.app = new Application({
            view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            background: backgroundColor,
            width: width,
            height: height
        });
        Editor.app.stage = new Stage();

        Input.initialize();
        
        //Pixel art style
        BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;
        Editor.app.ticker.add(Editor.update)
    }

    public static update(delta: number) : void{
        if (Editor.tilemap) {
            Editor.tilemap.update(delta);
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

    public static createTileMap(filename: string, urlSource : string ,exportName :string ,numberOfTiles: [number,number], tileSize : [number,number]): void {
        Editor.tilemap = new TilemapFile(filename, exportName, numberOfTiles, tileSize)
        //Editor.tilemap.pivot.set(0.5);
        Editor.tilemap.position.x = Editor.app.screen.width / 2;
        Editor.tilemap.position.y = Editor.app.screen.height / 2;
        Editor.app.stage.addChild(Editor.tilemap);

        Editor.createTileset(urlSource)
    }


    public static get getTilemap(): TilemapFile {
        return Editor.tilemap;
    }
    public static get getCurrentLayer(): number {
        return Editor.selectedLayer;
    }
    public static set setCurrentLayer(value: number) {
        Editor.selectedLayer = value;
    }

    public static set setSelectedTile(values: [number, number]) {
        Editor.selectedTile = values;
    }
    public static set setSelectedTileTexture(texture: Texture) {
        Editor.selectedTileTexture = texture;
    }
    public static set setSpriteTexture(texture : Texture) {
        if (Editor.selectedTileSprite) Editor.selectedTileSprite.texture = texture;
    }
    
    public static get getTileset(): BaseTexture {
        return Editor.tileset;
    }

    public static createTileset(urlSource: string) : void {
        //TODO create separatly or use ONLY one atlas image for each tilemap?
        Editor.tileset = BaseTexture.from(urlSource);
        UI.initUITileset(urlSource);
       
        //getting the first tile texture from the tileset
        Editor.selectedTileTexture = new Texture(Editor.tileset,
            new Rectangle(0, 0, Editor.tilemap.tileSize[0], Editor.tilemap.tileSize[1]));
         //Creating sprite for UI
        Editor.selectedTileSprite = Sprite.from(Editor.selectedTileTexture);
          
        Editor.selectedTileSprite.alpha = 0.5;
        Editor.selectedTileSprite.renderable = false;
        Editor.tilemap.addChild(Editor.selectedTileSprite); //Add tilemap container for better pos calculation
  
    }

    //GRID functions
    public static placeTile(gridPos: Point): void {
        const height = UI.getZHeight();
        Editor.tilemap.drawAndSaveTile(Editor.selectedTileTexture, gridPos, height
            , Editor.selectedTile, Editor.selectedLayer);
    }


    public static showCurrentTileOnGrid(gridRef: DisplayObject): void {
        if (Editor.selectedTileSprite) {
            Editor.selectedTileSprite.renderable = true;
            
            const heightOffset = -(Editor.tilemap.tileSize[1] / 2) * UI.getZHeight();

            //Why need divide by half the tile to center on the grid?
            /*const { x, y } = new Point(gridRef.parent.position.x - Editor.tilemap.tileSize[0] / 2
                                        , gridRef.parent.position.y - Editor.tilemap.tileSize[1] / 2 + heightOffset); //HALF the size to center
            Editor.selectedTileSprite.position = gridRef.toGlobal({x,y} as Point);*/
            
            const newPosition = new Point(gridRef.position.x - (Editor.tilemap.tileSize[0] / 2) , gridRef.position.y - (Editor.tilemap.tileSize[1] / 2) + heightOffset);
            Editor.selectedTileSprite.position.copyFrom(newPosition)

            /*console.log(`Tile x: ${Editor.selectedTileSprite.position.x} y: ${Editor.selectedTileSprite.position.y} \n
            Grid x: ${gridRef.position.x} y: ${gridRef.position.y}`)*/
        }
    }

    public static hideCurrentTileOnGrid() {
        if (Editor.selectedTileSprite) {
            Editor.selectedTileSprite.renderable = false;
        }
    }

}