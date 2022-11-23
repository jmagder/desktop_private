import React, {FunctionComponent, useContext, useState} from 'react'

const DesktopConfigContext = React.createContext<AppState>({ centered: false, taskbarLocation: 'bottom' })

interface AppState {
  centered: boolean
  taskbarLocation: 'bottom' | 'top' | 'left' | 'right'
}

const DESKTOP_CONFIG_PERSISTENCE_KEY = 'desktopConfig'
interface Props {
  children: React.ReactElement
}
const DesktopConfigProvider: React.FunctionComponent<Props> = (props: Props) => {
  let storedState = {
    centered: false,
    taskbarLocation: 'bottom'
  }

  try {
    const persistedState = localStorage.getItem(DESKTOP_CONFIG_PERSISTENCE_KEY)
    if (persistedState != null) {
      storedState = JSON.parse(persistedState)
    }
  } catch {
    console.log('Error restoring desktop config, restoring to default')
  }

  const [state, setState] = useState(storedState)
  // @ts-expect-error
  return <DesktopConfigContext.Provider value={[state, setState]} {...props} />
}

export interface DesktopConfig {
  centered: boolean
  taskbarLocation: string
  setCentered: Function
  setTaskbarLocation: Function
}

const useDesktopConfig = (): DesktopConfig => {
  // @ts-expect-error
  const [state, setState] = useContext(DesktopConfigContext)

  const saveDesktopConfigState = (newState: AppState): void => {
    localStorage.setItem('desktopConfig', JSON.stringify(newState))
  }

  const setCentered = (isCentered: boolean): void => {
    const newState = { ...state, centered: isCentered }
    setState(newState)
    saveDesktopConfigState(newState)
  }

  const setTaskbarLocation = (taskbarLocation: string): void => {
    const newState = { ...state, taskbarLocation }
    setState(newState)
    saveDesktopConfigState(newState)
  }

  return {
    centered: state.centered,
    taskbarLocation: state.taskbarLocation,
    setCentered,
    setTaskbarLocation
  }
}

export { DesktopConfigProvider, useDesktopConfig }
