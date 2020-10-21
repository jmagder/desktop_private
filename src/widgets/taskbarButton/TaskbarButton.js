import React from "react";
import './TaskbarButton.scss'

const TaskbarButton = ({name, icon, isActive, handleClick, children, hideLabel}) => {
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