import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function ChartDisplay({products}) {

const brandCounts = {};
products.forEach(item => {
  const brand = item.brandName;
  if (!brandCounts[brand]) {
    brandCounts[brand] = 0;
  }
  brandCounts[brand]++;
});
const totalFacings = products.length;

// Sort brands by share and select top 5
const sortedBrands = Object.keys(brandCounts).sort((a, b) => brandCounts[b] - brandCounts[a]);
const top5Brands = sortedBrands.slice(0, 5);

// Calculate "Other Brands" share
const otherBrandsCount = sortedBrands.slice(5).reduce((count, brand) => count + brandCounts[brand], 0);
const otherBrandsShare = otherBrandsCount / totalFacings;

// Prepare data for chart
const labels = top5Brands.concat(['Other Brands']);
const dataValues = top5Brands.map(brand => (brandCounts[brand] / totalFacings) * 100);
dataValues.push(otherBrandsShare * 100);

const backgroundColors = labels.map(() => `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2)`);
const borderColors = labels.map((bgColor) => bgColor.replace("0.2", "1"));

// Generate the chart data
const data = {
  labels: labels,
  datasets: [
    {
      data: dataValues,
      backgroundColor: backgroundColors,
      borderColor: borderColors,
      borderWidth: 1,
    },
  ],
};

// Generate the chart options
const options = {
  plugins:{
  tooltip: {
    callbacks: {
      label: function (context) {
        const index = context.dataIndex;
        const brand = context.label;
        const percent = context.dataset.data[index].toFixed(2);
        const facingCount = brand === 'Other Brands' ? otherBrandsCount : brandCounts[brand];
        return `${brand}: ${percent}% (${facingCount} facings)`;
      },
    },
  },
}
};


  return (
    <div style={{ height: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
    <div><h1>Doughnut Chart</h1></div>
    <Doughnut data={data} options={options} />
</div>

  );
}

export default ChartDisplay;
