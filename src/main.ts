import './style.css'
import  EditorManager  from './core/EditorManager';

//TODO criar uma promise que carrega a img do tileset com Assets loading

EditorManager.initialize(1280, 960, 0x6495ed);
EditorManager.createTileMap('tileset/isometric_tiles.png', [32, 32], [48,48]);

