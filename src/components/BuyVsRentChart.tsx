import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  TooltipItem,
} from "chart.js";
import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { BuyVsRentYearPoint } from "../types";
import { formatCurrency } from "../utils/calculations";
import { readCssColor } from "../utils/colors";
import { Card } from "./ui/Card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

type Props = {
  points: BuyVsRentYearPoint[];
  crossoverYear: number | null;
};

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

const BuyVsRentChart = ({ points, crossoverYear }: Props) => {
  const colors = useMemo(
    () => ({
      buy: readCssColor("--color-chart-buy"),
      rent: readCssColor("--color-chart-rent"),
      axisText: readCssColor("--color-gray-500"),
      legendText: readCssColor("--color-gray-600"),
      tooltipBg: readCssColor("--color-gray-900"),
    }),
    [],
  );

  const chartData = useMemo(
    () => ({
      labels: points.map((p) => `An ${p.year}`),
      datasets: [
        {
          label: "Patrimoine si achat",
          data: points.map((p) => p.buyNetWorth),
          borderColor: colors.buy,
          backgroundColor: colors.buy,
          borderWidth: 2.5,
          tension: 0.25,
          pointRadius: 0,
          pointHoverRadius: 5,
        },
        {
          label: "Patrimoine si location",
          data: points.map((p) => p.rentNetWorth),
          borderColor: colors.rent,
          backgroundColor: colors.rent,
          borderWidth: 2.5,
          tension: 0.25,
          pointRadius: 0,
          pointHoverRadius: 5,
        },
      ],
    }),
    [points, colors],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index" as const, intersect: false },
      plugins: {
        legend: {
          position: "bottom" as const,
          labels: {
            color: colors.legendText,
            usePointStyle: true,
            padding: 16,
          },
        },
        tooltip: {
          backgroundColor: colors.tooltipBg,
          callbacks: {
            label: (ctx: TooltipItem<"line">) =>
              `${ctx.dataset.label ?? ""} : ${formatCurrency(ctx.parsed.y ?? 0)}`,
          },
        },
      },
      scales: {
        x: {
          ticks: { color: colors.axisText, maxTicksLimit: 12 },
          grid: { display: false },
        },
        y: {
          ticks: {
            color: colors.axisText,
            callback: (value: string | number) => formatAxisEuro(Number(value)),
          },
          grid: { color: readCssColor("--color-gray-200", 0.6) },
        },
      },
    }),
    [colors],
  );

  const description =
    crossoverYear !== null
      ? `Les courbes se croisent vers l’année ${crossoverYear} : au-delà, l’achat affiche un patrimoine net plus élevé avec ces hypothèses.`
      : "Sur l’horizon choisi, les courbes ne se croisent pas : une option reste nettement devant selon les hypothèses.";

  return (
    <Card title="Patrimoine net dans le temps" description={description}>
      <div
        className="h-80 min-h-[16rem] w-full"
        role="img"
        aria-label="Graphique comparant le patrimoine net en cas d’achat ou de location"
      >
        <Line data={chartData} options={options} />
      </div>
    </Card>
  );
};

export default BuyVsRentChart;
