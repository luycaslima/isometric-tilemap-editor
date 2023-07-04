import { Vector3 } from "../entities/Tiles";
import Editor from "./Editor";

export default class Input {
    public static readonly state : Map<string, boolean> = new Map<string, boolean>;

    //TODO pensar quando tiver q clicar multiplos botoes(existem funcoes prebuilt)
    public static isLeftMouseDown: boolean = false;
    public static isMiddleMouseDown: boolean = false;
    private static lastMousePosition: Vector3;

    public static initialize() : void{
        document.addEventListener('keydown', Input.keyDown);
        document.addEventListener('keyup', Input.keyUp);
        document.addEventListener('mousedown', Input.mouseDown);
        document.addEventListener('mouseup', Input.mouseUp);

          
        const stage = document.querySelector('#pixi-canvas') as HTMLCanvasElement;
        stage.addEventListener('wheel', Input.wheel);
        stage.addEventListener('mousedown', Input.setLastMousePosition);
        stage.addEventListener('mousemove', Input.moveMap);
    }

    private static keyDown(e: KeyboardEvent): void{
        Input.state.set(e.key, true);
    }

    private static keyUp(e: KeyboardEvent): void{
        Input.state.set(e.key, false);
    }

    private static mouseDown(e: MouseEvent): void {
        Input.state.set(e.button.toString(), true);
    
    }
    private static mouseUp(e: MouseEvent):void {
        Input.state.set(e.button.toString(), false);
    }

     //ZOOM and Pan use stage from pixi/layers https://plnkr.co/edit/II6lgj511fsQ7l0QCoRi?p=preview&preview
    private static wheel(e: WheelEvent) {
        if(!Editor.getCurrentTilemapFile) return;
        //TODO check if is a map to make this event
        Input.zoom(e.deltaY, e.offsetX, e.offsetY);
    }
    private static zoom(verticalMouseVelocity: number, x: number, y: number): void{
        const stage = Editor.getAppStage; //need to be the stage not the current scene because we need to know the size of screen

        verticalMouseVelocity = verticalMouseVelocity > 0 ? 2 : 0.5;

        const worldPos: Vector3 = {
            x: (x - stage.x) / stage.scale.x,
            y: (y - stage.y) / stage.scale.y
        } as Vector3;
        const newScale: Vector3 = {
            x: stage.scale.x * verticalMouseVelocity,
            y: stage.scale.y * verticalMouseVelocity
        };

        newScale.x = newScale.x > 4 ? 4 : newScale.x
        newScale.x = newScale.x < 1 ? 1 : newScale.x
        
        
        newScale.y = newScale.y > 4 ? 4 : newScale.y
        newScale.y = newScale.y < 1 ? 1 : newScale.y
        

        const newScreenPos = {
            x: (worldPos.x) * newScale.x + stage.x,
            y: (worldPos.y) * newScale.y + stage.y
        };

        stage.x -= (newScreenPos.x-x) ;
        stage.y -= (newScreenPos.y - y);
        
        stage.scale.x = newScale.x;
        stage.scale.y = newScale.y;
    }

    private static setLastMousePosition(e: MouseEvent) {
        Input.lastMousePosition = {x : e.offsetX, y:e.offsetY} as Vector3;
    }
    private static moveMap(e: MouseEvent) {
        if (!Input.isMiddleMouseDown || (!Editor.getCurrentTilemapFile)) return;
        
        const stage = Editor.getAppStage;
        stage.x += (e.offsetX - Input.lastMousePosition.x);
        stage.y += (e.offsetY - Input.lastMousePosition.y);  
        Input.lastMousePosition = {x:e.offsetX,y:e.offsetY};
        
    }



    public static update(_delta : number) {
        Input.isLeftMouseDown = Input.state.get('0') ? true : false;
        Input.isMiddleMouseDown = Input.state.get('1') ? true : false;
    }
}