import { Container, Point, Sprite, Texture } from "pixi.js";

export interface SpriteSize {
    w: number;
    h: number
}

//Converte grid position to  isometric position
export function toScreenCoordinates(gridPosition: Point, spriteSize : SpriteSize): Point {
    //Multiply by halfbecause of the offset of 0 on the canvas
    return {
        x: (gridPosition.x * spriteSize.w / 2  - gridPosition.y  * spriteSize.w /2) - (spriteSize.w/2),
        y: gridPosition.x *  spriteSize.h / 4  + gridPosition.y  * spriteSize.h /4 - (spriteSize.h/2) 
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
    depth: number; //depth
    tileType: TileType;
}

export class Tile extends Container implements ITile{
    tilesetTile: [number, number];
    isoPosition: Vector2;
    gridPosition: Vector2;
    depth: number; // depth
    tileType: TileType;
    
    private sprite : Sprite


    constructor(gridPosition: Point, texture: Texture, tilesetPos : [number,number], spriteSize : SpriteSize) {
        super();

        this.tileType = 'NORMAL';
        this.tilesetTile = tilesetPos;
        this.gridPosition = gridPosition; //Attetion to convertion from point to vector2
        this.sprite = new Sprite(texture);

        this.zIndex = gridPosition.x + gridPosition.y;
        this.depth = this.zIndex;

        this.isoPosition = toScreenCoordinates(gridPosition,spriteSize); //Attetion to convertion from point to vector2
        
        this.position.x = this.isoPosition.x;
        this.position.y = this.isoPosition.y;

        this.addChild(this.sprite);
    }

    public changeTexture(texture: Texture) {
        this.sprite.texture = texture;
    }

}
