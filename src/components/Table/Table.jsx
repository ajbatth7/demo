import React, { useState, useEffect } from 'react';
import './Table.css'; // Importing the CSS file

const Table = ({ name, data , setTableName, setTableItem}) => {
  

  const [expanded, setExpanded] = useState(true); // State to handle expansion (initially expanded)
  const [sortedData, setSortedData] = useState([]); // State for sorted data

  useEffect(() => {
    setSortedData(data); // Sync sortedData with data prop on initial load and when data changes
  }, [data]);

  // Determine the number of rows to display when collapsed
  const rowsToShow = expanded ? 10 : sortedData.length;

  // Get table headers from the keys of the first data object
  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  // Format the value in millions
  const formatInMillions = (value) => {
    if (typeof value === 'number') {
      return (value / 1e6).toFixed(2); // Convert to millions with two decimal places
    }
    return value; // Return as is if not a number
  };

  // Handle sorting when clicking the sort icon
  const handleSort = (column) => {
    const sorted = [...sortedData].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];

      // Ensure undefined or non-numeric values are handled
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return bValue - aValue; // Sort in descending order
      }
      return 0;
    });
    setSortedData(sorted); // Update the sorted data
  };

  return (
    <div className="table-container">
      {/* Table with scrollable div when collapsed */}
      <div className={`table-wrapper ${!expanded ? 'scrollable' : ''}`}>
        <table className="styled-table">
          <thead>
            <tr onClick={() => setExpanded(!expanded)}>
              {/* First header cell contains the name */}
              <th>{name}</th>
              {headers.slice(1).map((header, index) => (
                <th key={index}>
                  <div className='table-heading'>
                    {header}
                    <img
                      className='sort-icon'
                      src="static/sort.png"
                      alt="sort icon"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row expansion toggle
                        handleSort(header); // Trigger sorting
                      }}
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.slice(0, rowsToShow).map((row, index) => (
              <tr key={index}>
                {headers.map((header, headerIndex) => {
                  const value = row[header];
                  const formattedValue = formatInMillions(value); // Formatted value in millions
                  return (
                    <td 
                      key={headerIndex} 
                      title={value}
                      onClick={() => {
                        setTableItem(value); // Update with the value
                        setTableName(name);  // Update with the name
                      }}
                    > {/* Show exact value on hover */}
                      {String(header)!=='DayChange'?formattedValue:String(row[header])+'%' }
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
