import { Graphics, Point, Polygon } from "pixi.js";
import Editor from "../core/Editor";
import Input from "../core/Input";

//Class for the representation of the grid of the map
export class GridSquare extends Graphics{
    private readonly gridPosition: Point
    private rectPos: [number, number, number, number, number, number, number, number];

    constructor(gridPos : Point, rect : [number, number, number, number, number, number, number, number]) {
        super(); 
        this.gridPosition = gridPos;
        
        this.rectPos = rect;
        this.lineStyle(1, 0x00000);
        this.alpha = 0.8;

        this.drawPolygon(this.rectPos);
        //Region interactable by the user (mouse)
        this.hitArea = new Polygon(this.rectPos); 
        this.eventMode = 'static';

        //TODO descorbri uma forma de n ter q chamar no pointer down e no mouser over
        this.on('pointerdown', this.placeTile); //Calls the fill square with tile function here
        
        this.on('mouseover', this.onHover); 
        this.on('mouseout', this.outHover);
    }

    private onHover() {
        //Show the current sprite in the grid position 
        Editor.showCurrentTileOnGrid(this);
        if (Input.isLeftMouseDown) Editor.placeTile(this.gridPosition); 

        this.clear();
        this.beginFill(0xFFFFFF);
        this.alpha = 0.5;
        this.lineStyle(1, 0x00000);
        this.drawPolygon(this.rectPos);
        this.endFill()
    }

    private outHover() {
        //hide it
        Editor.hideCurrentTileOnGrid();
        this.clear();
        this.alpha = 0.8;
        this.lineStyle(1, 0x00000);
        this.drawPolygon(this.rectPos);
        this.endFill();
    }
    
    private placeTile(e: MouseEvent) {
        if (e.button.toString() !== '0') return; //Find a way to check the input check
        Editor.placeTile(this.gridPosition); 
    }
}