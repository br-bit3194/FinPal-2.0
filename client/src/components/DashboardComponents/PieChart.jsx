import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ income, expenses, balance }) => {
  // Calculate total and percentages
  const total = income + expenses + balance;
  const incomePercent = total > 0 ? ((income / total) * 100).toFixed(1) : 0;
  const expensesPercent = total > 0 ? ((expenses / total) * 100).toFixed(1) : 0;
  const balancePercent = total > 0 ? ((balance / total) * 100).toFixed(1) : 0;

  const data = {
    labels: [
      `Income (${incomePercent}%)`, 
      `Expenses (${expensesPercent}%)`, 
      `Balance (${balancePercent}%)`
    ],
    datasets: [
      {
        label: 'Financial Overview',
        data: [income, expenses, balance],
        backgroundColor: [
          '#10B981',   // Income - Professional Green
          '#EF4444',   // Expenses - Professional Red
          '#3B82F6',   // Balance - Professional Blue
        ],
        borderColor: [
          '#059669',   // Darker Green
          '#DC2626',   // Darker Red
          '#2563EB',   // Darker Blue
        ],
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
            const percentage = context.label.match(/\(([^)]+)\)/)?.[1] || '';
            return `${label.split(' (')[0]}: ₹${value.toLocaleString()} (${percentage})`;
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
    maintainAspectRatio: false,
    cutout: '60%'
  };

  return (
    <div style={{ height: 300 }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default PieChart;
