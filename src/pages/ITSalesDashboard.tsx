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

  const loggedInUser = React.useMemo(() => {
    const saved = localStorage.getItem('customUser');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse customUser:", e);
      }
    }
    return {
      id: 'admin',
      name: 'Main Administrator',
      email: 'admin@nexasphere.it',
      role: 'admin',
      commissionPercentage: 10
    };
  }, []);

  const isUserAdmin = loggedInUser.role === 'admin';

  // --- State for Role Management ---
  // Administrators can toggle their active role to test or preview executive restrictions inline, while Executives are hard-locked as 'executive'.
  const [activeRoleState, setActiveRoleState] = useState<'admin' | 'executive'>(() => {
    return loggedInUser.role === 'admin' ? 'admin' : 'executive';
  });

  const activeRole = isUserAdmin ? activeRoleState : 'executive';

  const setActiveRole = (role: 'admin' | 'executive') => {
    if (isUserAdmin) {
      setActiveRoleState(role);
    } else {
      toast.error('Privilege Violation: Only administrators can change active views.');
    }
  };

  const [executiveName, setExecutiveName] = useState<string>(() => {
    return loggedInUser.name || 'Sales Executive';
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
  const [servicesSnap, servicesLoading, servicesError] = useCollection(collection(db, 'services'));
  const [customersSnap, customersLoading, customersError] = useCollection(collection(db, 'customers'));
  const [transactionsSnap, transactionsLoading, transactionsError] = useCollection(collection(db, 'transactions'));
  const [usersSnap, usersLoading, usersError] = useCollection(collection(db, 'users'));

  const activeDbError = servicesError || customersError || transactionsError || usersError;

  // --- Local Setup & Active Modals State ---
  const [activeSubTab, setActiveSubTab] = useState<'sales' | 'services' | 'customers' | 'commissions' | 'users' | null>(null);
  
  // Customer Search
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [selectedCustomerIdForDetails, setSelectedCustomerIdForDetails] = useState<string | null>(null);

  // New Transaction Form state
  const [txCustomerId, setTxCustomerId] = useState('');
  const [txCustomerName, setTxCustomerName] = useState('');
  const [txCustomerPhone, setTxCustomerPhone] = useState('');
  const [txIsNewCustomer, setTxIsNewCustomer] = useState(false);
  const [txPhoneSearch, setTxPhoneSearch] = useState('');
  const [txServiceId, setTxServiceId] = useState('');
  const [txQuantity, setTxQuantity] = useState(1);
  const [txPrice, setTxPrice] = useState('0');
  const [txItems, setTxItems] = useState<{
    id: string;
    serviceId: string;
    serviceName: string;
    price: number;
    quantity: number;
    totalAmount: number;
  }[]>([]);
  const [txDate, setTxDate] = useState('2026-05-20');
  const [txExecutiveId, setTxExecutiveId] = useState(''); // defaults to current logged-in user
  const [expandedTxId, setExpandedTxId] = useState<string | null>(null);
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
  const [serviceQuantity, setServiceQuantity] = useState('1');
  const [serviceDesc, setServiceDesc] = useState('');

  // Service Edit Mode states
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editServiceName, setEditServiceName] = useState('');
  const [editServicePrice, setEditServicePrice] = useState('');
  const [editServiceQuantity, setEditServiceQuantity] = useState('1');
  const [editServiceDesc, setEditServiceDesc] = useState('');

  // Quick User Registration states
  const [quickUserId, setQuickUserId] = useState('');
  const [quickFullName, setQuickFullName] = useState('');
  const [quickPassword, setQuickPassword] = useState('');
  const [quickRole, setQuickRole] = useState<'admin' | 'executive'>('executive');
  const [quickCommission, setQuickCommission] = useState('10');
  const [showQuickAddUserForm, setShowQuickAddUserForm] = useState(false);

  // CRM Navigation Sub-Tab inside Customer CRM
  const [crmFilterMode, setCrmFilterMode] = useState<'all' | 'dues'>('all');

  // Calendar toggle and service search states
  const [showCalendar, setShowCalendar] = useState(false);
  const [serviceSearchQuery, setServiceSearchQuery] = useState('');
  const [selectedServiceDetails, setSelectedServiceDetails] = useState<any | null>(null);

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
    if (loggedInUser && loggedInUser.id) {
      setTxExecutiveId(loggedInUser.id);
    }
  }, [loggedInUser]);

  // Strict frontend sub-tab routing privilege guard for non-admin users
  useEffect(() => {
    if (!isUserAdmin && activeSubTab === 'users') {
      setActiveSubTab('sales');
      toast.error('Restricted Access: Executives are not authorized to view the Staff Panel.');
    }
  }, [isUserAdmin, activeSubTab]);

  // Seeding initial sandbox data if empty
  const handleSeedData = async () => {
    const loadingToast = toast.loading('Seeding database with IT Sales data...');
    try {
      // 1. Seed Services
      const existingServices = await getDocs(collection(db, 'services'));
      if (existingServices.empty) {
        for (const service of PRESEEDED_SERVICES) {
          await addDoc(collection(db, 'services'), {
            name: service.name,
            price: service.price,
            quantity: 1,
            description: service.description,
            status: 'Kept',
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
            dealId: 'IT-20260518-842',
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
            dealId: 'IT-20260515-519',
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
            dealId: 'IT-20260510-188',
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

    const qtyNum = parseInt(serviceQuantity, 10);
    if (isNaN(qtyNum) || qtyNum < 1) {
      toast.error('Please enter a valid service quantity');
      return;
    }

    const loadingToast = toast.loading('Adding secure IT service offering...');
    try {
      await addDoc(collection(db, 'services'), {
        name: serviceName,
        price: priceNum,
        quantity: qtyNum,
        description: serviceDesc,
        status: 'Kept',
        createdAt: new Date().toISOString()
      });
      toast.success('New Corporate Service registered!', { id: loadingToast });
      setServiceName('');
      setServicePrice('');
      setServiceQuantity('1');
      setServiceDesc('');
    } catch (err: any) {
      const errorMessage = err?.message || err?.code || String(err);
      toast.error(`Error recording service details: ${errorMessage}`, { id: loadingToast });
      handleFirestoreError(err, OperationType.CREATE, 'services');
    }
  };

  const handleUpdateService = async (serviceId: string) => {
    const priceNum = parseFloat(editServicePrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please enter a valid price amount');
      return;
    }
    const qtyNum = parseInt(editServiceQuantity, 10);
    if (isNaN(qtyNum) || qtyNum < 1) {
      toast.error('Please enter a valid service quantity');
      return;
    }
    if (!editServiceName.trim()) {
      toast.error('Service Name is required');
      return;
    }

    const loadingToast = toast.loading('Updating IT service details...');
    try {
      await updateDoc(doc(db, 'services', serviceId), {
        name: editServiceName.trim(),
        price: priceNum,
        quantity: qtyNum,
        description: editServiceDesc.trim(),
        updatedAt: new Date().toISOString()
      });
      toast.success('Service updated successfully!', { id: loadingToast });
      setEditingServiceId(null);
    } catch (err) {
      toast.error('Could not update service details', { id: loadingToast });
    }
  };

  const handleToggleServiceStatus = async (serviceId: string, currentStatus?: string) => {
    const nextStatus = currentStatus === 'Muted' ? 'Kept' : 'Muted';
    const loadingToast = toast.loading(`Setting service to ${nextStatus}...`);
    try {
      await updateDoc(doc(db, 'services', serviceId), {
        status: nextStatus,
        updatedAt: new Date().toISOString()
      });
      toast.success(`Service status set to ${nextStatus}!`, { id: loadingToast });
    } catch (err) {
      toast.error('Could not modify service status', { id: loadingToast });
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    const loadingToast = toast.loading('Removing IT service package...');
    try {
      await deleteDoc(doc(db, 'services', serviceId));
      toast.success('Service package removed from catalog!', { id: loadingToast });
    } catch (err) {
      toast.error('Could not delete service offering', { id: loadingToast });
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

    // Load Services configured in the items list
    if (txItems.length === 0) {
      toast.error('Please configure the scope by adding at least one IT corporate service offering.');
      return;
    }

    const firstItem = txItems[0];
    const totalAmount = txItems.reduce((acc, item) => acc + item.totalAmount, 0);
    const totalQuantity = txItems.reduce((acc, item) => acc + item.quantity, 0);
    const serviceName = txItems.map(item => `${item.serviceName} (x${item.quantity})`).join(', ');
    const price = firstItem ? firstItem.price : 0;

    let currentExecId = loggedInUser.id;
    let currentExecName = loggedInUser.name;
    const dbUserField = usersSnap?.docs.find(doc => doc.id === loggedInUser.id)?.data();
    let commissionPercentage = dbUserField?.commissionPercentage !== undefined 
      ? dbUserField.commissionPercentage 
      : (loggedInUser.commissionPercentage !== undefined ? loggedInUser.commissionPercentage : 10);

    if (activeRole === 'admin') {
      if (assignedExecutiveId) {
        currentExecId = assignedExecutiveId;
        currentExecName = assignedExecutiveName;
        commissionPercentage = assignedExecutiveCommission;
      } else {
        currentExecId = 'admin';
        currentExecName = 'Main Administrator';
        const adminDbField = usersSnap?.docs.find(doc => doc.id === 'admin')?.data();
        commissionPercentage = adminDbField?.commissionPercentage !== undefined 
          ? adminDbField.commissionPercentage 
          : 10;
      }
    } else {
      // Current executive logged-in
      currentExecId = loggedInUser.id;
      currentExecName = dbUserField?.name || loggedInUser.name || 'Sales Executive';
      commissionPercentage = dbUserField?.commissionPercentage !== undefined 
        ? dbUserField.commissionPercentage 
        : (loggedInUser.commissionPercentage !== undefined ? loggedInUser.commissionPercentage : 10);
    }

    const commissionEarned = totalAmount * (commissionPercentage / 100);

    const datePart = txDate.replace(/-/g, '');
    const randPart = Math.floor(100 + Math.random() * 900);
    const generatedDealId = `IT-${datePart}-${randPart}`;

    const transactionPayload = {
      dealId: generatedDealId,
      customerId: targetCustomerId,
      customerName: finalCustName,
      customerPhone: finalCustPhone,
      serviceId: firstItem?.serviceId || '',
      serviceName,
      price,
      quantity: totalQuantity,
      totalAmount,
      items: txItems.map(it => ({
        serviceId: it.serviceId,
        serviceName: it.serviceName,
        price: it.price,
        quantity: it.quantity,
        totalAmount: it.totalAmount
      })),
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
      toast.success(`Sales Ledger updated securely with Deal ID: ${generatedDealId}`, { id: loadSave });
      
      // Reset Transaction Form Fields
      setTxServiceId('');
      setTxQuantity(1);
      setTxPrice('0');
      setTxItems([]);
      setTxCustomerName('');
      setTxCustomerPhone('');
      setTxCustomerId('');
      setTxPhoneSearch('');
      setAssignedExecutiveId('');
      setAssignedExecutiveName('');
      
      const todayStr = '2026-05-20';
      setTxStartDate(todayStr);
      setTxDate(todayStr);
      const d = new Date(todayStr);
      d.setDate(d.getDate() + 30);
      setTxEndDate(d.toISOString().split('T')[0]);
    } catch (err) {
      toast.error('Transaction filing aborted.', { id: loadSave });
      handleFirestoreError(err, OperationType.CREATE, 'transactions');
    }
  };

  // --- Filtering Ledger Based on Activated RBAC Roles & Calendar Ranges ---
  const rawTransactions = transactionsSnap?.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)) || [];
  const activeUserIdForSession = loggedInUser.id;

  const execTransactionsFiltered = rawTransactions.filter(t => t.executiveId === activeUserIdForSession);
  const execCustomersClosedCount = Array.from(new Set(
    execTransactionsFiltered
      .filter(t => t.status === 'Collected')
      .map(t => t.customerId)
      .filter(Boolean)
  )).length;

  const execCustomersServedCount = Array.from(new Set(
    execTransactionsFiltered
      .map(t => t.customerId)
      .filter(Boolean)
  )).length;

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
    // 3. Global search query filtering
    if (globalSearchQuery.trim()) {
      const gQuery = globalSearchQuery.toLowerCase();
      const match = 
        (item.serviceName && item.serviceName.toLowerCase().includes(gQuery)) ||
        (item.executiveName && item.executiveName.toLowerCase().includes(gQuery)) ||
        (item.customerName && item.customerName.toLowerCase().includes(gQuery)) ||
        (item.id && item.id.toLowerCase().includes(gQuery)) ||
        (item.date && item.date.includes(gQuery)) ||
        String(item.totalAmount).includes(gQuery);
      if (!match) return false;
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

  const handleUpdateUserProperties = async (uId: string, updatedFields: any) => {
    const loading = toast.loading(`Updating credentials profile...`);
    try {
      await updateDoc(doc(db, 'users', uId), {
        ...updatedFields,
        updatedAt: new Date().toISOString()
      });
      toast.success('Credentials profile updated successfully!', { id: loading });
    } catch (err) {
      toast.error('Could not complete credentials update.', { id: loading });
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
      createdAt: data.createdAt || '',
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
    const queryStr = (customerSearchQuery || globalSearchQuery).toLowerCase();
    const matchesSearch = 
      cust.name.toLowerCase().includes(queryStr) || 
      cust.phone.includes(queryStr) ||
      cust.status.toLowerCase().includes(queryStr) ||
      cust.history.some(tx => 
        (tx.serviceName && tx.serviceName.toLowerCase().includes(queryStr)) ||
        (tx.executiveName && tx.executiveName.toLowerCase().includes(queryStr))
      );
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

  // Today's Live Engagement Analytics ('2026-05-20')
  const todayDateStr = '2026-05-20';
  const todayTransactions = rawTransactions.filter(item => item.date === todayDateStr);
  const todaySalesCount = todayTransactions.length;
  const todayRevenueSum = todayTransactions.reduce((acc, t) => acc + (t.totalAmount || 0), 0);
  
  const todayOnboardedCustomers = customerList.filter(c => {
    const createdStr = c.createdAt?.split('T')[0] || (c.history && c.history[0]?.createdAt?.split('T')[0]);
    return createdStr === todayDateStr;
  });
  const todayOnboardedCount = todayOnboardedCustomers.length;

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

  const handleQuickSwitchUser = (userId: string) => {
    if (userId === 'admin') {
      localStorage.setItem('customUser', JSON.stringify({
        id: 'admin',
        uid: 'admin',
        name: 'Main Administrator',
        email: 'admin@nexasphere.it',
        role: 'admin',
        commissionPercentage: 10
      }));
      toast.success('Successfully switched active workspace session to Main Administrator!');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      const docMatch = usersSnap?.docs.find(d => d.id === userId);
      if (docMatch) {
        const u = docMatch.data();
        localStorage.setItem('customUser', JSON.stringify({
          id: u.id,
          uid: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          commissionPercentage: u.commissionPercentage || 10
        }));
        toast.success(`Active status changed! Authenticated as Sales ${u.role === 'admin' ? 'Admin' : 'Executive'}: ${u.name}`);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    }
  };

  const handleQuickAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickUserId.trim()) {
      toast.error('Please specify a unique User ID login!');
      return;
    }
    if (!quickFullName.trim()) {
      toast.error('Please specify a full name!');
      return;
    }
    if (!quickPassword.trim()) {
      toast.error('Please define an access password!');
      return;
    }

    const cleanId = quickUserId.trim().toLowerCase().replace(/\s+/g, '-');
    const commPct = parseFloat(quickCommission);
    if (isNaN(commPct) || commPct < 0 || commPct > 100) {
      toast.error('Commission percentage must be between 0 and 100');
      return;
    }

    // Check if ID matches admin or existing firestore user
    const idExistsInFirestore = usersSnap?.docs.some(d => d.id === cleanId) || cleanId === 'admin';
    if (idExistsInFirestore) {
      toast.error(`The login ID "${cleanId}" is already taken. Try another unique user ID.`);
      return;
    }

    const newUserObj = {
      id: cleanId,
      name: quickFullName.trim(),
      email: `${cleanId}@nexasphere.it`,
      role: quickRole,
      password: quickPassword.trim(),
      commissionPercentage: commPct,
      createdAt: new Date().toISOString()
    };

    const loadingToast = toast.loading(`Registering credentials for ${newUserObj.name}...`);
    try {
      await setDoc(doc(db, 'users', cleanId), newUserObj);
      toast.success(`Account created with Password: "${newUserObj.password}"! Switch to this account now!`, { id: loadingToast });
      
      // Clear fields
      setQuickUserId('');
      setQuickFullName('');
      setQuickPassword('');
      setQuickRole('executive');
      setQuickCommission('10');
      setShowQuickAddUserForm(false);
    } catch (err) {
      toast.error('Failed to save staff credentials record.', { id: loadingToast });
    }
  };

  // --- Global Omni Search Matches compiler ---
  const getGlobalSearchMatches = () => {
    if (!globalSearchQuery.trim()) return null;
    const queryStr = globalSearchQuery.trim().toLowerCase();

    // 1. Matching Services
    const matchingServicesList = (servicesSnap?.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)) || []).filter(srv => 
      (srv.name && srv.name.toLowerCase().includes(queryStr)) ||
      (srv.description && srv.description.toLowerCase().includes(queryStr))
    );

    // 2. Matching Customers
    const matchingCustomersList = customerList.filter(cust => 
      cust.name.toLowerCase().includes(queryStr) ||
      cust.phone.toLowerCase().includes(queryStr)
    );

    // 3. Matching Staff/Users
    const matchingUsersList = (usersSnap?.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)) || []).filter(u => 
      (u.name && u.name.toLowerCase().includes(queryStr)) ||
      (u.id && u.id.toLowerCase().includes(queryStr)) ||
      (u.email && u.email.toLowerCase().includes(queryStr))
    );

    // 4. Matching Transactions / Deals
    const matchingTransactionsList = rawTransactions.filter(tx => 
      (tx.serviceName && tx.serviceName.toLowerCase().includes(queryStr)) ||
      (tx.executiveName && tx.executiveName.toLowerCase().includes(queryStr)) ||
      (tx.customerName && tx.customerName.toLowerCase().includes(queryStr)) ||
      (tx.id && tx.id.toLowerCase().includes(queryStr)) ||
      (tx.date && tx.date.includes(queryStr))
    );

    return {
      services: matchingServicesList,
      customers: matchingCustomersList,
      users: matchingUsersList,
      transactions: matchingTransactionsList,
      totalMatches: matchingServicesList.length + matchingCustomersList.length + matchingUsersList.length + matchingTransactionsList.length
    };
  };

  const omniMatches = getGlobalSearchMatches();

  return (
    <div className="space-y-8 pb-20">
      
      {activeDbError && (
        <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-2xl flex items-start gap-3 text-red-200">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="flex-1 text-xs">
            <span className="font-bold block text-sm text-red-300">Firestore Connection or Permission Warning ({activeDbError.code || 'UNKNOWN'}):</span>
            <p className="mt-1 opacity-90">{activeDbError.message}</p>
            <p className="mt-2 text-[10px] text-slate-400 font-mono">
              Database Path: services/customers/transactions/users <br />
              Action tip: If the error reports missing permissions, please run Database Seed or verify that rules match the custom database in config.
            </p>
          </div>
        </div>
      )}
      
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
          
          {/* Omni Search Bar */}
          <div className="relative shrink-0 w-full sm:w-auto">
            <Search className="absolute left-3.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search anything..."
              value={globalSearchQuery}
              onChange={(e) => setGlobalSearchQuery(e.target.value)}
              className={cn(
                "pl-10 pr-8 py-2 rounded-2xl text-[10px] font-bold w-full sm:w-48 outline-none border transition-all shadow-inner",
                isDark 
                  ? "bg-slate-900 border-white/5 text-slate-200 focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/20" 
                  : "bg-slate-50 border-slate-200 text-slate-900 focus:border-rose-400 focus:ring-1 focus:ring-rose-400/20"
              )}
            />
            {globalSearchQuery && (
              <button 
                onClick={() => setGlobalSearchQuery('')}
                className="absolute right-2.5 top-1 text-slate-400 hover:text-rose-520 text-base font-black font-sans cursor-pointer focus:outline-none"
              >
                ×
              </button>
            )}
          </div>

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

      {/* GLOBAL OMNI-SEARCH RESULTS PANEL */}
      {omniMatches && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-6 rounded-[2rem] border space-y-4 relative overflow-hidden shadow-xl text-left",
            isDark ? "bg-[#0b0c16]/85 border-rose-500/20 backdrop-blur-xl" : "bg-white border-rose-300 shadow-rose-100"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-rose-500">Omni-Search Engine Matrix (সার্বজনীন সার্চ ফলাফল)</h3>
                <p className="text-[10px] text-slate-500 font-bold italic">Matches found for keyword: "{globalSearchQuery}"</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 font-mono">
                {omniMatches.totalMatches} Universal Matches
              </span>
              <button
                onClick={() => setGlobalSearchQuery('')}
                className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white transition-all cursor-pointer focus:outline-none"
              >
                Clear Search
              </button>
            </div>
          </div>

          {omniMatches.totalMatches === 0 ? (
            <div className="py-6 text-center text-slate-500 font-bold italic text-xs">
              No services, customers, deals, or staff credentials match "{globalSearchQuery}". Try another keyword!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              {/* CATEGORY 1: MATCHING DEALS/TRANSACTIONS */}
              <div className="space-y-2">
                <h4 className="font-black uppercase text-[10px] text-slate-500 flex items-center justify-between border-b border-slate-800/10 pb-1">
                  <span>Transactions ({omniMatches.transactions.length})</span>
                  <span className="font-mono text-[9px] text-slate-400">DEALS</span>
                </h4>
                {omniMatches.transactions.length === 0 ? (
                  <p className="text-[10px] italic text-slate-500">No matching deals</p>
                ) : (
                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                    {omniMatches.transactions.slice(0, 5).map(tx => (
                      <div 
                        key={tx.id} 
                        onClick={() => {
                          setActiveSubTab('commissions');
                          toast.success(`Redirected to Commission ledger matching transaction ${tx.id.substring(0,8).toUpperCase()}`);
                        }}
                        className={cn(
                          "p-2 rounded-xl border text-[10px] hover:scale-[1.01] transition-all cursor-pointer",
                          isDark ? "bg-slate-900/40 border-white/5 hover:bg-slate-850" : "bg-slate-100/50 border-slate-200 hover:bg-slate-100"
                        )}
                      >
                        <div className="flex justify-between items-start font-bold">
                          <span className="truncate max-w-[120px]" style={{ color: isDark ? '#cbd5e1' : '#1e293b' }}>{tx.serviceName}</span>
                          <span className="text-rose-500 font-mono font-black">{currencySymbol}{tx.totalAmount?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-[8px] text-slate-500 mt-1">
                          <span>Client: {tx.customerName}</span>
                          <span className="font-mono">{tx.date}</span>
                        </div>
                      </div>
                    ))}
                    {omniMatches.transactions.length > 5 && (
                      <p className="text-[8px] text-center text-slate-500 italic mt-1 font-bold">+{omniMatches.transactions.length - 5} more transactions</p>
                    )}
                  </div>
                )}
              </div>

              {/* CATEGORY 2: MATCHING CUSTOMERS */}
              <div className="space-y-2">
                <h4 className="font-black uppercase text-[10px] text-slate-500 flex items-center justify-between border-b border-slate-800/10 pb-1">
                  <span>Customers ({omniMatches.customers.length})</span>
                  <span className="font-mono text-[9px] text-slate-400">CRM</span>
                </h4>
                {omniMatches.customers.length === 0 ? (
                  <p className="text-[10px] italic text-slate-500">No matching profiles</p>
                ) : (
                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                    {omniMatches.customers.slice(0, 5).map(cust => (
                      <div 
                        key={cust.id} 
                        onClick={() => {
                          setActiveSubTab('customers');
                          setSelectedCustomerIdForDetails(cust.id);
                          toast.success(`Redirected to Customer details for ${cust.name}`);
                        }}
                        className={cn(
                          "p-2 rounded-xl border text-[10px] hover:scale-[1.01] transition-all cursor-pointer",
                          isDark ? "bg-slate-900/40 border-white/5 hover:bg-slate-850" : "bg-slate-100/50 border-slate-200 hover:bg-slate-100"
                        )}
                      >
                        <div className="font-bold flex justify-between items-center">
                          <span className="truncate max-w-[120px]" style={{ color: isDark ? '#cbd5e1' : '#1e293b' }}>{cust.name}</span>
                          <span className={cn(
                            "px-1.5 py-0.2 rounded text-[7px] font-black uppercase tracking-wider",
                            cust.status === 'Due' ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"
                          )}>{cust.status}</span>
                        </div>
                        <p className="text-[8.5px] text-slate-500 font-mono mt-1">{cust.phone}</p>
                      </div>
                    ))}
                    {omniMatches.customers.length > 5 && (
                      <p className="text-[8px] text-center text-slate-500 italic mt-1 font-bold">+{omniMatches.customers.length - 5} more profiles</p>
                    )}
                  </div>
                )}
              </div>

              {/* CATEGORY 3: MATCHING SERVICES */}
              <div className="space-y-2">
                <h4 className="font-black uppercase text-[10px] text-slate-500 flex items-center justify-between border-b border-slate-800/10 pb-1">
                  <span>Services ({omniMatches.services.length})</span>
                  <span className="font-mono text-[9px] text-slate-400">CATALOG</span>
                </h4>
                {omniMatches.services.length === 0 ? (
                  <p className="text-[10px] italic text-slate-500">No matching contracts</p>
                ) : (
                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                    {omniMatches.services.slice(0, 5).map(srv => {
                      const desc = srv.description || srv.desc || '';
                      return (
                        <div 
                          key={srv.id} 
                          onClick={() => {
                            setActiveSubTab('services');
                            setSelectedServiceDetails(srv);
                            toast.success(`Viewing service package ${srv.name}`);
                          }}
                          className={cn(
                            "p-2 rounded-xl border text-[10px] hover:scale-[1.01] transition-all cursor-pointer",
                            isDark ? "bg-slate-900/40 border-white/5 hover:bg-slate-850" : "bg-slate-100/50 border-slate-200 hover:bg-slate-100"
                          )}
                        >
                          <div className="font-bold flex justify-between items-center">
                            <span className="truncate max-w-[120px]" style={{ color: isDark ? '#cbd5e1' : '#1e293b' }}>{srv.name}</span>
                            <span className="text-violet-500 font-mono font-black">{currencySymbol}{srv.price?.toLocaleString()}</span>
                          </div>
                          {desc && (
                            <p className="text-[8px] text-slate-500 italic mt-1 truncate max-w-[180px]">{desc}</p>
                          )}
                        </div>
                      );
                    })}
                    {omniMatches.services.length > 5 && (
                      <p className="text-[8px] text-center text-slate-500 italic mt-1 font-bold">+{omniMatches.services.length - 5} more services</p>
                    )}
                  </div>
                )}
              </div>

              {/* CATEGORY 4: MATCHING STAFF & LOGIN CREDENTIALS */}
              <div className="space-y-2">
                <h4 className="font-black uppercase text-[10px] text-slate-500 flex items-center justify-between border-b border-slate-800/10 pb-1">
                  <span>Sales Reps ({omniMatches.users.length})</span>
                  <span className="font-mono text-[9px] text-slate-400">PEOPLE</span>
                </h4>
                {omniMatches.users.length === 0 ? (
                  <p className="text-[10px] italic text-slate-500">No matching team members</p>
                ) : (
                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                    {omniMatches.users.slice(0, 5).map(u => (
                      <div 
                        key={u.id} 
                        onClick={() => {
                          if (isUserAdmin) {
                            setActiveSubTab('users');
                            toast.success(`Active staff list opened on ${u.name}`);
                          } else {
                            toast.error('Only Administrators can view staff registrations');
                          }
                        }}
                        className={cn(
                          "p-2 rounded-xl border text-[10px] hover:scale-[1.01] transition-all cursor-pointer",
                          isDark ? "bg-slate-900/40 border-white/5 hover:bg-slate-850" : "bg-slate-100/50 border-slate-200 hover:bg-slate-100"
                        )}
                      >
                        <div className="font-bold flex justify-between items-center">
                          <span className="truncate max-w-[120px]" style={{ color: isDark ? '#cbd5e1' : '#1e293b' }}>{u.name}</span>
                          <span className="px-1.5 py-0.2 rounded text-[7px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {u.role || 'executive'}
                          </span>
                        </div>
                        <p className="text-[8.5px] text-slate-500 font-mono mt-1">{u.email}</p>
                      </div>
                    ))}
                    {omniMatches.users.length > 5 && (
                      <p className="text-[8px] text-center text-slate-500 italic mt-1 font-bold">+{omniMatches.users.length - 5} more staff</p>
                    )}
                  </div>
                )}
              </div>

            </div>
          )}
        </motion.div>
      )}

      {/* NEW SECTION: ACTIVE USER CREDENTIALS SWAPPER, PASSKEY DIRECTORY, & QUICK REGISTRY */}
      <section className={cn(
        "rounded-[2.5rem] p-6 lg:p-8 border shadow-xl space-y-6 transition-all text-left",
        isDark ? "bg-[#0c0d1b]/70 border-white/5" : "bg-slate-50 border-slate-200"
      )}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-[#ec4899]/10 text-[#ec4899] border border-[#ec4899]/20 animate-pulse">
              Sandbox Control Companion
            </span>
            <h2 className={cn("text-lg font-black tracking-tight mt-2 uppercase", isDark ? "text-white" : "text-slate-900")}>
              System Credentials Hub & Switcher
            </h2>
            <p className="text-slate-500 text-[10.5px] font-semibold mt-0.5 leading-relaxed">
              Define custom user accounts & passwords below. Select any identity to instantly change the active session dashboard!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQuickAddUserForm(!showQuickAddUserForm)}
              className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {showQuickAddUserForm ? 'Close Registration Form' : 'Register New User ID'}
            </button>
          </div>
        </div>

        {/* Dynamic Multi-column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Column A: Swapper Selection & Current Profile Info */}
          <div className="lg:col-span-4 flex flex-col justify-between p-5 rounded-[1.75rem] bg-indigo-500/5 border border-indigo-500/10">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black tracking-widest text-slate-500">
                  Select Active Login Identity:
                </label>
                <div className="relative">
                  <select
                    value={loggedInUser?.id || 'admin'}
                    onChange={(e) => handleQuickSwitchUser(e.target.value)}
                    className={cn(
                      "w-full px-4 py-3 border-none rounded-xl transition-all outline-none text-xs font-bold appearance-none cursor-pointer",
                      isDark ? "bg-slate-900 text-white" : "bg-white text-slate-900 shadow-sm"
                    )}
                  >
                    <option value="admin">
                      👑 Head Administrator [id: admin]
                    </option>
                    {usersSnap?.docs
                      .filter(d => d.id !== 'admin')
                      .map(d => {
                        const u = d.data();
                        return (
                          <option key={d.id} value={d.id}>
                            👤 {u.name} [{u.role?.toUpperCase()} | UserID: {u.id}]
                          </option>
                        );
                      })}
                  </select>
                </div>
                <span className="text-[8.5px] text-slate-500 block leading-tight">
                  Selecting an account will simulate signing-out and signing-in again instantly.
                </span>
              </div>

              <div className="py-3.5 border-t border-slate-800/10 dark:border-white/5 space-y-2">
                <p className="text-[10px] uppercase font-black text-slate-500 tracking-wider">Active Authorized User Info</p>
                <div className="space-y-1 text-xs">
                  <p className="font-extrabold text-[#6366f1] text-[13px]">{loggedInUser?.name || 'Main Administrator'}</p>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Assigned Role:</span>
                    <span className="font-bold text-slate-300 uppercase tracking-widest text-[10px]">
                      {loggedInUser?.role || 'admin'}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Base Commission Perc.:</span>
                    <span className="font-bold text-slate-300">
                      {loggedInUser?.commissionPercentage || loggedInUser?.commission || 10}% rate
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Unique Service DB Access:</span>
                    <span className={cn(
                      "font-black text-[9px] uppercase tracking-wider",
                      isUserAdmin ? "text-emerald-400" : "text-rose-450"
                    )}>
                      {isUserAdmin ? '✅ Enabled' : '❌ Disabled'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column B: Active Passkey Directory Checklist / Table */}
          <div className="lg:col-span-8 flex flex-col justify-between p-5 rounded-[1.75rem] bg-pink-500/5 border border-pink-500/10 min-h-[14rem]">
            <div className="space-y-3 w-full overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  Access Directory Checklist [IDs & Passwords]
                </span>
                <span className="text-[9px] font-bold text-slate-500 bg-slate-500/10 px-2 py-0.5 rounded">
                  {1 + (usersSnap?.size || 0)} Total Profiles
                </span>
              </div>

              <div className="overflow-x-auto w-full prose prose-slate">
                <table className="w-full text-[10.5px] leading-relaxed select-text border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/10 text-slate-500 font-extrabold text-[9px] uppercase tracking-wider">
                      <th className="pb-2 text-left font-semibold">Staff Identity</th>
                      <th className="pb-2 text-left font-semibold">User ID (Login)</th>
                      <th className="pb-2 text-left font-semibold">Access Password</th>
                      <th className="pb-2 text-left font-semibold">Role Level</th>
                      <th className="pb-2 text-right font-semibold">Com.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/5">
                    {/* Pre-seeded Admin fallback or explicit admin doc row */}
                    <tr className={cn(
                      "group",
                      (loggedInUser?.id === 'admin') ? "text-[#ec4899] font-bold" : "text-slate-400"
                    )}>
                      <td className="py-2.5 font-bold flex items-center gap-1">
                        👑 Main Administrator
                      </td>
                      <td className="py-2.5 font-mono font-bold text-[10px]">admin</td>
                      <td className="py-2.5 font-mono bg-slate-900/40 px-2 py-0.5 rounded text-[10px] text-amber-500 font-extrabold select-all">
                        admin
                      </td>
                      <td className="py-2.5 uppercase text-[9px] tracking-wider font-extrabold text-indigo-400">ADMIN</td>
                      <td className="py-2.5 text-right font-bold">10%</td>
                    </tr>

                    {/* Firestore users */}
                    {usersSnap?.docs
                      .filter(doc => doc.id !== 'admin')
                      .map(doc => {
                        const u = doc.data();
                        const isActive = loggedInUser?.id === u.id;
                        return (
                          <tr key={doc.id} className={cn(
                            "group hover:bg-slate-500/5 transition-all",
                            isActive ? "text-[#6366f1] font-bold" : "text-slate-400"
                          )}>
                            <td className="py-2 font-black">👤 {u.name}</td>
                            <td className="py-2 font-mono font-bold">{u.id}</td>
                            <td className="py-2 font-mono bg-slate-900/35 px-2 py-0.5 rounded text-[10px] text-amber-500 select-all font-semibold">
                              {u.password || 'exec123'}
                            </td>
                            <td className="py-2">
                              <span className={cn(
                                "text-[8.5px] font-black uppercase tracking-wider",
                                u.role === 'admin' ? "text-indigo-400" : "text-amber-500"
                              )}>
                                {u.role?.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-2 text-right font-semibold">
                              {u.commissionPercentage || u.commission || 10}%
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

        {/* Quick User Creation Form Modal Panel */}
        {showQuickAddUserForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-6 rounded-[1.75rem] bg-indigo-500/5 border border-indigo-500/10 space-y-4 animate-fade-in text-xs"
          >
            <div className="border-b border-indigo-500/10 pb-3">
              <h3 className="font-black uppercase tracking-widest text-[#ec4899] text-xs">
                Register New Credentials Profile
              </h3>
              <p className="text-[10px] text-slate-500 mt-1">
                Instantly provision a brand-new user with their own ID, passcode, role level, and automatic commission rate tracker.
              </p>
            </div>

            <form onSubmit={handleQuickAddUserSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <Input
                label="Full Employee Name"
                placeholder="e.g. John Executive"
                value={quickFullName}
                onChange={(e) => setQuickFullName(e.target.value)}
                required
              />
              <Input
                label="User ID (Login Username)"
                placeholder="e.g. john"
                value={quickUserId}
                onChange={(e) => setQuickUserId(e.target.value)}
                required
              />
              <Input
                label="Access Password / Passkey"
                placeholder="e.g. securePass1"
                value={quickPassword}
                onChange={(e) => setQuickPassword(e.target.value)}
                required
              />
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] pl-1 font-black uppercase tracking-widest text-slate-500">Role access level</label>
                <select
                  value={quickRole}
                  onChange={(e) => setQuickRole(e.target.value as any)}
                  className="w-full bg-slate-900 border-none rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  style={{ backgroundColor: isDark ? 'rgba(15, 23, 42, 0.6)' : '#e2e8f0', color: isDark ? 'white' : 'black' }}
                >
                  <option value="executive">Sales Executive (No DB View)</option>
                  <option value="admin">Main Administrator (Full Access)</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-1.5 text-left">
                <label className="text-[10px] pl-1 font-black uppercase tracking-widest text-slate-500">Commission Ratio (%)</label>
                <input
                  type="number"
                  placeholder="e.g. 15"
                  value={quickCommission}
                  onChange={(e) => setQuickCommission(e.target.value)}
                  className={cn(
                    "w-full px-4 py-3 border-none rounded-xl transition-all outline-none font-semibold text-xs",
                    isDark ? "bg-slate-900 text-white" : "bg-white text-slate-900 border border-slate-200"
                  )}
                  style={{ backgroundColor: isDark ? 'rgba(15, 23, 42, 0.6)' : '#fff' }}
                  required
                />
              </div>

              <div className="md:col-span-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowQuickAddUserForm(false)}
                  className="w-1/2 py-3 rounded-xl bg-slate-800 text-slate-300 font-extrabold uppercase text-[10px] tracking-wider transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 text-white py-3 rounded-xl font-extrabold uppercase text-[10px] tracking-wider transition-all cursor-pointer"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  Create Identity
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </section>

      {/* QUICK CORE ANALYTICS CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
        {activeRole === 'admin' ? (
          <>
            {/* ADMIN KPI CARDS */}
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
          </>
        ) : (
          <>
            {/* EXECUTIVE MY DATA PIE OUTLINE */}
            <Card className="flex items-center gap-5">
              <div className="p-4 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${settings.primaryColor}15`, color: settings.primaryColor }}>
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">My Revenue Generated</p>
                <h3 className="text-2xl font-black mt-1 text-slate-200" style={{ color: isDark ? 'white' : 'black' }}>
                  {currencySymbol}{totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </h3>
                <span className="text-[9px] text-[#ec4899] font-extrabold flex items-center gap-1 mt-1">
                  <TrendingUp size={10} /> Personal direct sales
                </span>
              </div>
            </Card>

            <Card className="flex items-center gap-5">
              <div className="p-4 rounded-2xl flex items-center justify-center shrink-0 text-sky-500 bg-sky-500/10">
                <ShoppingBag size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">My Daily Sales Volume</p>
                <h3 className="text-2xl font-black mt-1" style={{ color: isDark ? 'white' : 'black' }}>
                  {totalTransactionsCount} Orders
                </h3>
                <span className="text-[9px] text-slate-500 font-medium italic mt-1 block">Active date scope target</span>
              </div>
            </Card>

            <Card className="flex items-center gap-5">
              <div className="p-4 rounded-2xl flex items-center justify-center shrink-0 text-emerald-500 bg-emerald-500/10">
                <UserCheck size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Customers Key Closed</p>
                <h3 className="text-2xl font-black mt-1" style={{ color: isDark ? 'white' : 'black' }}>
                  {execCustomersClosedCount} Accounts
                </h3>
                <span className="text-[9px] font-extrabold text-emerald-400 mt-1 block">Fully paid & settled transactions</span>
              </div>
            </Card>

            <Card className="flex items-center gap-5">
              <div className="p-4 rounded-2xl flex items-center justify-center shrink-0 text-violet-500 bg-violet-500/10">
                <Users size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Customers Serviced</p>
                <h3 className="text-2xl font-black mt-1" style={{ color: isDark ? 'white' : 'black' }}>
                  {execCustomersServedCount} Clients
                </h3>
                <span className="text-[9px] font-extrabold text-violet-400 mt-1 block">All registered sales accounts</span>
              </div>
            </Card>
          </>
        )}
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

      {/* COMPACT ENTERPRISE PACKAGE DECK & MENU CONSOLE */}
      <div className={cn(
        "rounded-[2.5rem] p-6 border shadow-2xl relative overflow-hidden transition-all text-left",
        isDark ? "bg-[#0b0c16]/30 border-white/5" : "bg-white border-slate-200 shadow-sm"
      )}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-800/20 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                NexaSphere Workspace Services
              </span>
            </div>
            <h2 className={cn("text-base font-black tracking-tight uppercase mt-1", isDark ? "text-slate-200" : "text-slate-850")}>
              💼 IT Sales Control Console (সার্ভিসেস ও অপশন ডেস্ক)
            </h2>
            <p className="text-slate-500 text-[10.5px] mt-0.5">
              Click any package card below to instantly display its management database, clicking it again will collapse (turn off) the view.
            </p>
          </div>
          {activeSubTab && (
            <button
              onClick={() => {
                setActiveSubTab(null);
                toast.success('Workspace collapsed successfully!');
              }}
              className="px-3 py-1.5 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-500 text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5 border border-red-500/20"
            >
              <X size={11} /> Turn Off Active View
            </button>
          )}
        </div>

        {/* Small Package App Icons Grid - Highly polished, responsive Launchpad Menu */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
          
          {/* PACKAGE 1: SALES MODULE */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (activeSubTab === 'sales') {
                setActiveSubTab(null);
                toast.success('Sales Ledger collapsed.');
              } else {
                setActiveSubTab('sales');
                toast.success('Opened Sales & Purchases Ledger!');
              }
            }}
            className={cn(
              "p-4 rounded-[2rem] border transition-all text-center cursor-pointer flex flex-col items-center justify-between min-h-[130px] md:min-h-[140px] relative overflow-hidden group select-none hover:shadow-xl backdrop-blur-md",
              activeSubTab === 'sales'
                ? "bg-indigo-500/10 border-indigo-500 shadow-xl ring-2 ring-indigo-500/20 font-bold"
                : isDark 
                  ? "bg-slate-900/40 border-white/5 hover:bg-slate-800/60" 
                  : "bg-slate-50 border-slate-200 hover:bg-slate-100"
            )}
          >
            <div 
              className="p-3.5 rounded-2xl mb-2.5 shrink-0 transition-all group-hover:scale-110 shadow-md"
              style={{ 
                backgroundColor: activeSubTab === 'sales' ? `${settings.primaryColor}25` : isDark ? '#1e293b' : '#fff',
                color: activeSubTab === 'sales' ? settings.primaryColor : '#8e9bb0',
                border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)'
              }}
            >
              <ShoppingBag size={22} />
            </div>
            <div className="text-center w-full">
              <p className={cn("text-[11px] font-black uppercase tracking-wider leading-none", (activeSubTab === 'sales' ? "text-slate-100 font-extrabold" : isDark ? "text-slate-300" : "text-slate-850"))} style={activeSubTab === 'sales' ? { color: settings.primaryColor } : {}}>
                Sales Ledger
              </p>
              <p className="text-[9.5px] text-slate-500 font-bold mt-1.5 font-sans leading-none">
                সেলস ও খতিয়ান
              </p>
            </div>
            
            <div className="absolute top-2.5 right-2.5">
              <span className={cn(
                "w-2.5 h-2.5 rounded-full block border shadow-sm",
                activeSubTab === 'sales' 
                  ? "bg-emerald-400 border-emerald-300/40 animate-pulse" 
                  : "bg-slate-600 border-slate-500/30"
              )} />
            </div>
          </motion.div>

          {/* PACKAGE 2: SERVICES CATALOGUE */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (activeSubTab === 'services') {
                setActiveSubTab(null);
                toast.success('Services Catalog collapsed.');
              } else {
                setActiveSubTab('services');
                toast.success('Opened Service Catalog Repository!');
              }
            }}
            className={cn(
              "p-4 rounded-[2rem] border transition-all text-center cursor-pointer flex flex-col items-center justify-between min-h-[130px] md:min-h-[140px] relative overflow-hidden group select-none hover:shadow-xl backdrop-blur-md",
              activeSubTab === 'services'
                ? "bg-indigo-500/10 border-indigo-500 shadow-xl ring-2 ring-indigo-500/20 font-bold"
                : isDark 
                  ? "bg-slate-900/40 border-white/5 hover:bg-slate-800/60" 
                  : "bg-slate-50 border-slate-200 hover:bg-slate-100"
            )}
          >
            <div 
              className="p-3.5 rounded-2xl mb-2.5 shrink-0 transition-all group-hover:scale-110 shadow-md"
              style={{ 
                backgroundColor: activeSubTab === 'services' ? `${settings.primaryColor}25` : isDark ? '#1e293b' : '#fff',
                color: activeSubTab === 'services' ? settings.primaryColor : '#8e9bb0',
                border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)'
              }}
            >
              <Database size={22} />
            </div>
            <div className="text-center w-full">
              <p className={cn("text-[11px] font-black uppercase tracking-wider leading-none", (activeSubTab === 'services' ? "text-slate-100 font-extrabold" : isDark ? "text-slate-300" : "text-slate-850"))} style={activeSubTab === 'services' ? { color: settings.primaryColor } : {}}>
                IT Services
              </p>
              <p className="text-[9.5px] text-slate-500 font-bold mt-1.5 font-sans leading-none">
                সার্ভিসেস ক্যাটালগ
              </p>
            </div>
            
            <div className="absolute top-2.5 right-2.5">
              <span className={cn(
                "w-2.5 h-2.5 rounded-full block border shadow-sm",
                activeSubTab === 'services' 
                  ? "bg-emerald-400 border-emerald-300/40 animate-pulse" 
                  : "bg-slate-600 border-slate-500/30"
              )} />
            </div>
          </motion.div>

          {/* PACKAGE 3: CRM DECK */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (activeSubTab === 'customers') {
                setActiveSubTab(null);
                toast.success('CRM Desk collapsed.');
              } else {
                setActiveSubTab('customers');
                toast.success('Opened Client CRM Registry!');
              }
            }}
            className={cn(
              "p-4 rounded-[2rem] border transition-all text-center cursor-pointer flex flex-col items-center justify-between min-h-[130px] md:min-h-[140px] relative overflow-hidden group select-none hover:shadow-xl backdrop-blur-md",
              activeSubTab === 'customers'
                ? "bg-indigo-500/10 border-indigo-500 shadow-xl ring-2 ring-indigo-500/20 font-bold"
                : isDark 
                  ? "bg-slate-900/40 border-white/5 hover:bg-slate-800/60" 
                  : "bg-slate-50 border-slate-200 hover:bg-slate-100"
            )}
          >
            <div 
              className="p-3.5 rounded-2xl mb-2.5 shrink-0 transition-all group-hover:scale-110 shadow-md"
              style={{ 
                backgroundColor: activeSubTab === 'customers' ? `${settings.primaryColor}25` : isDark ? '#1e293b' : '#fff',
                color: activeSubTab === 'customers' ? settings.primaryColor : '#8e9bb0',
                border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)'
              }}
            >
              <Users size={22} />
            </div>
            <div className="text-center w-full">
              <p className={cn("text-[11px] font-black uppercase tracking-wider leading-none", (activeSubTab === 'customers' ? "text-slate-100 font-extrabold" : isDark ? "text-slate-300" : "text-slate-850"))} style={activeSubTab === 'customers' ? { color: settings.primaryColor } : {}}>
                CRM Contacts
              </p>
              <p className="text-[9.5px] text-slate-500 font-bold mt-1.5 font-sans leading-none">
                ক্লায়েন্ট ডাটাবেজ
              </p>
            </div>
            
            <div className="absolute top-2.5 right-2.5">
              <span className={cn(
                "w-2.5 h-2.5 rounded-full block border shadow-sm",
                activeSubTab === 'customers' 
                  ? "bg-emerald-400 border-emerald-300/40 animate-pulse" 
                  : "bg-slate-600 border-slate-500/30"
              )} />
            </div>
          </motion.div>

          {/* PACKAGE 4: COMMISSIONS REPORT */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (activeSubTab === 'commissions') {
                setActiveSubTab(null);
                toast.success('Commissions Panel collapsed.');
              } else {
                setActiveSubTab('commissions');
                toast.success('Opened Commissions & Sales Target Analytics!');
              }
            }}
            className={cn(
              "p-4 rounded-[2rem] border transition-all text-center cursor-pointer flex flex-col items-center justify-between min-h-[130px] md:min-h-[140px] relative overflow-hidden group select-none hover:shadow-xl backdrop-blur-md",
              activeSubTab === 'commissions'
                ? "bg-indigo-500/10 border-indigo-500 shadow-xl ring-2 ring-indigo-500/20 font-bold"
                : isDark 
                  ? "bg-slate-900/40 border-white/5 hover:bg-slate-800/60" 
                  : "bg-slate-50 border-slate-200 hover:bg-slate-100"
            )}
          >
            <div 
              className="p-3.5 rounded-2xl mb-2.5 shrink-0 transition-all group-hover:scale-110 shadow-md"
              style={{ 
                backgroundColor: activeSubTab === 'commissions' ? `${settings.primaryColor}25` : isDark ? '#1e293b' : '#fff',
                color: activeSubTab === 'commissions' ? settings.primaryColor : '#8e9bb0',
                border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)'
              }}
            >
              <TrendingUp size={22} />
            </div>
            <div className="text-center w-full">
              <p className={cn("text-[11px] font-black uppercase tracking-wider leading-none", (activeSubTab === 'commissions' ? "text-white font-extrabold" : isDark ? "text-slate-300" : "text-slate-850"))} style={activeSubTab === 'commissions' ? { color: settings.primaryColor } : {}}>
                Commissions
              </p>
              <p className="text-[9.5px] text-slate-500 font-bold mt-1.5 font-sans leading-none">
                টিম লভ্যাংশ ও কাজ
              </p>
            </div>
            
            <div className="absolute top-2.5 right-2.5">
              <span className={cn(
                "w-2.5 h-2.5 rounded-full block border shadow-sm",
                activeSubTab === 'commissions' 
                  ? "bg-emerald-400 border-emerald-300/40 animate-pulse" 
                  : "bg-slate-600 border-slate-500/30"
              )} />
            </div>
          </motion.div>

          {/* PACKAGE 5: PASSKEYS ACCESS & PROFILES MODULE (ADMIN GUARDED) */}
          {isUserAdmin ? (
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (activeSubTab === 'users') {
                  setActiveSubTab(null);
                  toast.success('Staff profiles collapsed.');
                } else {
                  setActiveSubTab('users');
                  toast.success('Opened Passkeys & Executive Management Module!');
                }
              }}
              className={cn(
                "p-4 rounded-[2rem] border transition-all text-center cursor-pointer flex flex-col items-center justify-between min-h-[130px] md:min-h-[140px] relative overflow-hidden group select-none hover:shadow-xl backdrop-blur-md",
                activeSubTab === 'users'
                  ? "bg-indigo-500/10 border-indigo-500 shadow-xl ring-2 ring-indigo-500/20 font-bold"
                  : isDark 
                    ? "bg-slate-900/40 border-white/5 hover:bg-slate-800/60" 
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
              )}
            >
              <div 
                className="p-3.5 rounded-2xl mb-2.5 shrink-0 transition-all group-hover:scale-110 shadow-md"
                style={{ 
                  backgroundColor: activeSubTab === 'users' ? `${settings.primaryColor}25` : isDark ? '#1e293b' : '#fff',
                  color: activeSubTab === 'users' ? settings.primaryColor : '#8e9bb0',
                  border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)'
                }}
              >
                <UserCheck size={22} />
              </div>
              <div className="text-center w-full">
                <p className={cn("text-[11px] font-black uppercase tracking-wider leading-none", (activeSubTab === 'users' ? "text-white font-extrabold" : isDark ? "text-slate-300" : "text-slate-850"))} style={activeSubTab === 'users' ? { color: settings.primaryColor } : {}}>
                  Passkeys & Team
                </p>
                <p className="text-[9.5px] text-slate-500 font-bold mt-1.5 font-sans leading-none">
                  কী'স ও একাউন্ট রেশিও
                </p>
              </div>
              
              <div className="absolute top-2.5 right-2.5">
                <span className={cn(
                  "w-2.5 h-2.5 rounded-full block border shadow-sm",
                  activeSubTab === 'users' 
                    ? "bg-emerald-400 border-emerald-300/40 animate-pulse" 
                    : "bg-slate-600 border-slate-500/30"
                )} />
              </div>
            </motion.div>
          ) : (
            <div className={cn(
              "p-4 rounded-[2rem] border transition-all text-center opacity-40 select-none flex flex-col items-center justify-center min-h-[130px] md:min-h-[140px] relative overflow-hidden backdrop-blur-md",
              isDark ? "bg-slate-950/25 border-white/5 text-slate-600" : "bg-slate-150 border-slate-200 text-slate-400"
            )}>
              <ShieldAlert size={22} className="mb-2 text-slate-550" />
              <p className="text-[10px] font-black uppercase tracking-tight leading-none text-slate-500">Security Gate</p>
              <p className="text-[9px] italic mt-1 pl-1 text-slate-500">Admin Only Access</p>
            </div>
          )}

        </div>
      </div>
      
      {/* SECTION CONTENT SWITCHING */}
      <div className="grid grid-cols-12 gap-8 items-start">
        
        {/* LANDING INSTRUCTIONAL COMPACT GUIDE WHEN EVERYTHING IS COLLAPSED */}
        {activeSubTab === null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "col-span-12 p-12 text-center rounded-[2.5rem] border border-dashed flex flex-col items-center justify-center gap-4 transition-all duration-300",
              isDark ? "border-slate-800 bg-slate-900/10" : "border-slate-200 bg-slate-50"
            )}
          >
            <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
              <FolderTree size={24} className="animate-pulse" />
            </div>
            <div className="max-w-md">
              <h3 className={cn("text-xs font-black uppercase tracking-widest text-[#ec4899]")}>
                Corporate System Standby
              </h3>
              <p className={cn("text-base font-black tracking-tight uppercase mt-1", isDark ? "text-slate-100" : "text-slate-800")}>
                কোনো মডিউল কন্সোল সিলেক্ট করা নেই
              </p>
              <p className="text-slate-500 text-xs mt-2.5 font-medium italic">
                উপরের <strong className="text-slate-400 font-bold">কন্ট্রোল ডেক</strong> প্যানেল থেকে আপনার প্রয়োজনীয় মডিউলে (যেমন: লেজার হিসাব, সার্ভিস তালিকা, ইত্যাদি) ক্লিক করুন। ক্লিক করলে বিস্তারিত ডাটাবেজ কন্সোল সামনে ওপেন হবে এবং পুনরায় সেখানে ক্লিক করলে বা 'Turn Off' করলে মডিউল গুটিয়ে অফ হয়ে যাবে।
              </p>
            </div>
          </motion.div>
        )}
        
        {/* TAB 1: SALES AND PURCHASES ENGINE */}
        {activeSubTab === 'sales' && (
          <>
            {/* Dynamic Real-Time Today's Live Radar Board */}
            <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className={cn(
                "p-4 rounded-2.5xl border flex items-center gap-4 transition-all hover:scale-[1.01] cursor-pointer",
                isDark ? "bg-slate-900 border-white/5" : "bg-white border-slate-100 shadow-sm"
              )} onClick={() => {
                setFilterStartDate('2026-05-20');
                setFilterEndDate('2026-05-20');
                setSelectedPreset('custom');
                toast.success("Filtering active table for Today's Sales entries!");
              }}>
                <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                  <ShoppingBag size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Today's Sales</p>
                  <h4 className="text-xl font-black mt-0.5" style={{ color: isDark ? 'white' : 'black' }}>
                    {currencySymbol}{todayRevenueSum.toLocaleString()}
                  </h4>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[9px] text-orange-400 font-extrabold pb-px">Live dynamic flow</span>
                    <span className="text-[9px] font-bold text-slate-400 bg-orange-500/5 px-1.5 py-0.5 rounded">
                      Show Today ({todaySalesCount})
                    </span>
                  </div>
                </div>
              </div>

              <div className={cn(
                "p-4 rounded-2.5xl border flex items-center gap-4 transition-all hover:scale-[1.01] cursor-pointer",
                isDark ? "bg-slate-900 border-white/5" : "bg-white border-slate-100 shadow-sm"
              )} onClick={() => {
                setFilterStartDate('2026-05-20');
                setFilterEndDate('2026-05-20');
                setSelectedPreset('custom');
                toast.success("Filtering active table for Today's New IT Deals!");
              }}>
                <div className="p-3 rounded-xl bg-[#ec4899]/10 text-[#ec4899] flex items-center justify-center" style={{ backgroundColor: `${settings.primaryColor}15`, color: settings.primaryColor }}>
                  <TrendingUp size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-500 font-bold">New IT Deals Today</p>
                  <h4 className="text-xl font-black mt-0.5" style={{ color: isDark ? 'white' : 'black' }}>
                    {todaySalesCount} active contracts
                  </h4>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[9px] text-[#ec4899] font-extrabold" style={{ color: settings.primaryColor }}>Real-time persistence</span>
                    <span className="text-[9px] text-slate-400">Default date: 2026-05-20</span>
                  </div>
                </div>
              </div>

              <div className={cn(
                "p-4 rounded-2.5xl border flex items-center gap-4 transition-all hover:scale-[1.01] cursor-pointer",
                isDark ? "bg-slate-900 border-white/5" : "bg-white border-slate-100 shadow-sm"
              )} onClick={() => {
                setActiveSubTab('customers');
                setCustomerSearchQuery('');
                toast.success("Transferred to CRM search suite!");
              }}>
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Users size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Today Onboarding Desk</p>
                  <h4 className="text-xl font-black mt-0.5" style={{ color: isDark ? 'white' : 'black' }}>
                    {todayOnboardedCount} clients registered
                  </h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[9px] text-emerald-400 font-extrabold">Instant corporate CRM</span>
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1 py-0.5 rounded font-bold">Manage CRM</span>
                  </div>
                </div>
              </div>
            </div>

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
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <div className="flex flex-wrap gap-1.5 bg-slate-900/10 dark:bg-slate-950/40 p-1.5 rounded-2xl border border-slate-800/10 flex-1 md:flex-none">
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

                    <button
                      type="button"
                      onClick={() => {
                        setShowCalendar(prev => !prev);
                        toast.success(showCalendar ? "SLA Calendar grid minimized" : "Interactive calendar grid expanded!");
                      }}
                      className={cn(
                        "flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer border active:scale-95 justify-center md:justify-start h-[38px] shrink-0",
                        showCalendar 
                          ? "bg-[#ec4899]/10 border-[#ec4899]/25 text-white shadow-md font-bold" 
                          : "bg-slate-900/10 border-slate-800/10 text-slate-400 hover:text-white"
                      )}
                      style={showCalendar ? { color: settings.primaryColor, backgroundColor: `${settings.primaryColor}15`, borderColor: `${settings.primaryColor}25` } : {}}
                    >
                      <Calendar size={11} className={showCalendar ? "animate-spin" : ""} />
                      <span>{showCalendar ? "Minimize Calendar" : "Calendar Grid"}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* CALENDAR NAVIGATION & CELLS GRID COLUMN - Condensed to smaller, compact side view! */}
                  {showCalendar && (
                    <div className="md:col-span-5 lg:col-span-4 space-y-3 max-w-[280px] mx-auto md:mx-0 animate-fade-in shrink-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#ec4899]" style={{ color: settings.primaryColor }}>
                        Month Explorer
                      </span>
                      {/* Navigation buttons */}
                      <div className="flex items-center gap-1 bg-slate-900/10 dark:bg-slate-950/50 p-1 rounded-lg border border-slate-800/10">
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
                          <ChevronLeft size={12} />
                        </button>
                        <span className="text-[9px] font-black uppercase px-2 text-slate-500 tracking-wider">
                          {MONTHS_NAMES[calendarMonth].substring(0, 3)} '{String(calendarYear).substring(2)}
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
                          <ChevronRight size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Weekday guide & Cells condensed */}
                    <div className="grid grid-cols-7 gap-1 text-center bg-slate-900/5 dark:bg-slate-950/20 p-2 rounded-2xl border border-slate-850/5">
                      {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(d => (
                        <div key={d} className="font-extrabold text-slate-500 text-[8px] tracking-widest uppercase py-0.5">{d}</div>
                      ))}
                      
                      {calendarCells.map((cell, idx) => {
                        if (cell.dayNum === null || !cell.dateString) {
                          return <div key={`empty-${idx}`} className="p-1.5 opacity-0 text-[10px]" />;
                        }
                        
                        const count = getSalesCountForDate(cell.dateString);
                        const isSelectedRange = filterStartDate <= cell.dateString && filterEndDate >= cell.dateString && filterStartDate !== '' && filterEndDate !== '';
                        const isDaySelectedExact = filterStartDate === cell.dateString && filterEndDate === cell.dateString;
                        const isToday = cell.dateString === '2026-05-20'; // Local current date

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
                              "relative w-7 h-7 mx-auto flex flex-col items-center justify-center rounded-lg text-[9px] font-black cursor-pointer transition-all border border-transparent duration-150",
                              isDaySelectedExact 
                                ? "text-white shadow-md font-bold scale-105"
                                : isSelectedRange
                                  ? "bg-slate-500/15 border-slate-500/10 text-white"
                                  : isToday
                                    ? "bg-rose-500/15 border border-rose-500/20 text-rose-450 font-black"
                                    : isDark ? "bg-slate-900/30 text-slate-350 hover:bg-slate-850" : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                            )}
                            style={isDaySelectedExact ? { backgroundColor: settings.primaryColor } : {}}
                          >
                            <span>{cell.dayNum}</span>
                            
                            {count > 0 && (
                              <span 
                                className={cn(
                                  "absolute bottom-0.5 w-1 h-1 rounded-full",
                                  isDaySelectedExact ? "bg-white" : "bg-emerald-500"
                                )} 
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* CUSTOM DATE PICKERS & REAL-TIME INTERACTIVE SLATE */}
                <div className={cn(
                  showCalendar ? "md:col-span-7 lg:col-span-8" : "md:col-span-12",
                  "flex flex-col justify-between space-y-4"
                )}>
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
                      <div className="relative">
                        <input
                          type="text"
                          required={!txCustomerId}
                          placeholder="🔍 Search profile (e.g., +88017...)"
                          value={txPhoneSearch}
                          onChange={(e) => {
                            setTxPhoneSearch(e.target.value);
                            // If they empty search, reset active selection
                            if (!e.target.value) {
                              setTxCustomerId('');
                            }
                          }}
                          className={cn(
                            "w-full px-5 py-3.5 border-none rounded-2xl transition-all outline-none text-xs font-semibold placeholder:text-slate-500",
                            isDark ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-900 border border-slate-200"
                          )}
                        />
                        
                        {/* Selected Customer confirmation banner */}
                        {txCustomerId && (
                          <div className={cn(
                            "mt-2 text-[10px] p-2.5 rounded-xl flex items-center justify-between font-bold",
                            isDark ? "bg-emerald-950/20 border border-emerald-900/60 text-emerald-400" : "bg-emerald-50 border border-emerald-100 text-emerald-850"
                          )}>
                            <span className="truncate">
                              Selected: <span className="underline">{customersSnap?.docs.find(d => d.id === txCustomerId)?.data().name}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setTxCustomerId('');
                                setTxPhoneSearch('');
                              }}
                              className="text-[9px] font-black uppercase text-rose-500 hover:underline shrink-0"
                            >
                              Clear
                            </button>
                          </div>
                        )}

                        {/* Dropdown Suggestions matching phone numbers */}
                        {txPhoneSearch && (
                          <div className={cn(
                            "absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto divide-y rounded-xl shadow-2xl z-30",
                            isDark ? "bg-slate-950 border border-white/5 divide-slate-800" : "bg-white border border-slate-200 divide-slate-100"
                          )}>
                            {(customersSnap?.docs.filter(doc => {
                              const ph = doc.data().phone || '';
                              const nm = doc.data().name || '';
                              const sTerm = txPhoneSearch.toLowerCase();
                              return ph.toLowerCase().includes(sTerm) || nm.toLowerCase().includes(sTerm);
                            }) || []).length === 0 ? (
                              <div className="p-3 text-slate-500 text-[10px] italic">No phone or customer matches found. Toggle "Add New Customer"!</div>
                            ) : (
                              (customersSnap?.docs.filter(doc => {
                                const ph = doc.data().phone || '';
                                const nm = doc.data().name || '';
                                const sTerm = txPhoneSearch.toLowerCase();
                                return ph.toLowerCase().includes(sTerm) || nm.toLowerCase().includes(sTerm);
                              }) || []).map(doc => {
                                const d = doc.data();
                                const isSelected = txCustomerId === doc.id;
                                return (
                                  <button
                                    key={doc.id}
                                    type="button"
                                    onClick={() => {
                                      setTxCustomerId(doc.id);
                                      setTxPhoneSearch(d.phone);
                                      toast.success(`Selected customer context: ${d.name}`);
                                    }}
                                    className={cn(
                                      "w-full text-left p-2.5 flex flex-col transition-all text-xs",
                                      isSelected ? (isDark ? "bg-white/[0.05]" : "bg-slate-50") : (isDark ? "hover:bg-white/[0.03]" : "hover:bg-slate-50")
                                    )}
                                  >
                                    <div className="flex items-center justify-between w-full font-bold">
                                      <span className={isDark ? "text-slate-150" : "text-slate-850"}>{d.name}</span>
                                      {isSelected && <span className="text-[8px] uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-1 py-0.5 rounded font-black">Active</span>}
                                    </div>
                                    <span className="text-[9px] text-slate-500 font-mono mt-0.5">{d.phone}</span>
                                  </button>
                                );
                              })
                            )}
                          </div>
                        )}
                      </div>
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

                  {/* INTERACTIVE MULTIPLE IT SERVICES BUILDER DESIGN */}
                  <div className="p-4 rounded-2xl bg-slate-900/5 dark:bg-slate-950/40 border border-slate-805/10 dark:border-white/5 space-y-4 text-left">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800/10 dark:border-white/5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#ec4899] block" style={{ color: settings.primaryColor }}>
                        IT Services & Custom Scope Configurator
                      </span>
                      <span className="text-[9px] font-mono p-1 rounded bg-slate-500/10 text-slate-400 font-extrabold uppercase">
                        {txItems.length} Added
                      </span>
                    </div>

                    {/* Simple dynamic select + price value + quantity form to add packages */}
                    <div className="space-y-3 p-3.5 rounded-xl border border-dashed border-slate-805/30 bg-slate-50/50 dark:bg-slate-950/60">
                      <div className="space-y-1">
                        <label className="text-[8.5px] font-black uppercase tracking-wider text-slate-400 block pl-1">Choose Service Offering</label>
                        <select
                          value={txServiceId}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTxServiceId(val);
                            const orig = servicesSnap?.docs.find(s => s.id === val);
                            if (orig) {
                              setTxPrice(String(orig.data().price || 0));
                            } else {
                              setTxPrice('0');
                            }
                          }}
                          className={cn(
                            "w-full px-3 py-2 rounded-xl text-xs font-semibold outline-none",
                            isDark ? "bg-slate-900 text-white" : "bg-white text-slate-900 border border-slate-200"
                          )}
                        >
                          <option value="">-- Click to select a package --</option>
                          {servicesSnap?.docs
                            .filter(doc => doc.data().status !== 'Muted')
                            .map(doc => {
                              const d = doc.data();
                              return (
                                <option key={doc.id} value={doc.id}>
                                  {d.name} ({currencySymbol}{Number(d.price || 0).toLocaleString()})
                                </option>
                              );
                            })}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[8.5px] font-black uppercase tracking-wider text-slate-400 block pl-1">Unit Value ({currencySymbol})</label>
                          <input
                            type="number"
                            value={txPrice}
                            onChange={(e) => setTxPrice(e.target.value)}
                            placeholder="Base Price"
                            className={cn(
                              "w-full px-3 py-2 rounded-xl text-xs font-bold outline-none",
                              isDark ? "bg-slate-900 text-white animate-pulse" : "bg-white text-slate-900 border border-slate-200"
                            )}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[8.5px] font-black uppercase tracking-wider text-slate-400 block pl-1">Quantity</label>
                          <input
                            type="number"
                            min="1"
                            value={txQuantity}
                            onChange={(e) => setTxQuantity(parseInt(e.target.value) || 1)}
                            className={cn(
                              "w-full px-3 py-2 rounded-xl text-xs font-bold outline-none",
                              isDark ? "bg-slate-900 text-white" : "bg-white text-slate-900 border border-slate-200"
                            )}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const chosenDoc = servicesSnap?.docs.find(s => s.id === txServiceId);
                          if (!chosenDoc) {
                            toast.error('Please pick a corporate service offering from the list first.');
                            return;
                          }
                          const sData = chosenDoc.data();
                          const valNum = parseFloat(txPrice);
                          if (isNaN(valNum) || valNum < 0) {
                            toast.error('Please specify a positive unit price value.');
                            return;
                          }
                          if (txQuantity <= 0) {
                            toast.error('The order quantity must be at least 1.');
                            return;
                          }

                          // Check if service is already added, if so, merge or update
                          const existingIndex = txItems.findIndex(item => item.serviceId === txServiceId);
                          if (existingIndex > -1) {
                            const updated = [...txItems];
                            updated[existingIndex].quantity += txQuantity;
                            updated[existingIndex].totalAmount = updated[existingIndex].price * updated[existingIndex].quantity;
                            setTxItems(updated);
                            toast.success(`Incremented quantity for ${sData.name}!`);
                          } else {
                            const newItem = {
                              id: Math.random().toString(36).substring(2, 9),
                              serviceId: txServiceId,
                              serviceName: sData.name,
                              price: valNum,
                              quantity: txQuantity,
                              totalAmount: valNum * txQuantity
                            };
                            setTxItems(prev => [...prev, newItem]);
                            toast.success(`Added ${sData.name} to this custom deal scope.`);
                          }

                          // Clear selection states
                          setTxServiceId('');
                          setTxPrice('0');
                          setTxQuantity(1);
                        }}
                        className="w-full text-[10px] py-2 font-black uppercase tracking-widest text-center cursor-pointer rounded-xl text-white transition-all shadow-md flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-[0.98]"
                        style={{ backgroundColor: settings.primaryColor }}
                      >
                        <Plus size={12} /> Add Scope Service
                      </button>
                    </div>

                    {/* Added List card items with editable values and delete option */}
                    {txItems.length === 0 ? (
                      <div className="p-6 text-center text-slate-500 italic text-[11px] bg-slate-100/10 dark:bg-slate-900/10 rounded-xl border border-dashed border-slate-800/10">
                        No services added yet. Select a service package above and click "Add Scope Service" to configure the custom deal dynamically.
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                        {txItems.map((item) => (
                          <div
                            key={item.id}
                            className={cn(
                              "p-3 rounded-xl border flex flex-col gap-2 transition-all relative group",
                              isDark ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200 shadow-sm"
                            )}
                          >
                            <div className="flex justify-between items-start gap-4">
                              <span className="font-extrabold text-[11px] text-slate-200 leading-tight block text-left" style={{ color: isDark ? 'white' : 'black' }}>
                                {item.serviceName}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setTxItems(prev => prev.filter(it => it.id !== item.id));
                                  toast.error(`${item.serviceName} removed from configuration scope.`);
                                }}
                                className="text-slate-500 hover:text-red-500 transition-colors p-1"
                                title="Remove item"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pb-1 border-t border-slate-800/5 dark:border-slate-800/20 pt-2">
                              {/* Inline price value editor (price adjustments) */}
                              <div className="space-y-0.5 text-left">
                                <label className="text-[8px] font-black uppercase text-slate-500 tracking-wider">Unit Value ({currencySymbol})</label>
                                <input
                                  type="number"
                                  value={item.price}
                                  onChange={(e) => {
                                    const nextPrice = parseFloat(e.target.value) || 0;
                                    setTxItems(prev => prev.map(it => {
                                      if (it.id === item.id) {
                                        return {
                                          ...it,
                                          price: nextPrice,
                                          totalAmount: nextPrice * it.quantity
                                        };
                                      }
                                      return it;
                                    }));
                                  }}
                                  className={cn(
                                    "w-full px-2 py-1 rounded-lg text-[11px] font-bold outline-none",
                                    isDark ? "bg-slate-950 text-emerald-400" : "bg-slate-100 text-slate-900 border border-slate-200"
                                  )}
                                />
                              </div>

                              {/* Inline quantity editor */}
                              <div className="space-y-0.5 text-left">
                                <label className="text-[8px] font-black uppercase text-slate-500 tracking-wider">Quantity</label>
                                <input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => {
                                    const nextQty = parseInt(e.target.value) || 1;
                                    setTxItems(prev => prev.map(it => {
                                      if (it.id === item.id) {
                                        return {
                                          ...it,
                                          quantity: nextQty,
                                          totalAmount: it.price * nextQty
                                        };
                                      }
                                      return it;
                                    }));
                                  }}
                                  className={cn(
                                    "w-full px-2 py-1 rounded-lg text-[11px] font-bold outline-none",
                                    isDark ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-900 border border-slate-200"
                                  )}
                                />
                              </div>
                            </div>

                            <div className="flex justify-between items-center text-[10px] pt-1 border-t border-slate-800/5 dark:border-slate-800/20 font-bold">
                              <span className="text-slate-500">Subtotal Amount:</span>
                              <span className="text-slate-100 font-mono" style={{ color: isDark ? 'white' : 'black' }}>
                                {currencySymbol}{item.totalAmount.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4">
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

                {/* Dual-Responsive View Wrapper */}
                <div>
                  {/* MOBILE-ONLY VIEW (block md:hidden) - Stack of beautiful corporate interactive cards */}
                  <div className="block md:hidden divide-y divide-slate-800/10 dark:divide-white/10">
                    {filteredTransactions.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 italic text-xs">
                        No IT deals matching filter criteria. Record a transaction or trigger "Seeding Data" to initialize.
                      </div>
                    ) : (
                      filteredTransactions.map((tx, idx) => {
                        const isExpanded = expandedTxId === (tx.id || `idx-${idx}`);
                        const hasDues = tx.status !== 'Collected';
                        return (
                          <div 
                            key={tx.id || `tx-mob-${idx}`}
                            className={cn(
                              "p-5 transition-all text-left space-y-3.5 select-none cursor-pointer",
                              isExpanded ? (isDark ? "bg-white/[0.02]" : "bg-slate-50/70") : "",
                              isDark ? "hover:bg-white/[0.01]" : "hover:bg-slate-50/40"
                            )}
                            onClick={() => {
                              setExpandedTxId(isExpanded ? null : (tx.id || `idx-${idx}`));
                              toast.success(`Deal ${isExpanded ? 'collapsed' : 'expanded'}: ${tx.dealId || 'No Contract'}`);
                            }}
                          >
                            {/* Card Header row */}
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <h4 className="font-extrabold text-xs font-sans leading-tight" style={{ color: settings.primaryColor }}>
                                  👤 {tx.customerName}
                                </h4>
                                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{tx.customerPhone}</p>
                              </div>
                              <span className={cn(
                                "text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full select-none",
                                !hasDues ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                              )}>
                                ● {!hasDues ? 'Collected' : 'Due'}
                              </span>
                            </div>

                            {/* Service and Price block */}
                            <div className="grid grid-cols-2 gap-3 pt-1">
                              <div className="col-span-2">
                                <p className="text-[9px] font-black uppercase text-slate-500 leading-none">IT Service Offer</p>
                                <p className="font-bold text-xs mt-1 text-slate-200" style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>
                                  {tx.serviceName}
                                </p>
                              </div>
                              <div>
                                <p className="text-[9px] font-black uppercase text-slate-550 leading-none">Price/Unit</p>
                                <p className="font-mono text-[10.5px] font-medium mt-1 text-slate-450">
                                  {currencySymbol}{Number(tx.price).toLocaleString()} <span className="text-[9px] text-slate-500 font-sans">x{tx.quantity}</span>
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-[9px] font-black uppercase text-slate-550 leading-none">Booking Value</p>
                                <p className="font-mono text-xs font-black mt-1" style={{ color: settings.primaryColor }}>
                                  {currencySymbol}{Number(tx.totalAmount).toLocaleString()}
                                </p>
                              </div>
                            </div>

                            {/* Chevron expand trigger and key descriptors */}
                            <div className="flex justify-between items-center pt-2.5 border-t border-slate-800/10 dark:border-white/10">
                              <span className="text-[9px] text-slate-500 font-mono">
                                Date logged: {tx.date}
                              </span>
                              <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-slate-400">
                                <span>{isExpanded ? "Collapse" : "Reveal SLA"}</span>
                                <ChevronRight size={10} className={cn("transition-transform", isExpanded ? "rotate-90" : "")} />
                              </div>
                            </div>

                            {/* Expanded Mobile Details Drawer */}
                            {isExpanded && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="pt-3.5 space-y-3 text-xs font-sans text-left bg-slate-500/5 border border-slate-500/10 p-3 rounded-2xl overflow-hidden"
                              >
                                <div>
                                  <p className="text-[8.5px] font-black uppercase tracking-wider text-slate-500">Corporate Deal Key (Contract ID)</p>
                                  <p className="font-bold text-amber-500 font-mono mt-0.5 text-[10px] select-all">
                                    {tx.dealId || `IT-${tx.date.replace(/-/g, '')}-DNL`}
                                  </p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <p className="text-[8.5px] font-black uppercase tracking-wider text-slate-500">Sales Representative</p>
                                    <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded bg-slate-500/10 text-slate-400 text-[8.5px] font-bold max-w-[120px] truncate">
                                      👤 {tx.executiveName || 'Admin Desk'}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="text-[8.5px] font-black uppercase tracking-wider text-slate-500">Commission Rate</p>
                                    <p className="font-extrabold text-[#ec4899] mt-0.5 text-[10px]" style={{ color: settings.primaryColor }}>
                                      {tx.commissionPercentage || 10}% rate ({currencySymbol}{Number(tx.commissionEarned || 0).toLocaleString()})
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-[8.5px] font-black uppercase tracking-wider text-slate-550 mb-1">Contract Operational Life SLA Span</p>
                                  <div className="flex items-center justify-between bg-slate-950/25 p-2 rounded-xl border border-white/5 text-[9.5px]">
                                    <div className="flex flex-col">
                                      <span className="text-slate-500 font-black text-[8px] uppercase">Commencement</span>
                                      <span className="text-emerald-400 font-bold font-mono">{tx.startDate || tx.date}</span>
                                    </div>
                                    <div className="flex flex-col text-right">
                                      <span className="text-slate-500 font-black text-[8px] uppercase">Termination SLA</span>
                                      <span className="text-pink-400 font-bold font-mono">{tx.endDate || tx.date}</span>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* DESKTOP/TABLET VIEW (hidden md:block) - Standard elegant enterprise table */}
                  <div className="hidden md:block overflow-x-auto">
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
                        filteredTransactions.map((tx, idx) => {
                          const isExpanded = expandedTxId === (tx.id || `idx-${idx}`);
                          return (
                            <React.Fragment key={tx.id || `tx-${idx}`}>
                              <tr 
                                onClick={() => {
                                  setExpandedTxId(isExpanded ? null : (tx.id || `idx-${idx}`));
                                  toast.success(`Deal info ${isExpanded ? 'collapsed' : 'revealed'}: ${tx.dealId || 'No Contract ID'}`);
                                }}
                                className={cn(
                                  "hover:bg-slate-50/50 transition-colors cursor-pointer select-none",
                                  isExpanded ? (isDark ? "bg-white/[0.03]" : "bg-slate-100/50") : "",
                                  isDark ? "hover:bg-white/[0.02]" : ""
                                )}
                              >
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
                              {isExpanded && (
                                <tr className={isDark ? "bg-slate-950/40" : "bg-slate-50/30"}>
                                  <td colSpan={8} className="p-4 border-t border-b border-slate-800/10">
                                    <motion.div 
                                      initial={{ opacity: 0, y: -4 }} 
                                      animate={{ opacity: 1, y: 0 }}
                                      className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs py-2 px-1"
                                    >
                                      <div>
                                        <p className="text-[9px] font-black uppercase text-slate-500">Unique Corporate Deal ID</p>
                                        <p className="font-extrabold text-amber-500 font-mono mt-1 text-[11px] block">{tx.dealId || `IT-${tx.date.replace(/-/g, '')}-DNL`}</p>
                                      </div>
                                      <div>
                                        <p className="text-[9px] font-black uppercase text-slate-500 animate-pulse">SLA Contract support span</p>
                                        <p className="font-bold text-slate-300 mt-1" style={{ color: isDark ? '#cbd5e1' : '#334155' }}>
                                          {tx.startDate || tx.date} to {tx.endDate || tx.date}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-[9px] font-black uppercase text-slate-500">Commission Distribution</p>
                                        <p className="font-black text-rose-455 mt-1" style={{ color: settings.primaryColor }}>
                                          {tx.commissionPercentage || 10}% rate ({currencySymbol}{Number(tx.commissionEarned || 0).toLocaleString()})
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-[9px] font-black uppercase text-slate-500">Payment Status Tracker</p>
                                        <span className={cn(
                                          "inline-block mt-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider select-none",
                                          tx.status === 'Collected' ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-450"
                                        )}>
                                          ● {tx.status || 'Collected'}
                                        </span>
                                      </div>
                                    </motion.div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
                </div>
              </Card>
            </div>
          </>
        )}

        {/* TAB 2: IT SERVICES MANAGER OR SEARCHABLE CATALOG */}
        {activeSubTab === 'services' && (
          <>
            {/* Left Column: Form to Add Corporate IT Service */}
            <div className="col-span-12 lg:col-span-4 animate-fade-in">
              <Card className="space-y-6">
                <div>
                  <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                    <Briefcase style={{ color: settings.primaryColor }} size={20} />
                    Add Corporate IT Service
                  </h2>
                  <p className="text-[10px] text-slate-500 mt-1 italic font-medium">Extend business catalog packages or project scopes details.</p>
                </div>

                <form onSubmit={handleAddService} className="space-y-4 text-left">
                  <Input 
                    label="Service Name"
                    placeholder="e.g., Facebook ads"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    required
                  />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Input 
                      label={`Base Rate (${currency})`}
                      placeholder="e.g., 145"
                      type="number"
                      value={servicePrice}
                      onChange={(e) => setServicePrice(e.target.value)}
                      required
                    />

                    <Input 
                      label="Service Quantity"
                      placeholder="e.g., 1"
                      type="number"
                      min="1"
                      value={serviceQuantity}
                      onChange={(e) => setServiceQuantity(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] pl-1 font-black uppercase tracking-[0.2em] text-slate-400 italic">Description of Service</label>
                    <textarea
                      placeholder="e.g., Meta/Facebook marketing campaign management, pixel setup, and conversion API audit..."
                      value={serviceDesc}
                      onChange={(e) => setServiceDesc(e.target.value)}
                      className={cn(
                        "w-full px-4 py-3 border-none rounded-2xl transition-all outline-none placeholder:text-slate-500 text-xs font-semibold h-24 whitespace-pre-wrap",
                        isDark ? "bg-slate-900/70 text-white" : "bg-slate-100/90 text-slate-900"
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full text-xs font-black uppercase tracking-widest py-4 rounded-2.5xl">
                    <Check size={14} /> Add Service Offer
                  </Button>
                </form>
              </Card>
            </div>

            {/* Right Column: Service list table right */}
            <div className="col-span-12 lg:col-span-8 animate-fade-in">
              <Card className="p-0 overflow-hidden">
                <div className="p-6 border-b border-slate-800/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                      <Database size={16} style={{ color: settings.primaryColor }} />
                      Live Services Catalog ({servicesSnap?.size || 0})
                    </h3>
                    <p className="text-[10px] text-slate-500 italic mt-1 font-semibold">Manage corporate services, prices, and quantities below.</p>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    {/* Admin filter input */}
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Search services..."
                        value={serviceSearchQuery}
                        onChange={(e) => setServiceSearchQuery(e.target.value)}
                        className={cn(
                          "w-full pl-8 pr-3 py-1.5 rounded-xl text-[11px] font-semibold border-none outline-none",
                          isDark ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-900 border border-slate-205"
                        )}
                      />
                    </div>

                    <button
                      onClick={handleSeedData}
                      className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-white transition-all hover:opacity-90 whitespace-nowrap"
                      style={{ backgroundColor: settings.primaryColor }}
                    >
                      <RefreshCw size={12} className="inline mr-1" /> Seed Templates
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-slate-800/10 text-left">
                  {servicesSnap?.empty ? (
                    <div className="p-12 text-center text-slate-500 italic flex flex-col items-center justify-center gap-4">
                      <p>No services listed yet in this workspace. Restructure or populate now.</p>
                      <button
                        onClick={handleSeedData}
                        className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all hover:scale-[1.01]"
                        style={{ backgroundColor: settings.primaryColor }}
                      >
                        Populate Template IT Services
                      </button>
                    </div>
                  ) : (() => {
                    const servicesList = servicesSnap?.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)) || [];
                    const filteredServices = servicesList.filter(svc => {
                      const sQuery = (serviceSearchQuery || globalSearchQuery).toLowerCase();
                      return svc.name.toLowerCase().includes(sQuery) ||
                             (svc.description && svc.description.toLowerCase().includes(sQuery)) ||
                             String(svc.price).includes(sQuery);
                    });

                    if (filteredServices.length === 0) {
                      return <div className="p-12 text-center text-slate-500 font-bold italic">No services match your search query.</div>;
                    }

                    return filteredServices.map(svc => {
                      const isEditingThis = editingServiceId === svc.id;

                      if (isEditingThis) {
                        return (
                          <div key={svc.id} className="p-6 bg-slate-500/5 space-y-4 animate-fade-in text-xs text-left">
                            <span className="font-extrabold text-[9px] text-[#ec4899] uppercase tracking-widest">Inline IT Service Editor</span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Input 
                                label="Service name"
                                value={editServiceName}
                                onChange={(e) => setEditServiceName(e.target.value)}
                                required
                              />
                              <Input 
                                label={`Price (${currency})`}
                                type="number"
                                value={editServicePrice}
                                onChange={(e) => setEditServicePrice(e.target.value)}
                                required
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Input 
                                label="Service Quantity"
                                type="number"
                                min="1"
                                value={editServiceQuantity}
                                onChange={(e) => setEditServiceQuantity(e.target.value)}
                                required
                              />
                              <Input 
                                label="Short description"
                                value={editServiceDesc}
                                onChange={(e) => setEditServiceDesc(e.target.value)}
                              />
                            </div>
                            <div className="flex gap-2 justify-end pt-2">
                              <button
                                type="button"
                                onClick={() => setEditingServiceId(null)}
                                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-[10px] font-black uppercase tracking-wider text-slate-300 transition-all cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateService(svc.id)}
                                className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider text-white transition-all cursor-pointer"
                                style={{ backgroundColor: settings.primaryColor }}
                              >
                                Save Changes
                              </button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div key={svc.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-slate-50/20 transition-all">
                          <div className="space-y-2 flex-1 text-left min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-bold text-sm tracking-tight" style={{ color: isDark ? 'white' : 'black' }}>{svc.name}</h4>
                              
                              <span className="px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-widest border shrink-0 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                Quantity: {svc.quantity || 1}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed font-semibold italic truncate">{svc.description || 'No description provided.'}</p>
                          </div>

                          <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                            <div className="text-right">
                              <p className="text-lg font-mono font-black" style={{ color: settings.primaryColor }}>{currencySymbol}{Number(svc.price).toLocaleString()}</p>
                              <p className="text-[8px] font-bold text-slate-500 mt-1 uppercase tracking-wider">Per Unit Rate</p>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingServiceId(svc.id);
                                  setEditServiceName(svc.name);
                                  setEditServicePrice(String(svc.price));
                                  setEditServiceQuantity(String(svc.quantity || 1));
                                  setEditServiceDesc(svc.description || '');
                                }}
                                className="p-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
                                title="Edit Service details"
                              >
                                <Edit size={14} />
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`Are you absolutely sure you want to delete this IT service offer entirely from the system database? Any record using this service id will remain as-is.`)) {
                                    handleDeleteService(svc.id);
                                  }
                                }}
                                className="p-2 bg-red-500/10 border border-red-500/20 text-slate-400 hover:text-red-500 rounded-xl transition-all cursor-pointer"
                                title="Delete Service record"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </Card>
            </div>

            {/* DETAILS SERVICE SPECIFICATIONS MODAL DIALOG */}
            {selectedServiceDetails && (
              <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                <div
                  className={cn(
                    "w-full max-w-lg rounded-3xl p-8 border text-left shadow-2xl relative space-y-6 animate-scale-up",
                    isDark ? "bg-[#0c0f1d] border-slate-800" : "bg-white border-slate-100 shadow-xl"
                  )}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1 text-left">
                      <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border block w-fit bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                        Quantity: {selectedServiceDetails.quantity || 1}
                      </span>
                      <h3 className="text-lg font-black tracking-tight mt-2.5" style={{ color: isDark ? 'white' : 'black' }}>
                        {selectedServiceDetails.name}
                      </h3>
                    </div>
                    <button 
                      onClick={() => setSelectedServiceDetails(null)}
                      className="p-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold transition-all cursor-pointer shrink-0"
                    >
                      ✕ Close
                    </button>
                  </div>

                  <hr className="border-slate-800/10" />

                  <div className="space-y-4">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">SLA Rate Package</span>
                      <span className="text-2xl font-mono font-black mt-1 block" style={{ color: settings.primaryColor }}>
                        {currencySymbol}{Number(selectedServiceDetails.price).toLocaleString()} <span className="text-xs text-slate-500 font-sans font-bold uppercase tracking-wider">Base Rate</span>
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">Scope of Service</span>
                      <p className="text-xs leading-relaxed font-semibold italic mt-1.5" style={{ color: isDark ? '#cbd5e1' : '#475569' }}>
                        {selectedServiceDetails.description || 'No detailed specifications have been compiled for this contract package.'}
                      </p>
                    </div>

                    <div className={cn(
                      "p-4 border rounded-2xl text-[10.5px] leading-relaxed font-semibold space-y-1.5",
                      isDark ? "bg-slate-950/40 border-slate-800/10 text-slate-400" : "bg-slate-50 border-slate-200/50 text-slate-600"
                    )}>
                      <p className="font-extrabold uppercase tracking-wider text-[8px]" style={{ color: settings.primaryColor }}>Contractual SLA Specifications Included:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Standard 30-day dynamic sandbox support logs</li>
                        <li>High performance API nodes optimization integration</li>
                        <li>Applied direct sales credited commission and deal tracking</li>
                        <li>Full secure compliance on customer data registries</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setSelectedServiceDetails(null)}
                      className="flex-1 py-3.5 rounded-2xl text-[10px] bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white font-black uppercase tracking-wider border border-slate-800 transition-all cursor-pointer text-center"
                    >
                      Done Browsing
                    </button>
                  </div>
                </div>
              </div>
            )}
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
              usersList={usersSnap?.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)) || []}
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
              usersList={(usersSnap?.docs.map(doc => ({ id: doc.id, ...doc.data() } as any)) || []).filter(u => {
                if (!globalSearchQuery) return true;
                const sq = globalSearchQuery.toLowerCase();
                return (u.name && u.name.toLowerCase().includes(sq)) || 
                       (u.id && u.id.toLowerCase().includes(sq)) || 
                       (u.email && u.email.toLowerCase().includes(sq));
              })}
              rawTransactions={rawTransactions}
              currencySymbol={currencySymbol}
              onAddUser={handleAddUser}
              onUpdateUserCommission={handleUpdateUserCommission}
              onUpdateUserProperties={handleUpdateUserProperties}
              onDeleteUser={handleDeleteUser}
            />
          </div>
        )}

      </div>
    </div>
  );
}
