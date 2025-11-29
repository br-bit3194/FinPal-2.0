import React from 'react';
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

const MonthlyBarChart = ({ incomeLabels, incomeValues, expenseLabels, expenseValues }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 12,
            weight: '500'
          }
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#374151',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        titleFont: {
          size: 14,
          weight: '600'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ₹${value.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 11,
            weight: '500'
          },
          color: '#6b7280'
        }
      },
      y: {
        grid: {
          color: '#f3f4f6',
          drawBorder: false
        },
        ticks: {
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 11,
            weight: '500'
          },
          color: '#6b7280',
          callback: function(value) {
            return '₹' + value.toLocaleString();
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  // Use incomeLabels as the primary labels, or create month labels if not provided
  const labels = incomeLabels && incomeLabels.length > 0 ? incomeLabels : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Income',
        data: incomeValues || [],
        backgroundColor: 'rgba(0, 129, 167, 0.8)',
        borderColor: 'rgba(0, 129, 167, 1)',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(0, 129, 167, 1)',
        hoverBorderColor: 'rgba(0, 129, 167, 1)',
        barThickness: 'flex',
        maxBarThickness: 50
      },
      {
        label: 'Expense',
        data: expenseValues || [],
        backgroundColor: 'rgba(220, 38, 38, 0.8)',
        borderColor: 'rgba(220, 38, 38, 1)',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(220, 38, 38, 1)',
        hoverBorderColor: 'rgba(220, 38, 38, 1)',
        barThickness: 'flex',
        maxBarThickness: 50
      }
    ]
  };

  return (
    <div className="w-full h-full">
      <Bar options={options} data={data} />
    </div>
  );
};

export default MonthlyBarChart;
