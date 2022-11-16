import React, {useContext, useState} from "react";

const DesktopConfigContext = React.createContext<AppState>({ centered: false, taskbarLocation: "bottom"});

// const AppListContext = React.createContext<AppContext>({openAppList: []});
interface AppState {
    centered: boolean,
    taskbarLocation: "bottom" | "top" | "left" | "right",
}

const DESKTOP_CONFIG_PERSISTENCE_KEY = 'desktopConfig';
type Props = {
    children: React.ReactElement
};
const DesktopConfigProvider = (props: Props) => {
    let storedState = {
        centered: false,
        taskbarLocation: "bottom"
    };

    try {
        const persistedState = localStorage.getItem(DESKTOP_CONFIG_PERSISTENCE_KEY)
        if (persistedState) {
            storedState = JSON.parse(persistedState);
        }
    } catch {
        console.log("Error restoring desktop config, restoring to default");
    }

    const [state, setState] = useState(storedState);
    // @ts-ignore
    return <DesktopConfigContext.Provider value={[state, setState]} {...props} />
}

const useDesktopConfig = () => {
    // @ts-ignore
    const [state, setState] = useContext(DesktopConfigContext);

    const saveDesktopConfigState = (newState: AppState) => {
        localStorage.setItem('desktopConfig', JSON.stringify(newState))
    }

    const setCentered = (isCentered: boolean) => {
        const newState = {...state, centered: isCentered};
        setState(newState);
        saveDesktopConfigState(newState);
    }

    const setTaskbarLocation = (taskbarLocation: string) => {
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