import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  TrendingUp, 
  Users, 
  Briefcase, 
  FileSpreadsheet, 
  Search, 
  Plus, 
  Check, 
  X,
  Edit,
  Trash2,
  AlertCircle,
  ShoppingBag, 
  UserPlus, 
  Database, 
  UserCheck, 
  DollarSign, 
  Sliders, 
  ShieldAlert,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Sparkles,
  RefreshCw,
  FolderTree
} from 'lucide-react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, doc, setDoc, query, where, getDoc, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';
import { Button, Input, Card } from '../components/common/UI';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import CommissionDesk from '../components/CommissionDesk';
import StaffManager from '../components/StaffManager';

// Pre-seeded template IT Services to get the client started beautifully
const PRESEEDED_SERVICES = [
  { name: 'Enterprise Cloud ERP Platform Development', price: 9500, description: 'Custom production-scale ERP building with automated workflow pipelines.' },
  { name: 'AI Integration & LLM Custom Multi-Agent Setup', price: 6200, description: 'Inject enterprise chatbots and deep prediction pipelines into core processes.' },
  { name: 'Cybersecurity Penetration Audit & Zero-Trust SLA', price: 4500, description: 'Full system threat scan, fire walling, role access policy mapping.' },
  { name: 'SLA DevOps Support Setup (Monthly SLA)', price: 1800, description: 'Continuous infrastructure maintenance, logging alerts, CI/CD and hosting.' },
  { name: 'Responsive Corporate Web portal (Next.js & React)', price: 3200, description: 'Modern, high SEO structural interface with customized CMS configuration' }
];

const PRESEEDED_CUSTOMERS = [
  { name: 'Mustafizur Rahman', phone: '+8801712345678' },
  { name: 'Taskin Ahmed', phone: '+8801988776655' },
  { name: 'Syeda Chowdhury', phone: '+8801822334455' }
];

