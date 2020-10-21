import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import {DesktopConfigProvider} from "./Contexts/DesktopConfigContext";
import {AppListProvider} from "./Contexts/AppListContext";

ReactDOM.render(
    <React.StrictMode>
        <AppListProvider>
            <DesktopConfigProvider>
                <App/>
            </DesktopConfigProvider>
        </AppListProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
