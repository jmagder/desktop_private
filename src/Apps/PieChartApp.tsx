import React, { useState } from 'react'
import './ChartApp.scss'
import { PieChart, ResponsiveContainer, Cell, Pie, Tooltip, Legend } from 'recharts'

interface Props {
  name: string
  timestamp: Date
}

interface DataPoint {
  name: string
  value: number
}

const PieChartApp: React.FunctionComponent<Props> = ({ name, timestamp }: Props) => {
  const APP_PERSIST_KEY = `${name}-${timestamp.toString()}`

  const sliceColors = ['#0077B6', '#0096C7', '#48CAE4', '#90e0ef', '#CAF0F8', '#D0E6EB']

  const generateData = (): DataPoint[] => {
    const dataBuffer: DataPoint[] = []
    for (let i = 0; i < 6; i++) {
      dataBuffer.push({
        name: `Group ${i + 1}`,
        value: Math.round(Math.random() * 1000)
      })
    }
    localStorage.setItem(APP_PERSIST_KEY, JSON.stringify(dataBuffer))
    return dataBuffer
  }
  const storedAppState = localStorage.getItem(APP_PERSIST_KEY)
  const deserializedState = (storedAppState != null) ? JSON.parse(storedAppState) as DataPoint[] : generateData()
  const [generatedData, setGeneratedDate] = useState(deserializedState)

  const handleGenerateData = (): void => {
    setGeneratedDate(generateData())
  }

  return (
        <div className="ChartContainer">
            <div className="chartHolder">
                <ResponsiveContainer>
                    <PieChart>
                        <Pie data={generatedData}
                             innerRadius={'30%'}
                             animationBegin={0} animationDuration={450} dataKey="value">
                            {generatedData.map((entry, index) => <Cell fill={sliceColors[index]} key={index}/>)}
                        </Pie>
                        <Tooltip/>
                        <Legend/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="regenerate">
                <button onClick={handleGenerateData}>Regenerate Data</button>
            </div>
        </div>
  )
}

export default PieChartApp
