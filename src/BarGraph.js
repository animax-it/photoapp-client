import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

const BarGraph = ({products}) => {
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [brandData, setBrandData] = useState([]);
    const [chartData, setChartData] = useState({});
  
    useEffect(() => {
        if (products) { 
      const distinctBrands = Array.from(new Set(products.map(item => item.brandName)));
      setBrands(distinctBrands);
        }
    }, [products]);
  
    
  useEffect(() => {
    if (selectedBrand) {
      const selectedBrandData = products.filter(item => item.brandName === selectedBrand);

      const totalFacings = selectedBrandData.length;
      const topLevelFacings = selectedBrandData.filter(item => item.shelfLevel === 'Top').length;
      const middleLevelFacings = selectedBrandData.filter(item => item.shelfLevel === 'Middle').length;
      const bottomLevelFacings = selectedBrandData.filter(item => item.shelfLevel === 'Bottom').length;

      const percentageTop = (topLevelFacings / totalFacings) * 100;
      const percentageMiddle = (middleLevelFacings / totalFacings) * 100;
      const percentageBottom = (bottomLevelFacings / totalFacings) * 100;


      setBrandData([percentageTop, percentageMiddle, percentageBottom]);

      setChartData({
        labels: ['Top', 'Middle', 'Bottom'],
        datasets: [
          {
            label: selectedBrand,
            data: [percentageTop, percentageMiddle, percentageBottom],
            backgroundColor: ['#FF5733', '#FFC300', '#36A2EB'],
          },
        ],
      });
    }

  }, [selectedBrand]);

    const handleBrandChange = (event) => {
      setSelectedBrand(event.target.value);
    };
    const options = {
        indexAxis: 'y',
        elements: {
          bar: {
            borderWidth: 2,
          },
        },
        responsive: false,
        plugins: {
          legend: {
            position: 'right',
          }
        },
      };
    
  return (
    <div style={{ height: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div><h1>Bar Graph</h1></div>
          <h3> Please select a product to view chart</h3>

      <label htmlFor="brandSelect">Select Brand:</label>
      <select id="brandSelect" value={selectedBrand} onChange={handleBrandChange}>
        <option value="">Select a brand</option>
        {brands?.map((brand, index) => (
          <option key={index} value={brand}>
            {brand}
          </option>
        ))}
      </select>
      {selectedBrand &&
       chartData && Object.keys(chartData).length > 0 && (
        <div style={{ width: '400px', height:'400px', margin: '20px auto' }}>
          <Bar data={chartData} options={options} />
        </div>
      )}
    </div>
  )
}

export default BarGraph