import {
  Users,
  Store,
  ShoppingCart,
  CreditCard,
  TrendingUp,
} from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      label: 'Total Users',
      value: '2,458',
      icon: Users,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      label: 'Total Stores',
      value: '156',
      icon: Store,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      label: "Today's Orders",
      value: '342',
      icon: ShoppingCart,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      label: 'Total Revenue',
      value: '25.8M',
      icon: CreditCard,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600'
    }
  ];

  const pendingApprovals = [
    {
      id: 1,
      name: 'Gourmet Garden',
      category: 'Vegan, Healthy',
      owner: 'Elena Rodriguez',
      submitted: 'Oct 24, 2023',
      icon: 'G'
    },
    {
      id: 2,
      name: 'Slice of Life',
      category: 'Italian, Pizza',
      owner: 'Marco V.',
      submitted: 'Oct 23, 2023',
      icon: 'S'
    },
    {
      id: 3,
      name: 'Blue Ocean Sushi',
      category: 'Japanese, Seafood',
      owner: 'Akira Tanaka',
      submitted: 'Oct 22, 2023',
      icon: 'B'
    }
  ];

  const categories = [
    { name: 'Pizza', percentage: 40, color: 'bg-orange-500' },
    { name: 'Burgers', percentage: 25, color: 'bg-orange-300' },
    { name: 'Sushi', percentage: 15, color: 'bg-yellow-500' },
    { name: 'Others', percentage: 20, color: 'bg-stone-400' }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-[#2d2114] p-6 rounded-xl border border-[#eadbcd] dark:border-[#3d2f21] flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <IconComponent className={`${stat.iconColor} w-6 h-6`} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium dark:text-gray-400">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <div className="xl:col-span-2 bg-white dark:bg-[#2d2114] p-6 rounded-xl border border-[#eadbcd] dark:border-[#3d2f21] shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Trend</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Performance in the last 7 days</p>
            </div>
            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              +12%
            </div>
          </div>

          {/* Simple Chart Placeholder */}
          <div className="h-[250px] w-full relative bg-gradient-to-b from-orange-50 dark:from-orange-900/10 to-transparent rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400 dark:text-gray-500">
              <p className="text-sm">Revenue chart visualization</p>
            </div>
          </div>

          <div className="flex justify-between mt-4 text-xs font-bold text-gray-400 uppercase tracking-tighter">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-[#2d2114] p-6 rounded-xl border border-[#eadbcd] dark:border-[#3d2f21] shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Category Distribution</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Order volume by cuisine</p>

          <div className="flex flex-col gap-6">
            {/* Pie Chart Placeholder */}
            <div className="relative size-48 mx-auto flex items-center justify-center">
              <div className="size-40 rounded-full border-8 border-gray-200 dark:border-gray-700 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">1.2k</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block">Total</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${cat.color}`}></span>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    {cat.name} ({cat.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="bg-white dark:bg-[#2d2114] rounded-xl border border-[#eadbcd] dark:border-[#3d2f21] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#f4ede6] dark:border-[#3d2f21] flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Pending Store Approvals</h3>
          <a href="#" className="text-sm font-semibold text-orange-600 dark:text-orange-500 hover:underline">
            View all
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#1f160d] text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                <th className="px-6 py-4">Store Details</th>
                <th className="px-6 py-4">Owner</th>
                <th className="px-6 py-4">Submitted</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4ede6] dark:divide-[#3d2f21]">
              {pendingApprovals.map((store) => (
                <tr
                  key={store.id}
                  className="hover:bg-gray-50 dark:hover:bg-[#3a2f24] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-orange-600 font-bold">
                        {store.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{store.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{store.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{store.owner}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{store.submitted}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button className="px-4 py-1.5 bg-orange-600 text-white text-xs font-bold rounded-lg hover:bg-orange-700 transition-colors">
                        Approve
                      </button>
                      <button className="px-4 py-1.5 border border-[#eadbcd] dark:border-[#3d2f21] text-gray-600 dark:text-gray-300 text-xs font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        Reject
                      </button>
                    </div>
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

export default Dashboard;
