
export function createLayerElement(id: number): HTMLDivElement {
    const divContainer : HTMLDivElement = document.createElement('div');
    divContainer.className = 'layer';
    divContainer.id = id.toString();

    const input: HTMLInputElement = document.createElement('input');   
    input.type = 'radio';
    input.name = `Layer`;
    input.value = id.toString();
    input.id = `l${id.toString()}`;
    
    const label : HTMLLabelElement = document.createElement('label');
    label.htmlFor = input.id;

    let layerName: string = '';
    
    switch (id) {
        case 0:
            layerName = "Lower Dec. Layer";
            break;
        case 1:
            layerName = "Ground Layer";
            break;
        case 2:
            layerName = "High Dec. Layer";
            break;
                    
    }

    label.textContent = layerName;
    const breakPoint: HTMLBRElement = document.createElement('br');
    
    divContainer.appendChild(input);
    divContainer.appendChild(label);
    divContainer.appendChild(breakPoint);
 
    return divContainer;
}

export class UI {
    
}
