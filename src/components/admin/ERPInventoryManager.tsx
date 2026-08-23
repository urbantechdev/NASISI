import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { formatKsh } from '../../utils/currency';
import { ERPInventoryItem } from '../../types';
import {
  Boxes,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Trash2,
  Edit2,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';

interface ERPInventoryManagerProps {
  onOpenAddStockModal: () => void;
}

export const ERPInventoryManager: React.FC<ERPInventoryManagerProps> = ({
  onOpenAddStockModal,
}) => {
  const { inventory, adjustStock, deleteInventoryItem } = useERP();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Total valuation
  const totalStockCount = inventory.reduce((sum, i) => sum + i.stockOnHand, 0);
  const totalCostValue = inventory.reduce((sum, i) => sum + i.stockOnHand * i.unitCost, 0);
  const totalSalesValue = inventory.reduce((sum, i) => sum + i.stockOnHand * i.sellingPrice, 0);

  const filteredItems = inventory.filter((item) => {
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.supplier && item.supplier.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const handleQuickAdjust = (item: ERPInventoryItem, isAddition: boolean) => {
    const promptDelta = prompt(
      `${isAddition ? 'Add to' : 'Deduct from'} stock for ${item.name} (${item.sku}):`,
      '10'
    );
    if (!promptDelta) return;
    const delta = parseInt(promptDelta);
    if (isNaN(delta) || delta <= 0) {
      alert('Please enter a valid positive number.');
      return;
    }
    adjustStock(item.id, isAddition ? delta : -delta);
  };

  return (
    <div className="space-y-6">
      {/* Valuation & Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Inventory Valuation (Selling Value)
          </span>
          <span className="text-2xl font-black text-[#032345] font-['Outfit'] block">
            {formatKsh(totalSalesValue)}
          </span>
          <span className="text-[11px] text-slate-500">Cost Basis: {formatKsh(totalCostValue)}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Units in Warehouse
          </span>
          <span className="text-2xl font-black text-slate-900 font-['Outfit'] block">
            {totalStockCount.toLocaleString()} units
          </span>
          <span className="text-[11px] text-slate-500">Across {inventory.length} distinct SKUs</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Low Stock Reorder Alerts
          </span>
          <span className="text-2xl font-black text-amber-600 font-['Outfit'] block">
            {inventory.filter((i) => i.status === 'low_stock' || i.status === 'out_of_stock').length} Items
          </span>
          <span className="text-[11px] text-amber-700">Requires factory replenishment</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Stock Reserved for Orders
          </span>
          <span className="text-2xl font-black text-blue-700 font-['Outfit'] block">
            {inventory.reduce((sum, i) => sum + i.stockReserved, 0)} units
          </span>
          <span className="text-[11px] text-slate-500">Allocated to current batch runs</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
              Raw Materials & Finished Garments Inventory
            </h2>
            <p className="text-xs text-slate-500">
              Track finished uniforms, poly-viscose fabrics, knitwear yarns, trims, and packaging in Kenyan Shillings.
            </p>
          </div>

          <button
            onClick={onOpenAddStockModal}
            className="px-4 py-2.5 bg-[#032345] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow transition-all inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add SKU / Material</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by SKU, Material name, Shelf location or Supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs scrollbar-none">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'finished_garment', label: 'Finished Garments' },
              { id: 'raw_fabric', label: 'Raw Fabrics' },
              { id: 'yarn_knit', label: 'Knitwear Yarn' },
              { id: 'accessories', label: 'Trims & Embroidery' },
              { id: 'packaging', label: 'Packaging' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                  categoryFilter === cat.id
                    ? 'bg-[#032345] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stock Items Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">SKU / Item Name</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3 text-center">Stock on Hand</th>
                <th className="py-3 px-3 text-center">Reserved</th>
                <th className="py-3 px-3 text-right">Cost Price (Ksh)</th>
                <th className="py-3 px-3 text-right">Selling Price (Ksh)</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Quick Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-500">
                    No inventory items found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block text-xs">{item.name}</span>
                      <span className="font-mono text-slate-400 text-[10px] block">
                        SKU: {item.sku} {item.size && `• Size: ${item.size}`} {item.color && `• Color: ${item.color}`}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-700 uppercase">
                        {item.categoryLabel}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center font-mono font-black text-sm text-slate-900">
                      {item.stockOnHand} <span className="text-[10px] font-normal text-slate-500">{item.unit}</span>
                    </td>

                    <td className="py-3 px-3 text-center font-mono text-xs text-blue-700 font-bold">
                      {item.stockReserved}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-slate-600">
                      {formatKsh(item.unitCost)}
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      {formatKsh(item.sellingPrice)}
                    </td>

                    <td className="py-3 px-3 text-[11px] text-slate-600">
                      {item.location}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          item.status === 'in_stock'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'low_stock'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleQuickAdjust(item, true)}
                          className="p-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded font-bold text-xs"
                          title="Restock (+ Units)"
                        >
                          + Add
                        </button>
                        <button
                          onClick={() => handleQuickAdjust(item, false)}
                          className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded font-bold text-xs"
                          title="Issue to Factory / Dispatch (- Units)"
                        >
                          - Issue
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete ${item.name}?`)) {
                              deleteInventoryItem(item.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 rounded"
                          title="Delete SKU"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
