import React, {useContext, useState} from "react";

// JEFF: TODO find out type for importing svg
// @ts-ignore
import Notes from "../icons/note.svg";
// @ts-ignore
import BarChartIcon from "../icons/bar-chart.svg"
// @ts-ignore
import PieChartIcon from "../icons/pie-chart.svg"
import BarChartApp from "../Apps/BarChartApp";
import PieChartApp from "../Apps/PieChartApp";
import NotesApp from "../Apps/NotesApp";

// Represents an application definition
export interface AppEntry {
    icon: any,
    name: string,
    description: string,
    content: React.ReactNode
}

// Window dimensions, zIndex, location, etc
export interface WindowsConfiguration {
    width?: number,
    height?: number,
    top?: number,
    left?: number,
    maximized?: boolean,
    minimized?: boolean,
    zIndex?: number,
}

// A realized instance of an AppEntry.
export interface AppInstance extends AppEntry {
    // timestamp is in ms.
    timestamp: number,
    lastActive: number,
    windowConfiguration: WindowsConfiguration,
    isActive: boolean,
}

interface AppContext {
    openAppList: AppInstance[]
}

interface AppState {
    openAppList: AppInstance[],
}

const AppListContext = React.createContext<AppContext>({openAppList: []});

const applications : AppEntry[] = [
    {
        icon: Notes,
        name: "Notes",
        description: "Take some notes",
        content: <NotesApp name="" timestamp={new Date()}/>
    },
    {
        icon: BarChartIcon,
        name: "Bar Graphs",
        description: "Randomized bar graphs",
        content: <BarChartApp name="" timestamp={new Date()}/>
    },
    {
        icon: PieChartIcon,
        name: "Pie Chart",
        description: "Randomized pie graphs",
        content: <PieChartApp name="" timestamp={new Date()}/>
    }
];

const OPEN_APP_PERSISTENCE_KEY = 'openAppList';

const AppListProvider = (props: any) => {
    const storedState = localStorage.getItem(OPEN_APP_PERSISTENCE_KEY);
    const [state, setState] = useState({
        openAppList: (storedState && JSON.parse(storedState)) || []
    });

    return <AppListContext.Provider value={[state, setState]} {...props} />
}

let numWindows = 0;

export interface AppListHook {
    openAppList: AppInstance[],
    availableAppList: AppEntry[],
    getAppFromName: (name: string) => AppEntry | undefined,
    openApp: (name: string) => void,
    closeApp: (appName: string, timestamp: number) => void,
    persistNewAppConfig: (name: string, timestamp: number, windowConfiguration: WindowsConfiguration) => void,
    setActiveApp: (name?: string, timestamp?: number, toggle?: boolean) => void,
}

const useAppList = (): AppListHook => {
    // @ts-ignore
    const [state, setState] = useContext(AppListContext);

    const saveAppListState = () => {
        localStorage.setItem('openAppList', JSON.stringify(state.openAppList));
    }

    const setActiveApp = (name?: string, timestamp?: number, toggle?: boolean) => {
        const newState: AppState = {...state};

        const clickedAppConfig = newState.openAppList
            .find(item => item.name === name && item.timestamp === timestamp);

        if (clickedAppConfig) {
            Object.assign(clickedAppConfig, {
                lastActive: new Date().getTime(),
                isActive: !(toggle && clickedAppConfig.isActive)
            });

            clickedAppConfig.windowConfiguration.minimized = toggle && !clickedAppConfig.isActive;
        }

        newState.openAppList
            .sort((item1: AppInstance, item2: AppInstance) => {
                return item1.lastActive - item2.lastActive
            })
            .forEach((item, index: number) => {
                item.windowConfiguration.zIndex = index;
                if (item.name !== name || item.timestamp !== timestamp) {
                    item.isActive = false;
                }
            });
        newState.openAppList.sort((item1, item2) => {
            return item1.timestamp - item2.timestamp
        });
        setState(newState);
        saveAppListState();
    }

    const getAppFromName = (appName: string) => applications.find((currentConfig => currentConfig.name === appName));

    const closeApp = (appName: string, timestamp: number) => {
        const index = (state as AppState).openAppList.findIndex(app => app.name === appName && timestamp === app.timestamp);
        state.openAppList.splice(index, 1);
        saveAppListState();
        setState({...state});
    }

    const openApp = (appName: string) => {
        const timestamp = (new Date()).getTime()
        state.openAppList.push({
            ...getAppFromName(appName),
            timestamp,
            windowConfiguration: {
                width: 400,
                height: 400,
                top: `${numWindows * 34 % 500}px`,
                left: `${numWindows * 34 % 500}px`,
                maximized: false
            }
        });
        numWindows++;
        setActiveApp(appName, timestamp, false);
        saveAppListState();
    }

    const getOpenConfigFromName = (name: string, timestamp: number): AppInstance => {
        return (state as AppState).openAppList.find(windowConfig =>
            windowConfig.name === name && windowConfig.timestamp === timestamp)!;
    }

    const persistNewAppConfig = (name: string, timestamp: number, windowConfiguration: WindowsConfiguration) => {
        const appConfig = getOpenConfigFromName(name, timestamp);
        appConfig.windowConfiguration = {...appConfig.windowConfiguration, ...windowConfiguration};
        saveAppListState();
        setState({...state})
    }

    return {
        openAppList: state.openAppList,
        availableAppList: applications,
        getAppFromName,
        openApp,
        closeApp,
        persistNewAppConfig,
        setActiveApp,
    }
}

export {AppListProvider, useAppList}
