import { Container, Point, Sprite, Texture } from "pixi.js";

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
        x: (gridPosition.x * SPRITESIZE.w / 2  - gridPosition.y  * SPRITESIZE.w /2) - (SPRITESIZE.w/2),
        y: gridPosition.x *  SPRITESIZE.h / 4  + gridPosition.y  * SPRITESIZE.h /4 - (SPRITESIZE.h/2) 
    } as Point;
}

//Best to not export a Point from pixi js
export interface Vector2{
    x: number;
    y: number;
}

type TileType = "SPAWNER" | "NORMAL";

export interface ITile {
    //the position on the tileset atlas of the tile (value of the grid* tileset size)
    tilesetTile: [number, number];
    isoPosition: Vector2;
    gridPosition: Vector2;
    z: number; // Height of the tile (zIndex)
    tileType: TileType;
}

export class Tile extends Container implements ITile{
    tilesetTile: [number, number];
    isoPosition: Vector2;
    gridPosition: Vector2;
    z: number; // Height of the tile (zIndex)
    tileType: TileType;
    
    private sprite : Sprite


    constructor(gridPosition: Point, texture: Texture, tilesetPos : [number,number]) {
        super();

        this.tileType = 'NORMAL';
        this.tilesetTile = tilesetPos;
        this.gridPosition = gridPosition; //Attetion to convertion from point to vector2
        this.sprite = new Sprite(texture);

        this.zIndex = gridPosition.x + gridPosition.y;
        this.z = 0;

        this.isoPosition = toScreenCoordinates(gridPosition); //Attetion to convertion from point to vector2
        
        this.position.x = this.isoPosition.x;
        this.position.y = this.isoPosition.y;

        this.addChild(this.sprite);
        this.sortChildren();
    }

    public changeTexture(texture: Texture) {
        this.sprite.texture = texture;
    }
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