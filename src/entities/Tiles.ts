import { Container, Point, Sprite, Texture } from "pixi.js";

export interface SpriteSize {
    w: number;
    h: number
}

//Convert grid position to  isometric position
export function toScreenCoordinates(gridPosition: Point, spriteSize : SpriteSize): Point {
    return {
        x: (gridPosition.x * spriteSize.w / 2  - gridPosition.y  * spriteSize.w /2) - (spriteSize.w/2),
        y: gridPosition.x *  spriteSize.h / 4  + gridPosition.y  * spriteSize.h /4 - (spriteSize.h/2) 
    } as Point;
}

//Best to not export a Point from pixi js
export interface Vector2{
    x: number;
    y: number;
}//TODO adicionar o z aqui

type TileType = "SPAWNER" | "NORMAL";

export interface ITile {
    //the position of the tile on the tileset basetexture (size of the grid * tileset size)
    tilesetTile: [number, number];
    isoPosition: Vector2;
    gridPosition: Vector2;
    zHeight: number;
    depth: number; //depth
    tileType: TileType;
    neighbours: [Vector2 | undefined, Vector2 | undefined, Vector2 | undefined, Vector2 | undefined]
}

export class Tile extends Container implements ITile{
    tilesetTile: [number, number];
    isoPosition: Vector2;
    zHeight: number;
    gridPosition: Vector2;
    depth: number; // depth - order of rendering
    tileType: TileType;
    //UP,RIGHT,DOWN,LEFT
    neighbours: [Vector2 | undefined, Vector2 | undefined, Vector2 | undefined, Vector2 | undefined]

    
    private sprite : Sprite
    private spriteSize : SpriteSize

    constructor(gridPosition: Point, z: number,texture: Texture, tilesetPos : [number,number], spriteSize : SpriteSize) {
        super();

        this.tileType = 'NORMAL';
        this.tilesetTile = tilesetPos;
        this.gridPosition = gridPosition; //Attetion to convertion from point to vector2
        this.sprite = new Sprite(texture);
        this.spriteSize = spriteSize;
        this.neighbours = [undefined,undefined,undefined,undefined]

        this.zIndex = gridPosition.x + gridPosition.y;        
        this.depth = this.zIndex;

        this.zHeight = z;
        this.isoPosition = toScreenCoordinates(gridPosition,spriteSize); //Attetion to convertion from point to vector2
        
        this.position.x = this.isoPosition.x;
        this.recalculateHeight(z);
        this.addChild(this.sprite);
    }

    public changeTexture(texture: Texture) : void {
        this.sprite.texture = texture;
    }

    public recalculateHeight(z: number): void{
        const heightOffset: number = -(this.spriteSize.h / 2) * z;
        this.zHeight = z;
        this.position.y = this.isoPosition.y + heightOffset;
    }

}
