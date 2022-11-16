import React from 'react';
import './App.scss';
import Taskbar from "./widgets/taskbar/Taskbar";
import Window from './widgets/window/Window'

import {useDesktopConfig} from "./Contexts/DesktopConfigContext";
import {useAppList} from "./Contexts/AppListContext";

function App() {
    const {taskbarLocation} = useDesktopConfig();
    const {openAppList} = useAppList();
    const desktopNodeRef = React.useRef(null);

    return (
        <div className="App">
            <div className={`grid-container taskbar-${taskbarLocation}`}>
                <div id="desktop" ref={desktopNodeRef}>
                    {openAppList.map(currentApp =>
                        <Window key={currentApp.timestamp}
                                {...currentApp}
                                boundingNode={desktopNodeRef}/>)}
                </div>
                <div id="taskbar" className={'taskbar-anchor'}>
                    <Taskbar/>
                </div>
            </div>
        </div>
    );
}

export default App;
