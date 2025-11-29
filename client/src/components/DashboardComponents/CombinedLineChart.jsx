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

const CombinedLineChart = ({ labels, incomeValues, expenseValues }) => {
  // Add debugging and validation
  console.log('CombinedLineChart Data:', { labels, incomeValues, expenseValues });
  
  // Validate data
  if (!labels || !Array.isArray(labels) || labels.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-lg font-medium mb-2">No Data Available</div>
          <div className="text-sm">Add some income or expenses for this month to see the trend</div>
        </div>
      </div>
    );
  }

  // Ensure values arrays have the same length as labels
  const normalizedIncomeValues = labels.map((_, index) => incomeValues?.[index] || 0);
  const normalizedExpenseValues = labels.map((_, index) => expenseValues?.[index] || 0);

  const data = {
    labels,
    datasets: [
      {
        label: "Income",
        data: normalizedIncomeValues,
        fill: 'origin',
        borderColor: "#0081A7",
        backgroundColor: "rgba(0, 129, 167, 0.2)", // area fill
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointHoverBackgroundColor: "#00B4D8",
        pointHoverBorderColor: "#ffffff",
        borderWidth: 2,
      },
      {
        label: "Expense",
        data: normalizedExpenseValues,
        fill: 'origin',
        borderColor: "#DC2626",
        backgroundColor: "rgba(220, 38, 38, 0.2)", // area fill
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointHoverBackgroundColor: "#EF4444",
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
        display: true,
        position: "top",
        labels: {
          color: "#374151",
          font: {
            size: 13,
            weight: "bold",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 129, 167, 0.9)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#0081A7",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: function(context) {
            return `Day ${context[0].label}`;
          },
          label: function(context) {
            return `${context.dataset.label}: ₹${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Day of Month',
          color: '#6B7280',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        ticks: {
          color: "#6B7280",
          font: {
            size: 11,
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Amount (₹)',
          color: '#6B7280',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        ticks: {
          color: "#6B7280",
          font: {
            size: 11,
          },
          callback: function (value) {
            return "₹" + value.toLocaleString();
          },
        },
        grid: {
          color: "rgba(0, 129, 167, 0.1)",
          drawBorder: false,
        },
      },
    },
    animation: {
      duration: 600,
      easing: "easeInOutQuart",
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
  };

  return (
    <div className="w-full h-full">
      <Line data={data} options={options} />
    </div>
  );
};

export default CombinedLineChart;
