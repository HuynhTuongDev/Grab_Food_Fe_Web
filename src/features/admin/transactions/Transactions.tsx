import { useState } from 'react';
import { Search, Calendar, Filter, Download, ArrowUpRight, ArrowDownLeft, Check, MoreVertical } from 'lucide-react';

interface Transaction {
  id: string;
  user: string;
  email: string;
  type: 'Top-up' | 'Order';
  amount: number;
  date: string;
  time: string;
  status: 'Success' | 'Pending' | 'Failed';
}

const Transactions = () => {
  const [transactions] = useState<Transaction[]>([
    {
      id: '#TX-94210',
      user: 'Marcus Chen',
      email: 'marcus@example.com',
      type: 'Top-up',
      amount: 120,
      date: 'Oct 19, 2023',
      time: '14:23 PM',
      status: 'Success'
    },
    {
      id: '#TX-94208',
      user: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      type: 'Order',
      amount: 42.5,
      date: 'Oct 19, 2023',
      time: '12:10 PM',
      status: 'Success'
    },
    {
      id: '#TX-94195',
      user: 'David Miller',
      email: 'd.miller@example.com',
      type: 'Top-up',
      amount: 250,
      date: 'Oct 18, 2023',
      time: '09:45 AM',
      status: 'Success'
    },
    {
      id: '#TX-94182',
      user: 'Elena Rodriguez',
      email: 'elena.r@example.com',
      type: 'Order',
      amount: 18.9,
      date: 'Oct 18, 2023',
      time: '08:22 AM',
      status: 'Success'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const stats = [
    { label: 'Total Transactions', value: '1.2M', change: '+12%', positive: true },
    { label: 'Total Volume', value: '125.8M', change: '+5%', positive: true },
    { label: 'Total Top-ups', value: '45.2M', change: '-2%', positive: false },
    { label: 'Total Payments', value: '80.6M', change: '+8%', positive: true }
  ];

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <a href="#" className="text-gray-600 dark:text-gray-400 text-sm font-medium hover:underline">
            Home
          </a>
          <span className="text-gray-600 dark:text-gray-400 text-sm">/</span>
          <span className="text-gray-900 dark:text-white text-sm font-bold">Transactions</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions Log</h2>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1d140c] border border-[#eadbcd] dark:border-[#3d2d1e] shadow-sm"
          >
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">
              {stat.label}
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{stat.value}</p>
              <p className={`text-sm font-bold ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters Section */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-[#1d140c] p-4 rounded-xl border border-[#eadbcd] dark:border-[#3d2d1e]">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 w-5 h-5" />
          <input
            className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-[#eadbcd] dark:border-[#3d2d1e] dark:bg-[#23190f] text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-600/50 focus:border-orange-600 placeholder:text-gray-500/60"
            placeholder="Search by ID, User, or Store..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 w-4 h-4" />
            <input
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#eadbcd] dark:border-[#3d2d1e] dark:bg-[#23190f] text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-600/50 focus:border-orange-600"
              type="text"
              defaultValue="Oct 12 - Oct 19, 2023"
            />
          </div>

          <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#eadbcd] dark:border-[#3d2d1e] hover:bg-gray-100 dark:hover:bg-[#3d2d1e] text-gray-900 dark:text-white text-sm font-bold transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>

          <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-500/30 text-sm font-bold transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="bg-white dark:bg-[#1d140c] rounded-xl border border-[#eadbcd] dark:border-[#3d2d1e] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 dark:bg-[#23190f] border-b border-[#eadbcd] dark:border-[#3d2d1e]">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-500">
                  Transaction ID
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-500">
                  User
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-500">
                  Type
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-500">
                  Amount
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-500">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-500">
                  Status
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eadbcd] dark:divide-[#3d2d1e]">
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-gray-50 dark:hover:bg-[#23190f] transition-colors group"
                >
                  <td className="px-6 py-4 text-sm font-medium font-mono text-gray-900 dark:text-white">
                    {transaction.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold"></div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {transaction.user}
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{transaction.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit font-bold text-xs ${
                        transaction.type === 'Top-up'
                          ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                      }`}
                    >
                      {transaction.type === 'Top-up' ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownLeft className="w-4 h-4" />
                      )}
                      {transaction.type}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                    ${transaction.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-900 dark:text-white">{transaction.date}</span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">{transaction.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                      <Check className="w-5 h-5" />
                      <span className="text-sm font-medium">{transaction.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
