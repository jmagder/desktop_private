import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import {DesktopConfigProvider} from "./Contexts/DesktopConfigContext";
import {AppListProvider} from "./Contexts/AppListContext";
const root = createRoot(document.getElementById('root'));

root.render(
  <AppListProvider>
      <DesktopConfigProvider>
          <App/>
      </DesktopConfigProvider>
  </AppListProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
