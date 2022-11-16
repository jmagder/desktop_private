import React, {MouseEventHandler} from "react";
import "./Menu.scss"

import {useAppList} from "../../Contexts/AppListContext";

type Props = {
  icon: string,
  name: string,
  description: string,
  clickHandler: (name: string) => void,
}

const MenuEntry = ({icon, name, description, clickHandler}: Props) => {
    return (
        <div className='MenuEntry' onClick={() => clickHandler(name)}>
            <img src={icon} className="icon-holder" alt=""/>
            <div className="title">{name}</div>
            <div className="description">{description}</div>
        </div>
    )
};

const Menu = () => {
    const {openApp, availableAppList} = useAppList();
    return (
        <div className="Menu">
            {availableAppList.map(menuEntry => (
                <MenuEntry {...menuEntry} key={menuEntry.name} clickHandler={openApp}/>)
            )}
        </div>
    )
}

export default Menu;