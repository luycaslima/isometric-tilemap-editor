import { Application, BaseTexture, SCALE_MODES, Texture } from 'pixi.js'
import './style.css'
import { Tilemap } from './editor/Tilemap';



//TODO criar botoes que cria um TILEMAP e um TILESET;
//const tilesContainer = document.querySelector('.tiles-container');
const layerContainer = document.querySelector('.layers-container');

//Criando Tileset
const tilesetElement = document.querySelector('.tileset') as HTMLImageElement;
const tileset: Texture = Texture.from('tileset/isometric_tiles.png');
tilesetElement.src = 'tileset/isometric_tiles.png';

 //shift +click para remover o tile (no container de tile set selecionar mais de um?)
 //click para inserir tile
const selectedTile: [number, number] = [0, 0];
const gridSize: [number, number] = [48, 24];
const currentTile : [number, number] = [0, 0]; //Tile selecionado com ctrl+ mouse  que mostra suas flags no lil gui

let selectedLayer: number = 0;

const app: Application = new Application({
  view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  background: 0x6495ed,
  width: 1280,
  height: 960
})

//Pixel art style
BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;

//CRIA TILEMAP
const tilemap: Tilemap = new Tilemap('tileset/isometric_tiles.png', [32, 32], gridSize);
tilemap.position.x = app.screen.width / 2;
tilemap.position.y = app.screen.height / 8;

app.stage.addChild(tilemap);


