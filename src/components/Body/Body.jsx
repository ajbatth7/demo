import './Body.css';
import React, { useState, useEffect } from 'react';
import Table from '../Table/Table';
import BarGraph from '../charts/BarGraph/BarGraph';

const dummyData = [
  { name: 'Jan', value: 400, dataDate: '2024-01-01' },
  { name: 'Feb', value: 300, dataDate: '2024-02-01' },
  { name: 'Mar', value: 500, dataDate: '2024-03-01' },
  // Add more data points for each month, and ensure dates cover a long period for different ranges
];

const processBranchData = (data) => {
  // Create an empty array to store the results
  const result = [];

  // Iterate over each entry in the data
  data.forEach(item => {
    // Extract relevant values
    const branch = item.Branch;
    const today = item["Initial Margin(Inc NLV)"];
    const average = Math.round(Math.random()*1000000000)/100;
    const dayChange = Math.round(Math.random()*10000)/100;

    // Push the formatted result for the branch
    result.push({
      Branch: branch,
      Today: today,
      DayChange: dayChange,
      Average: average
    });
  });

  // Return the result in JSON format
  return result;
};

const processFirmOverallData = (result) => {
  return result.map((item) => {
    // Convert date format from 'DD-MM-YYYY' to 'YYYY-MM-DD'
    const [day, month, year] = item.Date.split("-");
    const formattedDate = `${year}-${month}-${day}`;

    // Return the new object structure
    return {
      name: convertDateFormat(formattedDate,0),
      value: item["Initial Margin"],
      dataDate: formattedDate,
    };
  });
};

const processAssetClassData = (data) => {

  // Initialize variables to track the max date and corresponding entries
  let mostRecentEntries = [];
  let maxDate = null;

  // Iterate through data once
  data.forEach(entry => {
      const entryDate = new Date(entry.Date.split("-").reverse().join("-")); // Convert "dd-mm-yyyy" to "yyyy-mm-dd" for Date parsing

      if (!maxDate || entryDate > maxDate) {
          // Found a new max date, update maxDate and reset the list
          maxDate = entryDate;
          mostRecentEntries = [entry];
      } else if (entryDate.getTime() === maxDate.getTime()) {
          // Same max date, add to the list
          mostRecentEntries.push(entry);
      }
  });

  data=mostRecentEntries
  // Step 1: Filter out rows with null assetClass
  const filteredData = data.filter(item => item.assetClass !== null);

  // Step 2: Aggregate data by assetClass
  const aggregatedData = filteredData.reduce((acc, item) => {
    const assetClass = item.assetClass;
    const initialMargin = item["Initial Margin"] || 0;

    // Check if assetClass already exists in the accumulator
    if (!acc[assetClass]) {
      acc[assetClass] = { assetClass, Today: 0 };
    }

    // Sum up the initial margins
    acc[assetClass].Today += initialMargin;

    return acc;
  }, {});

  // Step 3: Calculate daychange and average for each assetClass
  const result = Object.values(aggregatedData).map(item => {
    const Average = Math.round(Math.random()*1000000000)/100;
    const DayChange = Math.round(Math.random()*10000)/100;
    return {
      assetClass: item.assetClass,
      Today: item.Today,
      DayChange,
      Average
    };
  });

  // Return the result in JSON format
  return result;
};

const convertDateFormat = (dateString,full) => {
  // Split the input date string into day, month, and year
  
  if (full){
    const [day, month, year] = dateString.split("-");
    // Return the date in 'YYYY-MM-DD' format
      return `${year}-${month}-${day}`;
  }
  else{
    const [year, month, day] = dateString.split("-");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${monthNames[Number(month) - 1]}-${year.slice(-2)}`;
  }
};

const getBarChartData = (FirmData, Name, Item) => {
  // Check if Name is "Asset Class" and Item is a valid asset class in FirmData
  if (Name === "Asset Class" && FirmData.some(data => data.assetClass === Item)) {
    // Filter the data based on the selected asset class (Item)
    const filteredData = FirmData.filter(data => data.assetClass === Item);
    
    // Create a map to accumulate Initial Margin by date
    const dateMap = new Map();

    filteredData.forEach(data => {
      const date = convertDateFormat(data.Date,1);
      const margin = data["Initial Margin"] || 0;

      // Sum the Initial Margin values for the same date
      if (dateMap.has(date)) {
        dateMap.set(date, dateMap.get(date) + margin);
      } else {
        dateMap.set(date, margin);
      }
    });

    // Convert the map to an array of objects for the bar chart
    const barChartData = Array.from(dateMap.entries()).map(([date, value]) => ({
      name: convertDateFormat(date,0),
      value: value,
      dataDate: date
    }));

    console.log(barChartData);
    return barChartData;
  }
  return []
};




const Body = () => {
  const [AssetClassData, setAssetClassData] = useState([]); // State to store fetched data for Asset Class Table-1
  const [BranchData, setBranchData] = useState([]); // State to store fetched data for Branch table-2
  const [FirmProductData, setFirmProductData] = useState([]); // State to store fetched data for FirmProduct
  const [FirmOverallData, setFirmOverallData] = useState([]); // State to store fetched data for FirmProduct
  const [BarChart1Data, setBarChart1Data] = useState(dummyData); // State to store data to be displayed in Barchart-1
  const [TableName, setTableName] = useState([]); // State to store Table name
  const [TableItem, setTableItem] = useState(['Futures First']); // State to store Table name


  // Simulating an API call
  useEffect(() => {
    const fetchAssetClassData = async () => {
      // Replace this with your actual API call
      const response = await fetch('http://localhost:5000/FirmProduct');
      const result = await response.json();
      setFirmProductData(result)
      const processedData = processAssetClassData(result); // Apply processing
      setAssetClassData(processedData);
    };

    fetchAssetClassData();
  }, []);

  // Simulating an API call
  useEffect(() => {
    const fetchFirmOverallData = async () => {
      // Replace this with your actual API call
      const response = await fetch('http://localhost:5000/FirmOverall');
      const result = await response.json();
      const processedData = processFirmOverallData(result); // Apply processing
      setFirmOverallData(processedData);
      setBarChart1Data(processedData)
    };

    fetchFirmOverallData();
  }, []);

  // Simulating an API call
  useEffect(() => {
    const fetchBranchData = async () => {
      // Replace this with your actual API call
      const response = await fetch('http://localhost:5000/BranchOverall');
      const result = await response.json();
      const processedData = processBranchData(result); // Apply processing
      setBranchData(processedData);
    };

    fetchBranchData();
  }, []);
  
  useEffect(() => {
    const barChartData = getBarChartData(FirmProductData, TableName, TableItem);
    if (barChartData.length!==0) {setBarChart1Data(barChartData);}
  }, [FirmProductData, TableName, TableItem]);
  
  console.log('Firm',FirmOverallData)
  console.log('Bar',BarChart1Data)
  return (
    <div className='Body'>
      <div className="Tables">
      <Table name="Asset Class" data={AssetClassData} setTableName={setTableName} setTableItem={setTableItem}/>
      <Table name="Branch" data={BranchData} setTableName={setTableName} setTableItem={setTableItem}/>
      {/* <Table name="Analyst" /> */}
      {/* <Table name="Product" /> */}
      </div>

      <div className='Graphs'>
        <BarGraph name={TableItem} data={BarChart1Data}/>
      </div>
    </div>   
  );
};

export default Body;
