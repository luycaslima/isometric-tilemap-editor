import { ILayer } from "../entities/Layer";
import { TilemapFile } from "../entities/Tilemap";
import { ITile } from "../entities/Tiles";

export function createLayerElement(id : number): HTMLDivElement {
    const divContainer : HTMLDivElement = document.createElement('div');
    divContainer.className = 'layer';
    divContainer.draggable = true;
    divContainer.id = id.toString();

    const input: HTMLInputElement = document.createElement('input');   
    input.type = 'radio';
    input.name = `Layer`;
    input.value = id.toString();
    input.id = `l${id.toString()}`;
    //input.draggable = true;
    input.checked = true;

    const label : HTMLLabelElement = document.createElement('label');
    label.htmlFor = input.id;
    label.textContent = `${input.name}  ${Number(Number(id.toString()) + 1)}`;
    const breakPoint: HTMLBRElement = document.createElement('br');
    
    divContainer.appendChild(input);
    divContainer.appendChild(label);
    divContainer.appendChild(breakPoint);

    //TODO Entender como reordenar radio inputs como lista <li>
    //https://www.codingnepalweb.com/drag-and-drop-sortable-list-html-javascript/   
    return divContainer;
}


export function exportTilemap(tilemap: TilemapFile): string{
    const layers: Array<ILayer> = [];
    for (let i = 0; i < tilemap.layers.length; i++) {
        const tiles: Array<ITile> = Array.from(tilemap.layers[i].tileDictonary.values()) ;
        layers.push({
            name: tilemap.layers[i].name,
            renderOrder: tilemap.layers[i].renderOrder,
            createdTiles: tiles
        } as ILayer)
    }

    return JSON.stringify({
        tilesetPath: tilemap.tilesetPath,
        mapSize: tilemap.tileSize,
        tileSize: tilemap.tileSize,
        layers : layers
    })
}

export function openTilemap(tilemap: TilemapFile) {
    
}