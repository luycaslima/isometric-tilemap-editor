import { Rectangle, Texture } from "pixi.js";
import EditorManager from "./EditorManager";
import { exportTilemap } from "./File";

export function createLayerElement(id: number): HTMLDivElement {
    const divContainer : HTMLDivElement = document.createElement('div');
    divContainer.className = 'layer';
    divContainer.id = id.toString();

    const input: HTMLInputElement = document.createElement('input');   
    input.type = 'radio';
    input.name = `Layer`;
    input.value = id.toString();
    input.id = `l${id.toString()}`;
    
    const label : HTMLLabelElement = document.createElement('label');
    label.htmlFor = input.id;

    let layerName: string = '';
    
    switch (id) {
        case 0:
            layerName = "Lower Dec. Layer";
            break;
        case 1:
            layerName = "Ground Layer";
            break;
        case 2:
            layerName = "High Dec. Layer";
            break;
                    
    }

    label.textContent = layerName;
    const breakPoint: HTMLBRElement = document.createElement('br');
    
    divContainer.appendChild(input);
    divContainer.appendChild(label);
    divContainer.appendChild(breakPoint);
 
    return divContainer;
}

export class UI {

    private static tilesetImgElement: HTMLImageElement;
    private static selectedTileElement: HTMLDivElement;
    private static layersContainer: HTMLElement;
    private static toggleGridCheckbox: HTMLInputElement;
    private static exportFileBtn: HTMLButtonElement;
    private static zHeightInput: HTMLInputElement;
    private static cacheNeighboursBtn: HTMLButtonElement;


    public static initUIElements() {
        UI.tilesetImgElement = document.querySelector('.tileset') as HTMLImageElement;
        UI.selectedTileElement = document.querySelector('.selected-tile-container') as HTMLDivElement;
    
        UI.layersContainer = document.querySelector('.layers-list') as HTMLElement;
        UI.exportFileBtn = document.querySelector('.export') as HTMLButtonElement;
        UI.zHeightInput = document.getElementById('z-height') as HTMLInputElement;
        UI.cacheNeighboursBtn = document.getElementById('gen-neighbour') as HTMLButtonElement;
        UI.toggleGridCheckbox = document.getElementById('toggle-grid') as HTMLInputElement;
        UI.toggleGridCheckbox.checked = true;
    }

    public static initUITilemapFunctions() {
        const tilemap = EditorManager.getTilemap
        const createLayElement = () => {
            
            tilemap.createLayer();
            const previousLayer = document.querySelector('.layer');
            const layerContainer = createLayerElement(tilemap.layers.length - 1);

            UI.layersContainer.insertBefore(layerContainer, previousLayer);
        }
        UI.layersContainer.addEventListener('change', function () {
            const selectedLayerElement : HTMLInputElement | null = document.querySelector('input[name="Layer"]:checked');
            EditorManager.setCurrentLayer = Number(selectedLayerElement!.value);

        })
        UI.toggleGridCheckbox.addEventListener('change', function() {
            tilemap.toggleGrid();
        })

        UI.exportFileBtn.addEventListener('click', function () {
            //TODO show filemanager to save in a json file
            console.log(exportTilemap(tilemap));
        })

        UI.cacheNeighboursBtn.addEventListener('click', function () {
            tilemap.cacheNeighbours();  
        });
        
       
        createLayElement();
        createLayElement();
        createLayElement();
        tilemap.createGrid(); //Garantees that will always be over the layers

        //Set the initial layer the ground
        const groundLayer: HTMLInputElement | null = document.querySelector('#l1');
        EditorManager.setCurrentLayer = 1;
        groundLayer!.checked = true;

    }

    public static initUITileset(tilesetPath: string) {
        const tilemap = EditorManager.getTilemap
        UI.tilesetImgElement.src = tilesetPath;
        UI.tilesetImgElement.addEventListener('mousedown', UI.changeCurrentTileTexture)
        
        const cssParam: string = `outline: 3px solid cyan; left:0; top:0; 
                                     width:${tilemap.tileSize[0]}px; height:${tilemap.tileSize[1]}px;`;
        UI.selectedTileElement.setAttribute('style', cssParam);
    }


     //TODO This doesnt work in a instanced class
    private static changeCurrentTileTexture(e: MouseEvent) {
        const tilemap = EditorManager.getTilemap;
        const {x,y} = UI.tilesetImgElement.getBoundingClientRect();
        const mouseX = e.clientX - x;
        const mouseY = e.clientY - y;
        
        //get the grid value IN THE UI
        const [resultx, resulty] = [Math.floor(mouseX / tilemap.tileSize[0]), Math.floor(mouseY / tilemap.tileSize[1])]
       
        //Position the selection square on the tile over the image
        UI.selectedTileElement.style.left = resultx * tilemap.tileSize[0] + "px";
        UI.selectedTileElement.style.top = resulty * tilemap.tileSize[1] + "px";

        EditorManager.setSelectedTile = [resultx * tilemap.tileSize[0], resulty * tilemap.tileSize[1]]
        
        const rect = new Rectangle(resultx * tilemap.tileSize[0], resulty * tilemap.tileSize[1],
            tilemap.tileSize[0], tilemap.tileSize[1]);
        const texture = new Texture(EditorManager.getTileset, rect);
        
        EditorManager.setSelectedTileTexture = texture;
        EditorManager.setSpriteTexture = texture;
    }

    public static getZHeight(): number{
        return Number(UI.zHeightInput.value);
    }
}
