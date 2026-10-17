import { ArcElement, Chart as ChartJS, Tooltip, TooltipItem } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { formatCurrency } from "../utils/calculations";
import { readCssColor } from "../utils/colors";
import { Card } from "./ui/Card";

ChartJS.register(ArcElement, Tooltip);

export type CostSlice = {
  label: string;
  value: number;
  /** CSS custom property of the slice color, such as `--color-blue-600`. */
  color: string;
};

type Props = {
  title: string;
  description?: string;
  totalLabel: string;
  slices: CostSlice[];
};

const percentFormatter = new Intl.NumberFormat("fr-FR", {
  style: "percent",
  maximumFractionDigits: 0,
});

const CostPieChart = ({ title, description, totalLabel, slices }: Props) => {
  const visibleSlices = slices.filter((slice) => slice.value > 0);
  const total = visibleSlices.reduce((sum, slice) => sum + slice.value, 0);

  const data = {
    labels: visibleSlices.map((slice) => slice.label),
    datasets: [
      {
        data: visibleSlices.map((slice) => slice.value),
        backgroundColor: visibleSlices.map((slice) =>
          readCssColor(slice.color),
        ),
        borderColor: "#fff",
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: readCssColor("--color-gray-900"),
        cornerRadius: 10,
        padding: 12,
        boxPadding: 4,
        callbacks: {
          label: (context: TooltipItem<"doughnut">) =>
            ` ${context.label} : ${formatCurrency(context.parsed)}`,
        },
      },
    },
  };

  return (
    <Card title={title} description={description}>
      <div className="relative mx-auto h-48 max-w-48">
        <div aria-hidden="true" className="absolute inset-0">
          <Doughnut data={data} options={options} />
        </div>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-medium text-gray-600">
            {totalLabel}
          </span>
          <span className="text-lg font-semibold tracking-[-0.02em] text-gray-900 tabular-nums">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      <ul className="mt-5 space-y-2">
        {visibleSlices.map((slice) => (
          <li
            key={slice.label}
            className="flex items-baseline justify-between gap-3 text-sm"
          >
            <span className="flex min-w-0 items-center gap-2 text-gray-700">
              <span
                aria-hidden="true"
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: `var(${slice.color})` }}
              />
              {slice.label}
            </span>
            <span className="whitespace-nowrap tabular-nums">
              <span className="font-medium text-gray-900">
                {formatCurrency(slice.value)}
              </span>
              <span className="ms-2 inline-block w-10 text-end text-gray-500">
                {percentFormatter.format(total ? slice.value / total : 0)}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default CostPieChart;
