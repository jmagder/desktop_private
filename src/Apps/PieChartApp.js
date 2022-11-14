import React, {useState} from "react";
import './ChartApp.scss';
import {PieChart, ResponsiveContainer, Cell, Pie, Tooltip, Legend} from 'recharts';

const PieChartApp = ({name, timestamp}) => {
    const APP_PERSIST_KEY = `${name}-${timestamp}`;

    const sliceColors = ['#0077B6', '#0096C7', '#48CAE4', '#90e0ef', '#CAF0F8', '#D0E6EB']

    const generateData = () => {
        const dataBuffer = [];
        for (let i = 0; i < 6; i++) {
            dataBuffer.push({
                name: `Group ${i + 1}`,
                value: Math.round(Math.random() * 1000),
            })
        }
        localStorage.setItem(APP_PERSIST_KEY, JSON.stringify(dataBuffer));
        return dataBuffer;
    }

    let deserializedState = JSON.parse(localStorage.getItem(APP_PERSIST_KEY)) || generateData();
    const [generatedData, setGeneratedDate] = useState(deserializedState);

    const handleGenerateData = () => {
        setGeneratedDate(generateData());
    }

    return (
        <div className="ChartContainer">
            <div className="chartHolder">
                <ResponsiveContainer>
                    <PieChart>
                        <Pie data={generatedData}
                             innerRadius={'30%'}
                             margin={{bottom: 25}}
                             animationBegin={0} animationDuration={450} dataKey="value">
                            {generatedData.map((entry, index) => <Cell fill={sliceColors[index]}/>)}
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
    );
}

export default PieChartApp;