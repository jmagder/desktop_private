import React, {useContext, useState} from "react";

const DesktopConfigContext = React.createContext([{}, newState => {
}]);

const DESKTOP_CONFIG_PERSISTENCE_KEY = 'desktopConfig';

const DesktopConfigProvider = (props) => {
    let storedState = {
        centered: false,
        taskbarLocation: "bottom"
    };

    try {
        const deserializedState = JSON.parse(localStorage.getItem(DESKTOP_CONFIG_PERSISTENCE_KEY));
        if (deserializedState) {
            storedState = deserializedState
        }
    } catch {
        console.log("Error restoring desktop config, restoring to default");
    }

    const [state, setState] = useState(storedState);
    return <DesktopConfigContext.Provider value={[state, setState]} {...props} />
}

const useDesktopConfig = () => {
    const [state, setState] = useContext(DesktopConfigContext);

    const saveDesktopConfigState = (newState) => {
        localStorage.setItem('desktopConfig', JSON.stringify(newState))
    }

    const setCentered = (isCentered) => {
        const newState = {...state, centered: isCentered};
        setState(newState);
        saveDesktopConfigState(newState);
    }

    const setTaskbarLocation = (taskbarLocation) => {
        const newState = {...state, taskbarLocation: taskbarLocation};
        setState(newState);
        saveDesktopConfigState(newState);
    }

    return {
        centered: state.centered,
        taskbarLocation: state.taskbarLocation,
        setCentered,
        setTaskbarLocation,
    }
}

export {DesktopConfigProvider, useDesktopConfig};