import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

const CATEGORY_COLORS = {
  food: '#10B981',      // Professional Green
  rent: '#3B82F6',      // Professional Blue
  travel: '#F59E0B',    // Professional Amber
  shopping: '#8B5CF6',  // Professional Purple
  entertainment: '#EF4444', // Professional Red
  others: '#6B7280',    // Professional Gray
};

function getCategoryData(expenses) {
  const categoryTotals = {};
  expenses.forEach(exp => {
    if (exp.category) {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.ammount;
    }
  });
  
  const categories = Object.keys(CATEGORY_COLORS);
  const data = categories.map(cat => categoryTotals[cat] || 0);
  const labels = categories.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1));
  const backgroundColor = categories.map(cat => CATEGORY_COLORS[cat]);
  
  // Calculate total and percentages
  const total = data.reduce((sum, amount) => sum + amount, 0);
  const percentages = data.map(amount => total > 0 ? ((amount / total) * 100).toFixed(1) : 0);
  
  return { labels, data, backgroundColor, total, percentages };
}

const PieChartCategory = ({ expenses }) => {
  const { labels, data, backgroundColor, total, percentages } = getCategoryData(expenses);
  
  const chartData = {
    labels: labels.map((label, index) => `${label} (${percentages[index]}%)`),
    datasets: [
      {
        data,
        backgroundColor,
        borderColor: backgroundColor.map(color => color + 'CC'), // Add transparency
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { 
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const percentage = percentages[context.dataIndex];
            return `${label}: ₹${value.toLocaleString()} (${percentage}%)`;
          }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  return (
    <div style={{ width: '100%', maxWidth: 400 }}>
      <div style={{ height: 300 }}>
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PieChartCategory;
