import './styles/main.css'
import './styles/editor.css'
import './styles/popupMenus.css'

import  Editor  from './core/Editor';
import { UI } from './core/UI';

//TODO let the user select the background color
Editor.initialize(1280, 960, 0x6495ed);
UI.initUIElements();


