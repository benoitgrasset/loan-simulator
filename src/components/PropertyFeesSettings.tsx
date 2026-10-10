import { PropertyType } from "../constants";
import { Dialog } from "./ui/Dialog";
import { Input } from "./ui/Input";

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
    <div className="space-y-6">
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-gray-700">
          Frais de notaire
        </legend>
        <div className="grid grid-cols-2 gap-3">
          {PROPERTY_TYPES.map((type) => (
            <Input
              key={`notary-${type}`}
              label={type}
              value={notaryRates[type]}
              onChange={(value) => onNotaryRateChange(type, value)}
              symbol="%"
              step={0.1}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-gray-700">
          Frais de courtier
        </legend>
        <div className="grid grid-cols-2 gap-3">
          {PROPERTY_TYPES.map((type) => (
            <Input
              key={`broker-${type}`}
              label={type}
              value={brokerFees[type]}
              onChange={(value) => onBrokerFeesChange(type, value)}
              symbol="€"
              step={100}
            />
          ))}
        </div>
      </fieldset>
    </div>
  </Dialog>
);
