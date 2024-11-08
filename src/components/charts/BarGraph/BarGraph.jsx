// BarChartComponent.js
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import './BarGraph.css'; // Import the CSS file

const BarChartComponent = ({ name, data }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [range, setRange] = useState('YTD');

  // Filter data based on the selected range when the component mounts or when the range changes
  useEffect(() => {
    filterData(range);
  }, [range, data]);

  // Function to format Y-axis values into millions
  const formatYAxisValue = (value) => {
    return value / 1000000 + 'M';
  };

  // Function to format the X-axis label based on the selected range
  const formatXAxisLabel = (item) => {
    const date = new Date(item.dataDate);
    const options7D1M = { day: '2-digit', month: 'short' }; // DD-MMM
    const options6MYTD = { month: 'short', year: '2-digit' }; // Mmm-YY

    // Format date based on the selected range
    return (range === '7D' || range === '1M')
      ? date.toLocaleDateString('en-GB', options7D1M).toUpperCase() // DD-MMM
      : date.toLocaleDateString('en-GB', options6MYTD).toUpperCase(); // Mmm-YY
  };

  // Filter data based on selected range
  // Filter data based on selected range
  const filterData = (selectedRange) => {
    if (!data || data.length === 0) return;

    const currentDate = new Date('2024-10-18');
    let filtered = [];
    const cloneDate = (date) => new Date(date.getTime());

    // Filter data based on selected range
    switch (selectedRange) {
      case '7D': {
        const startDate = cloneDate(currentDate);
        startDate.setDate(startDate.getDate() - 7);
        filtered = data.filter((item) => new Date(item.dataDate) >= startDate);
        break;
      }
      case '1M': {
        const startDate = cloneDate(currentDate);
        startDate.setMonth(startDate.getMonth() - 1);
        filtered = data.filter((item) => new Date(item.dataDate) >= startDate);
        break;
      }
      case '6M': {
        const startDate = cloneDate(currentDate);
        startDate.setMonth(startDate.getMonth() - 6);
        filtered = data.filter((item) => new Date(item.dataDate) >= startDate);
        break;
      }
      case 'YTD': {
        const yearStart = new Date(currentDate.getFullYear(), 0, 1);
        filtered = data.filter((item) => new Date(item.dataDate) >= yearStart);
        break;
      }
      case '1Y': {
        const startDate = cloneDate(currentDate);
        startDate.setFullYear(startDate.getFullYear() - 1);
        filtered = data.filter((item) => new Date(item.dataDate) >= startDate);
        break;
      }
      default:
        filtered = data; // Use the entire dataset if no valid range is selected
        break;
    }

    // Update the state with the filtered data
    setFilteredData(filtered);
  };


    // Handle button click and set the range state
    const handleRangeClick = (selectedRange) => {
      if (selectedRange !== range) {
        setRange(selectedRange);
      }
    };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const { dataDate, value } = data.payload;
  
      return (
        <div className="custom-tooltip">
          <p className="tooltip-date">{`Date: ${dataDate}`}</p>
          <p className="tooltip-value">{`Margin: ${formatTooltipValue(value)}`}</p>
        </div>
      );
    }
  
    return null;
  };
  
  // Function to format the tooltip value in millions
  const formatTooltipValue = (value) => {
    return value >= 1000000 ? `${(value / 1000000).toFixed(2)}M` : value.toFixed(2);
  };

  // Function to get the fill color based on the index for zebra stripes
  const getBarFillColor = (index) => {
    return index % 2 === 0 ? '#7898be' : '#7898be'; // Change colors as needed
  };

  

  return (
    <div className='Graph-1-container'>
      <div className='graph-1-header'>
        {/* Header displaying the name from props */}
        <h3 className="chart-header">{name}</h3>

        <div className="button-container">
          <button
            className={`range-button ${range === '7D' ? 'active' : ''}`}
            onClick={() => handleRangeClick('7D')}
          >
            7D
          </button>
          <button
            className={`range-button ${range === '1M' ? 'active' : ''}`}
            onClick={() => handleRangeClick('1M')}
          >
            1M
          </button>
          <button
            className={`range-button ${range === '6M' ? 'active' : ''}`}
            onClick={() => handleRangeClick('6M')}
          >
            6M
          </button>
          <button
            className={`range-button ${range === '1Y' ? 'active' : ''}`}
            onClick={() => handleRangeClick('1Y')}
          >
            1Y
          </button>
          <button
            className={`range-button ${range === 'YTD' ? 'active' : ''}`}
            onClick={() => handleRangeClick('YTD')}
          >
            YTD
          </button>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={filteredData.map((item) => ({
              ...item,
              name: formatXAxisLabel(item),
            }))}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false}/>
            <XAxis dataKey="name" stroke="#333" />
            <YAxis stroke="#333" tickFormatter={formatYAxisValue} />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: '#e0e0e0' }}
            />
            <Legend wrapperStyle={{ color: '#666' }} />
            <Bar
              dataKey="value"
              name="Margin"
              barSize={25}
              // radius={[4, 4, 0, 0]}
              // Use `getBarFillColor` for zebra stripes effect
              isAnimationActive={false}
            >
              {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarFillColor(index)} />
              ))}
            </Bar>

          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartComponent;
