 import React, {useEffect, useRef, useState} from "react";
import './Popover.scss';
import CSS from 'csstype';
import {CSSTransition} from "react-transition-group";


// JEFF: Todo find type of anchornode
const calculateStyle = (displayBeside: boolean, anchorNode: any, hiddenContentNode:  any, padding = 0) => {
    const style: CSS.Properties = {};
    const xCenter = document.body.offsetWidth / 2;
    const yCenter = document.body.offsetHeight / 2;
    const boundingRect = anchorNode.getClientRects()[0];

    const onBottomHalf = boundingRect.y > yCenter;
    const onLeftHalf = boundingRect.x < xCenter;

    let xOffset = (anchorNode.offsetWidth + padding);
    let yOffset = (anchorNode.offsetHeight + padding);

    if (onBottomHalf) {
        style.bottom = '0';
        yOffset *= -1;
    } else {
        style.top = '0';
    }

    if (onLeftHalf) {
        style.left = '0';
    } else {
        if (displayBeside) {
            xOffset = hiddenContentNode.offsetWidth + padding;
        } else {
            style.right = '0';
        }
        xOffset *= -1;
    }

    if (!displayBeside) {
        style.transform = `translateY(${yOffset}px)`;
    } else {
        style.transform = `translateX(${xOffset}px)`;
    }

    return style;
}

type Props = {
    anchor?: React.ReactNode,
    content: React.ReactNode,
    children: React.ReactNode,
    displayBeside: boolean,
    redrawOnChange: boolean,
    closeOnClick?: boolean
    className?: string,
}

const Popover: React.FC<Props> = ({anchor, content, children, displayBeside, redrawOnChange, closeOnClick}: Props) => {
    const popoverAnchor = anchor || children;

    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [popoverStyle, setPopOverStyle] = useState({});

    const anchorEl = useRef<HTMLDivElement>(null);
    const hiddenContentEl = useRef<HTMLDivElement>(null);

    // Calculate position after anchored component is rendered.
    useEffect(() => {
        setPopOverStyle(calculateStyle(displayBeside, anchorEl.current, hiddenContentEl.current, 2))
    }, [displayBeside, redrawOnChange]);

    // Allow closing by clicking outside of the popover
    const addOutsideListeners = () => {
        document.addEventListener('click', handleOutsideClick)
        document.addEventListener('touchstart', handleOutsideClick);
    }

    const removeOutsideListeners = () => {
        document.removeEventListener('click', handleOutsideClick);
        document.removeEventListener('touchend', handleOutsideClick);
    }
    const handleOutsideClick = () => {
        setMenuIsOpen(false);
        removeOutsideListeners();
    }

    const changeOpenState = (setOpen: boolean) => {
        if (setOpen && !menuIsOpen) {
            addOutsideListeners();
        } else if (!setOpen) {
            removeOutsideListeners();
        }
        setMenuIsOpen(setOpen);
    }
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        changeOpenState(!menuIsOpen);
        event.nativeEvent.stopImmediatePropagation()
    };

    const handleClickPopover = (event: React.MouseEvent<HTMLElement>) => {
        if (closeOnClick) {
            changeOpenState(false);
        }
        event.nativeEvent.stopImmediatePropagation()
    }

    return (
        <div className="Popover">
            <CSSTransition in={menuIsOpen} classNames='visibility' timeout={200}>
                <div ref={hiddenContentEl} className="hidden-content" style={popoverStyle}
                     onClick={handleClickPopover}>
                    {content}
                </div>
            </CSSTransition>
            <div className="anchor" ref={anchorEl} onClick={handleClick}>
                {popoverAnchor}
            </div>

        </div>
    )
}

export default Popover;