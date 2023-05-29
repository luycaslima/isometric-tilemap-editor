import { Layer } from "@pixi/layers";
import { Tile } from "./Tiles";

export function createLayerElement(id : number): HTMLInputElement {
    const input: HTMLInputElement = document.createElement('input');   
    input.type = 'radio';
    input.className = "layer";
    input.name = `Layer`;
    input.value = id.toString();
    input.id = id.toString();
    input.draggable = true;
    //TODO Criar label do radio input
    //TODO Fazer o Css do layer
    //TODO ENtender como reordenar radio inputs como lista <li>
    //https://www.codingnepalweb.com/drag-and-drop-sortable-list-html-javascript/   
    return input;
}

//const layerElement: HTMLDivElement ;

export class MapLayer extends Layer{ 
    tiles: Array<Array<Tile | undefined>>;
    indexOrder: number = 0; //set on the constructor

    constructor( tiles : Array<Array <Tile | undefined>>) {
        super();
        this.tiles = tiles
        this.group.enableSort = true;
    }

    public deleteLayer() {
        
    }

    setLayerZRender(value: number) {
        //change the zorder of the layer based on the position of the element fo this class 
    }
}