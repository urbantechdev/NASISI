import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ERPBusinessProfile,
  ERPCustomer,
  ERPDocument,
  ERPDocumentType,
  ERPInventoryItem,
  ERPPaymentTransaction,
  ERPProductionOrder,
} from '../types';
import {
  INITIAL_BUSINESS_PROFILE,
  INITIAL_CUSTOMERS,
  INITIAL_DOCUMENTS,
  INITIAL_INVENTORY,
  INITIAL_PRODUCTION_ORDERS,
  INITIAL_TRANSACTIONS,
} from '../data/erpInitialData';

interface ERPContextType {
  // Data
  businessProfile: ERPBusinessProfile;
  customers: ERPCustomer[];
  documents: ERPDocument[];
  transactions: ERPPaymentTransaction[];
  inventory: ERPInventoryItem[];
  productionOrders: ERPProductionOrder[];

  // Document Operations
  createDocument: (doc: Omit<ERPDocument, 'id' | 'createdAt' | 'updatedAt'>) => ERPDocument;
  updateDocument: (id: string, updates: Partial<ERPDocument>) => void;
  deleteDocument: (id: string) => void;
  convertQuotationToInvoice: (quotationId: string) => ERPDocument | null;
  createDeliveryNoteFromInvoice: (invoiceId: string) => ERPDocument | null;
  createReceiptFromInvoice: (invoiceId: string, amount: number, method: ERPPaymentTransaction['method'], mpesaOrBankRef?: string) => ERPDocument | null;

  // Transaction / Payment Operations
  recordPayment: (payment: Omit<ERPPaymentTransaction, 'id' | 'createdAt'>) => ERPPaymentTransaction;
  reconcileMpesaPayment: (mpesaCode: string, invoiceNumber: string, amount: number, senderPhone: string, senderName: string) => boolean;

  // Inventory Operations
  addInventoryItem: (item: Omit<ERPInventoryItem, 'id'>) => ERPInventoryItem;
  updateInventoryItem: (id: string, updates: Partial<ERPInventoryItem>) => void;
  adjustStock: (id: string, delta: number, reason?: string) => void;
  deleteInventoryItem: (id: string) => void;

  // Customer Operations
  addCustomer: (customer: Omit<ERPCustomer, 'id' | 'createdAt'>) => ERPCustomer;
  updateCustomer: (id: string, updates: Partial<ERPCustomer>) => void;
  deleteCustomer: (id: string) => void;

  // Production Orders
  addProductionOrder: (order: Omit<ERPProductionOrder, 'id'>) => ERPProductionOrder;
  updateProductionOrder: (id: string, updates: Partial<ERPProductionOrder>) => void;
  deleteProductionOrder: (id: string) => void;

  // Profile Settings
  updateBusinessProfile: (updates: Partial<ERPBusinessProfile>) => void;
  resetToDefaultData: () => void;
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'nasisi_erp_profile_v2',
  CUSTOMERS: 'nasisi_erp_customers_v2',
  DOCUMENTS: 'nasisi_erp_documents_v2',
  TRANSACTIONS: 'nasisi_erp_transactions_v2',
  INVENTORY: 'nasisi_erp_inventory_v2',
  PRODUCTION: 'nasisi_erp_production_v2',
};

