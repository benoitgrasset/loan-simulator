import { Building2, Calculator } from "lucide-react";
import { useState } from "react";
import InvestmentSimulator from "./components/InvestmentSimulator";
import LoanSimulator from "./components/LoanSimulator";
import TabButton from "./components/ui/TabButton";

function App() {
  const [activeTab, setActiveTab] = useState<"loan" | "investment">("loan");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3 sm:px-6 lg:px-8">
          <p className="text-xl font-bold tracking-[-0.01em] text-gray-900">
            Simulateur financier immobilier
          </p>

          <div className="flex gap-1 rounded-[10px] bg-gray-100 p-1">
            <TabButton
              isActive={activeTab === "loan"}
              onClick={() => setActiveTab("loan")}
              icon={Calculator}
              activeColor="blue"
            >
              Crédit immobilier
            </TabButton>
            <TabButton
              isActive={activeTab === "investment"}
              onClick={() => setActiveTab("investment")}
              icon={Building2}
              activeColor="green"
            >
              Investissement Denormandie
            </TabButton>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {activeTab === "loan" ? <LoanSimulator /> : <InvestmentSimulator />}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-gray-600">
            Simulateur financier immobilier — outil d’aide à la décision
          </p>
          <p className="mt-2 text-xs text-gray-500 text-pretty">
            Les calculs sont donnés à titre indicatif et ne constituent pas un
            engagement contractuel.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
