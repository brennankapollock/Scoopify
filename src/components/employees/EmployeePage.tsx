import React, { useState, useEffect } from 'react';
import { Plus, Search, SlidersHorizontal, Send } from 'lucide-react';
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/auth';
import EmployeeCard from './EmployeeCard';
import EmployeeDialog from './EmployeeDialog';
import InviteDialog from './InviteDialog';
import FilterDialog from './FilterDialog';
import { Employee } from './types';

const EmployeePage = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEmployees = async () => {
      if (!user?.businessId) return;

      try {
        setError(null);
        const employeesRef = collection(db, 'businesses', user.businessId, 'employees');
        const employeesSnapshot = await getDocs(query(employeesRef));
        
        const loadedEmployees = employeesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Employee[];

        setEmployees(loadedEmployees);
      } catch (err) {
        console.error('Error loading employees:', err);
        setError('Failed to load employees. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, [user?.businessId]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSaveEmployee = async (employee: Employee) => {
    if (!user?.businessId) return;

    try {
      setError(null);

      if (employee.id) {
        // Update existing employee
        const employeeRef = doc(db, 'businesses', user.businessId, 'employees', employee.id);
        await updateDoc(employeeRef, {
          ...employee,
          updatedAt: new Date().toISOString()
        });

        // Update local state
        setEmployees(prev => prev.map(emp => 
          emp.id === employee.id ? employee : emp
        ));
      }

      setSelectedEmployee(null);
    } catch (err) {
      console.error('Error saving employee:', err);
      throw new Error('Failed to save employee changes');
    }
  };

  const handleInvite = async (invite: { email: string; firstName: string; position: string }) => {
    if (!user?.businessId) return;

    try {
      // Here you would typically send the invite via your backend API
      console.log('Sending invite to:', invite);
      
      // For demo purposes, show a success message
      alert(`Invitation sent to ${invite.email}`);
      setIsInviteOpen(false);
    } catch (err) {
      console.error('Error sending invite:', err);
      alert('Failed to send invitation. Please try again.');
    }
  };

  const filteredEmployees = employees.filter(employee =>
    employee.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
          Employees
        </h1>
        <p className="text-sm sm:text-base text-gray-500">
          Manage your team members and their performance
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search employees..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal size={20} className="mr-2" />
            Filters
          </button>
          <button
            onClick={() => setIsInviteOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            <Send size={20} className="mr-2" />
            Invite Member
          </button>
        </div>
      </div>

      {/* Employee Grid */}
      {filteredEmployees.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col items-center">
            <Users size={48} className="text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Employees Yet</h3>
            <p className="text-gray-500 mb-6">
              Start by inviting team members to join your business
            </p>
            <button
              onClick={() => setIsInviteOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Invite First Employee
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredEmployees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onClick={() => setSelectedEmployee(employee)}
            />
          ))}
        </div>
      )}

      {/* Employee Dialog */}
      <EmployeeDialog
        isOpen={selectedEmployee !== null}
        onClose={() => setSelectedEmployee(null)}
        employee={selectedEmployee}
        onSave={handleSaveEmployee}
      />

      {/* Invite Dialog */}
      <InviteDialog
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onInvite={handleInvite}
      />

      {/* Filter Dialog */}
      <FilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
    </div>
  );
};

export default EmployeePage;