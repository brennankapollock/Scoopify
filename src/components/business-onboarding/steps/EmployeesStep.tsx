import React, { useState } from 'react';
import { Users, Plus, X } from 'lucide-react';
import { BusinessOnboardingData } from '../types';

interface EmployeesStepProps {
  onNext: (data: Partial<BusinessOnboardingData>) => void;
  onBack: () => void;
  data: BusinessOnboardingData;
}

const roles = [
  'Route Manager',
  'Senior Technician',
  'Yard Technician',
  'Team Lead',
];

const EmployeesStep: React.FC<EmployeesStepProps> = ({ onNext, onBack, data }) => {
  const [formData, setFormData] = useState({
    employees: data.employees,
  });

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    zones: [] as string[],
  });

  const [newZone, setNewZone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const addEmployee = () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.role) return;

    setFormData(prev => ({
      ...prev,
      employees: [...prev.employees, { ...newEmployee }],
    }));

    setNewEmployee({
      name: '',
      email: '',
      phone: '',
      role: '',
      zones: [],
    });
  };

  const removeEmployee = (email: string) => {
    setFormData(prev => ({
      ...prev,
      employees: prev.employees.filter(emp => emp.email !== email),
    }));
  };

  const addZone = () => {
    if (!newZone.trim()) return;
    setNewEmployee(prev => ({
      ...prev,
      zones: [...prev.zones, newZone.trim()],
    }));
    setNewZone('');
  };

  const removeZone = (zone: string) => {
    setNewEmployee(prev => ({
      ...prev,
      zones: prev.zones.filter(z => z !== zone),
    }));
  };

  return (
    <div>
      <Users size={48} className="mx-auto mb-6 text-primary-600" />
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        Employee Setup
      </h2>
      
      <p className="text-lg text-gray-600 mb-8 text-center">
        Add your team members and their roles
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Add Employee Form */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Add New Employee
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                value={newEmployee.phone}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, phone: e.target.value }))}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                value={newEmployee.role}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, role: e.target.value }))}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">Select role...</option>
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Zones
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newZone}
                onChange={(e) => setNewZone(e.target.value)}
                className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Add zone"
              />
              <button
                type="button"
                onClick={addZone}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {newEmployee.zones.map((zone) => (
                <span
                  key={zone}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-50 text-primary-700"
                >
                  {zone}
                  <button
                    type="button"
                    onClick={() => removeZone(zone)}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={addEmployee}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Add Employee
          </button>
        </div>

        {/* Employee List */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Added Employees
          </h3>
          
          <div className="space-y-3">
            {formData.employees.map((employee) => (
              <div
                key={employee.email}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{employee.name}</h4>
                  <p className="text-sm text-gray-500">{employee.role}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {employee.zones.map((zone) => (
                      <span
                        key={zone}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700"
                      >
                        {zone}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeEmployee(employee.email)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-6 py-3 text-lg font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all"
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100 transition-all"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeesStep;