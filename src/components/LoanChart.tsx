import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  ScriptableContext,
  Tooltip,
  TooltipItem,
} from "chart.js";
import { useMemo } from "react";
import { Bar, Line } from "react-chartjs-2";
import { AmortizationRow } from "../types";
import { formatCurrency } from "../utils/calculations";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip,
  Legend,
);

type Props = {
  schedule: AmortizationRow[];
};

const BLUE = "#2563eb";
const EMERALD = "#059669";
const ROSE = "#e11d48";
const RED = "rgba(225, 29, 72, 0.82)";
const GREEN = "rgba(5, 150, 105, 0.88)";

const formatAxisEuro = (value: number) => {
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString("fr-FR", {
      maximumFractionDigits: 1,
    })} M€`;
  }
  if (Math.abs(value) >= 1000) {
    return `${Math.round(value / 1000).toLocaleString("fr-FR")} k€`;
  }
  return `${Math.round(value)} €`;
};

const createAreaGradient = (context: ScriptableContext<"line">) => {
  const { ctx, chartArea } = context.chart;
  if (!chartArea) return "rgba(37, 99, 235, 0.12)";

  const gradient = ctx.createLinearGradient(
    0,
    chartArea.top,
    0,
    chartArea.bottom,
  );
  gradient.addColorStop(0, "rgba(37, 99, 235, 0.38)");
  gradient.addColorStop(0.55, "rgba(37, 99, 235, 0.12)");
  gradient.addColorStop(1, "rgba(37, 99, 235, 0)");
  return gradient;
};

const LoanChart = ({ schedule }: Props) => {
  const remainingBalanceData = useMemo(
    () => ({
      labels: schedule.map((row) => row.month),
      datasets: [
        {
          label: "Capital restant dû",
          data: schedule.map((row) => row.remainingBalance),
          borderColor: BLUE,
          backgroundColor: createAreaGradient,
          borderWidth: 2.5,
          tension: 0.35,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: BLUE,
          pointHoverBorderColor: "#fff",
          pointHoverBorderWidth: 2,
        },
      ],
    }),
    [schedule],
  );

  const yearlyPayments = useMemo(() => {
    const years: { label: string; principal: number; interest: number }[] = [];

    schedule.forEach((row) => {
      const yearIndex = Math.floor((row.month - 1) / 12);
      if (!years[yearIndex]) {
        years[yearIndex] = {
          label: `An ${yearIndex + 1}`,
          principal: 0,
          interest: 0,
        };
      }
      years[yearIndex].principal += row.principalPayment;
      years[yearIndex].interest += row.interestPayment;
    });

    return years;
  }, [schedule]);

  const paymentsData = useMemo(
    () => ({
      labels: yearlyPayments.map((year) => year.label),
      datasets: [
        {
          label: "Capital",
          data: yearlyPayments.map((year) => year.principal),
          backgroundColor: GREEN,
          hoverBackgroundColor: EMERALD,
          borderRadius: { topLeft: 0, topRight: 0, bottomLeft: 6, bottomRight: 6 },
          borderSkipped: false,
          maxBarThickness: 36,
        },
        {
          label: "Intérêts",
          data: yearlyPayments.map((year) => year.interest),
          backgroundColor: RED,
          hoverBackgroundColor: ROSE,
          borderRadius: { topLeft: 6, topRight: 6, bottomLeft: 0, bottomRight: 0 },
          borderSkipped: false,
          maxBarThickness: 36,
        },
      ],
    }),
    [yearlyPayments],
  );

  const sharedOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top" as const,
        align: "end" as const,
        labels: {
          usePointStyle: true,
          pointStyle: "circle" as const,
          boxWidth: 8,
          boxHeight: 8,
          padding: 16,
          color: "#4b5563",
          font: { size: 12, weight: 500 as const },
        },
      },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#f9fafb",
        bodyColor: "#e5e7eb",
        borderColor: "rgba(255, 255, 255, 0.08)",
        borderWidth: 1,
        cornerRadius: 10,
        padding: 12,
        displayColors: true,
        boxPadding: 4,
        callbacks: {
          label: (context: TooltipItem<"line" | "bar">) => {
            const value = context.parsed.y ?? 0;
            return ` ${context.dataset.label}: ${formatCurrency(value)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#9ca3af",
          font: { size: 11 },
          maxRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
        border: {
          display: false,
        },
        grid: {
          color: "rgba(15, 23, 42, 0.06)",
          drawTicks: false,
        },
        ticks: {
          color: "#9ca3af",
          font: { size: 11 },
          padding: 8,
          callback: (value: string | number) => formatAxisEuro(Number(value)),
        },
      },
    },
  };

  const lineChartOptions = {
    ...sharedOptions,
    plugins: {
      ...sharedOptions.plugins,
      legend: {
        ...sharedOptions.plugins.legend,
        display: false,
      },
    },
    scales: {
      ...sharedOptions.scales,
      x: {
        ...sharedOptions.scales.x,
        ticks: {
          ...sharedOptions.scales.x.ticks,
          autoSkip: false,
          callback: (_value: string | number, index: number) => {
            if (index % 12 !== 0) return "";
            const year = index / 12 + 1;
            return year === 1 || year % 5 === 0 ? `An ${year}` : "";
          },
        },
      },
    },
  };

  const barChartOptions = {
    ...sharedOptions,
    scales: {
      ...sharedOptions.scales,
      x: {
        ...sharedOptions.scales.x,
        stacked: true,
      },
      y: {
        ...sharedOptions.scales.y,
        stacked: true,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800">
          Évolution du capital restant dû
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Décroissance du capital emprunté sur la durée du prêt
        </p>
        <div className="h-80">
          <Line data={remainingBalanceData} options={lineChartOptions} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800">
          Répartition capital / intérêts
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Montants remboursés chaque année
        </p>
        <div className="h-80">
          <Bar data={paymentsData} options={barChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default LoanChart;
