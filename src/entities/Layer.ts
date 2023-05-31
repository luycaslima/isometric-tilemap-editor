import { Layer } from "@pixi/layers";
import { ITile, Tile } from "./Tiles";

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

//TODO Have a flag to identify if this layer is purely for decoration?
export interface ILayer {
    renderOrder: number;
    name: string;
    createdTiles: Array<ITile>;
}

//TODO refactor and see if only a map is necessary
export class MapLayer extends Layer { 
    tiles: Array<Array<Tile | undefined>>; 
    //Create map 
    tileDictonary: Map<string, ITile>;
    renderOrder: number = 0;
    name: string;

    constructor(tiles : Array<Array <Tile | undefined>>) {
        super();
        this.name = `Layer`;
        this.tiles = tiles
        this.group.enableSort = true;
        this.tileDictonary = new Map();
    }

    setLayerZRender(value: number) {
        this.zOrder = value;
        this.renderOrder = value;
    }
}