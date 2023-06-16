import { Graphics, Point, Polygon } from "pixi.js";
import EditorManager from "../core/EditorManager";
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
        EditorManager.showCurrentTileOnGrid(this);
        if (Input.isLeftMouseDown) EditorManager.placeTile(this.gridPosition); //TODO block thoses events when new tilemap window appears

        this.clear();
        this.beginFill(0xFFFFFF);
        this.alpha = 0.5;
        this.lineStyle(1, 0x00000);
        this.drawPolygon(this.rectPos);
        this.endFill()
    }

    private outHover() {
        //hide it
        EditorManager.hideCurrentTileOnGrid(); //TODO block thoses events when new tilemap window appears
        this.clear();
        this.alpha = 0.8;
        this.lineStyle(1, 0x00000);
        this.drawPolygon(this.rectPos);
        this.endFill();
    }
    
    private placeTile() {
        EditorManager.placeTile(this.gridPosition); //TODO block thoses events when new tilemap window appears
    }
}