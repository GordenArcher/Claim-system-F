import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import Get_processingData from '../../api/Get_processingData';
import { useEffect } from 'react';

const ProcessingTime = () => {

    const { processingTimeData, getProcessingTimeData } = Get_processingData()

    useEffect(() => {
        getProcessingTimeData()
    }, [getProcessingTimeData])

    
  return (
    (processingTimeData.length > 0 ? (
        <div className="p-4 w-full bg-gray-50 h-[400px] rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Average Processing Time (Days)</h3>
            <ResponsiveContainer width={'100%'}>
                <LineChart data={processingTimeData ? processingTimeData : null} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} days`, 'Processing Time']} />
                    <Legend />
                    <Line type="monotone" dataKey="time" name="Average Processing Time" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>

                
                <div className="mt-4 text-sm text-gray-600">
                    {processingTimeData.length > 0 ? (
                        <>
                        <p className="font-medium">Summary:</p>
                        <p>Average Processing Time: {(processingTimeData.reduce((sum, item) => sum + item.time, 0) / processingTimeData.length).toFixed(1)} days</p>
                        <p>Fastest Day: {processingTimeData.reduce((min, item) => item.time < min.time ? item : min, processingTimeData[0]).day} ({processingTimeData.reduce((min, item) => item.time < min.time ? item : min, processingTimeData[0]).time} days)</p>
                        <p>Slowest Day: {processingTimeData.reduce((max, item) => item.time > max.time ? item : max, processingTimeData[0]).day} ({processingTimeData.reduce((max, item) => item.time > max.time ? item : max, processingTimeData[0]).time} days)</p>
                            </>
                    ) : (
                        <p>No data</p>
                    )}
                    
                </div>
            </ResponsiveContainer>
        </div>
    ) 
        :
        (
            <div>No data</div>
        )
    )
    
  )
}

export default ProcessingTime