import React from "react";
import { MouseEventHandler } from "react";
import './TaskbarButton.scss'

type Props=  {
    name: string,
    icon: string,
    isActive: boolean,
    handleClick?: MouseEventHandler,
    children:  React.ReactNode,
    hideLabel: boolean,
}
const TaskbarButton = ({name, icon, isActive, handleClick, children, hideLabel}: Props) => {
    return (
        <div
            className={`TaskbarButton  ${isActive ? 'isActive' : ''}`}
            onClick={handleClick}
        >
            {children
                ? children
                : <React.Fragment>
                    <img src={icon} className="small-icon" alt=""/>
                    <span className={`app-name ${hideLabel ? 'hide-label' : ''}`}>{name}</span>
                </React.Fragment>
            }
        </div>
    )
}

export default TaskbarButton;