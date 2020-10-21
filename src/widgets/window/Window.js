import React, {useEffect, useState} from "react";
import {useAppList} from "../../Contexts/AppListContext";
import './Window.scss';

import {IoIosCloseCircleOutline as CloseIcon} from 'react-icons/io'
import {VscChromeMinimize as MinimizeIcon} from 'react-icons/vsc'
import {AiOutlineExpandAlt as MaximizeIcon} from 'react-icons/ai'
import {CSSTransition} from "react-transition-group";
import classNames from "classnames";

// TODO: Move more of config to not be passed in ?
const Window = ({name, timestamp, icon, windowConfiguration = {}, boundingNode, isActive}) => {
    const {width, height, zIndex, top, left, minimized, maximized} = windowConfiguration;
    const windowNodeRef = React.useRef(null);
    const {setActiveApp, persistNewAppConfig, closeApp, getAppFromName} = useAppList();
    const {content} = getAppFromName(name);

    // State variables for dragging and resizing the window.
    let xMouseDownStart, yMouseDownStart = 0;
    let parentBoundingBox, windowBoundingBox = {};

    // Resize window variables
    let xMaxGrowth, yMaxGrowth = 0;
    let startWidth, startHeight = 0;
    let constrainToHorizontal, constrainToVertical = false;

    // Drag window offset variables.
    let dragXOffset, dragYOffset = 0;

    // Used for animating appearing and disappearing
    const [firstTime, setFirstTime] = useState(true);
    const [closing, setIsClosing] = useState(false);

    const getBoundingNode = () => {
        return boundingNode.current || windowNodeRef.current.parentNode;
    }

    const persistWindowPositioning = (maximized, minimized) => {
        const style = windowNodeRef.current.style;
        persistNewAppConfig(name, timestamp, {
            top: parseInt(style.top),
            left: parseInt(style.left),
            width: parseInt(style.width),
            height: parseInt(style.height),
            maximized: maximized,
            minimized: minimized,
        });
    }

    const getEventCoordinates = (event) => {
        const result = {
            clientX: event.clientX,
            clientY: event.clientY
        }
        if (event.type.startsWith('touch')) {
            result.clientX = Math.round(event.touches[0].clientX);
            result.clientY = Math.round(event.touches[0].clientY);
        }
        return result;
    }

    const setupMouseInteraction = (event) => {
        windowBoundingBox = windowNodeRef.current.getBoundingClientRect();
        parentBoundingBox = getBoundingNode().getBoundingClientRect();
        const coordinates = getEventCoordinates(event);
        xMouseDownStart = coordinates.clientX;
        yMouseDownStart = coordinates.clientY;
    }

    const handleMouseDownResize = (event) => {
        setupMouseInteraction(event);

        xMaxGrowth = parentBoundingBox.right - windowBoundingBox.right;
        yMaxGrowth = parentBoundingBox.bottom - windowBoundingBox.bottom;

        const node = windowNodeRef.current;
        startWidth = node.clientWidth;
        startHeight = node.clientHeight;

        const constrain = event.target.getAttribute('constrain');
        if (constrain === 'horizontal') {
            constrainToHorizontal = true;
        }
        if (constrain === 'vertical') {
            constrainToVertical = true;
        }

        document.addEventListener('mousemove', handleMouseMoveResize);
        document.addEventListener('touchmove', handleMouseMoveResize);
        document.addEventListener('mouseup', handleMouseUpResize);
        document.addEventListener('touchend', handleMouseUpResize);

        setActiveApp(name, timestamp);
    }

    const handleMouseMoveResize = (event) => {
        const {clientX, clientY} = getEventCoordinates(event);
        const diffX = clientX - xMouseDownStart;
        const diffY = clientY - yMouseDownStart;

        if (!constrainToVertical) {
            windowNodeRef.current.style.width = startWidth + Math.min(diffX, xMaxGrowth) + 'px';
        }
        if (!constrainToHorizontal) {
            windowNodeRef.current.style.height = startHeight + Math.min(diffY, yMaxGrowth) + 'px';
        }
        windowNodeRef.current.classList.add('resizing');
    }

    const handleMouseUpResize = () => {
        document.removeEventListener('mousemove', handleMouseMoveResize);
        document.removeEventListener('touchmove', handleMouseMoveResize);
        document.removeEventListener('mouseup', handleMouseUpResize);
        document.removeEventListener('touchup', handleMouseUpResize);
        windowNodeRef.current.classList.remove('resizing');
        constrainToHorizontal = constrainToVertical = false;
        persistWindowPositioning();
    }

    const handleMouseDownDrag = (event) => {
        setupMouseInteraction(event);
        const coordinates = getEventCoordinates(event);
        setActiveApp(name, timestamp);
        if (maximized) {
            return
        }
        const node = event.currentTarget;
        if (event.target.attributes.drag) {
            document.addEventListener('mousemove', handleMouseMoveDrag);
            document.addEventListener('touchmove', handleMouseMoveDrag);
            document.addEventListener('mouseup', handleMouseUpDrag);
            document.addEventListener('touchend', handleMouseUpDrag);
            dragXOffset = node.offsetLeft - coordinates.clientX;
            dragYOffset = node.offsetTop - coordinates.clientY;
        }
    }

    const handleMouseMoveDrag = (e) => {
        const {clientX, clientY} = getEventCoordinates(e);
        const draggedNode = windowNodeRef.current;
        const draggedBoundingBox = draggedNode.getBoundingClientRect();
        const xMax = parentBoundingBox.width - draggedBoundingBox.width;
        const yMax = parentBoundingBox.height - draggedBoundingBox.height;

        const diffX = clientX - xMouseDownStart;
        const diffY = clientY - yMouseDownStart;

        // Keep the window in bounds of its containing element.
        const xLocation = Math.min(Math.max(xMouseDownStart + diffX + dragXOffset, 0), xMax);
        const yLocation = Math.min(Math.max(yMouseDownStart + diffY + dragYOffset, 0), yMax);

        draggedNode.style.left = `${xLocation}px`;
        draggedNode.style.top = `${yLocation}px`;
        draggedNode.classList.add('dragging');
    }

    const handleMouseUpDrag = () => {
        document.removeEventListener('mousemove', handleMouseMoveDrag);
        document.removeEventListener('touchmove', handleMouseMoveDrag);
        document.removeEventListener('mouseup', handleMouseUpDrag);
        document.removeEventListener('touchend', handleMouseUpDrag);
        windowNodeRef.current.classList.remove('dragging');
        persistWindowPositioning();
    }

    const handleCloseClick = () => {
        setIsClosing(true);
        // Remove the window after the animation
        setTimeout(() => {
            closeApp(name, timestamp)
        }, 200);
    }

    const handleMaximizeToggle = () => {
        persistWindowPositioning(!maximized, false);
    }

    const handleMinimizeToggle = () => {
        setActiveApp(null);
        persistWindowPositioning(false, !minimized);
    }

    // Allow fade in animation.
    useEffect(() => {
        if (firstTime) {
            setFirstTime(false);
        }
    }, [firstTime])

    const classes = classNames({
        'maximized': maximized,
        'minimized': minimized,
        'active': isActive,
        'Window': true
    });

    const style = {
        width: `${width}px`,
        height: `${height}px`,
        zIndex,
        top: top,
        left: left
    }

    // Wrap the component with props specifying the name and timestamp.  This allows the app to persist and load
    // persisted data.
    const wrappedContent = React.Children.map(content, child => React.cloneElement(child, {timestamp, name}));

    // Set default position to whatever the last save translate was.
    return (
        <CSSTransition in={!firstTime && !closing} classNames='visibility' timeout={200}>
            <div ref={windowNodeRef} className={classes} style={style} onMouseDown={handleMouseDownDrag}
                 onTouchStart={handleMouseDownDrag}>
                <img className="window-icon" alt="" src={icon} drag="true" draggable="false"/>
                <div className="header drag" drag="true">
                    <div className="tools" drag="true">
                        <span className="window-tools" onClick={handleCloseClick}><CloseIcon/></span>
                        <span className="window-tools" onClick={handleMaximizeToggle}><MaximizeIcon/></span>
                        <span className="window-tools" onClick={handleMinimizeToggle}><MinimizeIcon/></span>
                    </div>
                    <span className="window-title" drag="true">{name}</span>
                </div>
                <div className="body">
                    <div
                        onMouseDown={handleMouseDownResize} onTouchStart={handleMouseDownResize}
                        onMouseUp={handleMouseUpResize} onTouchEnd={handleMouseUpResize}>
                        <div constrain="horizontal" className="resize right"/>
                        <div className="resize bottom-right"/>
                        <div constrain="vertical" className="resize bottom"/>
                    </div>
                    {wrappedContent}
                </div>
            </div>
        </CSSTransition>
    )
}

export default Window;