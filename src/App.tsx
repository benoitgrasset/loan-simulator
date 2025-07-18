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
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Simulateur Financier Immobilier
              </h1>
            </div>

            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <TabButton
                isActive={activeTab === "loan"}
                onClick={() => setActiveTab("loan")}
                icon={Calculator}
                activeColor="blue"
              >
                Crédit Immobilier
              </TabButton>
              <TabButton
                isActive={activeTab === "investment"}
                onClick={() => setActiveTab("investment")}
                icon={Building2}
                activeColor="green"
              >
                Investissement De Normandie
              </TabButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "loan" ? <LoanSimulator /> : <InvestmentSimulator />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              Simulateur Financier Immobilier - Outil d'aide à la décision
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Les calculs sont donnés à titre indicatif et ne constituent pas un
              engagement contractuel
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
