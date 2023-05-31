# Isometric Tatics Game (Map editor)

A typescript + vite + pixi js project for a isometric tatics game. Basic tilemap editor for the isometric-tatics repo.

---

## TODO

- [x] Tile interface

- [ ] Tilemaps
  
  - [x] Create Tilemaps
  
  - [ ] Background Image/Scenario of the Map
  
  - [ ] Layers
    
    - [x] Store name on layers
      
      - [ ] use the name variable
    
    - [ ] Refactor the matrix of tiles to use only a Map of created Tiles
    
    - [x] Store an array of Layers on the tilemap and insert the Tiles in each layer.
    
    - [x] Use the pixi layers context for z ordering and layers function
  
  - [x] Store Tiles, Sprite Size and path for the texture.
    
    - [x] Place sprite on the position of the grid and store on the exportable variable the data
  
  - [x] Grid
    
    - [x] Draw Grid
    
    - [x] Hover functions
    
    - [x] Place tile Function

- [x] Tilesets
  
  - [x] Create Tilesets

- [ ] Input Manager/Mouse class 
  
  - [ ] Mouse zoom
  
  - [ ] Mouse pan
  
  - [ ] Hold mouse button to apply the current tool to tile automatically when moving it

- [ ] TileMap Editor Manager
  
  - [x] Show Current selected tile on the grid
  
  - [x] Select tile from Tileset to draw on map
  
  - [ ] Open map file (JSON)
  
  - [ ] Export/Save map file (JSON)
    
    - [x] How save nested objects

- [ ] TileMap Editor UI/UX
  
  - [ ] Basic Interface / Functions
    
    - [ ] Layers
      
      - [x] Create new Layer
      
      - [x] Select current Layer
      
      - [ ] Delete current Layer
      
      - [ ] Hide Layer Button (Check box)
      
      - [x] Toggle Grid
      
      - [ ] Re order Layers
      
      - [x] CSS STYLE (Layer, buttons, change name(label)?)
    
    - [x] Tileset
    
    - [x] Export button
    
    - [x] Open button
    
    - [ ] New Tilemap button
    
    - [ ] New Tileset button (?)
    
    - [ ] Tools ( Brush, Eraser ) Zoom Input

- [ ] Direct Integration in the game engine (?)
