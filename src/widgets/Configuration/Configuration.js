import React from "react";
import './Configuration.scss';
import {useDesktopConfig} from "../../Contexts/DesktopConfigContext";

const Configuration = () => {

    const {centered, setCentered, taskbarLocation, setTaskbarLocation} = useDesktopConfig();

    return (
        <div className="Configuration">
            <fieldset onChange={(event) => setTaskbarLocation(event.target.value)}>
                <legend>Taskbar Location</legend>
                <label>
                    <input type="radio" id="top" name='taskbarLocation' value="top"
                           checked={taskbarLocation === "top"}/>
                    Top
                </label>
                <label>
                    <input type="radio" id="right" name='taskbarLocation' value="right"
                           checked={taskbarLocation === "right"}/>
                    Right
                </label>
                <label>
                    <input type="radio" id="bottom" name='taskbarLocation' value="bottom"
                           checked={taskbarLocation === "bottom"}/>
                    Bottom
                </label>
                <label>
                    <input type="radio" id="left" name='taskbarLocation' value="left"
                           checked={taskbarLocation === "left"}/>
                    Left
                </label>
            </fieldset>
            <fieldset onChange={(event) => setCentered(event.target.value === "true")}>
                <legend>Taskbar Centering</legend>
                <label>
                    <input type="radio" id="top" name='taskbarCentering' value={true} checked={centered}/>
                    Centered
                </label>
                <label>
                    <input type="radio" id="right" name='taskbarCentering' value={false} checked={!centered}/>
                    Not Centered
                </label>
            </fieldset>
        </div>
    )
};


export default Configuration;