import React from "react";
import './Taskbar.scss'
import TaskbarButton from "../taskbarButton/TaskbarButton";
import classNames from 'classnames';
import Popover from "../Popover/Popover";
import Menu from "../Menu/Menu";
import Configuration from "../Configuration/Configuration";

import {useDesktopConfig} from "../../Contexts/DesktopConfigContext";
import {useAppList} from "../../Contexts/AppListContext";

import StartIcon from '../../icons/start.svg'
import CogIcon from '../../icons/settings.svg'

const Taskbar = () => {
    const {centered, taskbarLocation} = useDesktopConfig();
    const {openAppList, setActiveApp} = useAppList();

    const vertical = taskbarLocation === "left" || taskbarLocation === "right";

    const getTaskbarButtonHandler = ({name, timestamp}) => {
        return () => setActiveApp(name, timestamp, true);
    }

    const taskbarButtons = openAppList.map(value =>
        <TaskbarButton
            hideLabel={vertical}
            key={value.timestamp}
            icon={value.icon}
            name={value.name}
            isActive={value.isActive}
            handleClick={getTaskbarButtonHandler(value)}>
        </TaskbarButton>);

    const classes = classNames({
        'Taskbar': true,
        'center': centered,
        'vertical': vertical
    });

    return (
        <div className={classes}>
            <Popover content={<Menu/>} displayBeside={vertical} redrawOnChange={taskbarLocation}>
                <TaskbarButton name="hello">
                    <img className="small-icon" src={StartIcon} alt=""/>
                </TaskbarButton>
            </Popover>
            {taskbarButtons}
            <div className={!centered ? 'last-item' : ''}>
                <Popover content={<Configuration/>} displayBeside={vertical} redrawOnChange={taskbarLocation}
                         className="last-item">
                    <TaskbarButton>
                        <img className="small-icon" src={CogIcon} alt=""/>
                    </TaskbarButton>
                </Popover>
            </div>
        </div>
    )
}

export default Taskbar;