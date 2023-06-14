# IsoEditor (Isometric tilemap editor)

A typescript + vite + pixi js project for a isometric tatics game. Basic tilemap editor that export the map in JSON for the isometric-tatics repo.

---

## TODO

- [x] Tile interface

- [ ] Host an usable version on vercel

- [ ] Document the code

- [ ] Organize/Stylize the README with explanation on how to use it

- [ ] Integration with svelte + tailwind for easier UI development

- [ ] Tilemaps
  
  - [x] Create Tilemaps
  
  - [ ] Background Image/Scenario of the Map
  
  - [x] Layers
    
    - [x] Store name on layers
    
    - [x] Add tile with custom height ( Z height)
    
    - [x] Refactor the matrix of tiles to use only a Map of created Tiles
    
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
  
  - [x] Hold mouse button to apply the current tool to tile automatically when moving it

- [ ] TileMap Editor Manager
  
  - [x] Show Current selected tile on the grid
  
  - [x] Select tile from Tileset to draw on map
  
  - [x] Separate the UI Elements in another class
  
  - [ ] Lazy load of the images
  
  - [ ] Open map file (JSON)
  
  - [x] Export/Save map file (JSON)
    
    - [x] How save nested objects

- [ ] TileMap Editor UI/UX
  
  - [ ] Basic Interface / Functions
    
    - [ ] Layers
      
      - [x] Select current Layer
      
      - [x] Fix number of the layers in three
        
        - [ ] Especify which is the walkable floor and the other two as only decorative( Visualy)
      
      - [ ] Hide Layer Button (Check box)
      
      - [x] Toggle Grid
      
      - [x] CSS STYLE (Layer, buttons, change name(label)?)
    
    - [x] Tileset
    
    - [x] Export button
    
    - [x] Open button
    
    - [x] Tile's Z Height input
    
    - [ ] New Tilemap button
      
      - [ ] Set up tileset size, image and tilemap grid with a form
    
    
    
    - [ ] Edit Tilemap Button ( With a button like that >✏️)
    
    - [ ] Tools ( Brush, Eraser ) Zoom Input
    
    - [ ] Open Tilemap Button
    
    - [x] Export TIlemap Button
