import React, { MouseEventHandler } from 'react'
import './TaskbarButton.scss'

interface Props {
  name?: string
  icon?: string
  isActive?: boolean
  handleClick?: MouseEventHandler
  children?: React.ReactNode
  hideLabel?: boolean
}
const TaskbarButton: React.FunctionComponent<Props> = ({ name, icon, isActive, handleClick, children, hideLabel }: Props) => {
  return (
        <div
            className={`TaskbarButton  ${(isActive === true) ? 'isActive' : ''}`}
            onClick={handleClick}
        >
            {children ?? <React.Fragment>
                    <img src={icon} className="small-icon" alt=""/>
                    <span className={`app-name ${(hideLabel === true) ? 'hide-label' : ''}`}>{name}</span>
                </React.Fragment>
            }
        </div>
  )
}

export default TaskbarButton
