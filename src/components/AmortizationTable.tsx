import { ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { AmortizationRow } from "../types";
import { formatCurrency } from "../utils/calculations";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import TableHeader from "./ui/TableHeader";

type Props = {
  schedule: AmortizationRow[];
};

const CELL = "px-4 py-3 whitespace-nowrap text-sm";

const PAGE_BUTTON =
  "flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50";

const AmortizationTable = ({ schedule }: Props) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [showAllRows, setShowAllRows] = useState(false);
  const rowsPerPage = 12;

  const totalPages = Math.ceil(schedule.length / rowsPerPage);
  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = showAllRows
    ? schedule
    : schedule.slice(startIndex, endIndex);

  const totalInterest = schedule.reduce(
    (sum, row) => sum + row.interestPayment,
    0,
  );
  const totalPrincipal = schedule.reduce(
    (sum, row) => sum + row.principalPayment,
    0,
  );

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Card
      title="Tableau d’amortissement"
      className="overflow-hidden pb-0"
      actions={
        <Button
          onClick={() => setShowAllRows(!showAllRows)}
          className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
        >
          {showAllRows ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          {showAllRows ? "Voir par page" : "Voir tout"}
        </Button>
      }
    >
      <div className="-mx-5 overflow-x-auto border-t border-gray-200">
        <table className="w-full tabular-nums">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader align="left" className="px-4">
                Mois
              </TableHeader>
              <TableHeader align="right" className="px-4">
                Mensualité
              </TableHeader>
              <TableHeader align="right" className="px-4">
                Intérêts
              </TableHeader>
              <TableHeader align="right" className="px-4">
                Capital
              </TableHeader>
              <TableHeader align="right" className="px-4">
                Capital restant dû
              </TableHeader>
              <TableHeader align="right" className="px-4">
                Total remboursé
              </TableHeader>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {currentRows.map((row, index) => (
              <tr
                key={row.month}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className={`${CELL} font-medium text-gray-900`}>
                  {row.month}
                </td>
                <td className={`${CELL} text-end font-medium text-gray-900`}>
                  {formatCurrency(row.monthlyPayment)}
                </td>
                <td className={`${CELL} text-end text-interest-strong`}>
                  {formatCurrency(row.interestPayment)}
                </td>
                <td className={`${CELL} text-end text-capital-strong`}>
                  {formatCurrency(row.principalPayment)}
                </td>
                <td className={`${CELL} text-end font-medium text-gray-900`}>
                  {formatCurrency(row.remainingBalance)}
                </td>
                <td className={`${CELL} text-end text-gray-900`}>
                  {formatCurrency(row.cumulativePayment)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100">
            <tr>
              <td className={`${CELL} font-bold text-gray-900`}>Total</td>
              <td className={`${CELL} text-end font-bold text-gray-900`}>
                {formatCurrency(totalPrincipal + totalInterest)}
              </td>
              <td className={`${CELL} text-end font-bold text-interest-strong`}>
                {formatCurrency(totalInterest)}
              </td>
              <td className={`${CELL} text-end font-bold text-capital-strong`}>
                {formatCurrency(totalPrincipal)}
              </td>
              <td className={`${CELL} text-end font-bold text-gray-900`}>—</td>
              <td className={`${CELL} text-end font-bold text-gray-900`}>—</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {!showAllRows && totalPages > 1 ? (
        <div className="-mx-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-5 py-4">
          <p className="text-sm text-gray-700 tabular-nums">
            Page {currentPage + 1} sur {totalPages}
            <span className="ms-2 text-gray-500">
              ({startIndex + 1}–{Math.min(endIndex, schedule.length)} sur{" "}
              {schedule.length})
            </span>
          </p>
          <div className="flex items-center gap-3">
            <Button
              onClick={goToPrevPage}
              disabled={currentPage === 0}
              className={`${PAGE_BUTTON} ps-2.5`}
            >
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </Button>
            <Button
              onClick={goToNextPage}
              disabled={currentPage === totalPages - 1}
              className={`${PAGE_BUTTON} pe-2.5`}
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : null}
    </Card>
  );
};

export default AmortizationTable;
