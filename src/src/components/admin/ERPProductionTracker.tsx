import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { ERPProductionOrder } from '../../types';
import {
  Factory,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  User,
  Layers,
  Sparkles,
  Scissors,
  Check,
} from 'lucide-react';

export const ERPProductionTracker: React.FC = () => {
  const { productionOrders, updateProductionOrder, addProductionOrder } = useERP();

  const stages: {
    id: ERPProductionOrder['stage'];
    label: string;
    icon: any;
    color: string;
  }[] = [
    { id: 'cutting', label: '1. Pattern Cutting', icon: Scissors, color: 'bg-blue-500' },
    { id: 'embroidery_print', label: '2. Embroidery / Print', icon: Sparkles, color: 'bg-purple-500' },
    { id: 'stitching', label: '3. Machine Stitching', icon: Layers, color: 'bg-indigo-500' },
    { id: 'quality_check', label: '4. QC & Inspection', icon: CheckCircle2, color: 'bg-amber-500' },
    { id: 'ironing_packing', label: '5. Steam & Packing', icon: Clock, color: 'bg-teal-500' },
    { id: 'ready_dispatch', label: '6. Ready for Delivery', icon: Check, color: 'bg-emerald-600' },
  ];

  const handleAdvanceStage = (order: ERPProductionOrder) => {
    const currentIndex = stages.findIndex((s) => s.id === order.stage);
    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1].id;
      const nextProgress = Math.min(100, Math.round(((currentIndex + 2) / stages.length) * 100));
      updateProductionOrder(order.id, {
        stage: nextStage,
        stageProgress: nextProgress,
      });
    }
  };

  const handleQuickAddOrder = () => {
    const clientName = prompt('Enter Customer / School Name:', 'Oakridge International School');
    if (!clientName) return;
    const prodName = prompt('Enter Product & Batch Details:', '150x Academic Blazers & Ties');
    if (!prodName) return;
    const qtyStr = prompt('Enter Total Quantity (pcs):', '150');
    const qty = parseInt(qtyStr || '150') || 150;
    const supervisor = prompt('Assign Factory Machine Supervisor:', 'Eunice Cherotich (Senior Machinist)');

    addProductionOrder({
      orderNumber: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: clientName,
      productName: prodName,
      quantity: qty,
      stage: 'cutting',
      stageProgress: 15,
      startDate: new Date().toISOString().split('T')[0],
      targetDeliveryDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      assignedSupervisor: supervisor || 'Factory Floor Lead',
      notes: 'Standard high-count stitching with reinforced bar tacks.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
            Garment Manufacturing & Factory Kanban Board
          </h2>
          <p className="text-xs text-slate-500">
            Real-time shop floor visibility from laser fabric cutting to Tajima embroidery, stitching, and dispatch.
          </p>
        </div>

        <button
          onClick={handleQuickAddOrder}
          className="px-4 py-2.5 bg-[#06163c] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow transition-all inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Production Batch Order</span>
        </button>
      </div>

      {/* Kanban Stage Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stages.map((stage) => {
          const StageIcon = stage.icon;
          const stageOrders = productionOrders.filter((o) => o.stage === stage.id);

          return (
            <div
              key={stage.id}
              className="bg-slate-100/70 p-3.5 rounded-2xl border border-slate-200 flex flex-col space-y-3 min-h-[420px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-1.5">
                  <div className={`p-1.5 rounded-lg text-white ${stage.color}`}>
                    <StageIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-slate-900 text-xs font-['Outfit']">
                    {stage.label}
                  </span>
                </div>
                <span className="bg-white px-2 py-0.5 rounded-full text-[10px] font-mono font-bold text-slate-700 border border-slate-200">
                  {stageOrders.length}
                </span>
              </div>

              {/* Cards list */}
              <div className="flex-1 space-y-2.5 overflow-y-auto">
                {stageOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-xs space-y-2 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-mono font-bold text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                        {ord.orderNumber}
                      </span>
                      <span className="font-bold text-slate-900 text-[11px]">
                        {ord.quantity} pcs
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-xs leading-snug">
                        {ord.customerName}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{ord.productName}</p>
                    </div>

                    {/* Progress slider */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>Progress</span>
                        <span>{ord.stageProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#06163c] h-1.5 rounded-full transition-all"
                          style={{ width: `${ord.stageProgress}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-100 space-y-0.5">
                      <p>Lead: <strong>{ord.assignedSupervisor}</strong></p>
                      <p>Due: <strong>{ord.targetDeliveryDate}</strong></p>
                    </div>

                    {/* Stage Advance Button */}
                    {stage.id !== 'ready_dispatch' && (
                      <button
                        onClick={() => handleAdvanceStage(ord)}
                        className="w-full mt-2 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#06163c] font-bold rounded-lg text-[10px] flex items-center justify-center gap-1 transition-colors"
                      >
                        <span>Move to Next Stage</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
