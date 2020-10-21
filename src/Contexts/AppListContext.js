import React, {useContext, useState} from "react";
import Notes from "../icons/note.svg";
import BarChartIcon from "../icons/bar-chart.svg"
import PieChartIcon from "../icons/pie-chart.svg"
import BarChartApp from "../Apps/BarChartApp";
import PieChartApp from "../Apps/PieChartApp";
import NotesApp from "../Apps/NotesApp";

const AppListContext = React.createContext([{}, newState => {
}]);

const applications = [
    {
        icon: Notes,
        name: "Notes",
        description: "Take some notes",
        content: <NotesApp/>
    },
    {
        icon: BarChartIcon,
        name: "Bar Graphs",
        description: "Randomized bar graphs",
        content: <BarChartApp/>
    },
    {
        icon: PieChartIcon,
        name: "Pie Chart",
        description: "Randomized pie graphs",
        content: <PieChartApp/>
    }
];

const OPEN_APP_PERSISTENCE_KEY = 'openAppList';

const AppListProvider = (props) => {
    const storedState = localStorage.getItem(OPEN_APP_PERSISTENCE_KEY);
    const [state, setState] = useState({
        openAppList: (storedState && JSON.parse(storedState)) || []
    });

    return <AppListContext.Provider value={[state, setState]} {...props} />
}

let numWindows = 0;

const useAppList = () => {
    const [state, setState] = useContext(AppListContext);

    const saveAppListState = () => {
        localStorage.setItem('openAppList', JSON.stringify(state.openAppList));
    }

    const setActiveApp = (name, timestamp, toggle) => {
        const newState = {...state};

        const clickedAppConfig = newState.openAppList
            .find(item => item.name === name && item.timestamp === timestamp);

        if (clickedAppConfig) {
            Object.assign(clickedAppConfig, {
                lastActive: new Date().getTime(),
                isActive: toggle && clickedAppConfig.isActive === true ? false : true
            });

            clickedAppConfig.windowConfiguration.minimized = toggle && !clickedAppConfig.isActive ? true : false;
        }

        newState.openAppList
            .sort((item1, item2) => {
                return item1.lastActive - item2.lastActive
            })
            .forEach((item, index) => {
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

    const getAppFromName = appName => applications.find((currentConfig => currentConfig.name === appName));

    const closeApp = (appName, timestamp) => {
        const index = state.openAppList.findIndex(app => app.name === appName && timestamp === app.timestamp);
        state.openAppList.splice(index, 1);
        saveAppListState();
        setState({...state});
    }

    const openApp = (appName) => {
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
        setActiveApp(appName, timestamp);
        saveAppListState();
    }

    const getOpenConfigFromName = (name, timestamp) => {
        return state.openAppList.find(windowConfig =>
            windowConfig.name === name && windowConfig.timestamp === timestamp);
    }

    const persistNewAppConfig = (name, timestamp, windowConfiguration) => {
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
