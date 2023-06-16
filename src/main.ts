import './styles/main.css'
import './styles/editor.css'
import './styles/popupMenus.css'

import  EditorManager  from './core/EditorManager';
import { UI } from './core/UI';

//TODO let the user select the background color
EditorManager.initialize(1280, 960, 0x6495ed);
UI.initUIElements();


