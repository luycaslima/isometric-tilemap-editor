# Isometric Tatics Game (Map editor)

A typescript + vite + pixi js project for a isometric tatics game. Basic tilemap editor for the isometric-tatics repo.

---

## TODO

- [ ] Refactor for using the pixi layers for z ordering and layers function

- [ ] TileMap
  
  - [ ] Background Image/Scenario of the Map
  
  - [x] Grid
    
    - [x] Draw Grid 
    
    - [x] Hover functions
    
    - [x] Place tile Function

- [x] Tile interface

- [ ] TileMap Editor Manager
  
  - [x] Create Tilemaps
    
    - [x] Create Tilesets
      
      - [ ] Separate from the EditorManager
  
  - [x] Place sprite on the position of the grid and store on the exportable variable the data
  
  - [x] Show Current selected tile on the grid
  
  - [x] Select tile from Tileset to draw on map
  
  - [ ] Export functions
    
    - [ ] JSON

- [ ] TileMap Editor UI/UX
  
  - [ ] Basic Interface / Functions
    
    - [ ] Layers
    
    - [x] Tileset
    
    - [ ] Export button
    
    - [ ] New Tilemap button
    
    - [ ] New Tileset button?
    
    - [ ] Tools ( Brush, Eraser ) Zoom Input
    
    - [ ] Mouse events
      
      - [ ] Mouse zoom
      
      - [ ] Mouse drag
      
      - [ ] Hold mouse button to place tile automatically when moving
