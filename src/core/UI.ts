import { Rectangle, Texture } from "pixi.js";
import Editor from "./Editor";
import { exportTilemap } from "./File";

function createLayerElement(id: number): HTMLDivElement {
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
    //POPUPS WINDOWS
    private static tilemapDataForm: HTMLFormElement;
    private static newPopupWindow: HTMLDivElement;
    private static createTilemapButton: HTMLButtonElement;
    private static popupBackground: HTMLDivElement;
    private static previewImage: HTMLImageElement;
    private static tilesetInputFile: HTMLInputElement;
    private static fileName?: string;
    private static urlFile?: string;

    //TILEMAP EDITOR
    private static tilesetImgElement: HTMLImageElement;
    private static selectedTileElement: HTMLDivElement;
    private static layersContainer: HTMLElement;
    private static toggleGridCheckbox: HTMLInputElement;
    
    private static exportTilemapBtn: HTMLButtonElement;
    private static newTilemapEditorBtn: HTMLButtonElement;
    private static openTilemapEditorBtn: HTMLButtonElement;
    private static editTilemapBtn: HTMLButtonElement;


    private static zHeightInput: HTMLInputElement;
    private static cacheNeighboursBtn: HTMLButtonElement;


    public static initUIElements() {
        //TODO Separate between what is popups and what is the side editor
        UI.tilemapDataForm = document.getElementById('tilemap-data') as HTMLFormElement;
        UI.newPopupWindow = document.querySelector('.create-tilemap-container') as HTMLDivElement;
        UI.createTilemapButton = document.getElementById('create-tilemap-btn') as HTMLButtonElement;
        UI.popupBackground = document.querySelector('.popup-background') as HTMLDivElement;
        UI.previewImage = document.getElementById('preview') as HTMLImageElement;
        UI.tilesetInputFile = document.getElementById('tileset-input-file') as HTMLInputElement;

        UI.tilesetImgElement = document.querySelector('.tileset') as HTMLImageElement;
        UI.selectedTileElement = document.querySelector('.selected-tile-container') as HTMLDivElement;
    
        UI.layersContainer = document.querySelector('.layers-list') as HTMLElement;

        UI.exportTilemapBtn = document.getElementById('export') as HTMLButtonElement;
        UI.openTilemapEditorBtn = document.getElementById('open') as HTMLButtonElement;
        UI.newTilemapEditorBtn = document.getElementById('new') as HTMLButtonElement;
        UI.editTilemapBtn = document.getElementById('edit') as HTMLButtonElement;

        UI.zHeightInput = document.getElementById('z-height') as HTMLInputElement;
        UI.cacheNeighboursBtn = document.getElementById('gen-neighbour') as HTMLButtonElement;
        UI.toggleGridCheckbox = document.getElementById('toggle-grid') as HTMLInputElement;
        UI.toggleGridCheckbox.checked = true;     

       
        UI.newTilemapEditorBtn.addEventListener('click',()=>{
            UI.newPopupWindow.classList.toggle('hidden');
            UI.popupBackground.classList.toggle('hidden');
        })
        
        UI.openTilemapEditorBtn.addEventListener('click', function () {
            
        })

        UI.tilesetInputFile.addEventListener('change', function () {
            if (UI.tilesetInputFile.files!.length > 0) {
                const file = UI.tilesetInputFile.files![0]
                if (/\.(jpe?g|png)$/i.test(file.name)) { //check if the file is one of the supported files
                    const src = URL.createObjectURL(file);              
                    UI.previewImage.src = src;
                    UI.urlFile = src;
                    //TODO let on the img preview check the size of the each tile?
                    UI.fileName = file.name;
                }
            }
        })

        UI.createTilemapButton.addEventListener('click', function () {
            if (!UI.fileName || !UI.urlFile) return; 
            const data: FormData = new FormData(UI.tilemapDataForm);
            const tilemapName = data.get('file-name') as string
            const tileSize: [number, number] = [Number(data.get('x-tile-size')), Number(data.get('y-tile-size'))];
            const numberOfTiles: [number, number] = [Number(data.get('x-n-tile')), Number(data.get('y-n-tile'))]
           
            Editor.createTileMap(UI.fileName, UI.urlFile, tilemapName, numberOfTiles, tileSize);
            UI.initUITilemapFunctions();
            
            UI.fileName = undefined;
            UI.previewImage.src = '';
            UI.newPopupWindow.classList.toggle('hidden');
            UI.popupBackground.classList.toggle('hidden');
        })
    }

    public static initUITilemapFunctions() {
        const tilemap = Editor.getTilemap
        const createLayElement = () => {
            
            tilemap.createLayer();
            const previousLayer = document.querySelector('.layer');
            const layerContainer = createLayerElement(tilemap.layers.length - 1);

            UI.layersContainer.insertBefore(layerContainer, previousLayer);
        }

        UI.layersContainer.addEventListener('change', function () {
            const selectedLayerElement : HTMLInputElement | null = document.querySelector('input[name="Layer"]:checked');
            Editor.setCurrentLayer = Number(selectedLayerElement!.value);

        })

        UI.editTilemapBtn.addEventListener('click', function () {
            
        })

        UI.exportTilemapBtn.addEventListener('click', function () {
            const content = exportTilemap(tilemap); 
            let file = 'data:application/json;charset=utf-8,' + encodeURIComponent(content);
            let fileDefaultName = `${Editor.getTilemap.name}.json`;

            let linkELement = document.createElement('a');
            linkELement.setAttribute('href', file)
            linkELement.setAttribute('download', fileDefaultName);
            linkELement.click();
        })

        UI.cacheNeighboursBtn.addEventListener('click', function () {
            tilemap.cacheNeighbours();  
        });

        UI.toggleGridCheckbox.addEventListener('change', function() {
            tilemap.toggleGrid();
        })

       
        createLayElement();
        createLayElement();
        createLayElement();
        tilemap.createGrid(); //Garantees that will always be over the layers

        //Set the initial layer the ground
        const groundLayer: HTMLInputElement | null = document.querySelector('#l1');
        Editor.setCurrentLayer = 1;
        groundLayer!.checked = true;

    }



    public static initUITileset(tilesetPath: string) {
        const tilemap = Editor.getTilemap
        UI.tilesetImgElement.src = tilesetPath;
        UI.tilesetImgElement.addEventListener('mousedown', UI.changeCurrentTileTexture)
        
        const cssParam: string = `outline: 3px solid cyan; left:0; top:0; 
                                     width:${tilemap.tileSize[0]}px; height:${tilemap.tileSize[1]}px;`;
        UI.selectedTileElement.setAttribute('style', cssParam);
    }


     //TODO This doesnt work in a instanced class
    private static changeCurrentTileTexture(e: MouseEvent) {
        const tilemap = Editor.getTilemap;
        const {x,y} = UI.tilesetImgElement.getBoundingClientRect();
        const mouseX = e.clientX - x;
        const mouseY = e.clientY - y;
        
        //get the grid value IN THE UI
        const [resultx, resulty] = [Math.floor(mouseX / tilemap.tileSize[0]), Math.floor(mouseY / tilemap.tileSize[1])]
       
        //Position the selection square on the tile over the image
        UI.selectedTileElement.style.left = resultx * tilemap.tileSize[0] + "px";
        UI.selectedTileElement.style.top = resulty * tilemap.tileSize[1] + "px";

        Editor.setSelectedTile = [resultx * tilemap.tileSize[0], resulty * tilemap.tileSize[1]]
        
        const rect = new Rectangle(resultx * tilemap.tileSize[0], resulty * tilemap.tileSize[1],
            tilemap.tileSize[0], tilemap.tileSize[1]);
        const texture = new Texture(Editor.getTileset, rect);
        
        Editor.setSelectedTileTexture = texture;
        Editor.setSpriteTexture = texture;
    }

    public static getZHeight(): number{
        return Number(UI.zHeightInput.value);
    }
}
