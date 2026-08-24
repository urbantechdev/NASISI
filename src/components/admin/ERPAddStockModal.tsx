import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { ERPInventoryItem } from '../../types';
import {
  X,
  Boxes,
  Plus,
  Save,
  Package,
  Layers,
  MapPin,
} from 'lucide-react';

interface ERPAddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ERPAddStockModal: React.FC<ERPAddStockModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addInventoryItem } = useERP();

  const [formData, setFormData] = useState({
    sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
    name: '',
    category: 'finished_garment' as ERPInventoryItem['category'],
    categoryLabel: 'Finished Garments',
    size: 'M',
    color: 'Navy Blue',
    unit: 'pcs',
    stockOnHand: 50,
    stockReserved: 0,
    reorderLevel: 20,
    unitCost: 1500,
    sellingPrice: 2800,
    supplier: 'Kenyan Mills Ltd',
    location: 'Warehouse Bay A-1',
  });

  if (!isOpen) return null;

  const handleCategoryChange = (cat: ERPInventoryItem['category']) => {
    let label = 'Finished Garments';
    let unit = 'pcs';
    if (cat === 'raw_fabric') {
      label = 'Raw Fabrics';
      unit = 'meters';
    } else if (cat === 'yarn_knit') {
      label = 'Knitwear Yarn';
      unit = 'cones';
    } else if (cat === 'accessories') {
      label = 'Trims & Embroidery';
      unit = 'spools';
    } else if (cat === 'packaging') {
      label = 'Packaging';
      unit = 'bags';
    }
    setFormData((prev) => ({ ...prev, category: cat, categoryLabel: label, unit }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sku) {
      alert('Please fill Item Name and SKU.');
      return;
    }

    addInventoryItem({
      sku: formData.sku.toUpperCase(),
      name: formData.name,
      category: formData.category,
      categoryLabel: formData.categoryLabel,
      size: formData.size || undefined,
      color: formData.color || undefined,
      unit: formData.unit,
      stockOnHand: formData.stockOnHand,
      stockReserved: formData.stockReserved,
      reorderLevel: formData.reorderLevel,
      unitCost: formData.unitCost,
      sellingPrice: formData.sellingPrice,
      status:
        formData.stockOnHand <= 0
          ? 'out_of_stock'
          : formData.stockOnHand <= formData.reorderLevel
          ? 'low_stock'
          : 'in_stock',
      supplier: formData.supplier,
      location: formData.location,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-[#032345] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Boxes className="w-5 h-5 text-sky-300" />
            <div>
              <h3 className="font-bold text-base font-['Outfit']">Add New Inventory SKU / Material</h3>
              <p className="text-xs text-blue-200">Catalog fabrics, garments, yarns, trims or packaging</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-blue-200 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Category */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Item Category *</label>
            <select
              value={formData.category}
              onChange={(e) => handleCategoryChange(e.target.value as any)}
              className="w-full p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
            >
              <option value="finished_garment">Finished Garment (Blazers, Shirts, Polos, Trousers)</option>
              <option value="raw_fabric">Raw Fabric (Poly-Viscose, Poplin, Twill, Suiting)</option>
              <option value="yarn_knit">Knitwear Yarn & Spun Acrylic Cones</option>
              <option value="accessories">Trims, Buttons, Zippers & Tajima Embroidery Thread</option>
              <option value="packaging">Packaging Bags & Delivery Polybags</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Item / Material Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Classic Tailored Navy School Blazer"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Stock Keeping Unit (SKU) *
              </label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-mono uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Size / Dimension (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 34, M, or 58-inch roll"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Color / Shade Spec (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Bottle Green / Royal Blue"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Initial Stock on Hand *
              </label>
              <input
                type="number"
                required
                value={formData.stockOnHand}
                onChange={(e) => setFormData({ ...formData, stockOnHand: parseInt(e.target.value) || 0 })}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Unit of Measure
              </label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Unit Cost Price (Ksh) *
              </label>
              <input
                type="number"
                required
                value={formData.unitCost}
                onChange={(e) => setFormData({ ...formData, unitCost: parseFloat(e.target.value) || 0 })}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Selling / Price (Ksh) *
              </label>
              <input
                type="number"
                required
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) || 0 })}
                className="w-full p-2.5 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Warehouse Location Shelf / Bay
              </label>
              <input
                type="text"
                placeholder="e.g. Warehouse Bay A-1"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Supplier Name
              </label>
              <input
                type="text"
                placeholder="e.g. Rivatex / African Cotton"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#032345] hover:bg-blue-900 text-white font-bold rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save SKU to Inventory</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
