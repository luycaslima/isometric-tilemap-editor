import { Application,  BaseTexture, DisplayObject, Point, Rectangle, SCALE_MODES, Sprite, Texture } from "pixi.js";
import { TilemapFile } from "../entities/Tilemap";
import { Stage } from "@pixi/layers";
import { createLayerElement, exportTilemap } from "./Utils";

//TODO Refactor this class to reduce the multiple functions that it makes
export class EditorManager {
    constructor() { }

    private static app: Application;
    private static tilemap: TilemapFile;
    
    private static tileset: BaseTexture; //stores the atlas of tiles 

    //UI variables
    private static selectedTile: [number, number]; //top left position of the current tile from the tileset image in pixels
    private static selectedTileTexture: Texture; //Texture  for swap the sprite 
    private static selectedTileSprite? : Sprite; //Sprite that shows the current tile on the grid
    private static selectedLayer: number;
    
    //UI elements
    private static tilesetImgElement: HTMLImageElement;
    private static selectedTileElement: HTMLDivElement;
    private static layersContainer: HTMLElement;
    private static addLayerButton: HTMLButtonElement;
    private static deleteCurrentLayer: HTMLButtonElement;
    private static toggleGridCheckbox: HTMLInputElement;
    private static exportFileButton: HTMLButtonElement;
    private static zHeightInput: HTMLInputElement;

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
        EditorManager.initUIElements();
        //Pixel art style
        BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;
        EditorManager.app.ticker.add(EditorManager.update)
    }

    public static update(_delta: number) : void{
        
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

        EditorManager.initUITilemapFunctions();
        EditorManager.createTileset(tilesetPath)
    }

    public static createTileset(tilesetPath: string) : void {
        //TODO create separatly or use ONLY one atlas image for each tilemap?
        EditorManager.tileset = BaseTexture.from(tilesetPath);
        EditorManager.initUITileset(tilesetPath);
       
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
        const height = EditorManager.getZHeight();
        EditorManager.tilemap.drawAndSaveTile(EditorManager.selectedTileTexture, gridPos, height
            , EditorManager.selectedTile, EditorManager.selectedLayer);
    }


    public static showCurrentTileOnGrid(gridRef: DisplayObject): void {
        if (EditorManager.selectedTileSprite) {
            EditorManager.selectedTileSprite.renderable = true;
            
            const heightOffset = -(EditorManager.tilemap.tileSize[1] / 2) * EditorManager.getZHeight();
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

    private static initUIElements() {
        EditorManager.tilesetImgElement = document.querySelector('.tileset') as HTMLImageElement;
        EditorManager.selectedTileElement = document.querySelector('.selected-tile-container') as HTMLDivElement;
        
        EditorManager.layersContainer = document.querySelector('.layers-list') as HTMLElement;
        EditorManager.addLayerButton = document.getElementById('add') as HTMLButtonElement;
        EditorManager.deleteCurrentLayer = document.getElementById('delete') as HTMLButtonElement;
        EditorManager.exportFileButton = document.querySelector('.export') as HTMLButtonElement;
        EditorManager.zHeightInput = document.getElementById('z-height') as HTMLInputElement;

        EditorManager.toggleGridCheckbox = document.getElementById('toggle-grid') as HTMLInputElement;
        EditorManager.toggleGridCheckbox.checked = true;
    }

    private static initUITilemapFunctions() {
        const createLayElement =  () => {
            EditorManager.tilemap.createLayer();

            const previousLayer = document.querySelector('.layer');
            const layerContainer = createLayerElement(EditorManager.tilemap.layers.length - 1);
            
            EditorManager.selectedLayer = EditorManager.tilemap.layers.length - 1;
            EditorManager.layersContainer.insertBefore(layerContainer, previousLayer);
        }

        EditorManager.layersContainer.addEventListener('change', function () {
            const selectedLayerElement : HTMLInputElement | null = document.querySelector('input[name="Layer"]:checked');
            EditorManager.selectedLayer = Number(selectedLayerElement!.value);

        })
        EditorManager.toggleGridCheckbox.addEventListener('change', function() {
            EditorManager.tilemap.toggleGrid();
        })

        EditorManager.exportFileButton.addEventListener('click', function () {
            //TODO  show filemanager to save in a json file
            console.log(exportTilemap(EditorManager.tilemap));
        })

        EditorManager.addLayerButton.addEventListener('click',createLayElement)
        EditorManager.deleteCurrentLayer.addEventListener('click',function(){}) //TODO delete current layer and reorder layers
        
        createLayElement();
    }

    private static initUITileset(tilesetPath : string) {
        EditorManager.tilesetImgElement.src = tilesetPath;
        EditorManager.tilesetImgElement.addEventListener('mousedown', EditorManager.changeCurrentTileTexture)
        
        const cssParam: string = `outline: 3px solid cyan; left:0; top:0; 
                                     width:${EditorManager.tilemap.tileSize[0]}px; height:${EditorManager.tilemap.tileSize[1]}px;`;
        EditorManager.selectedTileElement.setAttribute('style', cssParam);
    }


    //This doesnt work in a insntanced class
    private static changeCurrentTileTexture(e: MouseEvent) {
        const {x,y} = EditorManager.tilesetImgElement.getBoundingClientRect();
        const mouseX = e.clientX - x;
        const mouseY = e.clientY - y;
        
        //get the grid value IN THE UI
        const [resultx, resulty] = [Math.floor(mouseX / EditorManager.tilemap.tileSize[0]), Math.floor(mouseY / EditorManager.tilemap.tileSize[1])]
       
        //Position the selection square on the tile over the image
        EditorManager.selectedTileElement.style.left = resultx * EditorManager.tilemap.tileSize[0] + "px";
        EditorManager.selectedTileElement.style.top = resulty * EditorManager.tilemap.tileSize[1] + "px";

        EditorManager.selectedTile = [resultx * EditorManager.tilemap.tileSize[0], resulty * EditorManager.tilemap.tileSize[1]]
        //console.log(`${EditorManager.selectedTile}`);
        
        //TODO Make a local variable for readbility for the new position of the selected tile
        const rect = new Rectangle(resultx * EditorManager.tilemap.tileSize[0], resulty * EditorManager.tilemap.tileSize[1],
            EditorManager.tilemap.tileSize[0], EditorManager.tilemap.tileSize[1]);
        EditorManager.selectedTileTexture = new Texture(EditorManager.tileset, rect);
        if (EditorManager.selectedTileSprite) EditorManager.selectedTileSprite.texture = EditorManager.selectedTileTexture;
    }
    private static getZHeight(): number{
        return Number(EditorManager.zHeightInput.value);
    }
}