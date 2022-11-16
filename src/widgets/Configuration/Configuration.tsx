import React from "react";
import './Configuration.scss';
import {useDesktopConfig} from "../../Contexts/DesktopConfigContext";

const Configuration = () => {

    const {centered, setCentered, taskbarLocation, setTaskbarLocation} = useDesktopConfig();

    const onTaskbarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTaskbarLocation(event.target.value);
    };

    const onCenterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCentered(event.target.value === "true");
    };

    return (
        <div className="Configuration">
            <fieldset>
                <legend>Taskbar Location</legend>
                <label>
                    <input type="radio" id="top" name='taskbarLocation' value="top"
                           checked={taskbarLocation === "top"} onChange={onTaskbarChange} />
                    Top
                </label>
                <label>
                    <input type="radio" id="right" name='taskbarLocation' value="right"
                           checked={taskbarLocation === "right"} onChange={onTaskbarChange}/>
                    Right
                </label>
                <label>
                    <input type="radio" id="bottom" name='taskbarLocation' value="bottom"
                           checked={taskbarLocation === "bottom"} onChange={onTaskbarChange}/>
                    Bottom
                </label>
                <label>
                    <input type="radio" id="left" name='taskbarLocation' value="left"
                           checked={taskbarLocation === "left"} onChange={onTaskbarChange}/>
                    Left
                </label>
            </fieldset>
            <fieldset>
                <legend>Taskbar Centering</legend>
                <label>
                    <input type="radio" id="top" name='taskbarCentering' value="true" checked={centered} onChange={onCenterChange}/>
                    Centered
                </label>
                <label>
                    <input type="radio" id="right" name='taskbarCentering' value="false" checked={!centered} onChange={onCenterChange}/>
                    Not Centered
                </label>
            </fieldset>
        </div>
    )
};

export default Configuration;
