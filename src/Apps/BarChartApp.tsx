import React, { useState } from 'react'
import './ChartApp.scss'
import { BarChart, ResponsiveContainer, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'

interface Props {
  name: string
  timestamp: Date
}

interface DataPoint {
  name: string
  series1: number
  series2: number
}

const BarChartApp: React.FunctionComponent<Props> = ({ name, timestamp }: Props) => {
  const APP_PERSIST_KEY: string = `${name}-${timestamp.toString()}`

  const generateData = (): DataPoint[] => {
    const dataBuffer: DataPoint[] = []
    for (let i = 0; i < 10; i++) {
      dataBuffer.push({
        name: `Day ${i + 1}`,
        series1: Math.round(Math.random() * 1000),
        series2: Math.round(Math.random() * 1000)
      })
    }
    localStorage.setItem(APP_PERSIST_KEY, JSON.stringify(dataBuffer))
    return dataBuffer
  }

  const persistedData = localStorage.getItem(APP_PERSIST_KEY)

  const deserializedState = (persistedData != null) ? JSON.parse(persistedData) : generateData()
  const [generatedData, setGeneratedDate] = useState(deserializedState)
  const formatLegend = (legendName: string): string => {
    return legendName === 'series1' ? 'Series 1' : 'Series 2'
  }

  const handleGenerateData = (): void => {
    setGeneratedDate(generateData())
  }

  return (
        <div className="ChartContainer">
            <div className="chartHolder">
                <ResponsiveContainer>
                    <BarChart data={generatedData}
                              margin={{ top: 30, right: 25, left: 5, bottom: 25 }}
                    >
                        <XAxis dataKey="name"/>
                        <YAxis/>
                        <Tooltip/>
                        <Legend formatter={formatLegend}/>
                        <Bar dataKey="series2" fill="lightgrey"/>
                        <Bar dataKey="series1" fill="lightblue"/>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="regenerate">
                <button onClick={handleGenerateData}>Regenerate Data</button>
            </div>
        </div>
  )
}

export default BarChartApp
