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
export interface Vector3{
    x: number;
    y: number;
    z?: number; //UP directions simulating height(third axis) between tiles in the 2d world
}

type TileType = "SPAWNER" | "NORMAL";

export interface ITile {
    //the position of the tile on the tileset basetexture (size of the grid * tileset size)
    tilesetTile: [number, number];
    isoPosition: Vector3;
    gridPosition: Vector3;
    depth: number; //depth
    tileType: TileType;
    neighbours: [Vector3 | undefined, Vector3 | undefined, Vector3 | undefined, Vector3 | undefined]
}

export class Tile extends Container implements ITile{
    tilesetTile: [number, number];
    isoPosition: Vector3;
    //zHeight: number;
    gridPosition: Vector3;
    depth: number; // depth - order of rendering
    tileType: TileType;
    //UP,RIGHT,DOWN,LEFT
    neighbours: [Vector3 | undefined, Vector3 | undefined, Vector3 | undefined, Vector3 | undefined]


    private sprite : Sprite
    private spriteSize : SpriteSize

    constructor(gridPosition: Point, z: number,texture: Texture, tilesetPos : [number,number], spriteSize : SpriteSize) {
        super();
      
        this.tileType = 'NORMAL';
        this.tilesetTile = tilesetPos;
        this.gridPosition = { x: gridPosition.x, y:gridPosition.y, z: z  }; //Attetion to convertion from point to vector3
        this.sprite = new Sprite(texture);
        this.spriteSize = spriteSize;
        this.neighbours = [undefined,undefined,undefined,undefined]

        this.zIndex = gridPosition.x + gridPosition.y;        
        this.depth = this.zIndex;

        this.isoPosition = toScreenCoordinates(gridPosition,spriteSize); //Attetion to convertion from point to vector3
        
        this.position.x = this.isoPosition.x;
        
        //First time must happen here
        const heightOffset: number = -(this.spriteSize.h / 2) * z;
        this.gridPosition.z = z;
        this.position.y = this.isoPosition.y + heightOffset;
        this.isoPosition.y = this.isoPosition.y + heightOffset;

        this.addChild(this.sprite);
    }

    public changeTexture(texture: Texture) : void {
        this.sprite.texture = texture;
    }

    public recalculateHeight(z: number): void{
        if (z === this.gridPosition.z) return;
            
        const heightOffset: number = -(this.spriteSize.h / 2) * z;
        this.gridPosition.z = z;
        this.position.y = this.isoPosition.y + heightOffset;
        this.isoPosition.y = this.isoPosition.y + heightOffset;
    }


}