export const ERPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [businessProfile, setBusinessProfile] = useState<ERPBusinessProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return saved ? JSON.parse(saved) : INITIAL_BUSINESS_PROFILE;
  });

  const [customers, setCustomers] = useState<ERPCustomer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [documents, setDocuments] = useState<ERPDocument[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [transactions, setTransactions] = useState<ERPPaymentTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [inventory, setInventory] = useState<ERPInventoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [productionOrders, setProductionOrders] = useState<ERPProductionOrder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTION);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTION_ORDERS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(businessProfile));
  }, [businessProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTION, JSON.stringify(productionOrders));
  }, [productionOrders]);

  // Document Operations
  const createDocument = (docData: Omit<ERPDocument, 'id' | 'createdAt' | 'updatedAt'>): ERPDocument => {
    const newDoc: ERPDocument = {
      ...docData,
      id: `doc-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDocuments((prev) => [newDoc, ...prev]);

    // Update customer spend/balance if it's an invoice
    if (newDoc.type === 'invoice' && newDoc.customerId) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === newDoc.customerId
            ? {
                ...c,
                totalOrdersCount: c.totalOrdersCount + 1,
                totalSpendKsh: c.totalSpendKsh + newDoc.totalAmount,
                outstandingBalanceKsh: c.outstandingBalanceKsh + newDoc.balanceDue,
              }
            : c
        )
      );
    }

    return newDoc;
  };

  const updateDocument = (id: string, updates: Partial<ERPDocument>) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : doc
      )
    );
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const convertQuotationToInvoice = (quotationId: string): ERPDocument | null => {
    const quote = documents.find((d) => d.id === quotationId);
    if (!quote) return null;

    const invoiceNumber = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().split('T')[0];
    const dueDate = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

    const newInvoice: ERPDocument = {
      ...quote,
      id: `doc-inv-${Date.now()}`,
      type: 'invoice',
      docNumber: invoiceNumber,
      title: quote.title.replace('Quotation', 'Tax Invoice'),
      status: 'issued',
      issueDate: today,
      dueDate,
      relatedDocNumber: quote.docNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDocuments((prev) => [newInvoice, ...prev]);
    updateDocument(quotationId, { status: 'issued' });
    return newInvoice;
  };

  const createDeliveryNoteFromInvoice = (invoiceId: string): ERPDocument | null => {
    const invoice = documents.find((d) => d.id === invoiceId);
    if (!invoice) return null;

    const dlnNumber = `DLN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().split('T')[0];

    const newDln: ERPDocument = {
      ...invoice,
      id: `doc-dln-${Date.now()}`,
      type: 'delivery_note',
      docNumber: dlnNumber,
      title: `Dispatch Note for ${invoice.customerName}`,
      status: 'dispatched',
      issueDate: today,
      deliveryDate: today,
      deliveryStatus: 'in_transit',
      relatedDocNumber: invoice.docNumber,
      vehicleRegistration: 'KBZ 849X',
      driverName: 'Peter Ochieng',
      driverPhone: '+254 728 901 234',
      dispatchedBy: 'Samson Kimani (Dispatch Supervisor)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDocuments((prev) => [newDln, ...prev]);
    return newDln;
  };

  const createReceiptFromInvoice = (
    invoiceId: string,
    amount: number,
    method: ERPPaymentTransaction['method'],
    mpesaOrBankRef?: string
  ): ERPDocument | null => {
    const invoice = documents.find((d) => d.id === invoiceId);
    if (!invoice) return null;

    const rctNumber = `RCT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().split('T')[0];

    const newReceipt: ERPDocument = {
      id: `doc-rct-${Date.now()}`,
      docNumber: rctNumber,
      type: 'receipt',
      title: `Official Receipt for Payment on ${invoice.docNumber}`,
      status: 'paid',
      issueDate: today,
      customerId: invoice.customerId,
      customerName: invoice.customerName,
      contactPerson: invoice.contactPerson,
      customerEmail: invoice.customerEmail,
      customerPhone: invoice.customerPhone,
      customerKraPin: invoice.customerKraPin,
      customerAddress: invoice.customerAddress,
      customerCity: invoice.customerCity,
      items: [
        {
          id: `li-rct-${Date.now()}`,
          description: `Payment received towards Invoice ${invoice.docNumber} (${invoice.title})`,
          quantity: 1,
          unitPrice: amount,
          total: amount,
          taxRate: 0,
        },
      ],
      subtotal: amount,
      vatRate: 0,
      vatAmount: 0,
      totalAmount: amount,
      amountPaid: amount,
      balanceDue: 0,
      relatedDocNumber: invoice.docNumber,
      mpesaRef: method === 'mpesa' ? mpesaOrBankRef : undefined,
      bankRef: method === 'bank_transfer' ? mpesaOrBankRef : undefined,
      paymentTerms: `Settled via ${method.toUpperCase()} (${mpesaOrBankRef || 'Cash voucher'})`,
      notes: `Received with thanks. Remaining balance on ${invoice.docNumber}: Ksh ${(
        Math.max(0, invoice.balanceDue - amount)
      ).toLocaleString()}.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDocuments((prev) => [newReceipt, ...prev]);

    // Record the matching transaction
    recordPayment({
      transactionNumber: `TXN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      amount,
      method,
      status: 'completed',
      documentId: invoice.id,
      documentNumber: invoice.docNumber,
      customerId: invoice.customerId,
      customerName: invoice.customerName,
      mpesaCode: method === 'mpesa' ? mpesaOrBankRef : undefined,
      mpesaType: 'paybill',
      bankName: method === 'bank_transfer' ? 'Equity Bank Kenya' : undefined,
      bankTransactionRef: method === 'bank_transfer' ? mpesaOrBankRef : undefined,
      receiptId: newReceipt.id,
      notes: `Payment for Invoice ${invoice.docNumber}`,
    });

    return newReceipt;
  };

  // Record Payment
  const recordPayment = (
    paymentData: Omit<ERPPaymentTransaction, 'id' | 'createdAt'>
  ): ERPPaymentTransaction => {
    const newTxn: ERPPaymentTransaction = {
      ...paymentData,
      id: `txn-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setTransactions((prev) => [newTxn, ...prev]);

    // Deduct balance from the linked document if provided
    if (newTxn.documentId || newTxn.documentNumber) {
      setDocuments((prev) =>
        prev.map((doc) => {
          if (doc.id === newTxn.documentId || doc.docNumber === newTxn.documentNumber) {
            const newAmountPaid = doc.amountPaid + newTxn.amount;
            const newBalanceDue = Math.max(0, doc.totalAmount - newAmountPaid);
            const newStatus =
              newBalanceDue <= 0 ? 'paid' : newAmountPaid > 0 ? 'partially_paid' : doc.status;

            return {
              ...doc,
              amountPaid: newAmountPaid,
              balanceDue: newBalanceDue,
              status: newStatus,
              mpesaRef: newTxn.mpesaCode || doc.mpesaRef,
              bankRef: newTxn.bankTransactionRef || doc.bankRef,
              updatedAt: new Date().toISOString(),
            };
          }
          return doc;
        })
      );
    }

    // Update customer outstanding balance
    if (newTxn.customerId) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === newTxn.customerId
            ? {
                ...c,
                outstandingBalanceKsh: Math.max(0, c.outstandingBalanceKsh - newTxn.amount),
              }
            : c
        )
      );
    }

    return newTxn;
  };

  const reconcileMpesaPayment = (
    mpesaCode: string,
    invoiceNumber: string,
    amount: number,
    senderPhone: string,
    senderName: string
  ): boolean => {
    const invoice = documents.find(
      (d) => d.docNumber.toLowerCase() === invoiceNumber.trim().toLowerCase()
    );

    recordPayment({
      transactionNumber: `TXN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      amount,
      method: 'mpesa',
      status: 'completed',
      documentId: invoice?.id,
      documentNumber: invoice?.docNumber || invoiceNumber,
      customerId: invoice?.customerId,
      customerName: invoice?.customerName || senderName,
      mpesaCode: mpesaCode.toUpperCase().trim(),
      senderPhone,
      senderName: senderName.toUpperCase().trim(),
      mpesaType: 'paybill',
      notes: `Automated M-Pesa STK / Paybill reconciliation for ${invoiceNumber}`,
    });

    return true;
  };

  // Inventory Operations
  const addInventoryItem = (itemData: Omit<ERPInventoryItem, 'id'>): ERPInventoryItem => {
    const newItem: ERPInventoryItem = {
      ...itemData,
      id: `inv-${Date.now()}`,
    };
    setInventory((prev) => [newItem, ...prev]);
    return newItem;
  };

  const updateInventoryItem = (id: string, updates: Partial<ERPInventoryItem>) => {
    setInventory((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          const updated = { ...it, ...updates };
          // auto update status
          if (updated.stockOnHand <= 0) {
            updated.status = 'out_of_stock';
          } else if (updated.stockOnHand <= updated.reorderLevel) {
            updated.status = 'low_stock';
          } else {
            updated.status = 'in_stock';
          }
          return updated;
        }
        return it;
      })
    );
  };

  const adjustStock = (id: string, delta: number) => {
    setInventory((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          const newStock = Math.max(0, it.stockOnHand + delta);
          const newStatus =
            newStock <= 0 ? 'out_of_stock' : newStock <= it.reorderLevel ? 'low_stock' : 'in_stock';
          return {
            ...it,
            stockOnHand: newStock,
            status: newStatus,
            lastRestockedDate: delta > 0 ? new Date().toISOString().split('T')[0] : it.lastRestockedDate,
          };
        }
        return it;
      })
    );
  };

  const deleteInventoryItem = (id: string) => {
    setInventory((prev) => prev.filter((it) => it.id !== id));
  };

  // Customer Operations
  const addCustomer = (customerData: Omit<ERPCustomer, 'id' | 'createdAt'>): ERPCustomer => {
    const newCust: ERPCustomer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCustomers((prev) => [newCust, ...prev]);
    return newCust;
  };

  const updateCustomer = (id: string, updates: Partial<ERPCustomer>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  // Production Orders
  const addProductionOrder = (
    orderData: Omit<ERPProductionOrder, 'id'>
  ): ERPProductionOrder => {
    const newOrder: ERPProductionOrder = {
      ...orderData,
      id: `ord-${Date.now()}`,
    };
    setProductionOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateProductionOrder = (id: string, updates: Partial<ERPProductionOrder>) => {
    setProductionOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));
  };

  const deleteProductionOrder = (id: string) => {
    setProductionOrders((prev) => prev.filter((o) => o.id !== id));
  };

  // Profile Settings
  const updateBusinessProfile = (updates: Partial<ERPBusinessProfile>) => {
    setBusinessProfile((prev) => ({ ...prev, ...updates }));
  };

  const resetToDefaultData = () => {
    setBusinessProfile(INITIAL_BUSINESS_PROFILE);
    setCustomers(INITIAL_CUSTOMERS);
    setDocuments(INITIAL_DOCUMENTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setInventory(INITIAL_INVENTORY);
    setProductionOrders(INITIAL_PRODUCTION_ORDERS);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.DOCUMENTS);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.INVENTORY);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTION);
  };

  return (
    <ERPContext.Provider
      value={{
        businessProfile,
        customers,
        documents,
        transactions,
        inventory,
        productionOrders,
        createDocument,
        updateDocument,
        deleteDocument,
        convertQuotationToInvoice,
        createDeliveryNoteFromInvoice,
        createReceiptFromInvoice,
        recordPayment,
        reconcileMpesaPayment,
        addInventoryItem,
        updateInventoryItem,
        adjustStock,
        deleteInventoryItem,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addProductionOrder,
        updateProductionOrder,
        deleteProductionOrder,
        updateBusinessProfile,
        resetToDefaultData,
      }}
    >
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = () => {
  const context = useContext(ERPContext);
  if (!context) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return context;
};
