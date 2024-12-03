import React from 'react';

const TopPerformers = () => {
  const customers = [
    {
      name: 'John Smith',
      revenue: '$2,450',
      loyalty: '2 years',
      status: 'Premium',
    },
    {
      name: 'Sarah Johnson',
      revenue: '$2,100',
      loyalty: '1.5 years',
      status: 'Premium',
    },
    {
      name: 'Mike Wilson',
      revenue: '$1,950',
      loyalty: '1 year',
      status: 'Standard',
    },
  ];

  const employees = [
    {
      name: 'David Brown',
      score: 95,
      routes: 12,
      rating: 4.9,
    },
    {
      name: 'Lisa Anderson',
      score: 92,
      routes: 10,
      rating: 4.8,
    },
    {
      name: 'James Miller',
      score: 88,
      routes: 11,
      rating: 4.7,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
      {/* Top Customers */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Top Customers</h2>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 sm:py-3 px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Name
                  </th>
                  <th className="text-left py-2 sm:py-3 px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Revenue
                  </th>
                  <th className="text-left py-2 sm:py-3 px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Loyalty
                  </th>
                  <th className="text-left py-2 sm:py-3 px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr
                    key={customer.name}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-gray-900">
                      {customer.name}
                    </td>
                    <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-gray-500">
                      {customer.revenue}
                    </td>
                    <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-gray-500">
                      {customer.loyalty}
                    </td>
                    <td className="py-2 sm:py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${
                          customer.status === 'Premium'
                            ? 'bg-primary-100 text-primary-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {customer.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Top Employees */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Top Employees</h2>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 sm:py-3 px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Name
                  </th>
                  <th className="text-left py-2 sm:py-3 px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Score
                  </th>
                  <th className="text-left py-2 sm:py-3 px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Routes
                  </th>
                  <th className="text-left py-2 sm:py-3 px-4 text-xs sm:text-sm font-medium text-gray-500">
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr
                    key={employee.name}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-gray-900">
                      {employee.name}
                    </td>
                    <td className="py-2 sm:py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-primary-100 text-primary-800">
                        {employee.score}
                      </span>
                    </td>
                    <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-gray-500">
                      {employee.routes}
                    </td>
                    <td className="py-2 sm:py-3 px-4 text-xs sm:text-sm text-gray-500">
                      {employee.rating}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopPerformers;