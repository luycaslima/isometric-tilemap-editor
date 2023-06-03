import { ILayer } from "../entities/Layer";
import { TilemapFile } from "../entities/Tilemap";
import { ITile } from "../entities/Tiles";

//TODO remove this and limit only to 3 layers
export function createLayerElement(id : number): HTMLDivElement {
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

export function openTilemap(tilemap: TilemapFile) /*: TilemapFile */ {
    
}