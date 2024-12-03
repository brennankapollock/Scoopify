import React from 'react';
import { Plus, Check } from 'lucide-react';

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  selected: boolean;
}

const AddOnsSection = () => {
  const [addOns, setAddOns] = React.useState<AddOn[]>([
    {
      id: '1',
      name: 'Yard Deodorizer',
      description: 'Keep your yard fresh and clean',
      price: 9.99,
      selected: false,
    },
    {
      id: '2',
      name: 'Pet Treats',
      description: 'Premium treats for your furry friends',
      price: 4.99,
      selected: true,
    },
    {
      id: '3',
      name: 'Sanitizer Treatment',
      description: 'Extra protection for your family',
      price: 14.99,
      selected: false,
    },
  ]);

  const toggleAddOn = (id: string) => {
    setAddOns(addOns.map(addon =>
      addon.id === id ? { ...addon, selected: !addon.selected } : addon
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Add-ons</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {addOns.map((addon) => (
          <div
            key={addon.id}
            onClick={() => toggleAddOn(addon.id)}
            className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
              addon.selected
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-primary-200'
            }`}
          >
            {addon.selected && (
              <div className="absolute top-2 right-2">
                <Check className="text-primary-600" size={16} />
              </div>
            )}
            
            <h3 className="text-sm font-medium text-gray-900">{addon.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{addon.description}</p>
            <p className="text-sm font-medium text-primary-600 mt-2">
              ${addon.price.toFixed(2)}/mo
            </p>
          </div>
        ))}

        <button className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-300 hover:bg-primary-50 transition-all">
          <Plus className="text-gray-400" size={24} />
          <span className="text-sm font-medium text-gray-900 mt-2">Custom Add-on</span>
          <span className="text-xs text-gray-500">Contact us to request</span>
        </button>
      </div>
    </div>
  );
};

export default AddOnsSection;