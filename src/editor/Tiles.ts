import { Point } from "pixi.js";

// These are the four numbers that define the transform to isometric direction, i hat and j hat
const i_x = 1;
const i_y = 0.5;
const j_x = -1;
const j_y = 0.5;

//Constante por enquanto, futuro ser capaz de editar
export const SPRITESIZE = {w:48,h:48} as const;

//Converte grid position to  isometric position
export function toScreenCoordinates(gridPosition: Point): Point {
    //Multiply by halfbecause of the offset of 0 on the canvas
    return {
        x: gridPosition.x * i_x * 0.5 * SPRITESIZE.w + gridPosition.y * j_x * 0.5 * SPRITESIZE.w,
        y: gridPosition.x * i_y * 0.5 * SPRITESIZE.h + gridPosition.y * j_y *  0.5 * SPRITESIZE.h
    } as Point;
}

export interface ITile {
    tilesetSpritePos: [number, number]; //the top left tile position in pixels of the tileset
    //position: Point;
    isWalkable: boolean;
    isSpawner: boolean;
}
/*
export class Tile extends Container implements ITile{
    public sprite: Sprite;

    public gridPosition: Point;
    public isoPosition: Point;
    
    public isWalkable: boolean;
    public isSpawner: boolean;

    constructor(gridPosition: Point, texture: Texture) {
        super();   
        this.gridPosition = gridPosition;
        this.sprite = new Sprite(texture)
  
        this.isoPosition = toScreenCoordinates(gridPosition);
        
        this.isWalkable = true;
        this.isSpawner = false;

        this.eventMode = 'static'
        this.on('click',this.selectTile);

        this.position.x = this.isoPosition.x;
        this.position.y = this.isoPosition.y;

        this.addChild(this.sprite);
    }

    private selectTile() {
        console.log(`Selected tile : x:${this.gridPosition.x} y:${this.gridPosition.y}`)
    }

}*/