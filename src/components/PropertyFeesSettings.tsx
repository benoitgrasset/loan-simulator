import { PropertyType } from "../constants";
import { Dialog } from "./ui/Dialog";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";

type Props = {
  open: boolean;
  onClose: () => void;
  notaryRates: Record<PropertyType, number>;
  brokerFees: Record<PropertyType, number>;
  onNotaryRateChange: (propertyType: PropertyType, value: number) => void;
  onBrokerFeesChange: (propertyType: PropertyType, value: number) => void;
};

const PROPERTY_TYPES: PropertyType[] = ["Neuf", "Ancien"];

export const PropertyFeesSettings = ({
  open,
  onClose,
  notaryRates,
  brokerFees,
  onNotaryRateChange,
  onBrokerFeesChange,
}: Props) => (
  <Dialog open={open} title="Frais selon le type de bien" onClose={onClose}>
    <div className="space-y-5">
      <section className="space-y-3">
        <h4 className="text-sm font-bold text-gray-700">
          Frais de notaire
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {PROPERTY_TYPES.map((type) => (
            <div key={`notary-${type}`}>
              <Label>{type}</Label>
              <Input
                value={notaryRates[type]}
                onChange={(value) => onNotaryRateChange(type, value)}
                symbol="%"
                step={0.1}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="text-sm font-bold text-gray-700">
          Frais de courtier
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {PROPERTY_TYPES.map((type) => (
            <div key={`broker-${type}`}>
              <Label>{type}</Label>
              <Input
                value={brokerFees[type]}
                onChange={(value) => onBrokerFeesChange(type, value)}
                symbol="€"
                step={100}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  </Dialog>
);
