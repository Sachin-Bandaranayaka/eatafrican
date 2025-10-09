import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Save, X } from 'lucide-react';

interface City {
  id: string;
  name: string;
  display_order: number;
  is_active: boolean;
}

export const CitiesManagementView = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', display_order: 0 });
  const [isAdding, setIsAdding] = useState(false);
  const [newCity, setNewCity] = useState({ name: '', display_order: 0 });

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await fetch('/api/cities');
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (city: City) => {
    setEditingId(city.id);
    setEditForm({ name: city.name, display_order: city.display_order });
  };

  const handleSave = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/cities/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        await fetchCities();
        setEditingId(null);
      }
    } catch (error) {
      console.error('Error updating city:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this city?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/cities/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchCities();
      }
    } catch (error) {
      console.error('Error deleting city:', error);
    }
  };

  const handleAdd = async () => {
    if (!newCity.name.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/cities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newCity)
      });

      if (response.ok) {
        await fetchCities();
        setIsAdding(false);
        setNewCity({ name: '', display_order: 0 });
      }
    } catch (error) {
      console.error('Error adding city:', error);
    }
  };

  if (loading) {
    return <div className="p-4">Loading cities...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <p className="text-xs text-gray-600">
          Manage delivery cities. These cities will appear in restaurant registration and driver pickup zones.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">City Name</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Display Order</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cities.map((city) => (
              <tr key={city.id} className="border-b hover:bg-gray-50">
                {editingId === city.id ? (
                  <>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-2 py-1 border rounded text-sm text-gray-900"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={editForm.display_order}
                        onChange={(e) => setEditForm({ ...editForm, display_order: parseInt(e.target.value) })}
                        className="w-20 px-2 py-1 border rounded text-sm text-gray-900"
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleSave(city.id)}
                        className="text-green-600 hover:text-green-800 mr-2"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <X size={16} />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 font-medium text-gray-900">{city.name}</td>
                    <td className="px-4 py-3 text-gray-700">{city.display_order}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleEdit(city)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(city.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {isAdding && (
              <tr className="border-b bg-blue-50">
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={newCity.name}
                    onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
                    placeholder="City name"
                    className="w-full px-2 py-1 border rounded text-sm text-gray-900"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={newCity.display_order}
                    onChange={(e) => setNewCity({ ...newCity, display_order: parseInt(e.target.value) })}
                    className="w-20 px-2 py-1 border rounded text-sm text-gray-900"
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={handleAdd}
                    className="text-green-600 hover:text-green-800 mr-2"
                  >
                    <Save size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setIsAdding(false);
                      setNewCity({ name: '', display_order: 0 });
                    }}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <X size={16} />
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="mt-4 flex items-center gap-2 bg-orange-500 text-white font-bold py-2 px-4 rounded-lg text-sm hover:bg-orange-600"
        >
          <Plus size={16} />
          Add New City
        </button>
      )}
    </div>
  );
};
