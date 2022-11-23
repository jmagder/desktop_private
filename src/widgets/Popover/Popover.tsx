import React, { useEffect, useRef, useState } from 'react'
import './Popover.scss'
import CSS from 'csstype'
import { CSSTransition } from 'react-transition-group'

const calculateStyle = (displayBeside: boolean, anchorNode: HTMLDivElement | null, hiddenContentNode: HTMLDivElement | null, padding = 0): object => {
  const style: CSS.Properties = {}
  const xCenter = document.body.offsetWidth / 2
  const yCenter = document.body.offsetHeight / 2
  if (anchorNode === null) {
    return {}
  }
  const boundingRect = anchorNode.getClientRects()[0]

  const onBottomHalf = boundingRect.y > yCenter
  const onLeftHalf = boundingRect.x < xCenter

  let xOffset = (anchorNode.offsetWidth + padding)
  let yOffset = (anchorNode.offsetHeight + padding)

  if (onBottomHalf) {
    style.bottom = '0'
    yOffset *= -1
  } else {
    style.top = '0'
  }

  if (onLeftHalf) {
    style.left = '0'
  } else {
    if (displayBeside && hiddenContentNode != null) {
      xOffset = hiddenContentNode.offsetWidth + padding
    } else {
      style.right = '0'
    }
    xOffset *= -1
  }

  if (!displayBeside) {
    style.transform = `translateY(${yOffset}px)`
  } else {
    style.transform = `translateX(${xOffset}px)`
  }

  return style
}

interface Props {
  anchor?: React.ReactNode
  content: React.ReactNode
  children: React.ReactNode
  displayBeside: boolean
  redrawOnChange: string
  closeOnClick?: boolean
  className?: string
}

const Popover: React.FC<Props> = ({ anchor, content, children, displayBeside, redrawOnChange, closeOnClick }: Props) => {
  const popoverAnchor = anchor ?? children

  const [menuIsOpen, setMenuIsOpen] = useState(false)
  const [popoverStyle, setPopOverStyle] = useState({})

  const anchorEl = useRef<HTMLDivElement>(null)
  const hiddenContentEl = useRef<HTMLDivElement>(null)

  // Calculate position after anchored component is rendered.
  useEffect(() => {
    setPopOverStyle(calculateStyle(displayBeside, anchorEl.current, hiddenContentEl.current, 2))
  }, [displayBeside, redrawOnChange])

  // Allow closing by clicking outside the popover
  const addOutsideListeners = (): void => {
    document.addEventListener('click', handleOutsideClick)
    document.addEventListener('touchstart', handleOutsideClick)
  }

  const removeOutsideListeners = (): void => {
    document.removeEventListener('click', handleOutsideClick)
    document.removeEventListener('touchend', handleOutsideClick)
  }
  const handleOutsideClick = (): void => {
    setMenuIsOpen(false)
    removeOutsideListeners()
  }

  const changeOpenState = (setOpen: boolean): void => {
    if (setOpen && !menuIsOpen) {
      addOutsideListeners()
    } else if (!setOpen) {
      removeOutsideListeners()
    }
    setMenuIsOpen(setOpen)
  }
  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    changeOpenState(!menuIsOpen)
    event.nativeEvent.stopImmediatePropagation()
  }

  const handleClickPopover = (event: React.MouseEvent<HTMLElement>): void => {
    if (closeOnClick === true) {
      changeOpenState(false)
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

export default Popover
