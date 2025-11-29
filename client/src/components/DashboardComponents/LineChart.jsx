// src/components/DashboardComponents/LineChart.jsx
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const LineChart = ({ labels, values }) => {
  const data = {
    labels,
    datasets: [
      {
        label: "Daily Income (₹)",
        data: values,
        fill: false,
        borderColor: "#0081A7",
        tension: 0.3,
        pointRadius: 4,
        backgroundColor: "#0081A7",
        pointHoverRadius: 6,
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointHoverBackgroundColor: "#00B4D8",
        pointHoverBorderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 129, 167, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#0081A7',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `₹${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: "#6B7280",
          font: {
            size: 11
          }
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: "#6B7280",
          font: {
            size: 11
          },
          callback: function(value) {
            return '₹' + value.toLocaleString();
          }
        },
        grid: {
          color: "rgba(0, 129, 167, 0.1)",
          drawBorder: false,
        },
      },
    },
    animation: {
      duration: 600,
      easing: 'easeInOutQuart'
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  return (
    <div className="w-full h-[300px] bg-white/95 rounded-2xl p-4 border border-gray-200/60 shadow-md">
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;