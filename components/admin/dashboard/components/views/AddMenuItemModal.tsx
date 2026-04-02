"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { X } from "lucide-react";
import RegularButton from "@/app/components/RegularButton";

type AddItemType = "meal" | "drink" | "deal";

interface AddMenuItemModalProps {
  restaurantId: string;
  type: AddItemType;
  onClose: () => void;
  onSave: () => void;
}

const typeToCategory: Record<AddItemType, string> = {
  meal: "meals",
  drink: "drinks",
  deal: "special_deals",
};

const typeLabel: Record<AddItemType, string> = {
  meal: "Meal",
  drink: "Drink",
  deal: "Special Deal",
};

const AddMenuItemModal = ({ restaurantId, type, onClose, onSave }: AddMenuItemModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    specialPrice: "",
    mealType: "Vegan",
    quantity: "1",
    image: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = event.target as HTMLInputElement;
    if (target.type === "file" && target.files) {
      setFormData((prev) => ({ ...prev, image: target.files?.[0] ?? null }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token =
        localStorage.getItem("accessToken") || localStorage.getItem("auth_token");

      if (!token) {
        throw new Error("Missing authentication token");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("specialPrice", formData.specialPrice || "0");
      formDataToSend.append("category", typeToCategory[type]);
      formDataToSend.append("mealType", formData.mealType);
      formDataToSend.append("quantity", formData.quantity);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await fetch(`/api/restaurants/${restaurantId}/menu`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error?.message || "Failed to add menu item");
      }

      onSave();
      onClose();
    } catch (submitError: any) {
      console.error("Error adding menu item:", submitError);
      setError(submitError.message || "Failed to add menu item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-[900px] max-h-[90vh] overflow-y-auto rounded-none sm:rounded-lg shadow-xl bg-[#E8D7B4] text-black p-3 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[10px] sm:text-lg font-bold text-red-900">
            Add {typeLabel[type]}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-black hover:text-red-700"
            aria-label="Close add menu item modal"
          >
            <X size={18} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-3 rounded border border-red-300 bg-red-100 p-2 text-[9px] sm:text-xs text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <label className="block text-[9px] sm:text-xs font-bold">Image</label>
            <div className="w-full h-28 sm:h-44 bg-yellow-100 border border-white rounded-md sm:rounded-xl flex items-center justify-center overflow-hidden">
              {formData.image ? (
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Menu item preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[8px] sm:text-xs text-gray-600">No image selected</span>
              )}
            </div>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleInputChange}
              className="w-full text-[9px] sm:text-xs"
            />
          </div>

          <div className="space-y-2">
            <div>
              <label className="block text-[9px] sm:text-xs font-bold mb-1">{typeLabel[type]} Title</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                maxLength={50}
                className="w-full rounded-md sm:rounded-xl border border-amber-300 px-2 sm:px-3 py-1 sm:py-2 text-[9px] sm:text-xs bg-white"
              />
            </div>
            <div>
              <label className="block text-[9px] sm:text-xs font-bold mb-1">{typeLabel[type]} Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                maxLength={250}
                rows={3}
                className="w-full rounded-md sm:rounded-xl border border-amber-300 px-2 sm:px-3 py-1 sm:py-2 text-[9px] sm:text-xs bg-white resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[9px] sm:text-xs font-bold mb-1">Meal Type</label>
                <select
                  name="mealType"
                  value={formData.mealType}
                  onChange={handleInputChange}
                  className="w-full rounded-md sm:rounded-xl border border-amber-300 px-2 py-1 text-[9px] sm:text-xs bg-white"
                >
                  <option value="Vegan">Vegan</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] sm:text-xs font-bold mb-1">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className="w-full rounded-md sm:rounded-xl border border-amber-300 px-2 py-1 text-[9px] sm:text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-[9px] sm:text-xs font-bold mb-1">Regular Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="4"
                  step="0.01"
                  required
                  className="w-full rounded-md sm:rounded-xl border border-amber-300 px-2 py-1 text-[9px] sm:text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-[9px] sm:text-xs font-bold mb-1">Special Price</label>
                <input
                  type="number"
                  name="specialPrice"
                  value={formData.specialPrice}
                  onChange={handleInputChange}
                  step="0.01"
                  className="w-full rounded-md sm:rounded-xl border border-amber-300 px-2 py-1 text-[9px] sm:text-xs bg-white"
                />
              </div>
            </div>
          </div>

          <div className="sm:col-span-2 flex flex-wrap gap-2 pt-1">
            <RegularButton
              type="submit"
              disabled={loading}
              text={loading ? "Submitting..." : "SUBMIT FOR REVIEW"}
              fillColor="#b45309"
              borderColor="#b45309"
              fontSize="text-[8px] sm:text-[10px]"
              padding="py-0.5 px-2 sm:py-1 sm:px-4"
            />
            <RegularButton
              type="button"
              onClick={onClose}
              text="CANCEL"
              fillColor="#a16207"
              borderColor="#a16207"
              fontSize="text-[8px] sm:text-[10px]"
              padding="py-0.5 px-2 sm:py-1 sm:px-4"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMenuItemModal;
