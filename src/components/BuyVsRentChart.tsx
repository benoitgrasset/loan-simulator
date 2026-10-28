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
import {
  formatCurrency,
  formatDurationYearsMonths,
} from "../utils/calculations";
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
  crossoverMonth: number | null;
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

const createCrossoverLinePlugin = (crossoverMonth: number | null) => ({
  id: "buyVsRentCrossoverLine",
  afterDraw: (chart: ChartJS) => {
    if (crossoverMonth === null) return;

    const xScale = chart.scales.x;
    const yScale = chart.scales.y;
    if (!xScale || !yScale) return;

    const xYears = crossoverMonth / 12;
    const xPixel = xScale.getPixelForValue(xYears);
    const { ctx } = chart;
    const lineColor = readCssColor("--color-gray-400");

    ctx.save();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(xPixel, yScale.top);
    ctx.lineTo(xPixel, yScale.bottom);
    ctx.stroke();

    ctx.fillStyle = readCssColor("--color-gray-700");
    ctx.font = "600 11px ui-sans-serif, system-ui, sans-serif";
    ctx.textAlign = "center";
    const label = formatDurationYearsMonths(crossoverMonth);
    ctx.fillText(label, xPixel, yScale.top + 14);
    ctx.restore();
  },
});

const BuyVsRentChart = ({ points, crossoverMonth }: Props) => {
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

  const maxYear = points[points.length - 1]?.year ?? 0;

  const chartData = useMemo(
    () => ({
      datasets: [
        {
          label: "Patrimoine si achat",
          data: points.map((p) => ({ x: p.year, y: p.buyNetWorth })),
          borderColor: colors.buy,
          backgroundColor: colors.buy,
          borderWidth: 2.5,
          tension: 0.25,
          pointRadius: 0,
          pointHoverRadius: 5,
        },
        {
          label: "Patrimoine si location",
          data: points.map((p) => ({ x: p.year, y: p.rentNetWorth })),
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

  const crossoverPlugin = useMemo(
    () => createCrossoverLinePlugin(crossoverMonth),
    [crossoverMonth],
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
            title: (items: TooltipItem<"line">[]) => {
              const year = items[0]?.parsed.x;
              return year !== undefined ? `An ${Math.round(Number(year))}` : "";
            },
            label: (ctx: TooltipItem<"line">) =>
              `${ctx.dataset.label ?? ""} : ${formatCurrency(ctx.parsed.y ?? 0)}`,
          },
        },
      },
      scales: {
        x: {
          type: "linear" as const,
          min: 0,
          max: maxYear,
          ticks: {
            color: colors.axisText,
            stepSize: maxYear <= 15 ? 3 : 5,
            callback: (value: string | number) => `An ${value}`,
          },
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
    [colors, maxYear],
  );

  const crossoverLabel =
    crossoverMonth !== null
      ? formatDurationYearsMonths(crossoverMonth)
      : null;

  const description =
    crossoverLabel !== null
      ? `Les courbes se croisent vers ${crossoverLabel} : au-delà, l’achat affiche un patrimoine net plus élevé avec ces hypothèses.`
      : "Sur l’horizon choisi, les courbes ne se croisent pas : une option reste nettement devant selon les hypothèses.";

  const chartAriaLabel =
    crossoverLabel !== null
      ? `Graphique comparant le patrimoine net en cas d’achat ou de location. Croisement des courbes vers ${crossoverLabel}.`
      : "Graphique comparant le patrimoine net en cas d’achat ou de location.";

  return (
    <Card title="Patrimoine net dans le temps" description={description}>
      <div
        className="h-80 min-h-[16rem] w-full"
        role="img"
        aria-label={chartAriaLabel}
      >
        <Line
          data={chartData}
          options={options}
          plugins={[crossoverPlugin]}
        />
      </div>
    </Card>
  );
};

export default BuyVsRentChart;
