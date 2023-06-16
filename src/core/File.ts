import { ILayer } from "../entities/Layer";
import { ITilemap, TilemapFile } from "../entities/Tilemap";
import { ITile } from "../entities/Tiles";


export function exportTilemap(tilemap: TilemapFile): string{
    const layers: Array<ILayer> = [];
    for (let i = 0; i < tilemap.layers.length; i++) {
        const tiles: Array<ITile> = Array.from(tilemap.layers[i].tileDictonary.values()) ;
        layers.push({
            name: tilemap.layers[i].name,
            renderOrder: tilemap.layers[i].renderOrder,
            createdTiles: tiles
        } as ILayer)
    }

    return JSON.stringify({
        tilesetName: tilemap.tilesetName,
        mapSize: tilemap.tileSize,
        tileSize: tilemap.tileSize,
        layers: layers
    } as ITilemap);
}
/*
export function openTilemap(tilemap: TilemapFile) : TilemapFile {
    
}*/