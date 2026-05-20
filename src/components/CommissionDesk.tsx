import React from 'react';
import { Card, Button } from './common/UI';
import { 
  Coins, 
  TrendingUp, 
  Clock, 
  Award, 
  CheckCircle2, 
  HelpCircle, 
  User, 
  Briefcase,
  DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CommissionDeskProps {
  isDark: boolean;
  settings: any;
  activeUserId: string;
  activeRole: 'admin' | 'executive';
  currencySymbol: string;
  rawTransactions: any[];
  usersList: any[];
  onTogglePaymentStatus: (id: string, currentStatus: string) => Promise<void>;
}

export default function CommissionDesk({
  isDark,
  settings,
  activeUserId,
  activeRole,
  currencySymbol,
  rawTransactions,
  usersList,
  onTogglePaymentStatus
}: CommissionDeskProps) {
  // 1. Filter transactions representing the active user's visibility
  const visibleTransactions = rawTransactions.filter(tx => {
    if (activeRole === 'admin') return true;
    return tx.executiveId === activeUserId;
  });

  // 2. Map & calculate detailed commission data for each transaction
  const computedTransactions = visibleTransactions.map(tx => {
    const total = tx.totalAmount || 0;
    
    // Auto calculate commission percentage set for that desk or fallback
    const rate = tx.commissionPercentage !== undefined ? tx.commissionPercentage : 10;
    const earned = total * (rate / 100);
    const status = tx.status || 'Collected'; // Defaults to collected
    
    const collectedAmount = status === 'Due' ? 0 : total;
    const dueAmount = status === 'Due' ? total : 0;
    
    const commCollected = status === 'Due' ? 0 : earned;
    const commDue = status === 'Due' ? earned : 0;

    return {
      ...tx,
      rate,
      earned,
      status,
      collectedAmount,
      dueAmount,
      commCollected,
      commDue
    };
  });

  // Cumulative metrics
  const totalSold = computedTransactions.reduce((sum, tx) => sum + (tx.totalAmount || 0), 0);
  const totalEarnedCommissions = computedTransactions.reduce((sum, tx) => sum + tx.earned, 0);
  const totalCollectedCommissions = computedTransactions.reduce((sum, tx) => sum + tx.commCollected, 0);
  const totalDueCommissions = computedTransactions.reduce((sum, tx) => sum + tx.commDue, 0);

  // Individual Executive breakdowns (Only for Admin View)
  const executiveMetrics: { 
    [id: string]: { 
      name: string; 
      email: string;
      rate: number; 
      sold: number; 
      earned: number; 
      collected: number; 
      due: number;
    } 
  } = {};

  if (activeRole === 'admin') {
    // Collect all executives
    const executives = usersList.filter(u => u.role === 'executive');
    
    executives.forEach(exec => {
      executiveMetrics[exec.id] = {
        name: exec.name || 'Executive Desk',
        email: exec.email || 'exec@nexasphere.it',
        rate: exec.commissionPercentage !== undefined ? exec.commissionPercentage : 5,
        sold: 0,
        earned: 0,
        collected: 0,
        due: 0
      };
    });

    // Accumulate transaction sums
    rawTransactions.forEach(tx => {
      const execId = tx.executiveId;
      const total = tx.totalAmount || 0;
      const rate = tx.commissionPercentage !== undefined ? tx.commissionPercentage : 10;
      const earned = total * (rate / 100);
      const isDue = tx.status === 'Due';

      if (!executiveMetrics[execId]) {
        // Fallback for preseeded/unregistered executives
        executiveMetrics[execId] = {
          name: tx.executiveName || 'Secondary Desk',
          email: `${execId}@nexasphere.it`,
          rate,
          sold: 0,
          earned: 0,
          collected: 0,
          due: 0
        };
      }

      executiveMetrics[execId].sold += total;
      executiveMetrics[execId].earned += earned;
      if (isDue) {
        executiveMetrics[execId].due += earned;
      } else {
        executiveMetrics[execId].collected += earned;
      }
    });
  }

  const collectedPct = totalEarnedCommissions > 0 
    ? Math.round((totalCollectedCommissions / totalEarnedCommissions) * 100) 
    : 100;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* SECTION BANNER HERO */}
      <div className="flex justify-between items-center bg-slate-900/5 dark:bg-slate-950/20 p-6 rounded-3xl border border-slate-800/10">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2" style={{ color: isDark ? 'white' : 'black' }}>
            <Award className="text-yellow-500 animate-bounce" size={24} />
            {activeRole === 'admin' ? 'Executive Commission Ledger Center' : 'My Personal Commission Dashboard'}
          </h2>
          <p className="text-xs text-slate-500 mt-1 italic font-medium">
            {activeRole === 'admin' 
              ? 'Analyze overall sales performance, monitor corporate contract statuses, and process credited payouts.'
              : 'Keep track of your total corporate accounts logged, commission rates, outstanding dues, and cash collections.'}
          </p>
        </div>
      </div>

      {/* COMMISSIONS & METRICS BENTO CONTAINER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* CARD 1: TOTAL SALES VALUE */}
        <Card className="p-6 relative select-none">
          <div className="absolute top-4 right-4 text-slate-500 bg-slate-500/10 p-2 rounded-xl">
            <TrendingUp size={20} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Total Sales Booked</span>
            <span className="text-3xl font-black mt-2 block" style={{ color: isDark ? 'white' : 'black' }}>
              {currencySymbol}{totalSold.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
            <div className="mt-4 flex items-center gap-1.5 text-[10px] text-emerald-500 font-extrabold bg-emerald-500/5 px-2.5 py-1 rounded-lg w-fit">
              Total transaction volume
            </div>
          </div>
        </Card>

        {/* CARD 2: CUMULATIVE COMMISSION EARNINGS */}
        <Card className="p-6 relative select-none">
          <div className="absolute top-4 right-4 text-violet-500 bg-violet-500/10 p-2 rounded-xl">
            <Coins size={20} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-violet-400 block">Total Earned Commissions</span>
            <span className="text-3xl font-black mt-2 block text-violet-500">
              {currencySymbol}{totalEarnedCommissions.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
            <div className="mt-4 flex items-center gap-1.5 text-[10px] text-violet-400 font-extrabold bg-violet-500/5 px-2.5 py-1 rounded-lg w-fit">
              Compounded automatic desk calculations
            </div>
          </div>
        </Card>

        {/* CARD 3: COLLECTED COMMISSIONS */}
        <Card className="p-6 relative select-none">
          <div className="absolute top-4 right-4 text-emerald-500 bg-emerald-500/10 p-2 rounded-xl">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">Commission Collected</span>
            <span className="text-3xl font-black mt-2 block text-emerald-400">
              {currencySymbol}{totalCollectedCommissions.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
            
            {/* ProgressBar */}
            <div className="mt-4 space-y-1.5">
              <div className="w-full h-1.5 bg-slate-900/60 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500" 
                  style={{ width: `${collectedPct}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[9px] font-black text-slate-500">
                <span>{collectedPct}% RECOVERED</span>
                <span>{currencySymbol}{(totalEarnedCommissions - totalCollectedCommissions).toLocaleString()} REMAINING</span>
              </div>
            </div>
          </div>
        </Card>

        {/* CARD 4: OUTSTANDING COMMISSION DUES */}
        <Card className="p-6 relative select-none">
          <div className="absolute top-4 right-4 text-rose-500 bg-rose-500/10 p-2 rounded-xl">
            <Clock size={20} className={totalDueCommissions > 0 ? "animate-pulse" : ""} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 block">Commission Outstanding Due</span>
            <span className="text-3xl font-black mt-2 block text-rose-500">
              {currencySymbol}{totalDueCommissions.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
            <div className="mt-4 flex items-center gap-1.5 text-[10px] font-extrabold bg-rose-500/5 px-2.5 py-1 rounded-lg w-fit" style={{ color: totalDueCommissions > 0 ? '#f43f5e' : '#64748b' }}>
              {totalDueCommissions > 0 ? 'Payment collection required' : 'All accounts fully cleared!'}
            </div>
          </div>
        </Card>

      </div>

      {/* EXECUTIVE CONTRAST ANALYSIS (ONLY DISPLAYED TO THE CORE ADMINISTRATORS) */}
      {activeRole === 'admin' && (
        <Card className="p-6 space-y-4">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider" style={{ color: isDark ? 'white' : 'black' }}>
              Executive Staff Performance & Credited Commissions (Manager view)
            </h3>
            <p className="text-[10px] text-slate-500 font-bold italic mt-0.5">
              Monitor individual sales outputs, applied ratios, and corresponding receivables. Toggle switches below to credit collections.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800/10 text-slate-500 font-black uppercase text-[9px] tracking-widest">
                  <th className="py-4 px-2">Sales Executive</th>
                  <th className="py-4">Applied Commission Rate [%]</th>
                  <th className="py-4 text-right">Sum Total Sold</th>
                  <th className="py-4 text-right">Compounded Earnings</th>
                  <th className="py-4 text-right">Collected Payouts</th>
                  <th className="py-4 text-right text-rose-500">Uncollected Dues</th>
                  <th className="py-4 text-center">Desk Standing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/5 font-semibold text-slate-300">
                {Object.keys(executiveMetrics).length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-slate-500 font-bold italic">
                      No active sales executives profile logged. Add staff members in Logins Settings tab.
                    </td>
                  </tr>
                ) : (
                  Object.entries(executiveMetrics).map(([id, stats]) => {
                    const duePct = stats.earned > 0 ? (stats.due / stats.earned) * 100 : 0;
                    let badgeColor = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
                    let rating = "Elite Desk";
                    
                    if (stats.sold === 0) {
                      badgeColor = "bg-slate-500/10 text-slate-400 border border-slate-500/20";
                      rating = "Inactive";
                    } else if (duePct > 50) {
                      badgeColor = "bg-amber-500/10 text-amber-400 border border-amber-500/20";
                      rating = "Pending Dues Lock";
                    }

                    return (
                      <tr key={id} className="hover:bg-slate-800/5 transition-all">
                        <td className="py-4 px-2 flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-slate-500 border border-slate-800">
                            <User size={14} />
                          </div>
                          <div>
                            <span className="font-bold text-slate-200 block" style={{ color: isDark ? 'white' : 'black' }}>{stats.name}</span>
                            <span className="text-[9px] text-slate-500 font-bold">{stats.email}</span>
                          </div>
                        </td>
                        <td className="py-4 text-slate-400">
                          <span className="font-black font-mono">{stats.rate}%</span> commission limit
                        </td>
                        <td className="py-4 text-right font-black" style={{ color: isDark ? 'white' : 'black' }}>
                          {currencySymbol}{stats.sold.toLocaleString()}
                        </td>
                        <td className="py-4 text-right font-black text-violet-400">
                          {currencySymbol}{stats.earned.toLocaleString()}
                        </td>
                        <td className="py-4 text-right font-black text-emerald-400">
                          {currencySymbol}{stats.collected.toLocaleString()}
                        </td>
                        <td className="py-4 text-right font-black text-rose-500">
                          {currencySymbol}{stats.due.toLocaleString()}
                        </td>
                        <td className="py-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${badgeColor}`}>
                            {rating}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* CORE SPECIFIC ACCOUNTS CONTRACT SALES TABLE */}
      <Card className="p-6 space-y-4">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider" style={{ color: isDark ? 'white' : 'black' }}>
            Booked IT Deals Commission Accounting Grid
          </h3>
          <p className="text-[10px] text-slate-500 font-bold italic mt-0.5">
            Individual deal ledger transactions with their dynamic commission credit values, sales representative records, and payment status indicators.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800/10 text-slate-500 font-black uppercase text-[9px] tracking-widest">
                <th className="py-4 px-2">Deal Action / Date</th>
                <th className="py-4">Company Account</th>
                <th className="py-4">IT Enterprise Contract</th>
                <th className="py-4 text-right">Contract Deal Value</th>
                <th className="py-4 text-center">Sales Rep</th>
                <th className="py-4 text-center">Applied Ratio</th>
                <th className="py-4 text-right">Commission Credit</th>
                <th className="py-4 text-center">Client Payment Standing</th>
                <th className="py-4 text-center">Status Action Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/5 font-semibold text-slate-300">
              {computedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-500 font-bold italic">
                    No transactions registered in current view scope. Go to Sales ledger to file a new purchase.
                  </td>
                </tr>
              ) : (
                computedTransactions.map(tx => {
                  const hasDueStatus = tx.status === 'Due';
                  
                  return (
                    <tr key={tx.id} className="hover:bg-slate-800/5 transition-all">
                      <td className="py-4 px-2">
                        <span className="font-mono text-slate-500 bg-slate-900/40 px-1.5 py-0.5 rounded font-black block w-fit text-[9px]">{tx.date}</span>
                        <span className="text-[8px] text-slate-500 mt-1 block">Ref: {tx.id.substring(0, 8).toUpperCase()}</span>
                      </td>
                      <td className="py-4">
                        <span className="font-black text-slate-100 block" style={{ color: isDark ? 'white' : 'black' }}>{tx.customerName}</span>
                        <span className="text-[9px] text-slate-500">{tx.customerPhone}</span>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="text-slate-300 font-bold block truncate max-w-[180px]" style={{ color: isDark ? 'white' : 'black' }}>{tx.serviceName}</span>
                        <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Qty: {tx.quantity}</span>
                      </td>
                      <td className="py-4 text-right font-black text-slate-200" style={{ color: isDark ? 'white' : 'black' }}>
                        {currencySymbol}{tx.totalAmount?.toLocaleString()}
                      </td>
                      <td className="py-4 text-center text-slate-400">
                        <span className="font-bold text-xs">{tx.executiveName}</span>
                      </td>
                      <td className="py-4 text-center font-mono font-black text-slate-500">
                        {tx.rate}%
                      </td>
                      <td className="py-4 text-right font-black text-violet-400">
                        {currencySymbol}{tx.earned?.toLocaleString()}
                      </td>
                      <td className="py-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                          hasDueStatus 
                            ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {hasDueStatus ? 'Payment Due' : 'Fully Collected'}
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            const nextStatus = hasDueStatus ? 'Collected' : 'Due';
                            onTogglePaymentStatus(tx.id, nextStatus);
                          }}
                          className={`text-[8.5px] px-2.5 py-1 font-black uppercase tracking-wider border rounded-md cursor-pointer transition-all ${
                            hasDueStatus 
                              ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500 hover:text-white' 
                              : 'text-rose-400 border-rose-500/20 bg-rose-500/5 hover:bg-rose-500 hover:text-white'
                          }`}
                        >
                          {hasDueStatus ? 'Set Collected' : 'Set Due'}
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
