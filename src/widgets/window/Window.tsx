import React, { useEffect, useState } from 'react'
import { useAppList, WindowsConfiguration } from '../../Contexts/AppListContext'
import './Window.scss'

import { IoIosCloseCircleOutline as CloseIcon } from 'react-icons/io'
import { VscChromeMinimize as MinimizeIcon } from 'react-icons/vsc'
import { AiOutlineExpandAlt as MaximizeIcon } from 'react-icons/ai'
import { CSSTransition } from 'react-transition-group'
import classNames from 'classnames'

interface Props {
  name: string
  timestamp: number
  icon: string
  windowConfiguration: WindowsConfiguration
  boundingNode: React.MutableRefObject<HTMLElement | null>
  isActive: boolean
}

const Window: React.FunctionComponent<Props> = ({ name, timestamp, icon, windowConfiguration = {}, boundingNode, isActive }: Props) => {
  const { width, height, zIndex, top, left, minimized, maximized } = windowConfiguration
  const windowNodeRef = React.useRef<HTMLDivElement>(null)
  const { setActiveApp, persistNewAppConfig, closeApp, getAppFromName } = useAppList()
  const { content } = getAppFromName(name) ?? {}

  // State variables for dragging and resizing the window.
  let xMouseDownStart: number; let yMouseDownStart = 0
  let parentBoundingBox: DOMRect, windowBoundingBox: DOMRect

  // Resize window variables
  let xMaxGrowth: number; let yMaxGrowth = 0
  let startWidth: number; let startHeight = 0
  let constrainToHorizontal: boolean; let constrainToVertical = false

  // Drag window offset variables.
  let dragXOffset: number; let dragYOffset = 0

  // Used for animating appearing and disappearing
  const [firstTime, setFirstTime] = useState(true)
  const [closing, setIsClosing] = useState(false)

  const getBoundingNode = () => {
    if (boundingNode.current != null) {
      return boundingNode.current
    }
    if (windowNodeRef.current != null) {
      return windowNodeRef.current.parentNode
    }
    return null
  }

  const persistWindowPositioning = (maximized?: boolean, minimized?: boolean) => {
    const style = (windowNodeRef.current != null) ? windowNodeRef.current.style : { top: '0', left: '0', width: '0', height: '0' }
    persistNewAppConfig(name, timestamp, {
      top: parseInt(style.top),
      left: parseInt(style.left),
      width: parseInt(style.width),
      height: parseInt(style.height),
      maximized,
      minimized
    })
  }

  const getEventCoordinates = (event: React.MouseEvent) => {
    const result = {
      clientX: event.clientX,
      clientY: event.clientY
    }
    if (event.type.startsWith('touch')) {
      const touchEvent = event as unknown as TouchEvent
      result.clientX = Math.round(touchEvent.touches[0].clientX)
      result.clientY = Math.round(touchEvent.touches[0].clientY)
    }
    return result
  }

  const setupMouseInteraction = (event: React.MouseEvent | React.TouchEvent) => {
    // @ts-expect-error
    windowBoundingBox = (windowNodeRef.current != null) && windowNodeRef.current.getBoundingClientRect()
    // @ts-expect-error
    parentBoundingBox = getBoundingNode().getBoundingClientRect()
    const coordinates = getEventCoordinates(event as React.MouseEvent)
    xMouseDownStart = coordinates.clientX
    yMouseDownStart = coordinates.clientY
  }

  const handleMouseDownResize = (event: React.MouseEvent | React.TouchEvent) => {
    setupMouseInteraction(event)

    xMaxGrowth = parentBoundingBox.right - windowBoundingBox.right
    yMaxGrowth = parentBoundingBox.bottom - windowBoundingBox.bottom

    const node = windowNodeRef.current
    if (node != null) {
      startWidth = node.clientWidth
      startHeight = node.clientHeight
    }

    const constrain = (event.target as HTMLElement).getAttribute('data-constrain')
    if (constrain === 'horizontal') {
      constrainToHorizontal = true
    }
    if (constrain === 'vertical') {
      constrainToVertical = true
    }

    // @ts-expect-error
    document.addEventListener('mousemove', handleMouseMoveResize)
    // @ts-expect-error
    document.addEventListener('touchmove', handleMouseMoveResize)
    document.addEventListener('mouseup', handleMouseUpResize)
    document.addEventListener('touchend', handleMouseUpResize)

    setActiveApp(name, timestamp, false)
  }

  const handleMouseMoveResize = (event: React.MouseEvent) => {
    const { clientX, clientY } = getEventCoordinates(event)
    const diffX = clientX - xMouseDownStart
    const diffY = clientY - yMouseDownStart

    if (!constrainToVertical) {
      windowNodeRef.current!.style.width = startWidth + Math.min(diffX, xMaxGrowth) + 'px'
    }
    if (!constrainToHorizontal) {
      windowNodeRef.current!.style.height = startHeight + Math.min(diffY, yMaxGrowth) + 'px'
    }
    windowNodeRef.current!.classList.add('resizing')
  }

  const handleMouseUpResize = () => {
    // @ts-expect-error
    document.removeEventListener('mousemove', handleMouseMoveResize)
    // @ts-expect-error
    document.removeEventListener('touchmove', handleMouseMoveResize)
    document.removeEventListener('mouseup', handleMouseUpResize)
    document.removeEventListener('touchup', handleMouseUpResize)
    windowNodeRef.current!.classList.remove('resizing')
    constrainToHorizontal = constrainToVertical = false
    persistWindowPositioning()
  }

  const handleMouseDownDrag = (event: React.MouseEvent | React.TouchEvent) => {
    setupMouseInteraction(event)
    const coordinates = getEventCoordinates(event as React.MouseEvent)
    setActiveApp(name, timestamp, false)
    if (maximized) {
      return
    }
    const node = event.currentTarget as HTMLElement
    if (!node) {
      return
    }
    // @ts-expect-error
    if (event.target.attributes['data-drag']) {
      // @ts-expect-error
      document.addEventListener('mousemove', handleMouseMoveDrag)
      // @ts-expect-error
      document.addEventListener('touchmove', handleMouseMoveDrag)
      document.addEventListener('mouseup', handleMouseUpDrag)
      document.addEventListener('touchend', handleMouseUpDrag)
      dragXOffset = node.offsetLeft - coordinates.clientX
      dragYOffset = node.offsetTop - coordinates.clientY
    }
  }

  const handleMouseMoveDrag = (e: React.MouseEvent) => {
    const { clientX, clientY } = getEventCoordinates(e)
    const draggedNode = windowNodeRef.current
    if (draggedNode == null) {
      return
    }
    const draggedBoundingBox = draggedNode.getBoundingClientRect()
    const xMax = parentBoundingBox.width - draggedBoundingBox.width
    const yMax = parentBoundingBox.height - draggedBoundingBox.height

    const diffX = clientX - xMouseDownStart
    const diffY = clientY - yMouseDownStart

    // Keep the window in bounds of its containing element.
    const xLocation = Math.min(Math.max(xMouseDownStart + diffX + dragXOffset, 0), xMax)
    const yLocation = Math.min(Math.max(yMouseDownStart + diffY + dragYOffset, 0), yMax)

    draggedNode.style.left = `${xLocation}px`
    draggedNode.style.top = `${yLocation}px`
    draggedNode.classList.add('dragging')
  }

  const handleMouseUpDrag = () => {
    // @ts-expect-error
    document.removeEventListener('mousemove', handleMouseMoveDrag)
    // @ts-expect-error
    document.removeEventListener('touchmove', handleMouseMoveDrag)
    document.removeEventListener('mouseup', handleMouseUpDrag)
    document.removeEventListener('touchend', handleMouseUpDrag)
    windowNodeRef.current!.classList.remove('dragging')
    persistWindowPositioning()
  }

  const handleCloseClick = () => {
    setIsClosing(true)
    // Remove the window after the animation
    setTimeout(() => {
      closeApp(name, timestamp)
    }, 200)
  }

  const handleMaximizeToggle = () => {
    persistWindowPositioning(!maximized, false)
  }

  const handleMinimizeToggle = () => {
    setActiveApp()
    persistWindowPositioning(false, !minimized)
  }

  // Allow fade in animation.
  useEffect(() => {
    if (firstTime) {
      setFirstTime(false)
    }
  }, [firstTime])

  const classes = classNames({
    maximized,
    minimized,
    active: isActive,
    Window: true
  })

  const style = {
    width: `${width}px`,
    height: `${height}px`,
    zIndex,
    top,
    left
  }

  // Wrap the component with props specifying the name and timestamp.  This allows the app to persist and load
  // persisted data.
  // @ts-expect-error
  const wrappedContent = React.Children.map(content, child => React.cloneElement(child, { timestamp, name }))

  if (!windowNodeRef) {
    return <></>
  }
  // Set default position to whatever the last save translate was.
  return (
        <CSSTransition in={!firstTime && !closing} classNames='visibility' timeout={200}>
            <div ref={windowNodeRef} className={classes} style={style} onMouseDown={handleMouseDownDrag}
                 onTouchStart={handleMouseDownDrag}>
                <img className="window-icon" alt="" src={icon} data-drag="true" draggable="false"/>
                <div className="header drag" data-drag="true">
                    <div className="tools" data-drag="true">
                        <span className="window-tools" onClick={handleCloseClick}><CloseIcon/></span>
                        <span className="window-tools" onClick={handleMaximizeToggle}><MaximizeIcon/></span>
                        <span className="window-tools" onClick={handleMinimizeToggle}><MinimizeIcon/></span>
                    </div>
                    <span className="window-title" data-drag="true">{name}</span>
                </div>
                <div className="body">
                    <div
                        onMouseDown={handleMouseDownResize} onTouchStart={handleMouseDownResize}
                        onMouseUp={handleMouseUpResize} onTouchEnd={handleMouseUpResize}>
                        <div data-constrain="horizontal" className="resize right"/>
                        <div className="resize bottom-right"/>
                        <div data-constrain="vertical" className="resize bottom"/>
                    </div>
                    {wrappedContent}
                </div>
            </div>
        </CSSTransition>
  )
}

export default Window
