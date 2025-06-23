import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  TooltipItem,
} from "chart.js";
import React from "react";
import { Bar, Line } from "react-chartjs-2";
import { AmortizationRow } from "../types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface LoanChartProps {
  schedule: AmortizationRow[];
}

const LoanChart: React.FC<LoanChartProps> = ({ schedule }) => {
  // Données pour le graphique d'évolution du capital restant
  const remainingBalanceData = {
    labels: schedule.map((_, index) => `${index + 1}`),
    datasets: [
      {
        label: "Capital restant dû",
        data: schedule.map((row) => row.remainingBalance),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.1,
        fill: true,
      },
    ],
  };

  // Données pour le graphique des mensualités (capital vs intérêts)
  const paymentsData = {
    labels: schedule.map((_, index) => `M${index + 1}`), // Afficher seulement les 24 premiers mois
    datasets: [
      {
        label: "Capital",
        data: schedule.map((row) => row.principalPayment),
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 1,
      },
      {
        label: "Intérêts",
        data: schedule.map((row) => row.interestPayment),
        backgroundColor: "rgba(239, 68, 68, 0.8)",
        borderColor: "rgb(239, 68, 68)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"line" | "bar">) {
            const value = context.parsed.y;
            return `${context.dataset.label}: ${new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
            }).format(value)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: string | number) {
            return new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(Number(value));
          },
        },
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      ...chartOptions.scales,
      x: {
        stacked: true,
      },
      y: {
        ...chartOptions.scales.y,
        stacked: true,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Évolution du capital restant */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Évolution du capital restant dû
        </h3>
        <div className="h-80">
          <Line data={remainingBalanceData} options={chartOptions} />
        </div>
      </div>

      {/* Répartition capital/intérêts sur les 24 premiers mois */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Répartition Capital/Intérêts
        </h3>
        <div className="h-80">
          <Bar data={paymentsData} options={barChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default LoanChart;
