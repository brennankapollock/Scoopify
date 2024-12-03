import React from 'react';
import { BusinessOnboardingData } from '../../../../types/business';
import { Plus, X } from 'lucide-react';

interface EmployeesSectionProps {
  data: BusinessOnboardingData;
  onChange: (data: BusinessOnboardingData) => void;
}

const EmployeesSection: React.FC<EmployeesSectionProps> = ({ data, onChange }) => {
  const addEmployee = () => {
    onChange({
      ...data,
      employees: [
        ...data.employees,
        {
          name: '',
          email: '',
          phone: '',
          role: '',
          zones: [],
        }
      ]
    });
  };

  const removeEmployee = (index: number) => {
    onChange({
      ...data,
      employees: data.employees.filter((_, i) => i !== index)
    });
  };

  const updateEmployee = (index: number, field: string, value: string) => {
    onChange({
      ...data,
      employees: data.employees.map((emp, i) => 
        i === index ? { ...emp, [field]: value } : emp
      )
    });
  };

  const updateEmployeeZones = (index: number, zone: string) => {
    const employee = data.employees[index];
    const newZones = employee.zones.includes(zone)
      ? employee.zones.filter(z => z !== zone)
      : [...employee.zones, zone];

    onChange({
      ...data,
      employees: data.employees.map((emp, i) =>
        i === index ? { ...emp, zones: newZones } : emp
      )
    });
  };

  return (
    <div className="space-y-6">
      {data.employees.map((employee, index) => (
        <div
          key={index}
          className="p-4 border border-gray-200 rounded-lg space-y-4"
        >
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-gray-900">Employee {index + 1}</h4>
            <button
              type="button"
              onClick={() => removeEmployee(index)}
              className="text-gray-400 hover:text-red-500"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={employee.name}
                onChange={(e) => updateEmployee(index, 'name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={employee.email}
                onChange={(e) => updateEmployee(index, 'email', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={employee.phone}
                onChange={(e) => updateEmployee(index, 'phone', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                value={employee.role}
                onChange={(e) => updateEmployee(index, 'role', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">Select role...</option>
                <option value="Route Manager">Route Manager</option>
                <option value="Senior Technician">Senior Technician</option>
                <option value="Yard Technician">Yard Technician</option>
                <option value="Team Lead">Team Lead</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Zones</label>
            <div className="flex flex-wrap gap-2">
              {data.serviceArea.zipCodes.map((zipCode) => (
                <label
                  key={zipCode}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                    employee.zones.includes(zipCode)
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={employee.zones.includes(zipCode)}
                    onChange={() => updateEmployeeZones(index, zipCode)}
                    className="sr-only"
                  />
                  {zipCode}
                </label>
              ))}
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addEmployee}
        className="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-500 hover:text-primary-500"
      >
        <Plus size={20} className="mr-2" />
        Add Employee
      </button>
    </div>
  );
};

export default EmployeesSection;