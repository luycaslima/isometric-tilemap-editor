import { Layer } from "@pixi/layers";
import { Tile } from "./Tiles";

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

    //TODO Fazer o Css do layer
    //TODO ENtender como reordenar radio inputs como lista <li>
    //https://www.codingnepalweb.com/drag-and-drop-sortable-list-html-javascript/   
    return divContainer;
}


export interface ILayer {

    renderOrder: number;
    name: string;
    tiles: Array<Array<Tile | undefined>>;
}

//const layerElement: HTMLDivElement ;

export class MapLayer extends Layer implements ILayer{ 
    tiles: Array<Array<Tile | undefined>>;
    renderOrder: number = 0;
    name: string;

    constructor(tiles : Array<Array <Tile | undefined>>) {
        super();
        this.name = `Layer`;
        this.tiles = tiles
        this.group.enableSort = true;
    }

    setLayerZRender(value: number) {
        this.zOrder = value;
        this.renderOrder = value;
    }
}