import { ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { AmortizationRow } from "../types";
import { formatCurrency } from "../utils/calculations";
import TableHeader from "./ui/TableHeader";

interface AmortizationTableProps {
  schedule: AmortizationRow[];
}

const AmortizationTable: React.FC<AmortizationTableProps> = ({ schedule }) => {
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
    0
  );
  const totalPrincipal = schedule.reduce(
    (sum, row) => sum + row.principalPayment,
    0
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
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Tableau d'amortissement
          </h3>
          <button
            onClick={() => setShowAllRows(!showAllRows)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            {showAllRows ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            {showAllRows ? "Vue paginée" : "Voir tout"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader align="left">Mois</TableHeader>
              <TableHeader align="right">Mensualité</TableHeader>
              <TableHeader align="right">Intérêts</TableHeader>
              <TableHeader align="right">Capital</TableHeader>
              <TableHeader align="right">Capital restant</TableHeader>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentRows.map((row, index) => (
              <tr
                key={row.month}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {row.month}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                  {formatCurrency(row.monthlyPayment)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-right">
                  {formatCurrency(row.interestPayment)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 text-right">
                  {formatCurrency(row.principalPayment)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                  {formatCurrency(row.remainingBalance)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100">
            <tr>
              <td className="px-6 py-4 text-sm font-bold text-gray-900">
                Total
              </td>
              <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                {formatCurrency(totalPrincipal + totalInterest)}
              </td>
              <td className="px-6 py-4 text-sm font-bold text-red-600 text-right">
                {formatCurrency(totalInterest)}
              </td>
              <td className="px-6 py-4 text-sm font-bold text-green-600 text-right">
                {formatCurrency(totalPrincipal)}
              </td>
              <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                -
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {!showAllRows && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page {currentPage + 1} sur {totalPages}
              <span className="ml-2 text-gray-500">
                ({startIndex + 1}-{Math.min(endIndex, schedule.length)} sur{" "}
                {schedule.length})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 0}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Précédent
              </button>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages - 1}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmortizationTable;
