import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

import { DesktopConfigProvider } from './Contexts/DesktopConfigContext'
import { AppListProvider } from './Contexts/AppListContext'
const root = createRoot(document.getElementById('root')!)

root.render(
  <AppListProvider>
      <DesktopConfigProvider>
          <App/>
      </DesktopConfigProvider>
  </AppListProvider>
)