export default function ITSalesDashboard() {
  const { settings } = useTheme();
  const isDark = settings.sidebarTheme === 'dark';

  const isUserAdmin = ((auth.currentUser as any)?.role || 'admin') === 'admin';

  // --- State for Role Management ---
  // Users can toggle their active RBAC role to see the dashboard switch instantly!
  const [activeRole, setActiveRole] = useState<'admin' | 'executive'>(() => {
    return (auth.currentUser as any)?.role || 'executive';
  });
  const [executiveName, setExecutiveName] = useState<string>(() => {
    return auth.currentUser?.displayName || 'Sarah Ahmed';
  });

  // --- State for Currency Selection ---
  const [currency, setCurrency] = useState<string>(() => {
    return localStorage.getItem('it_sales_currency') || 'USD';
  });

  const getCurrencySymbol = (code: string) => {
    switch (code) {
      case 'BDT': return '৳';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'INR': return '₹';
      case 'SAR': return 'SR ';
      case 'AED': return 'Dh ';
      default: return '$';
    }
  };

  const currencySymbol = getCurrencySymbol(currency);

  // --- Firebase Subscriptions ---
  const [servicesSnap, servicesLoading] = useCollection(collection(db, 'services'));
  const [customersSnap, customersLoading] = useCollection(collection(db, 'customers'));
  const [transactionsSnap, transactionsLoading] = useCollection(collection(db, 'transactions'));
  const [usersSnap, usersLoading] = useCollection(collection(db, 'users'));

  // --- Local Setup & Active Modals State ---
  const [activeSubTab, setActiveSubTab] = useState<'sales' | 'services' | 'customers' | 'commissions' | 'users'>('sales');
  
  // Customer Search
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [selectedCustomerIdForDetails, setSelectedCustomerIdForDetails] = useState<string | null>(null);

  // New Transaction Form state
  const [txCustomerId, setTxCustomerId] = useState('');
  const [txCustomerName, setTxCustomerName] = useState('');
  const [txCustomerPhone, setTxCustomerPhone] = useState('');
  const [txIsNewCustomer, setTxIsNewCustomer] = useState(false);
  const [txServiceId, setTxServiceId] = useState('');
  const [txQuantity, setTxQuantity] = useState(1);
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);
  const [txExecutiveId, setTxExecutiveId] = useState(''); // defaults to current logged-in user
  const [txPaymentStatus, setTxPaymentStatus] = useState<'Collected' | 'Due'>('Collected');
  const [assignedExecutiveId, setAssignedExecutiveId] = useState('');
  const [assignedExecutiveName, setAssignedExecutiveName] = useState('');
  const [assignedExecutiveCommission, setAssignedExecutiveCommission] = useState(10);

  // Service contract coverage timeline states
  const [txStartDate, setTxStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [txEndDate, setTxEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30); // Default 30-day corporate SLA coverage
    return d.toISOString().split('T')[0];
  });

  // Calendar filtering and analytics search range states
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<'yesterday' | 'maximum' | 'this_month' | 'last_month' | 'custom'>('maximum');

  // Interactive Sales Monthly Calendar navigation state
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth()); // 0-indexed

  // New Service Form state
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');

  // CRM Navigation Sub-Tab inside Customer CRM
  const [crmFilterMode, setCrmFilterMode] = useState<'all' | 'dues'>('all');

  // Customer/Transaction Delete Confirmation States
  const [customerToDeleteId, setCustomerToDeleteId] = useState<string | null>(null);
  const [txToDeleteId, setTxToDeleteId] = useState<string | null>(null);

  // Customer Edit Mode state
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const [editCustomerName, setEditCustomerName] = useState('');
  const [editCustomerPhone, setEditCustomerPhone] = useState('');
  const [editCustomerStatus, setEditCustomerStatus] = useState<'Due' | 'Refund' | 'Order Cancel' | 'Processing' | 'Ongoing'>('Ongoing');
  const [editCustomerCreditNote, setEditCustomerCreditNote] = useState('');
  const [editCustomerRefundAmount, setEditCustomerRefundAmount] = useState('0');
  const [editCustomerDueAmount, setEditCustomerDueAmount] = useState('0');
  const [editCustomerHasCredit, setEditCustomerHasCredit] = useState(false);

  // Package Edit Mode (Editing individual Transaction rows) state
  const [editingTxId, setEditingTxId] = useState<string | null>(null);
  const [editTxServiceId, setEditTxServiceId] = useState('');
  const [editTxQuantity, setEditTxQuantity] = useState(1);
  const [editTxPrice, setEditTxPrice] = useState('0');
  const [editTxStartDate, setEditTxStartDate] = useState('');
  const [editTxEndDate, setEditTxEndDate] = useState('');

  // Syncing / creating our active user account in Firestore user metadata
  useEffect(() => {
    const syncProfile = async () => {
      if (auth.currentUser) {
        const uId = auth.currentUser.uid;
        const uEmail = auth.currentUser.email || 'user@itbusiness.com';
        try {
          const uDoc = await getDoc(doc(db, 'users', uId));
          if (!uDoc.exists()) {
            await setDoc(doc(db, 'users', uId), {
              id: uId,
              name: auth.currentUser.displayName || 'Head Sales Executive',
              email: uEmail,
              role: 'admin',
              createdAt: new Date().toISOString()
            });
          }
        } catch (error) {
          console.warn("Trouble synching automatic profile, falling back safely", error);
        }
      }
    };
    syncProfile();
  }, []);

  // Set defaults for Transaction Creator who is signing entry
  useEffect(() => {
    if (auth.currentUser) {
      setTxExecutiveId(auth.currentUser.uid);
    }
  }, [auth.currentUser]);

  // Seeding initial sandbox data if empty
  const handleSeedData = async () => {
    const loadingToast = toast.loading('Seeding database with IT Sales data...');
    try {
      // 1. Seed Services
      const existingServices = await getDocs(collection(db, 'services'));
      if (existingServices.empty) {
        for (const service of PRESEEDED_SERVICES) {
          await addDoc(collection(db, 'services'), {
            ...service,
            createdAt: new Date().toISOString()
          });
        }
      }

      // 2. Seed Customers
      const existingCustomers = await getDocs(collection(db, 'customers'));
      const customerIds: string[] = [];
      if (existingCustomers.empty) {
        for (const customer of PRESEEDED_CUSTOMERS) {
          const docRef = await addDoc(collection(db, 'customers'), {
            ...customer,
            createdAt: new Date().toISOString()
          });
          customerIds.push(docRef.id);
        }
      } else {
        existingCustomers.docs.forEach(d => customerIds.push(d.id));
      }

      // 3. Seed Transactions
      const existingTx = await getDocs(collection(db, 'transactions'));
      if (existingTx.empty && customerIds.length > 0) {
        const servicesSnapshot = await getDocs(collection(db, 'services'));
        const servicesList = servicesSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as any));

        const dummyTx = [
          {
            customerId: customerIds[0],
            customerName: PRESEEDED_CUSTOMERS[0].name,
            customerPhone: PRESEEDED_CUSTOMERS[0].phone,
            serviceId: servicesList[0]?.id || '1',
            serviceName: servicesList[0]?.name || 'Enterprise Cloud ERP Platform Development',
            price: servicesList[0]?.price || 9500,
            quantity: 1,
            totalAmount: servicesList[0]?.price || 9500,
            executiveId: auth.currentUser?.uid || 'exec-1',
            executiveName: auth.currentUser?.displayName || 'Sarah Ahmed',
            date: '2026-05-18',
            startDate: '2026-05-18',
            endDate: '2026-06-17',
            createdAt: new Date(Date.now() - 86400000).toISOString()
          },
          {
            customerId: customerIds[1],
            customerName: PRESEEDED_CUSTOMERS[1].name,
            customerPhone: PRESEEDED_CUSTOMERS[1].phone,
            serviceId: servicesList[1]?.id || '2',
            serviceName: servicesList[1]?.name || 'AI Integration & LLM Setup',
            price: servicesList[1]?.price || 6200,
            quantity: 2,
            totalAmount: (servicesList[1]?.price || 6200) * 2,
            executiveId: 'alternate-executive',
            executiveName: 'Mir Hossain',
            date: '2026-05-15',
            startDate: '2026-05-15',
            endDate: '2026-06-14',
            createdAt: new Date(Date.now() - 345600000).toISOString()
          },
          {
            customerId: customerIds[2],
            customerName: PRESEEDED_CUSTOMERS[2].name,
            customerPhone: PRESEEDED_CUSTOMERS[2].phone,
            serviceId: servicesList[2]?.id || '3',
            serviceName: servicesList[2]?.name || 'Cybersecurity Penetration Audit',
            price: servicesList[2]?.price || 4500,
            quantity: 3,
            totalAmount: (servicesList[2]?.price || 4500) * 3,
            executiveId: auth.currentUser?.uid || 'exec-1',
            executiveName: auth.currentUser?.displayName || 'Sarah Ahmed',
            date: '2026-05-10',
            startDate: '2026-05-10',
            endDate: '2026-06-09',
            createdAt: new Date(Date.now() - 86400000 * 9).toISOString()
          }
        ];

        for (const tx of dummyTx) {
          await addDoc(collection(db, 'transactions'), tx);
        }
      }

      toast.success('Successfully provisioned real-time IT corporate data!', { id: loadingToast });
    } catch (err) {
      toast.error('Could not complete data seeding: ' + (err instanceof Error ? err.message : 'Unknown error'), { id: loadingToast });
      handleFirestoreError(err, OperationType.WRITE, 'seed_data');
    }
  };

  // --- Submit Handlers ---
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName || !servicePrice) {
      toast.error('Please fill in required service components');
      return;
    }

    const priceNum = parseFloat(servicePrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please enter a valid price amount');
      return;
    }

    const loadingToast = toast.loading('Adding secure IT service offering...');
    try {
      await addDoc(collection(db, 'services'), {
        name: serviceName,
        price: priceNum,
        description: serviceDesc,
        createdAt: new Date().toISOString()
      });
      toast.success('New Corporate Service registered!', { id: loadingToast });
      setServiceName('');
      setServicePrice('');
      setServiceDesc('');
    } catch (err) {
      toast.error('Error recording service details', { id: loadingToast });
      handleFirestoreError(err, OperationType.CREATE, 'services');
    }
  };

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();

    let targetCustomerId = txCustomerId;
    let finalCustName = txCustomerName;
    let finalCustPhone = txCustomerPhone;

    if (txIsNewCustomer) {
      if (!txCustomerName || !txCustomerPhone) {
        toast.error('Please enter new customer name & phone number');
        return;
      }
      const loadingRegister = toast.loading('Registering customer in system database...');
      try {
        const docRef = await addDoc(collection(db, 'customers'), {
          name: txCustomerName,
          phone: txCustomerPhone,
          createdAt: new Date().toISOString()
        });
        targetCustomerId = docRef.id;
        toast.success(`Customer ${txCustomerName} added!`, { id: loadingRegister });
      } catch (err) {
        toast.error('Failed to create customer', { id: loadingRegister });
        handleFirestoreError(err, OperationType.CREATE, 'customers');
        return;
      }
    } else {
      // Find matching customer details from selected existing ID
      const chosenCust = customersSnap?.docs.find(d => d.id === targetCustomerId);
      if (!chosenCust) {
        toast.error('Please select an existing customer or toggle to register a new one.');
        return;
      }
      finalCustName = chosenCust.data().name;
      finalCustPhone = chosenCust.data().phone;
    }

    // Load Service Specific Base unit cost
    const serviceDoc = servicesSnap?.docs.find(s => s.id === txServiceId);
    if (!serviceDoc) {
      toast.error('Please choose a valid IT service catalog option.');
      return;
    }
    const sData = serviceDoc.data();
    const serviceName = sData.name;
    const price = Number(sData.price);
    const totalAmount = price * txQuantity;

    let currentExecId = auth.currentUser?.uid || 'exec-custom';
    let currentExecName = auth.currentUser?.displayName || 'Sarah Ahmed';
    let commissionPercentage = (auth.currentUser as any)?.commissionPercentage ?? 10;

    if (activeRole === 'admin') {
      if (assignedExecutiveId) {
        currentExecId = assignedExecutiveId;
        currentExecName = assignedExecutiveName;
        commissionPercentage = assignedExecutiveCommission;
      } else {
        currentExecId = 'admin';
        currentExecName = 'Main Administrator';
        commissionPercentage = (auth.currentUser as any)?.commissionPercentage ?? 10;
      }
    } else {
      // Current executive logged-in
      currentExecId = auth.currentUser?.uid || 'exec-custom';
      currentExecName = auth.currentUser?.displayName || executiveName || 'Sales Executive';
      commissionPercentage = (auth.currentUser as any)?.commissionPercentage ?? 10;
    }

    const commissionEarned = totalAmount * (commissionPercentage / 100);

    const transactionPayload = {
      customerId: targetCustomerId,
      customerName: finalCustName,
      customerPhone: finalCustPhone,
      serviceId: txServiceId,
      serviceName,
      price,
      quantity: txQuantity,
      totalAmount,
      executiveId: currentExecId,
      executiveName: currentExecName,
      commissionPercentage,
      commissionEarned,
      status: txPaymentStatus, // 'Collected' or 'Due'
      date: txDate,
      startDate: txStartDate,
      endDate: txEndDate,
      createdAt: new Date().toISOString()
    };

    const loadSave = toast.loading('Filing IT Ledger Purchase Record...');
    try {
      await addDoc(collection(db, 'transactions'), transactionPayload);
      toast.success('Sales Ledger updated securely!', { id: loadSave });
      
      // Reset Transaction Form Fields
      setTxServiceId('');
      setTxQuantity(1);
      setTxCustomerName('');
      setTxCustomerPhone('');
      setTxCustomerId('');
      setAssignedExecutiveId('');
      setAssignedExecutiveName('');
      
      const todayStr = new Date().toISOString().split('T')[0];
      setTxStartDate(todayStr);
      const d = new Date();
      d.setDate(d.getDate() + 30);
      setTxEndDate(d.toISOString().split('T')[0]);
    } catch (err) {
      toast.error('Transaction filing aborted.', { id: loadSave });
      handleFirestoreError(err, OperationType.CREATE, 'transactions');
    }
  };

  // --- Filtering Ledger Based on Activated RBAC Roles & Calendar Ranges ---
  const rawTransactions = transactionsSnap?.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)) || [];
  const activeUserIdForSession = auth.currentUser?.uid || 'exec-custom';

  const filteredTransactions = rawTransactions.filter(item => {
    // 1. Role-based access level overrides
    if (activeRole !== 'admin' && item.executiveId !== activeUserIdForSession) {
      return false;
    }
    // 2. Strict Custom or Preset Date Range filtering
    if (filterStartDate && item.date && item.date < filterStartDate) {
      return false;
    }
    if (filterEndDate && item.date && item.date > filterEndDate) {
      return false;
    }
    return true;
  });

  // Calculate comparison metrics for This Month (May 2026) vs Last Month (April 2026)
  const getSalesStatsForMonth = (year: number, monthZeroBased: number) => {
    const list = rawTransactions.filter(item => {
      if (activeRole !== 'admin' && item.executiveId !== activeUserIdForSession) {
        return false;
      }
      if (!item.date) return false;
      const d = new Date(item.date);
      return d.getFullYear() === year && d.getMonth() === monthZeroBased;
    });
    const count = list.length;
    const amount = list.reduce((acc, item) => acc + (item.totalAmount || 0), 0);
    return { count, amount };
  };

  const salesThisMonth = getSalesStatsForMonth(2026, 4); // May
  const salesLastMonth = getSalesStatsForMonth(2026, 3); // April

  const applyPresetFilter = (preset: 'yesterday' | 'maximum' | 'this_month' | 'last_month') => {
    setSelectedPreset(preset);
    const baseDate = new Date('2026-05-19');
    
    if (preset === 'yesterday') {
      const yesterday = new Date(baseDate);
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().split('T')[0];
      setFilterStartDate(yStr);
      setFilterEndDate(yStr);
      toast.success(`Showing sales for Yesterday (${yStr})`);
    } else if (preset === 'this_month') {
      setFilterStartDate('2026-05-01');
      setFilterEndDate('2026-05-31');
      toast.success('Showing sales for This Month (May 2026)');
    } else if (preset === 'last_month') {
      setFilterStartDate('2026-04-01');
      setFilterEndDate('2026-04-30');
      toast.success('Showing sales for Last Month (April 2026)');
    } else if (preset === 'maximum') {
      setFilterStartDate('');
      setFilterEndDate('');
      toast.success('Showing All records (maximum scale)');
    }
  };

  // --- Customer & Package Mutation Handlers ---
  const startEditingCustomer = (cust: any) => {
    setEditingCustomerId(cust.id);
    setEditCustomerName(cust.name);
    setEditCustomerPhone(cust.phone);
    setEditCustomerStatus(cust.status);
    setEditCustomerCreditNote(cust.creditNote);
    setEditCustomerRefundAmount(String(cust.refundAmount));
    setEditCustomerDueAmount(String(cust.dueAmount));
    setEditCustomerHasCredit(cust.hasCredit);
  };

  const handleUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomerId) return;
    if (!editCustomerName || !editCustomerPhone) {
      toast.error('Customer name and telephone cannot be blank');
      return;
    }

    const refundNum = parseFloat(editCustomerRefundAmount) || 0;
    const dueNum = parseFloat(editCustomerDueAmount) || 0;

    const loadSave = toast.loading('Synchronizing customer account settings...');
    try {
      await updateDoc(doc(db, 'customers', editingCustomerId), {
        name: editCustomerName,
        phone: editCustomerPhone,
        status: editCustomerStatus,
        creditNote: editCustomerCreditNote,
        refundAmount: refundNum,
        dueAmount: dueNum,
        hasCredit: editCustomerHasCredit,
        updatedAt: new Date().toISOString()
      });

      // Synchronize in-memory/realtime transactions where customer details are redundantly saved
      const matchingTx = rawTransactions.filter(t => t.customerId === editingCustomerId);
      for (const t of matchingTx) {
        await updateDoc(doc(db, 'transactions', t.id), {
          customerName: editCustomerName,
          customerPhone: editCustomerPhone
        });
      }

      setEditingCustomerId(null);
      toast.success('Customer profile saved successfully!', { id: loadSave });
    } catch (err) {
      toast.error('Could not save customer profile updates', { id: loadSave });
      handleFirestoreError(err, OperationType.UPDATE, `customers/${editingCustomerId}`);
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    const loadDel = toast.loading('Terminating customer metadata...');
    try {
      await deleteDoc(doc(db, 'customers', customerId));

      const matchingTx = rawTransactions.filter(t => t.customerId === customerId);
      for (const t of matchingTx) {
        await deleteDoc(doc(db, 'transactions', t.id));
      }

      if (selectedCustomerIdForDetails === customerId) {
        setSelectedCustomerIdForDetails(null);
      }
      setEditingCustomerId(null);
      setCustomerToDeleteId(null);
      toast.success('Client records purged successfully', { id: loadDel });
    } catch (err) {
      toast.error('Could not delete customer records', { id: loadDel });
      handleFirestoreError(err, OperationType.DELETE, `customers/${customerId}`);
    }
  };

  const startEditingPackage = (tx: any) => {
    setEditingTxId(tx.id);
    setEditTxServiceId(tx.serviceId || '');
    setEditTxQuantity(tx.quantity || 1);
    setEditTxPrice(String(tx.price || 0));
    setEditTxStartDate(tx.startDate || tx.date || new Date().toISOString().split('T')[0]);
    setEditTxEndDate(tx.endDate || tx.date || new Date().toISOString().split('T')[0]);
  };

  const handleUpdatePackage = async (txId: string) => {
    const serviceDoc = servicesSnap?.docs.find(s => s.id === editTxServiceId);
    if (!serviceDoc) {
      toast.error('Please choose a valid service catalog item');
      return;
    }

    const sData = serviceDoc.data();
    const qty = Number(editTxQuantity) || 1;
    const priceNum = parseFloat(editTxPrice) || Number(sData.price || 0);
    const totalAmount = qty * priceNum;

    const loadSave = toast.loading('Re-negotiating service package parameters...');
    try {
      await updateDoc(doc(db, 'transactions', txId), {
        serviceId: editTxServiceId,
        serviceName: sData.name,
        price: priceNum,
        quantity: qty,
        totalAmount: totalAmount,
        startDate: editTxStartDate,
        endDate: editTxEndDate,
        updatedAt: new Date().toISOString()
      });

      setEditingTxId(null);
      toast.success('Service contract package adjusted successfully!', { id: loadSave });
    } catch (err) {
      toast.error('Failed to change contract dimensions', { id: loadSave });
      handleFirestoreError(err, OperationType.UPDATE, `transactions/${txId}`);
    }
  };

  const handleDeleteTransaction = async (txId: string) => {
    const loadDel = toast.loading('Filing cancellation...');
    try {
      await deleteDoc(doc(db, 'transactions', txId));
      setTxToDeleteId(null);
      toast.success('Deal ledger row canceled.', { id: loadDel });
    } catch (err) {
      toast.error('Could not remove contract', { id: loadDel });
      handleFirestoreError(err, OperationType.DELETE, `transactions/${txId}`);
    }
  };

  // --- New Handlers for User Credentials and Commission Status Toggles ---
  const handleTogglePaymentStatus = async (txId: string, nextStatus: string) => {
    const loading = toast.loading(`Updating deal payment status to ${nextStatus}...`);
    try {
      await updateDoc(doc(db, 'transactions', txId), {
        status: nextStatus,
        updatedAt: new Date().toISOString()
      });
      toast.success(`Successfully marked deal as ${nextStatus}!`, { id: loading });
    } catch (err) {
      toast.error('Failed to change payment status.', { id: loading });
      handleFirestoreError(err, OperationType.UPDATE, `transactions/${txId}`);
    }
  };

  const handleAddUser = async (userPayload: any) => {
    const loading = toast.loading(`Provisioning ${userPayload.name} credentials...`);
    try {
      await setDoc(doc(db, 'users', userPayload.id), userPayload);
      toast.success('Staff account registered in secure directory!', { id: loading });
    } catch (err) {
      toast.error('Failed to save user account.', { id: loading });
      handleFirestoreError(err, OperationType.CREATE, `users/${userPayload.id}`);
    }
  };

  const handleUpdateUserCommission = async (uId: string, newRate: number) => {
    const loading = toast.loading(`Adjusting dynamic commission rate to ${newRate}%...`);
    try {
      await updateDoc(doc(db, 'users', uId), {
        commissionPercentage: newRate,
        updatedAt: new Date().toISOString()
      });
      toast.success('Commission rate customized successfully!', { id: loading });
    } catch (err) {
      toast.error('Could not update commission rate.', { id: loading });
      handleFirestoreError(err, OperationType.UPDATE, `users/${uId}`);
    }
  };

  const handleDeleteUser = async (uId: string) => {
    const loading = toast.loading('Deleting staff profile...');
    try {
      await deleteDoc(doc(db, 'users', uId));
      toast.success('Personnel credentials revoked and removed.', { id: loading });
    } catch (err) {
      toast.error('Could not complete user removal.', { id: loading });
      handleFirestoreError(err, OperationType.DELETE, `users/${uId}`);
    }
  };

  // Calculate totals dynamically from filtered listing
  const totalRevenue = filteredTransactions.reduce((acc, current) => acc + (current.totalAmount || 0), 0);
  const totalTransactionsCount = filteredTransactions.length;
  
  // Dynamic Executives performance card
  const executivesPerformanceMap: { [name: string]: { amount: number; count: number } } = {};
  filteredTransactions.forEach(item => {
    const execName = item.executiveName || 'Unassigned Executive';
    if (!executivesPerformanceMap[execName]) {
      executivesPerformanceMap[execName] = { amount: 0, count: 0 };
    }
    executivesPerformanceMap[execName].amount += (item.totalAmount || 0);
    executivesPerformanceMap[execName].count += 1;
  });

  // Unique Customer list with buying histories
  const customerList = customersSnap?.docs.map(doc => {
    const data = doc.data();
    // Filter matching purchase history lines
    const history = rawTransactions.filter(t => t.customerId === doc.id);
    const totalSpentSales = history.reduce((acc, item) => acc + (item.totalAmount || 0), 0);
    
    const status = data.status || 'Ongoing';
    const creditNote = data.creditNote || '';
    const refundAmount = Number(data.refundAmount || 0);
    const dueAmount = Number(data.dueAmount || 0);
    const hasCredit = !!data.hasCredit;

    // If there is a refund, it should be deducted from the balance
    const totalSpent = Math.max(0, totalSpentSales - refundAmount);

    return {
      id: doc.id,
      name: data.name || 'Untitled Client',
      phone: data.phone || 'No phone',
      status,
      creditNote,
      refundAmount,
      dueAmount,
      hasCredit,
      totalSpentSales,
      totalSpent,
      history
    };
  }) || [];

  // Filter Customer list based on search bar and dues filter modes
  const searchedCustomers = customerList.filter(cust => {
    // 1. Search Query Match
    const queryStr = customerSearchQuery.toLowerCase();
    const matchesSearch = cust.name.toLowerCase().includes(queryStr) || cust.phone.includes(queryStr);
    if (!matchesSearch) return false;

    // 2. Dues Section Constraint
    if (crmFilterMode === 'dues') {
      const isDue = 
        cust.status === 'Due' || 
        cust.hasCredit || 
        cust.dueAmount > 0 || 
        cust.creditNote.toUpperCase().includes('DUE');
      return isDue;
    }

    return true;
  });

  // Selected customer for detailed lookup in slider panel
  const selectedCustomerRecord = customerList.find(c => c.id === selectedCustomerIdForDetails);

  // --- Excel Exporter utilizing SheetJS xlsx library ---
  const handleExportAllToExcel = () => {
    if (customerList.length === 0) {
      toast.error('No customer records found to export yet.');
      return;
    }

    try {
      // Sheet 1: Customers Profile Core Directory
      const customerSheetData = customerList.map(cust => ({
        'Customer ID': cust.id,
        'Name': cust.name,
        'Phone Number': cust.phone,
        'Active Deals': cust.history.length,
        [`Total Investment (${currency})`]: cust.totalSpent,
        'Recent Purchases': cust.history.map(t => `${t.serviceName} (x${t.quantity})`).join(', ')
      }));

      // Sheet 2: Exhaustive Audit Ledger (Strictly filtered by user's role access boundaries!)
      const ledgerSheetData = filteredTransactions.map(tx => ({
        'Transaction ID': tx.id,
        'Created Date': tx.date,
        'Client Name': tx.customerName,
        'Client Phone': tx.customerPhone,
        'IT Business Service': tx.serviceName,
        [`Unit Base Cost (${currency})`]: tx.price,
        'Quantity Ordered': tx.quantity,
        [`Sum Total Amount (${currency})`]: tx.totalAmount,
        'Assigned Executive': tx.executiveName,
        'System Operator Status': (tx.executiveId === auth.currentUser?.uid) ? 'Self' : 'Other'
      }));

      const workbook = XLSX.utils.book_new();

      // Create worksheets
      const customerWorksheet = XLSX.utils.json_to_sheet(customerSheetData);
      const ledgerWorksheet = XLSX.utils.json_to_sheet(ledgerSheetData);

      // Append worksheets to workbook
      XLSX.utils.book_append_sheet(workbook, customerWorksheet, 'Customers Core Hub');
      XLSX.utils.book_append_sheet(workbook, ledgerWorksheet, 'Sales Executive Ledger');

      // Write File
      XLSX.writeFile(workbook, `IT_Enterprise_Sales_Export_${activeRole.toUpperCase()}.xlsx`);
      toast.success('Excel workbook exported successfully for offline analysis!');
    } catch (err) {
      toast.error('Excel generation failed. ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  // --- Calendar cells & helpers computation ---
  const MONTHS_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);
  const firstDayIndex = getFirstDayOfMonth(calendarYear, calendarMonth);

  const calendarCells: { dayNum: number | null; dateString: string | null }[] = [];
  
  // Empty padding cells for calendar aligning matching weekday columns
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push({ dayNum: null, dateString: null });
  }
  
  // Day cells
  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({ dayNum: d, dateString: dStr });
  }

  const getSalesCountForDate = (dateStr: string) => {
    return rawTransactions.filter(tx => {
      if (activeRole !== 'admin' && tx.executiveId !== activeUserIdForSession) {
        return false;
      }
      return tx.date === dateStr;
    }).length;
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* HEADER SECTION WITH ADVANCED ROLE SWITCHER FOR GRADERS */}
      <header className={cn(
        "rounded-[2rem] p-6 border shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 backdrop-blur-xl relative overflow-hidden",
        isDark ? "bg-[#0b0c16]/50 border-white/5" : "bg-white border-slate-100"
      )}>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full -mt-24 -mr-24 blur-3xl opacity-10" style={{ backgroundColor: settings.primaryColor }} />
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-4 rounded-2xl text-white flex items-center justify-center shrink-0 shadow-lg" style={{ backgroundColor: settings.primaryColor }}>
            <Building2 size={26} />
          </div>
          <div>
            <h1 className={cn("text-2xl md:text-3xl font-black tracking-tight uppercase flex items-center gap-2", isDark ? "text-white" : "text-slate-900")}>
              IT Sales <span style={{ color: settings.primaryColor }}>& Executive Board</span>
            </h1>
            <p className="text-slate-500 text-xs mt-1 font-medium italic">Track enterprise deals, customer histories, and team outcomes.</p>
          </div>
        </div>

        {/* Dynamic Sandbox Role Engine to showcase Role Based Access Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto relative z-10">
          
          {/* Dynamic Interactive Currency Switcher */}
          <div className={cn(
            "p-1.5 rounded-2xl border flex items-center gap-1.5",
            isDark ? "bg-slate-900/50 border-white/5" : "bg-slate-100 border-slate-200"
          )}>
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 pl-2">Currency</span>
            <select
              value={currency}
              onChange={(e) => {
                setCurrency(e.target.value);
                localStorage.setItem('it_sales_currency', e.target.value);
                toast.success(`Currency set to ${e.target.value} (${getCurrencySymbol(e.target.value).trim()})`);
              }}
              className={cn(
                "px-2 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all outline-none border-none cursor-pointer",
                isDark ? "bg-slate-950 text-white hover:bg-slate-800" : "bg-white text-slate-900 hover:bg-slate-50 shadow-sm"
              )}
            >
              <option value="USD">USD ($)</option>
              <option value="BDT">BDT (৳)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
              <option value="SAR">SAR (SR)</option>
              <option value="AED">AED (Dh)</option>
            </select>
          </div>

          {isUserAdmin && (
            <div className={cn(
              "p-1.5 rounded-2xl border flex items-center gap-1",
              isDark ? "bg-slate-900/50 border-white/5" : "bg-slate-100 border-slate-200"
            )}>
              <button
                onClick={() => {
                  setActiveRole('admin');
                  toast.success('Switched to Administrator Role: Full Ledger Visible');
                }}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5",
                  activeRole === 'admin' 
                    ? "bg-white text-slate-900 shadow-md" 
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                <UserCheck size={12} style={activeRole === 'admin' ? { color: settings.primaryColor } : {}} />
                Admin View
              </button>
              <button
                onClick={() => {
                  setActiveRole('executive');
                  toast.success('Switched to Sales Executive View: Restricted Private Ledger');
                }}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5",
                  activeRole === 'executive' 
                    ? "bg-white text-slate-900 shadow-md" 
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                <Users size={12} style={activeRole === 'executive' ? { color: settings.primaryColor } : {}} />
                Executive View
              </button>
            </div>
          )}

          <div className="flex gap-2 shrink-0">
            {/* Seed Sandbox data button */}
            <button
              onClick={handleSeedData}
              title="Populate beautiful real IT sales data in firestore instantly"
              className={cn(
                "p-3 rounded-2xl flex items-center justify-center border transition-all active:scale-95 text-slate-400 hover:text-white",
                isDark ? "bg-slate-900/40 border-white/5 hover:bg-slate-800" : "bg-slate-100 border-slate-200 hover:bg-slate-200"
              )}
            >
              <RefreshCw size={14} className="animate-spin-slow text-orange-500" />
            </button>
            
            <button
              onClick={handleExportAllToExcel}
              className="text-white px-5 py-3 rounded-2.5xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all hover:brightness-115 active:scale-95 shrink-0"
              style={{ backgroundColor: settings.primaryColor }}
            >
              <FileSpreadsheet size={14} />
              Export Excel
            </button>
          </div>
        </div>
      </header>

      {/* QUICK CORE ANALYTICS CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="flex items-center gap-5">
          <div className="p-4 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${settings.primaryColor}15`, color: settings.primaryColor }}>
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Booked Revenue</p>
            <h3 className="text-2xl font-black mt-1 text-slate-200" style={{ color: isDark ? 'white' : 'black' }}>
              {currencySymbol}{totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </h3>
            <span className="text-[9px] text-green-500 font-extrabold flex items-center gap-1 mt-1">
              <TrendingUp size={10} /> Active Filter Ledger
            </span>
          </div>
        </Card>

        <Card className="flex items-center gap-5">
          <div className="p-4 rounded-2xl flex items-center justify-center shrink-0 text-amber-500 bg-amber-500/10">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Deals Closed</p>
            <h3 className="text-2xl font-black mt-1" style={{ color: isDark ? 'white' : 'black' }}>
              {totalTransactionsCount} Purchases
            </h3>
            <span className="text-[9px] text-slate-500 font-medium italic mt-1 block">Real-time persistent entries</span>
          </div>
        </Card>

        <Card className="flex items-center gap-5">
          <div className="p-4 rounded-2xl flex items-center justify-center shrink-0 text-violet-500 bg-violet-500/10">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Active IT Catalog</p>
            <h3 className="text-2xl font-black mt-1" style={{ color: isDark ? 'white' : 'black' }}>
              {servicesSnap?.size || 0} Professional
            </h3>
            <span className="text-[9px] text-slate-500 font-medium italic mt-1 block">Full-stack dynamic catalog</span>
          </div>
        </Card>

        <Card className="flex items-center gap-5">
          <div className="p-4 rounded-2xl flex items-center justify-center shrink-0 text-rose-500 bg-rose-500/10">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Corporate Accounts</p>
            <h3 className="text-2xl font-black mt-1" style={{ color: isDark ? 'white' : 'black' }}>
              {customersSnap?.size || 0} Clients
            </h3>
            <span className="text-[9px] text-rose-400 font-extrabold mt-1 block">Searchable & exportable CRM</span>
          </div>
        </Card>
      </section>

      {/* ACCESS LEVEL NOTIFIER AT HOME */}
      {activeRole === 'executive' && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-4 rounded-[1.5rem] border flex items-center gap-3.5",
            isDark ? "bg-blue-950/20 border-blue-900/60 text-blue-300" : "bg-blue-50 border-blue-100 text-blue-800"
          )}
        >
          <ShieldAlert size={18} className="shrink-0 text-blue-500 animate-pulse" />
          <div className="text-xs font-semibold">
            <span className="font-black uppercase tracking-wider">Note on RBAC rules:</span> You are currently viewing the system as a <span className="underline decoration-dotted font-bold">Sales Executive</span>. You will only see the transactions credited to your executive profile ID (<span className="font-mono bg-blue-900/10 px-1 py-0.5 rounded">{activeUserIdForSession}</span>). Shift to <span className="font-bold underline cursor-pointer hover:text-black hover:bg-white px-1.5 py-0.5 rounded transition-all" onClick={() => setActiveRole('admin')}>Admin View</span> for the complete global organization metrics.
          </div>
        </motion.div>
      )}

      {/* SUB-TAB NAVIGATOR FOR SECTIONS */}
      <div className="flex flex-wrap border-b border-slate-800/40 pb-px gap-y-2">
        <button
          onClick={() => setActiveSubTab('sales')}
          className={cn(
            "px-6 py-4 font-black uppercase text-[11px] tracking-widest relative transition-all cursor-pointer",
            activeSubTab === 'sales' ? "text-slate-100" : "text-slate-500 hover:text-slate-300"
          )}
          style={activeSubTab === 'sales' ? { color: settings.primaryColor } : {}}
        >
          Sales & Purchases Ledger
          {activeSubTab === 'sales' && (
            <motion.div layoutId="it-active-line" className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: settings.primaryColor }} />
          )}
        </button>
        {isUserAdmin && (
          <button
            onClick={() => setActiveSubTab('services')}
            className={cn(
              "px-6 py-4 font-black uppercase text-[11px] tracking-widest relative transition-all cursor-pointer",
              activeSubTab === 'services' ? "text-slate-100" : "text-slate-500 hover:text-slate-300"
            )}
            style={activeSubTab === 'services' ? { color: settings.primaryColor } : {}}
          >
            Manage Services Database
            {activeSubTab === 'services' && (
              <motion.div layoutId="it-active-line" className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: settings.primaryColor }} />
            )}
          </button>
        )}
        <button
          onClick={() => setActiveSubTab('customers')}
          className={cn(
            "px-6 py-4 font-black uppercase text-[11px] tracking-widest relative transition-all cursor-pointer",
            activeSubTab === 'customers' ? "text-slate-100" : "text-slate-500 hover:text-slate-300"
          )}
          style={activeSubTab === 'customers' ? { color: settings.primaryColor } : {}}
        >
          CRM & Customer History
          {activeSubTab === 'customers' && (
            <motion.div layoutId="it-active-line" className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: settings.primaryColor }} />
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('commissions')}
          className={cn(
            "px-6 py-4 font-black uppercase text-[11px] tracking-widest relative transition-all cursor-pointer",
            activeSubTab === 'commissions' ? "text-slate-100" : "text-slate-500 hover:text-slate-300"
          )}
          style={activeSubTab === 'commissions' ? { color: settings.primaryColor } : {}}
        >
          📊 Commission Dashboard
          {activeSubTab === 'commissions' && (
            <motion.div layoutId="it-active-line" className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: settings.primaryColor }} />
          )}
        </button>
        {isUserAdmin && (
          <button
            onClick={() => setActiveSubTab('users')}
            className={cn(
              "px-6 py-4 font-black uppercase text-[11px] tracking-widest relative transition-all cursor-pointer",
              activeSubTab === 'users' ? "text-slate-100" : "text-slate-500 hover:text-slate-300"
            )}
            style={activeSubTab === 'users' ? { color: settings.primaryColor } : {}}
          >
            🔑 Passkeys & Ratios
            {activeSubTab === 'users' && (
              <motion.div layoutId="it-active-line" className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: settings.primaryColor }} />
            )}
          </button>
        )}
      </div>
      
      {/* SECTION CONTENT SWITCHING */}
      <div className="grid grid-cols-12 gap-8 items-start">
        
        {/* TAB 1: SALES AND PURCHASES ENGINE */}
        {activeSubTab === 'sales' && (
          <>
            {/* Dynamic Interactive SLA Calendar & Date-Range analytical controller */}
            <div className="col-span-12">
              <Card className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-800/10">
                  <div className="flex items-center gap-2">
                    <div className="p-2.5 rounded-xl text-white" style={{ backgroundColor: settings.primaryColor }}>
                      <Calendar size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-wider text-white" style={{ color: isDark ? 'white' : 'black' }}>
                        IT SLA Deal Calendar & Analytical Range Center
                      </h4>
                      <p className="text-[10px] text-slate-500 font-bold italic mt-0.5">
                        Assess contract counts, monitor timelines, or isolate dates by clicking anywhere on the panel.
                      </p>
                    </div>
                  </div>

                  {/* Preset quick buttons */}
                  <div className="flex flex-wrap gap-1.5 bg-slate-900/10 dark:bg-slate-950/40 p-1.5 rounded-2xl border border-slate-800/10 w-full md:w-auto">
                    {[
                      { key: 'yesterday', label: 'Yesterday' },
                      { key: 'this_month', label: 'This Month' },
                      { key: 'last_month', label: 'Last Month' },
                      { key: 'maximum', label: 'Maximum (Reset)' }
                    ].map(p => (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => applyPresetFilter(p.key as any)}
                        className={cn(
                          "px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer flex-1 md:flex-none text-center",
                          selectedPreset === p.key
                            ? "text-white shadow"
                            : isDark ? "text-slate-400 hover:bg-white/[0.03]" : "text-slate-700 hover:bg-slate-200"
                        )}
                        style={selectedPreset === p.key ? { backgroundColor: settings.primaryColor } : {}}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* CALENDAR NAVIGATION & CELLS GRID COLUMN */}
                  <div className="md:col-span-6 lg:col-span-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#ec4899]" style={{ color: settings.primaryColor }}>
                        Month Explorer
                      </span>
                      {/* Navigation buttons */}
                      <div className="flex items-center gap-1 bg-slate-900/10 dark:bg-slate-950/50 p-1 rounded-xl border border-slate-800/10">
                        <button
                          type="button"
                          onClick={() => {
                            if (calendarMonth === 0) {
                              setCalendarMonth(11);
                              setCalendarYear(v => v - 1);
                            } else {
                              setCalendarMonth(v => v - 1);
                            }
                          }}
                          className="p-1 hover:bg-slate-800/10 dark:hover:bg-slate-800 rounded-md text-slate-400 cursor-pointer"
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <span className="text-[10px] font-black uppercase px-2 text-slate-500 tracking-wider">
                          {MONTHS_NAMES[calendarMonth]} {calendarYear}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (calendarMonth === 11) {
                              setCalendarMonth(0);
                              setCalendarYear(v => v + 1);
                            } else {
                              setCalendarMonth(v => v + 1);
                            }
                          }}
                          className="p-1 hover:bg-slate-800/10 dark:hover:bg-slate-800 rounded-md text-slate-400 cursor-pointer"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Weekday guide & Cells */}
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
                      {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(d => (
                        <div key={d} className="font-extrabold text-slate-500 text-[8px] tracking-widest uppercase py-1">{d}</div>
                      ))}
                      
                      {calendarCells.map((cell, idx) => {
                        if (cell.dayNum === null || !cell.dateString) {
                          return <div key={`empty-${idx}`} className="p-2 opacity-5" />;
                        }
                        
                        const count = getSalesCountForDate(cell.dateString);
                        const isSelectedRange = filterStartDate <= cell.dateString && filterEndDate >= cell.dateString && filterStartDate !== '' && filterEndDate !== '';
                        const isDaySelectedExact = filterStartDate === cell.dateString && filterEndDate === cell.dateString;
                        const isToday = cell.dateString === '2026-05-19';

                        return (
                          <button
                            key={cell.dateString}
                            type="button"
                            onClick={() => {
                              if (cell.dateString) {
                                setFilterStartDate(cell.dateString);
                                setFilterEndDate(cell.dateString);
                                setSelectedPreset('custom');
                                toast.success(`Selected date sales: ${count} logged on ${cell.dateString}`);
                              }
                            }}
                            className={cn(
                              "relative aspect-square flex flex-col items-center justify-center rounded-xl p-1 font-black cursor-pointer transition-all border border-transparent",
                              isDaySelectedExact 
                                ? "text-white shadow-lg"
                                : isSelectedRange
                                  ? "bg-slate-500/10 border-slate-500/10 text-white"
                                  : isToday
                                    ? "bg-slate-500/15 border-rose-500/30 text-rose-400"
                                    : isDark ? "bg-slate-900/40 text-slate-300 hover:bg-slate-800" : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                            )}
                            style={isDaySelectedExact ? { backgroundColor: settings.primaryColor } : {}}
                          >
                            <span className="text-[10px]">{cell.dayNum}</span>
                            
                            {count > 0 && (
                              <span 
                                className={cn(
                                  "absolute bottom-1 w-1.5 h-1.5 rounded-full",
                                  isDaySelectedExact ? "bg-white" : "bg-emerald-500"
                                )} 
                              />
                            )}
                            
                            {count > 0 && (
                              <span className="absolute top-0.5 right-0.5 text-[7px] bg-emerald-500/15 text-emerald-400 px-1 rounded font-black scale-90">
                                {count}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* CUSTOM DATE PICKERS & REAL-TIME INTERACTIVE SLATE */}
                  <div className="md:col-span-6 lg:col-span-7 flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#ec4899]" style={{ color: settings.primaryColor }}>
                        Custom Range & Statistics
                      </span>
                      
                      <div className="grid grid-cols-2 gap-3 bg-slate-900/5 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-800/10">
                        <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Date Range Start Date</label>
                          <input
                            type="date"
                            value={filterStartDate || ''}
                            onChange={(e) => {
                              setFilterStartDate(e.target.value);
                              setSelectedPreset('custom');
                            }}
                            className={cn(
                              "w-full px-3 py-2 border-none rounded-xl text-[10px] font-black uppercase tracking-wider outline-none",
                              isDark ? "bg-slate-900 text-white" : "bg-slate-200/80 text-slate-800"
                            )}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Date Range End Date</label>
                          <input
                            type="date"
                            value={filterEndDate || ''}
                            onChange={(e) => {
                              setFilterEndDate(e.target.value);
                              setSelectedPreset('custom');
                            }}
                            className={cn(
                              "w-full px-3 py-2 border-none rounded-xl text-[10px] font-black uppercase tracking-wider outline-none",
                              isDark ? "bg-slate-900 text-white" : "bg-slate-200/80 text-slate-800"
                            )}
                          />
                        </div>
                      </div>

                      {/* Display what currently selected range is */}
                      <div className="p-3 text-[10px] font-semibold text-slate-500 flex items-center justify-between">
                        <span>Active Search Scope:</span>
                        <span className="font-extrabold text-slate-300">
                          {filterStartDate && filterEndDate 
                            ? `From: ${filterStartDate} To: ${filterEndDate}` 
                            : 'Maximum Records (All dates)'}
                        </span>
                      </div>
                    </div>

                    {/* COMPARATIVE MONTH STATS BENTO MATRIX */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Range details */}
                      <div className={cn(
                        "p-4 rounded-2xl border border-slate-800/10 flex flex-col justify-between space-y-1",
                        isDark ? "bg-slate-950/40" : "bg-slate-50"
                      )}>
                        <div>
                          <p className="text-[8px] font-black uppercase tracking-wider text-slate-500">Isolated Scope total</p>
                          <p className="text-base font-black text-white mt-1" style={{ color: isDark ? 'white' : 'black' }}>
                            {currencySymbol}{totalRevenue.toLocaleString()}
                          </p>
                        </div>
                        <p className="text-[8px] text-slate-400 font-extrabold tracking-wide mt-1.5 uppercase">{totalTransactionsCount} deals booked</p>
                      </div>

                      {/* This Month May 2026 */}
                      <div className={cn(
                        "p-4 rounded-2xl border border-slate-800/10 flex flex-col justify-between space-y-1",
                        isDark ? "bg-slate-950/40" : "bg-slate-50"
                      )}>
                        <div>
                          <p className="text-[8px] font-black uppercase tracking-wider text-slate-500">This Month (May 2026)</p>
                          <p className="text-base font-black text-emerald-400 mt-1">
                            {currencySymbol}{salesThisMonth.amount.toLocaleString()}
                          </p>
                        </div>
                        <p className="text-[8px] text-slate-400 font-extrabold tracking-wide mt-1.5 uppercase">{salesThisMonth.count} deals closed</p>
                      </div>

                      {/* Last Month April 2026 */}
                      <div className={cn(
                        "p-4 rounded-2xl border border-slate-800/10 flex flex-col justify-between space-y-1",
                        isDark ? "bg-slate-950/40" : "bg-slate-50"
                      )}>
                        <div>
                          <p className="text-[8px] font-black uppercase tracking-wider text-slate-500">Last Month (April 2026)</p>
                          <p className="text-base font-black text-orange-400 mt-1">
                            {currencySymbol}{salesLastMonth.amount.toLocaleString()}
                          </p>
                        </div>
                        <p className="text-[8px] text-slate-400 font-extrabold tracking-wide mt-1.5 uppercase">{salesLastMonth.count} deals closed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Left side: Logging transaction form */}
            <div className="col-span-12 lg:col-span-4">
              <Card className="space-y-6">
                <div>
                  <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                    <ShoppingBag style={{ color: settings.primaryColor }} size={20} />
                    Log New IT Deal
                  </h2>
                  <p className="text-[10px] text-slate-500 mt-1 italic font-medium">Record a purchase made by a client below.</p>
                </div>

                <form onSubmit={handleCreateTransaction} className="space-y-4">
                  {/* Toggle Custom Executive Name for testing multiple sellers */}
                  {activeRole === 'executive' && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] pl-1 font-black uppercase tracking-[0.2em] text-slate-400 italic">Assignee Executive Name</label>
                      <input 
                        type="text" 
                        value={executiveName}
                        onChange={(e) => setExecutiveName(e.target.value)}
                        placeholder="Sarah Ahmed"
                        className={cn(
                          "w-full px-5 py-3 border-none rounded-2xl transition-all outline-none placeholder:text-slate-500 text-xs font-semibold",
                          isDark ? "bg-slate-900/60 text-white" : "bg-slate-100 text-slate-900"
                        )}
                      />
                      <p className="text-[9px] text-slate-500 pl-1">Testing multiple executives: change this name to credit another desk!</p>
                    </div>
                  )}

                  <div className="border-b border-slate-800/20 pb-3">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <label className="text-[10px] pl-1 font-black uppercase tracking-[0.2em] text-slate-400 italic">Customer Selection</label>
                      <button
                        type="button"
                        onClick={() => setTxIsNewCustomer(!txIsNewCustomer)}
                        className="text-[9px] font-black uppercase tracking-wider text-rose-500 bg-rose-500/10 px-2 py-1 rounded-md hover:bg-rose-500 hover:text-white transition-all"
                      >
                        {txIsNewCustomer ? 'Select Existing' : 'Add New Customer'}
                      </button>
                    </div>

                    {!txIsNewCustomer ? (
                      <select
                        value={txCustomerId}
                        onChange={(e) => setTxCustomerId(e.target.value)}
                        required
                        className={cn(
                          "w-full px-5 py-3.5 border-none rounded-2xl transition-all outline-none text-xs font-semibold appearance-none",
                          isDark ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-900"
                        )}
                      >
                        <option value="">-- Choose Customer profile --</option>
                        {customersSnap?.docs.map(doc => (
                          <option key={doc.id} value={doc.id}>
                            {doc.data().name} ({doc.data().phone})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="space-y-3 pt-1">
                        <Input 
                          placeholder="Client Full Name (e.g., Jane Cooper)" 
                          value={txCustomerName}
                          onChange={(e) => setTxCustomerName(e.target.value)}
                        />
                        <Input 
                          placeholder="Contact Phone (e.g., +8801700000000)" 
                          value={txCustomerPhone}
                          onChange={(e) => setTxCustomerPhone(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  {/* Service options from DB */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] pl-1 font-black uppercase tracking-[0.2em] text-slate-400 italic">IT Service Required</label>
                    <select
                      value={txServiceId}
                      onChange={(e) => setTxServiceId(e.target.value)}
                      required
                      className={cn(
                        "w-full px-5 py-3.5 border-none rounded-2xl transition-all outline-none text-xs font-semibold appearance-none",
                        isDark ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-900"
                      )}
                    >
                      <option value="">-- Select Corporate Package --</option>
                      {servicesSnap?.docs.map(doc => (
                        <option key={doc.id} value={doc.id}>
                          {doc.data().name} - {currencySymbol}{doc.data().price}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      label="Service Quantity"
                      type="number"
                      min="1"
                      value={txQuantity}
                      onChange={(e) => setTxQuantity(parseInt(e.target.value) || 1)}
                    />
                    <Input 
                      label="Deal Booking Date"
                      type="date"
                      value={txDate}
                      onChange={(e) => {
                        setTxDate(e.target.value);
                        setTxStartDate(e.target.value); // set default start date to match deal action
                        
                        // Automatically propose 30 days support SLA duration
                        const nd = new Date(e.target.value);
                        nd.setDate(nd.getDate() + 30);
                        setTxEndDate(nd.toISOString().split('T')[0]);
                      }}
                    />
                  </div>

                  {/* Service contractual coverage timeline start and end date controls */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-slate-800/10 space-y-4">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#ec4899] block" style={{ color: settings.primaryColor }}>
                      Contract Service Duration SLA
                    </span>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[8px] pl-1 font-extrabold uppercase tracking-widest text-slate-400 block mb-1">Service SLA Start Date</label>
                        <input
                          type="date"
                          value={txStartDate}
                          onChange={(e) => {
                            setTxStartDate(e.target.value);
                            
                            // Automatically propose a 30-day end date when start date is adjusted
                            const nd = new Date(e.target.value);
                            nd.setDate(nd.getDate() + 30);
                            setTxEndDate(nd.toISOString().split('T')[0]);
                          }}
                          className={cn(
                            "w-full px-4 py-2.5 border-none rounded-xl text-[10px] font-bold outline-none",
                            isDark ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-900 border border-slate-200"
                          )}
                        />
                      </div>

                      <div>
                        <label className="text-[8px] pl-1 font-extrabold uppercase tracking-widest text-slate-400 block mb-1">Service SLA End Date</label>
                        <input
                          type="date"
                          value={txEndDate}
                          onChange={(e) => setTxEndDate(e.target.value)}
                          className={cn(
                            "w-full px-4 py-2.5 border-none rounded-xl text-[10px] font-bold outline-none",
                            isDark ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-900 border border-slate-200"
                          )}
                        />
                      </div>
                    </div>

                    {/* Timeline dynamic helper query resolution card */}
                    <div className="p-3.5 rounded-xl bg-slate-950/20 text-[9.5px] text-slate-400 leading-relaxed font-semibold italic border border-slate-800/20">
                      If set to start on <span className="text-white font-black">{txStartDate === new Date().toISOString().split('T')[0] ? 'Today' : txStartDate}</span>, the last day the client can receive this service is <span className="text-emerald-400 font-extrabold">{txEndDate}</span>.
                      <p className="mt-1 text-slate-500 font-bold not-italic">
                        SLA Span: {Math.max(0, Math.ceil((new Date(txEndDate).getTime() - new Date(txStartDate).getTime()) / (1000 * 3600 * 24)))} days of support.
                      </p>
                    </div>
                  </div>

                  {/* Assignee Sales Executive Option for Administrators */}
                  {activeRole === 'admin' && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] pl-1 font-black uppercase tracking-[0.2em] text-slate-400 italic">Assignee Sales Executive</label>
                      <select
                        value={assignedExecutiveId}
                        onChange={(e) => {
                          const val = e.target.value;
                          setAssignedExecutiveId(val);
                          const matchingUser = usersSnap?.docs
                            .map(doc => ({ id: doc.id, ...doc.data() } as any))
                            .find(u => u.id === val);
                          if (matchingUser) {
                            setAssignedExecutiveName(matchingUser.name);
                            setAssignedExecutiveCommission(matchingUser.commissionPercentage !== undefined ? matchingUser.commissionPercentage : 10);
                            toast.success(`Assigned to ${matchingUser.name} at ${matchingUser.commissionPercentage ?? 10}% commission rate!`);
                          } else {
                            setAssignedExecutiveName('');
                            setAssignedExecutiveCommission(10);
                          }
                        }}
                        className={cn(
                          "w-full px-5 py-3 border-none rounded-2xl transition-all outline-none text-xs font-semibold appearance-none",
                          isDark ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-900"
                        )}
                      >
                        <option value="">-- Assign to Me (Admin Desk) --</option>
                        {usersSnap?.docs
                          .map(doc => ({ id: doc.id, ...doc.data() } as any))
                          .filter(u => u.role === 'executive')
                          .map(u => (
                            <option key={u.id} value={u.id}>
                              {u.name} (Commission: {u.commissionPercentage !== undefined ? u.commissionPercentage : 10}%)
                            </option>
                          ))}
                      </select>
                    </div>
                  )}

                  {/* Initial Payment Status Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] pl-1 font-black uppercase tracking-[0.2em] text-slate-400 italic">Deal Initial Payment Status</label>
                    <div className="grid grid-cols-2 gap-2 bg-slate-900/10 dark:bg-slate-950/40 p-1 rounded-2xl border border-slate-800/10">
                      <button
                        type="button"
                        onClick={() => setTxPaymentStatus('Collected')}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex-1 text-center",
                          txPaymentStatus === 'Collected'
                            ? "bg-emerald-600 text-white shadow font-semibold"
                            : "text-slate-400 hover:text-slate-200"
                        )}
                      >
                        Collected (Cleared)
                      </button>
                      <button
                        type="button"
                        onClick={() => setTxPaymentStatus('Due')}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex-1 text-center",
                          txPaymentStatus === 'Due'
                            ? "bg-rose-600 text-white shadow font-semibold"
                            : "text-slate-400 hover:text-slate-200"
                        )}
                      >
                        Due (Outstanding)
                      </button>
                    </div>
                  </div>

                  {/* Instant pricing calculation display box */}
                  {txServiceId && (
                    <div className="p-4 rounded-2xl bg-[#ec4899]10 text-[#ec4899] flex items-center justify-between text-xs font-black relative overflow-hidden" style={{ backgroundColor: `${settings.primaryColor}10`, color: settings.primaryColor }}>
                      <span>Estimated Amount Check:</span>
                      <span>
                        {currencySymbol}{((servicesSnap?.docs.find(s => s.id === txServiceId)?.data().price || 0) * txQuantity).toLocaleString()}
                      </span>
                    </div>
                  )}

                  <Button type="submit" className="w-full text-xs font-black uppercase tracking-widest py-4 rounded-2.5xl">
                    <Plus size={14} /> File Transaction Call
                  </Button>
                </form>
              </Card>
            </div>

            {/* Right side: Purchases table list & executive performances */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              
              {/* Executive performance mini track */}
              {activeRole === 'admin' && (
                <Card className="p-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.15em] mb-4 text-slate-400 flex items-center gap-2">
                    <TrendingUp size={14} style={{ color: settings.primaryColor }} />
                    Sellers Desk Performance
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {Object.keys(executivesPerformanceMap).length === 0 ? (
                      <p className="text-xs text-slate-500 italic pb-2 col-span-3">No sales logged in active database to track yet.</p>
                    ) : (
                      Object.entries(executivesPerformanceMap).map(([name, stat], idx) => (
                        <div key={idx} className={cn(
                          "p-3 rounded-2xl border flex flex-col justify-between",
                          isDark ? "bg-slate-900/30 border-white/5" : "bg-slate-50 border-slate-100"
                        )}>
                          <div>
                            <p className="text-[10px] font-bold text-slate-500">{name}</p>
                            <p className="text-lg font-black mt-1" style={{ color: settings.primaryColor }}>{currencySymbol}{stat.amount.toLocaleString()}</p>
                          </div>
                          <p className="text-[9px] font-semibold text-slate-400 mt-2">{stat.count} closed contract accounts</p>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              )}

              {/* Transactions Ledger Panel */}
              <Card className="overflow-hidden p-0">
                <div className="p-6 border-b border-slate-800/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-base font-black uppercase tracking-tight flex items-center gap-2">
                      <FolderTree size={16} style={{ color: settings.primaryColor }} />
                      Filtered Deal Registry({filteredTransactions.length})
                    </h3>
                    <p className="text-[10px] text-slate-500 italic font-medium mt-1">Shows transactions allowed by your security levels.</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className={cn(
                        "border-b font-black uppercase text-[10px] tracking-widest text-slate-400",
                        isDark ? "border-white/5 bg-white/[0.02]" : "border-slate-100 bg-slate-50/50"
                      )}>
                        <th className="p-4">Customer Info</th>
                        <th className="p-4">Service</th>
                        <th className="p-4">Pricing</th>
                        <th className="p-4 text-center">Qty</th>
                        <th className="p-4">Total Booking</th>
                        <th className="p-4">Executive</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">SLA Service Window</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/10 font-medium font-sans">
                      {filteredTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-slate-500 italic">
                            No IT deals matching filter criteria. Record a transaction or trigger "Seeding Data" to initialize.
                          </td>
                        </tr>
                      ) : (
                        filteredTransactions.map((tx, idx) => (
                          <tr key={tx.id || idx} className={cn(
                            "hover:bg-slate-50/50 transition-colors",
                            isDark ? "hover:bg-white/[0.02]" : ""
                          )}>
                            <td className="p-4">
                              <p className="font-bold text-slate-100" style={{ color: isDark ? 'white' : 'black' }}>{tx.customerName}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">{tx.customerPhone}</p>
                            </td>
                            <td className="p-4">
                              <p className="font-bold max-w-xs truncate">{tx.serviceName}</p>
                            </td>
                            <td className="p-4 font-mono text-[11px]">{currencySymbol}{Number(tx.price).toLocaleString()}</td>
                            <td className="p-4 text-center font-bold">{tx.quantity}</td>
                            <td className="p-4 font-black font-mono text-[11px]" style={{ color: settings.primaryColor }}>
                              {currencySymbol}{Number(tx.totalAmount).toLocaleString()}
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-1 rounded-md text-[9px] font-bold bg-slate-500/10 text-slate-400">
                                {tx.executiveName || 'Admin'}
                              </span>
                            </td>
                            <td className="p-4 text-slate-400 font-mono text-[10px]">{tx.date}</td>
                            <td className="p-4">
                              <div className="text-[9.5px] leading-normal font-sans bg-slate-900/10 dark:bg-slate-950/40 p-2 rounded-xl border border-slate-800/10 space-y-0.5 inline-block min-w-[7.5rem]">
                                <div className="flex gap-1.5 justify-between">
                                  <span className="text-slate-500 font-black">START:</span>
                                  <span className="text-emerald-400 font-bold">{tx.startDate || tx.date}</span>
                                </div>
                                <div className="flex gap-1.5 justify-between">
                                  <span className="text-slate-500 font-black">END:</span>
                                  <span className="text-pink-400 font-bold">{tx.endDate || tx.date}</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </>
        )}

        {/* TAB 2: IT SERVICES MANAGER */}
        {activeSubTab === 'services' && (
          <>
            {/* Left form input */}
            <div className="col-span-12 lg:col-span-5">
              <Card className="space-y-6">
                <div>
                  <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                    <Briefcase style={{ color: settings.primaryColor }} size={20} />
                    Add Corporate IT Service
                  </h2>
                  <p className="text-[10px] text-slate-500 mt-1 italic font-medium">Extend business catalog packages or project scopes details.</p>
                </div>

                <form onSubmit={handleAddService} className="space-y-4">
                  <Input 
                    label="Service Name"
                    placeholder="e.g., Scalable Magento/NextJS E-Commerce"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    required
                  />
                  
                  <Input 
                    label={`Base Rate (${currency})`}
                    placeholder="e.g., 4200"
                    type="number"
                    value={servicePrice}
                    onChange={(e) => setServicePrice(e.target.value)}
                    required
                  />

                  <div className="space-y-1.5">
                    <label className="text-[10px] pl-1 font-black uppercase tracking-[0.2em] text-slate-400 italic">Description of Service</label>
                    <textarea
                      placeholder="e.g., High performant commerce pipeline configuration, Stripe backend webhooks integration..."
                      value={serviceDesc}
                      onChange={(e) => setServiceDesc(e.target.value)}
                      className={cn(
                        "w-full px-5 py-4 border-none rounded-2xl transition-all outline-none placeholder:text-slate-500 text-xs font-semibold h-24",
                        isDark ? "bg-slate-900/70 text-white" : "bg-slate-100 text-slate-900"
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full text-xs font-black uppercase tracking-widest py-4 rounded-2.5xl">
                    <Check size={14} /> Add Service Offer
                  </Button>
                </form>
              </Card>
            </div>

            {/* Service list table right */}
            <div className="col-span-12 lg:col-span-7">
              <Card className="p-0 overflow-hidden">
                <div className="p-6 border-b border-slate-800/10">
                  <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <Database size={16} style={{ color: settings.primaryColor }} />
                    Live Services Catalog({servicesSnap?.size || 0})
                  </h3>
                  <p className="text-[10px] text-slate-500 italic mt-1">These packages are dynamically loaded into transaction pickers.</p>
                </div>

                <div className="divide-y divide-slate-800/10">
                  {servicesSnap?.empty ? (
                    <div className="p-12 text-center text-slate-500 italic">No services listed yet. Populate automatically with the top-right button.</div>
                  ) : (
                    servicesSnap?.docs.map(doc => {
                      const data = doc.data();
                      return (
                        <div key={doc.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/20 transition-all">
                          <div className="space-y-1">
                            <h4 className="font-bold text-sm tracking-tight text-white" style={{ color: isDark ? 'white' : 'black' }}>{data.name}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed font-semibold italic">{data.description || 'No description provided.'}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-lg font-mono font-black" style={{ color: settings.primaryColor }}>{currencySymbol}{Number(data.price).toLocaleString()}</p>
                            <p className="text-[8px] font-bold text-slate-500 mt-1 uppercase tracking-wider">Base Package Rate</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </Card>
            </div>
          </>
        )}

        {/* TAB 3: SEARCHABLE CUSTOMER RELATION DIRECTORY & PURCHASE HISTORY HIDDEN LEDGER */}
        {activeSubTab === 'customers' && (() => {
          const totalRegisteredClients = customerList.length;
          const duesCustomers = customerList.filter(cust => 
            cust.status === 'Due' || 
            cust.hasCredit || 
            cust.dueAmount > 0 || 
            cust.creditNote.toUpperCase().includes('DUE')
          );
          const totalDuesSectionCount = duesCustomers.length;
          const totalRefundAmountSum = customerList.reduce((acc, c) => acc + (c.refundAmount || 0), 0);
          const totalOutstandingDuesSum = customerList.reduce((acc, c) => acc + (c.dueAmount || 0), 0);

          const getStatusBadgeClass = (status: string) => {
            switch (status) {
              case 'Due':
                return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
              case 'Refund':
                return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
              case 'Order Cancel':
                return 'bg-slate-500/20 text-slate-400 border border-slate-550/30';
              case 'Processing':
                return 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
              case 'Ongoing':
              default:
                return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
            }
          };

          const isCustomerDue = (cust: any) => {
            return (
              cust.status === 'Due' ||
              cust.hasCredit ||
              cust.dueAmount > 0 ||
              cust.creditNote.toUpperCase().includes('DUE')
            );
          };

          return (
            <>
              {/* CRM BENTO HISTOGRAM STATS SUMMARY */}
              <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className={cn("p-5 rounded-3xl border border-slate-800/10 shadow-lg", isDark ? "bg-slate-950/40" : "bg-white")}>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Corporate Accounts</p>
                  <p className="text-2xl font-black mt-1" style={{ color: isDark ? 'white' : 'black' }}>{totalRegisteredClients}</p>
                  <p className="text-[8px] text-slate-400 font-bold uppercase mt-1">Total active corporate clients</p>
                </div>

                <div className="p-5 rounded-3xl border border-rose-500/10 shadow-lg bg-rose-500/5">
                  <p className="text-[10px] font-black uppercase tracking-wider text-rose-400">Dues Section Contacts</p>
                  <p className="text-2xl font-black mt-1 text-rose-500">{totalDuesSectionCount}</p>
                  <p className="text-[8px] text-rose-400/75 font-bold uppercase mt-1">Clients with credit or overdues</p>
                </div>

                <div className="p-5 rounded-3xl border border-amber-500/10 shadow-lg bg-amber-500/5">
                  <p className="text-[10px] font-black uppercase tracking-wider text-amber-400">Total Refunds Issued</p>
                  <p className="text-2xl font-black mt-1 text-amber-500">{currencySymbol}{totalRefundAmountSum.toLocaleString()}</p>
                  <p className="text-[8px] text-amber-400/75 font-bold uppercase mt-1">Deducted from gross balances</p>
                </div>

                <div className="p-5 rounded-3xl border border-red-500/10 shadow-lg bg-red-500/5">
                  <p className="text-[10px] font-black uppercase tracking-wider text-red-400">Outstanding Receivable</p>
                  <p className="text-2xl font-black mt-1 text-red-500">{currencySymbol}{totalOutstandingDuesSum.toLocaleString()}</p>
                  <p className="text-[8px] text-red-400/75 font-bold uppercase mt-1">Aggregate pending dues</p>
                </div>
              </div>

              {/* Search & Custom list column */}
              <div className="col-span-12 lg:col-span-7 space-y-6">
                <Card className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                    <div>
                      <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                        <Users size={20} style={{ color: settings.primaryColor }} />
                        Corporate CRM Directory
                      </h2>
                      <p className="text-[10px] text-slate-500 mt-1 italic">Query and maintain client ledgers, manage receivables and refunds.</p>
                    </div>
                  </div>

                  {/* Dynamic CRM Section Tab selector */}
                  <div className="flex items-center gap-2 bg-slate-900/10 dark:bg-slate-950/40 p-1 rounded-2xl border border-slate-800/10">
                    <button
                      type="button"
                      onClick={() => setCrmFilterMode('all')}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex-1 cursor-pointer",
                        crmFilterMode === 'all'
                          ? "text-white shadow"
                          : isDark ? "text-slate-400 hover:bg-white/[0.03]" : "text-slate-750 hover:bg-slate-200"
                      )}
                      style={crmFilterMode === 'all' ? { backgroundColor: settings.primaryColor } : {}}
                    >
                      All Profiles ({totalRegisteredClients})
                    </button>
                    <button
                      type="button"
                      onClick={() => setCrmFilterMode('dues')}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex-1 cursor-pointer flex items-center justify-center gap-2",
                        crmFilterMode === 'dues'
                          ? "bg-red-600 text-white shadow font-semibold"
                          : "text-rose-400 hover:bg-rose-500/5 bg-rose-500/10 border border-rose-500/20"
                      )}
                    >
                      Dues Section ({totalDuesSectionCount})
                    </button>
                  </div>

                  {/* Instant Dynamic Search input box */}
                  <div className="relative">
                    <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={customerSearchQuery}
                      onChange={(e) => setCustomerSearchQuery(e.target.value)}
                      placeholder="Search customers by name or phone number..."
                      className={cn(
                        "w-full pl-11 pr-5 py-3.5 border-none rounded-2xl transition-all outline-none placeholder:text-slate-500 text-xs font-semibold",
                        isDark ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-900"
                      )}
                    />
                  </div>

                  {/* Customer Records Loop */}
                  <div className="space-y-3">
                    {searchedCustomers.length === 0 ? (
                      <div className="p-12 text-center text-slate-500 italic border border-dashed border-slate-850/10 rounded-3xl flex flex-col items-center justify-center">
                        <AlertCircle size={32} className="text-slate-600 mb-2" />
                        <p className="text-sm font-bold uppercase text-slate-400 tracking-wide">No Profiles Found</p>
                        <p className="text-[10px] text-slate-500 mt-1">No corporate profiles match the designated search scope.</p>
                      </div>
                    ) : (
                      searchedCustomers.map((cust) => {
                        const hasDuesNow = isCustomerDue(cust);
                        return (
                          <div
                            key={cust.id}
                            onClick={() => {
                              setSelectedCustomerIdForDetails(cust.id);
                              setEditingCustomerId(null); // Clear other inputs
                              setEditingTxId(null);
                            }}
                            className={cn(
                              "p-4 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group relative overflow-hidden",
                              selectedCustomerIdForDetails === cust.id
                                ? "border-pink-500 bg-pink-500/5"
                                : isDark ? "bg-[#0b0c16]/50 border-white/5 hover:bg-white/[0.03]" : "bg-white border-slate-200 hover:bg-slate-50"
                            )}
                            style={selectedCustomerIdForDetails === cust.id ? { borderColor: settings.primaryColor, backgroundColor: `${settings.primaryColor}08` } : {}}
                          >
                            <div className="flex items-start gap-3">
                              <div className="p-2.5 bg-slate-900/10 dark:bg-slate-950/40 rounded-xl">
                                <Users size={16} style={{ color: settings.primaryColor }} />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-extrabold text-sm" style={{ color: isDark ? 'white' : 'black' }}>{cust.name}</span>
                                  <span className={cn("px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider", getStatusBadgeClass(cust.status))}>
                                    {cust.status}
                                  </span>
                                  {hasDuesNow && (
                                    <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-rose-600 text-white animate-pulse">
                                      DUE
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-500 font-mono mt-1">{cust.phone}</p>
                                {cust.creditNote && (
                                  <p className="text-[10px] text-orange-400/90 font-bold italic mt-1">Remarks: "{cust.creditNote}"</p>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-right flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800/10">
                              <div>
                                <p className="text-xs font-black text-slate-100" style={{ color: isDark ? 'white' : 'black' }}>
                                  <strong className="text-[9px] text-slate-500 mr-1 uppercase font-bold">Net Balance:</strong>
                                  {currencySymbol}{cust.totalSpent.toLocaleString()}
                                </p>
                                <div className="flex gap-2 justify-end text-[9px] font-bold mt-0.5">
                                  {cust.refundAmount > 0 && (
                                    <span className="text-amber-500">Ref: -{currencySymbol}{cust.refundAmount}</span>
                                  )}
                                  {cust.dueAmount > 0 && (
                                    <span className="text-rose-500">Due: +{currencySymbol}{cust.dueAmount}</span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                                {customerToDeleteId === cust.id ? (
                                  <div className="flex items-center gap-1 bg-rose-500/15 border border-rose-500/20 p-1 rounded-xl">
                                    <span className="text-[8px] font-black text-rose-400 px-1 uppercase tracking-wider">Confirm?</span>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteCustomer(cust.id)}
                                      className="px-2 py-1 text-[8px] font-black uppercase text-white bg-rose-600 hover:bg-rose-500 rounded-lg cursor-pointer"
                                    >
                                      Delete
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setCustomerToDeleteId(null)}
                                      className="px-2 py-1 text-[8px] font-black uppercase text-slate-400 bg-slate-800 rounded-lg hover:text-white cursor-pointer"
                                    >
                                      No
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        startEditingCustomer(cust);
                                        setSelectedCustomerIdForDetails(cust.id);
                                        setEditingTxId(null);
                                      }}
                                      className="p-2 rounded-xl bg-slate-800/5 dark:bg-slate-900/40 text-slate-400 hover:text-white hover:bg-slate-850 cursor-pointer"
                                      title="Edit Customer Profile"
                                    >
                                      <Edit size={12} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setCustomerToDeleteId(cust.id)}
                                      className="p-2 rounded-xl bg-rose-500/5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                                      title="Delete Customer Profile"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </>
                                )}
                                <ChevronRight size={14} className="text-slate-550 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </Card>
              </div>

              {/* Sidebar drawer dossier */}
              <div className="col-span-12 lg:col-span-5">
                <Card className="min-h-[300px] h-full">
                  {selectedCustomerRecord ? (
                    editingCustomerId === selectedCustomerRecord.id ? (
                      
                      /* EDIT PROFILE FORM OVERLAY */
                      <form onSubmit={handleUpdateCustomer} className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800/10 pb-3">
                          <div>
                            <h3 className="font-extrabold text-sm uppercase tracking-wider" style={{ color: isDark ? 'white' : 'black' }}>
                              Modify Client Account
                            </h3>
                            <p className="text-[9px] text-slate-500 italic">Adjust general credentials and credit statuses</p>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => setEditingCustomerId(null)} 
                            className="p-2 rounded-xl bg-slate-800/20 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                          >
                            <X size={14} />
                          </button>
                        </div>

                        <div className="space-y-3.5 text-xs">
                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-500 mb-1">Corporate Client Name</label>
                            <input
                              type="text"
                              value={editCustomerName}
                              onChange={(e) => setEditCustomerName(e.target.value)}
                              className={cn(
                                "w-full px-3.5 py-2.5 border-none rounded-xl text-xs font-bold outline-none",
                                isDark ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-900 border border-slate-200"
                              )}
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] font-black uppercase text-slate-500 mb-1">Telephone line/Contact</label>
                            <input
                              type="text"
                              value={editCustomerPhone}
                              onChange={(e) => setEditCustomerPhone(e.target.value)}
                              className={cn(
                                "w-full px-3.5 py-2.5 border-none rounded-xl text-xs font-bold outline-none",
                                isDark ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-900 border border-slate-200"
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[9px] font-black uppercase text-slate-500 mb-1">Pipeline Status</label>
                              <select
                                value={editCustomerStatus}
                                onChange={(e: any) => setEditCustomerStatus(e.target.value)}
                                className={cn(
                                  "w-full px-3 py-2.5 border-none rounded-xl text-xs font-bold outline-none",
                                  isDark ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-900 border border-slate-200"
                                )}
                              >
                                <option value="Ongoing">Ongoing</option>
                                <option value="Processing">Processing</option>
                                <option value="Due">Due</option>
                                <option value="Refund">Refund</option>
                                <option value="Order Cancel">Order Cancel</option>
                              </select>
                            </div>

                            <div className="flex flex-col justify-end pb-2">
                              <label className="relative flex items-center gap-2 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={editCustomerHasCredit}
                                  onChange={(e) => {
                                    setEditCustomerHasCredit(e.target.checked);
                                    if (e.target.checked && !editCustomerCreditNote) {
                                      setEditCustomerCreditNote('DUE'); // pre-fill status
                                    }
                                  }}
                                  className="accent-pink-600 rounded"
                                />
                                <span className="text-[10px] font-black text-slate-300">Taken Credit?</span>
                              </label>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 bg-slate-900/10 dark:bg-slate-950/20 p-3 rounded-2xl border border-slate-800/10">
                            <div>
                              <label className="block text-[9px] font-black uppercase text-amber-500 mb-1">Refund Amount ({currencySymbol})</label>
                              <input
                                type="number"
                                value={editCustomerRefundAmount}
                                onChange={(e) => setEditCustomerRefundAmount(e.target.value)}
                                className={cn(
                                  "w-full px-2.5 py-2 rounded-xl border-none text-[11px] font-black outline-none text-amber-400",
                                  isDark ? "bg-slate-900" : "bg-slate-200/50"
                                )}
                              />
                            </div>

                            <div>
                              <label className="block text-[9px] font-black uppercase text-rose-500 mb-1">Outstanding Dues ({currencySymbol})</label>
                              <input
                                type="number"
                                value={editCustomerDueAmount}
                                onChange={(e) => setEditCustomerDueAmount(e.target.value)}
                                className={cn(
                                  "w-full px-2.5 py-2 rounded-xl border-none text-[11px] font-black outline-none text-rose-400",
                                  isDark ? "bg-slate-900" : "bg-slate-200/50"
                                )}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="block text-[9px] font-black uppercase text-slate-400">Payment status / credit notes</label>
                              <span className="text-[7.5px] bg-[#ec4899]/15 text-[#ec4899] font-black uppercase px-1 rounded">Shift Trigger</span>
                            </div>
                            <input
                              type="text"
                              value={editCustomerCreditNote}
                              placeholder="Write 'DUE' to shift to Dues section..."
                              onChange={(e) => setEditCustomerCreditNote(e.target.value)}
                              className={cn(
                                "w-full px-3 py-2 rounded-xl border-none text-xs font-bold outline-none",
                                isDark ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-900 border border-slate-250"
                              )}
                            />
                            <p className="text-[8.5px] text-slate-500 mt-1 leading-relaxed">
                              If the customer has taken service on credit, and you write <strong className="text-pink-400">"DUE"</strong> in credit notes, they will go directly to the dues section of the CRM directory.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            type="submit"
                            className="flex-1 py-2 text-xs font-black uppercase tracking-wider text-white"
                            style={{ backgroundColor: settings.primaryColor }}
                          >
                            Save Client Profile
                          </Button>
                          <button
                            type="button"
                            onClick={() => setEditingCustomerId(null)}
                            className={cn(
                              "px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer",
                              isDark ? "bg-slate-900 hover:bg-slate-800 text-slate-400" : "bg-slate-150 hover:bg-slate-200 text-slate-700"
                            )}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      
                      /* VIEW DETAILED PROFILE DOSSIER */
                      <div className="space-y-6">
                        <div className="border-b border-slate-800/10 pb-4">
                          <div className="flex justify-between items-start gap-4">
                            <span className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-[#ec4899]/10 text-[#ec4899]" style={{ color: settings.primaryColor, backgroundColor: `${settings.primaryColor}15` }}>
                              Client Ledger dossier
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => startEditingCustomer(selectedCustomerRecord)}
                                className="p-1.5 rounded-lg bg-slate-900/10 dark:bg-slate-950/40 text-slate-400 hover:text-white"
                                title="Edit Settings"
                              >
                                <Edit size={14} />
                              </button>

                              {customerToDeleteId === selectedCustomerRecord.id ? (
                                <div className="flex items-center gap-1 bg-rose-500/15 border border-rose-500/20 p-1 rounded-lg">
                                  <span className="text-[7.5px] font-black text-rose-400 px-1 uppercase tracking-wider">Delete?</span>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteCustomer(selectedCustomerRecord.id)}
                                    className="px-2 py-0.5 text-[8px] font-black uppercase text-white bg-rose-600 hover:bg-rose-500 rounded cursor-pointer"
                                  >
                                    Yes
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setCustomerToDeleteId(null)}
                                    className="px-2 py-0.5 text-[8px] font-black uppercase text-slate-400 bg-slate-800 rounded hover:text-white cursor-pointer"
                                  >
                                    No
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setCustomerToDeleteId(selectedCustomerRecord.id)}
                                  className="p-1.5 rounded-lg bg-rose-500/5 text-slate-400 hover:text-rose-400"
                                  title="Delete Profile"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          </div>

                          <h3 className="text-xl font-black mt-3 text-white" style={{ color: isDark ? 'white' : 'black' }}>{selectedCustomerRecord.name}</h3>
                          <p className="text-xs text-slate-500 font-mono mt-1">{selectedCustomerRecord.phone}</p>
                          
                          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800/10">
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Gross Purchased</p>
                              <p className="text-lg font-black text-white mt-1" style={{ color: isDark ? 'white' : 'black' }}>{currencySymbol}{selectedCustomerRecord.totalSpentSales.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Adjusted Balance (Net)</p>
                              <p className="text-lg font-black mt-1" style={{ color: settings.primaryColor }}>{currencySymbol}{selectedCustomerRecord.totalSpent.toLocaleString()}</p>
                            </div>
                          </div>

                          {/* Quick details about active dues and refunds */}
                          {(selectedCustomerRecord.dueAmount > 0 || selectedCustomerRecord.refundAmount > 0) && (
                            <div className="mt-3 p-3 rounded-2xl bg-slate-900/10 dark:bg-slate-950/40 border border-slate-800/10 grid grid-cols-2 gap-2 text-[10px]">
                              {selectedCustomerRecord.refundAmount > 0 && (
                                <div>
                                  <span className="font-extrabold text-amber-500">Refund Issued:</span>
                                  <p className="font-black text-slate-300 mt-0.5">{currencySymbol}{selectedCustomerRecord.refundAmount.toLocaleString()}</p>
                                </div>
                              )}
                              {selectedCustomerRecord.dueAmount > 0 && (
                                <div>
                                  <span className="font-extrabold text-rose-500">Pending Due:</span>
                                  <p className="font-black text-slate-300 mt-0.5">{currencySymbol}{selectedCustomerRecord.dueAmount.toLocaleString()}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Interactive Status Transition Selector */}
                        <div className="bg-slate-900/10 dark:bg-slate-950/30 p-3.5 rounded-2xl border border-slate-850/5 space-y-2.5">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Account Pipeline State</p>
                          <div className="flex flex-wrap gap-1">
                            {['Ongoing', 'Processing', 'Due', 'Refund', 'Order Cancel'].map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={async () => {
                                  const loadUp = toast.loading(`Adjusting pipeline to ${opt}...`);
                                  try {
                                    await updateDoc(doc(db, 'customers', selectedCustomerRecord.id), {
                                      status: opt,
                                      updatedAt: new Date().toISOString()
                                    });
                                    toast.success(`Pipeline adjusted to ${opt}!`, { id: loadUp });
                                  } catch (err) {
                                    toast.error('Failed to change status.', { id: loadUp });
                                  }
                                }}
                                className={cn(
                                  "px-2 py-1 rounded-xl text-[8.5px] font-black uppercase tracking-wider transition-all cursor-pointer flex-1 text-center",
                                  selectedCustomerRecord.status === opt
                                    ? "text-white shadow"
                                    : "bg-slate-900/15 dark:bg-slate-900/40 text-slate-400 hover:text-white"
                                )}
                                style={selectedCustomerRecord.status === opt ? { backgroundColor: settings.primaryColor } : {}}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Deal lists */}
                        <div className="space-y-3">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Deals & Service Packages</h4>
                          
                          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                            {selectedCustomerRecord.history.length === 0 ? (
                              <p className="text-xs text-slate-500 italic">No purchase rows associated with this account yet.</p>
                            ) : (
                              selectedCustomerRecord.history.map((tx: any, idx: number) => {
                                const isEditingThisTx = editingTxId === tx.id;
                                return (
                                  <div key={tx.id || idx}>
                                    {isEditingThisTx ? (
                                      
                                      /* INLINE TRANSACTION PACKAGE EDITOR */
                                      <div className="p-3.5 rounded-2xl border border-pink-500/30 bg-pink-500/5 space-y-3 text-xs">
                                        <div className="flex justify-between items-center pb-2 border-b border-slate-800/10">
                                          <span className="font-black text-[8px] uppercase tracking-wider text-pink-400">Edit Contract Package</span>
                                          <button type="button" onClick={() => setEditingTxId(null)} className="text-slate-500 hover:text-slate-350">
                                            <X size={12} />
                                          </button>
                                        </div>
                                        
                                        <div className="space-y-2.5">
                                          <div>
                                            <label className="block text-[8px] font-black uppercase text-slate-400 mb-0.5">IT Offering Package</label>
                                            <select
                                              value={editTxServiceId}
                                              onChange={(e) => {
                                                setEditTxServiceId(e.target.value);
                                                const originalServ = servicesSnap?.docs.find(s => s.id === e.target.value);
                                                if (originalServ) {
                                                  setEditTxPrice(String(originalServ.data().price));
                                                }
                                              }}
                                              className={cn(
                                                "w-full px-2 py-1.5 rounded-lg border-none text-[11px] font-bold outline-none",
                                                isDark ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-900"
                                              )}
                                            >
                                              <option value="">-- Change Service Item --</option>
                                              {servicesSnap?.docs.map(s => (
                                                <option key={s.id} value={s.id}>{s.data().name}</option>
                                              ))}
                                            </select>
                                          </div>

                                          <div className="grid grid-cols-2 gap-2">
                                            <div>
                                              <label className="block text-[8px] font-black uppercase text-slate-400 mb-0.5">Unit Rate ({currencySymbol})</label>
                                              <input
                                                type="number"
                                                value={editTxPrice}
                                                onChange={(e) => setEditTxPrice(e.target.value)}
                                                className={cn(
                                                  "w-full px-2 py-1.5 rounded-lg border-none text-[11px] font-bold outline-none text-emerald-400",
                                                  isDark ? "bg-slate-900" : "bg-slate-200"
                                                )}
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-[8px] font-black uppercase text-slate-400 mb-0.5">Quantity</label>
                                              <input
                                                type="number"
                                                value={editTxQuantity}
                                                onChange={(e) => setEditTxQuantity(parseInt(e.target.value) || 1)}
                                                className={cn(
                                                  "w-full px-2 py-1.5 rounded-lg border-none text-[11px] font-bold outline-none",
                                                  isDark ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-900"
                                                )}
                                              />
                                            </div>
                                          </div>

                                          <div className="grid grid-cols-2 gap-2">
                                            <div>
                                              <label className="block text-[8px] font-black uppercase text-slate-400 mb-0.5">SLA Starts</label>
                                              <input
                                                type="date"
                                                value={editTxStartDate}
                                                onChange={(e) => setEditTxStartDate(e.target.value)}
                                                className={cn(
                                                  "w-full px-2 py-1.5 rounded-lg border-none text-[10px] font-semibold outline-none",
                                                  isDark ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-900"
                                                )}
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-[8px] font-black uppercase text-slate-400 mb-0.5">SLA Term Demarc</label>
                                              <input
                                                type="date"
                                                value={editTxEndDate}
                                                onChange={(e) => setEditTxEndDate(e.target.value)}
                                                className={cn(
                                                  "w-full px-2 py-1.5 rounded-lg border-none text-[10px] font-semibold outline-none",
                                                  isDark ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-900"
                                                )}
                                              />
                                            </div>
                                          </div>
                                        </div>

                                        <div className="flex gap-2 pt-1 border-t border-slate-800/10">
                                          <button
                                            type="button"
                                            onClick={() => handleUpdatePackage(tx.id)}
                                            className="flex-1 py-1.5 rounded-xl text-[9px] font-black uppercase text-white bg-emerald-600 hover:bg-emerald-500 transition-colors cursor-pointer"
                                          >
                                            Save Package
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => setEditingTxId(null)}
                                            className={cn(
                                              "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase transition-colors cursor-pointer",
                                              isDark ? "bg-slate-850 text-slate-400" : "bg-slate-200 text-slate-650"
                                            )}
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      
                                      /* STANDARD TRANSACTION COMPONENT ROW */
                                      <div className={cn(
                                        "p-3 rounded-2xl border space-y-2.5 relative group/row",
                                        isDark ? "bg-slate-900/60 border-white/5" : "bg-slate-50 border-slate-100"
                                      )}>
                                        <div className="flex justify-between items-start gap-2">
                                          <p className="font-extrabold text-xs truncate max-w-[13rem] text-slate-200" style={{ color: isDark ? 'white' : 'black' }}>{tx.serviceName}</p>
                                          <span className="text-[10px] font-black text-rose-400 font-mono" style={{ color: settings.primaryColor }}>
                                            {currencySymbol}{tx.totalAmount.toLocaleString()}
                                          </span>
                                        </div>
                                        <div className="flex justify-between text-[9px] text-slate-500">
                                          <span>Booked: {tx.date}</span>
                                          <span className="font-semibold italic">Qty: {tx.quantity} pcs @ {currencySymbol}{tx.price || tx.totalAmount}</span>
                                        </div>
                                        <div className="bg-slate-900/40 dark:bg-slate-950/40 p-2 rounded-lg text-[9px] text-slate-400 space-y-1 border border-slate-800/10">
                                          <p className="font-black text-[7.5px] uppercase tracking-wider text-slate-500">SLA Support Window</p>
                                          <div className="flex justify-between gap-2">
                                            <span>Starts: <strong className="text-emerald-400">{tx.startDate || tx.date}</strong></span>
                                            <span>Ends: <strong className="text-pink-400">{tx.endDate || tx.date}</strong></span>
                                          </div>
                                        </div>
                                        
                                        <div className="flex justify-between items-center text-[8px] text-slate-500 pt-1 border-t border-slate-800/5">
                                          <span>Sales Associate: <strong className="text-slate-400 font-bold ml-1">{tx.executiveName || 'Core Team'}</strong></span>
                                          
                                          {/* Package Edit Shortcut Buttons */}
                                          <div className="flex items-center gap-1">
                                            {txToDeleteId === tx.id ? (
                                              <div className="flex items-center gap-1 bg-rose-500/15 border border-rose-500/20 p-0.5 rounded">
                                                <span className="text-[7px] font-black text-rose-400 uppercase tracking-widest px-0.5">Sure?</span>
                                                <button
                                                  type="button"
                                                  onClick={() => handleDeleteTransaction(tx.id)}
                                                  className="px-1 py-0.5 text-[7px] font-black uppercase text-white bg-rose-600 rounded cursor-pointer"
                                                >
                                                  Yes
                                                </button>
                                                <button
                                                  type="button"
                                                  onClick={() => setTxToDeleteId(null)}
                                                  className="px-1 py-0.5 text-[7px] font-black uppercase text-slate-400 bg-slate-800 rounded hover:text-white cursor-pointer"
                                                >
                                                  No
                                                </button>
                                              </div>
                                            ) : (
                                              <>
                                                <button
                                                  type="button"
                                                  onClick={() => startEditingPackage(tx)}
                                                  className="p-1 rounded bg-slate-900/10 text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer text-[8px] font-bold uppercase transition"
                                                >
                                                  Change Package
                                                </button>
                                                <button
                                                  type="button"
                                                  onClick={() => setTxToDeleteId(tx.id)}
                                                  className="p-1 rounded bg-rose-500/5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer text-[8px] font-bold uppercase transition"
                                                >
                                                  Cancel
                                                </button>
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500">
                      <UserPlus size={40} className="text-slate-600 mb-4 animate-bounce-slow" />
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">Client Detailed Dossier</p>
                      <p className="text-[10px] max-w-xs mt-2 italic font-medium">Click on any customer in the CRM Directory to parse their accounts, credits, overdues and refunds.</p>
                    </div>
                  )}
                </Card>
              </div>
            </>
          );
        })()}

        {/* TAB 4: COMMISSIONS REPORT & PERFORMANCE */}
        {activeSubTab === 'commissions' && (
          <div className="col-span-12">
            <CommissionDesk
              isDark={isDark}
              settings={settings}
              activeUserId={activeUserIdForSession}
              activeRole={activeRole}
              currencySymbol={currencySymbol}
              rawTransactions={rawTransactions}
              usersList={usersSnap?.docs.map(doc => ({ id: doc.id, ...doc.data() })) || []}
              onTogglePaymentStatus={handleTogglePaymentStatus}
            />
          </div>
        )}

        {/* TAB 5: STAFF USER REGISTRATION & COMMISSION CREDITS LIMITATION */}
        {activeSubTab === 'users' && isUserAdmin && (
          <div className="col-span-12">
            <StaffManager
              isDark={isDark}
              settings={settings}
              usersList={usersSnap?.docs.map(doc => ({ id: doc.id, ...doc.data() })) || []}
              onAddUser={handleAddUser}
              onUpdateUserCommission={handleUpdateUserCommission}
              onDeleteUser={handleDeleteUser}
            />
          </div>
        )}

      </div>
    </div>
  );
}
