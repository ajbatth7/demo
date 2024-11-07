import './Body.css';
import React, { useState, useEffect } from 'react';
import Table from '../Table/Table';



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

const processAssetClassData = (data) => {
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


const Body = () => {
  const [AssetClassData, setAssetClassData] = useState([]); // State to store fetched data
  const [BranchData, setBranchData] = useState([]); // State to store fetched data

  // Simulating an API call
  useEffect(() => {
    const fetchAssetClassData = async () => {
      // Replace this with your actual API call
      const response = await fetch('http://localhost:5000/FirmProduct');
      const result = await response.json();
      const processedData = processAssetClassData(result); // Apply processing
      setAssetClassData(processedData);
      console.log(AssetClassData)
    };

    fetchAssetClassData();
  }, []);

  // Simulating an API call
  useEffect(() => {
    const fetchBranchData = async () => {
      // Replace this with your actual API call
      const response = await fetch('http://localhost:5000/BranchOverall');
      const result = await response.json();
      const processedData = processBranchData(result); // Apply processing
      setBranchData(processedData);
      console.log(BranchData)
    };

    fetchBranchData();
  }, []);

  return (
    <div className="Tables">
    <Table name="Asset Class" data={AssetClassData}/>
    <Table name="Branch" data={BranchData} />
    {/* <Table name="Analyst" /> */}
    {/* <Table name="Product" /> */}
  </div>);
};

export default Body;
