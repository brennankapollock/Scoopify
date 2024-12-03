import React from 'react';
import { Plus, Pencil, Bone, PawPrint } from 'lucide-react';

interface DogProfile {
  id: string;
  name: string;
  breed: string;
  image: string;
  treats: boolean;
}

const DogProfiles = () => {
  const [dogs, setDogs] = React.useState<DogProfile[]>([
    {
      id: '1',
      name: 'Max',
      breed: 'Golden Retriever',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2324&q=80',
      treats: true,
    },
    {
      id: '2',
      name: 'Bella',
      breed: 'German Shepherd',
      image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      treats: false,
    },
  ]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Your Dogs</h2>
          <p className="text-sm text-gray-500">Manage your pets' profiles</p>
        </div>
        <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-full hover:bg-primary-100 transition-colors">
          <Plus size={16} className="mr-1" />
          Add Dog
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {dogs.map((dog) => (
          <div key={dog.id} className="relative group">
            <div className="flex flex-col items-center">
              {/* Circular Image with Playful Border */}
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-300 to-primary-600 rounded-full transform rotate-6 scale-105" />
                <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <div className="w-full h-full relative">
                    <img
                      src={dog.image}
                      alt={dog.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
                {/* Edit Button */}
                <button className="absolute -right-2 -bottom-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <Pencil size={14} className="text-primary-600" />
                </button>
              </div>

              {/* Dog Info with Playful Icons */}
              <div className="mt-4 text-center">
                <h3 className="text-base font-medium text-gray-900 flex items-center justify-center gap-1">
                  <PawPrint size={16} className="text-primary-500" />
                  {dog.name}
                </h3>
                <p className="text-sm text-gray-500">{dog.breed}</p>
                {dog.treats && (
                  <span className="inline-flex items-center px-2 py-1 mt-2 text-xs font-medium text-primary-700 bg-primary-50 rounded-full">
                    <Bone size={12} className="mr-1" />
                    Treats Enabled
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Add Dog Card */}
        <button className="flex flex-col items-center justify-center h-full aspect-square border-2 border-dashed border-primary-200 rounded-2xl hover:border-primary-300 hover:bg-primary-50 transition-all">
          <div className="w-24 h-24 rounded-full bg-primary-50 flex items-center justify-center">
            <Plus size={24} className="text-primary-400" />
          </div>
          <span className="mt-4 text-sm font-medium text-primary-600">Add Dog</span>
          <span className="text-xs text-primary-400">Upload photo</span>
        </button>
      </div>
    </div>
  );
};

export default DogProfiles;