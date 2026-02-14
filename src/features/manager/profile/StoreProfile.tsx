import { useState } from 'react';
import { Edit2 } from 'lucide-react';

const StoreProfile = () => {
  const [isEditingHours, setIsEditingHours] = useState(false);
  const [isAcceptingOrders, setIsAcceptingOrders] = useState(true);
  const [isHolidayMode, setIsHolidayMode] = useState(false);

  const hours = [
    { day: 'Monday', time: '06:00 - 22:00', isOpen: true },
    { day: 'Tuesday', time: '06:00 - 22:00', isOpen: true },
    { day: 'Wednesday', time: '06:00 - 22:00', isOpen: true },
    { day: 'Thursday', time: '06:00 - 22:00', isOpen: true },
    { day: 'Friday', time: '06:00 - 22:00', isOpen: true },
    { day: 'Saturday', time: '06:00 - 22:00', isOpen: true },
    { day: 'Sunday', time: '06:00 - 22:00', isOpen: true }
  ];

  return (
    <div className="space-y-6">
      {/* Cover Photo Section */}
      <div className="relative mb-20">
        <div
          className="bg-cover bg-center flex flex-col justify-end overflow-hidden rounded-xl min-h-80 shadow-lg"
          style={{
            backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 40%), url(https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1200&h=300&fit=crop)',
            backgroundPosition: 'center'
          }}
        >
          <div className="flex p-6 justify-between items-end">
            <div>
              <p className="text-white tracking-light text-[32px] font-bold leading-tight">
                Gourmet Italian Kitchen
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-orange-400">✓</span>
                <p className="text-white/90 text-base font-medium">Verified Partner • Italian Cuisine</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-xl hover:bg-white/30 transition-all font-medium">
              <Edit2 className="w-4 h-4" />
              Edit Cover
            </button>
          </div>
        </div>

        {/* Profile Logo */}
        <div className="absolute -bottom-14 left-8">
          <div
            className="size-32 rounded-full border-4 border-white dark:border-gray-900 bg-white overflow-hidden shadow-xl bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop)'
            }}
          ></div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column (8/12) */}
        <div className="md:col-span-8 flex flex-col gap-6">
          {/* Basic Info Card */}
          <div className="rounded-xl bg-white dark:bg-[#2d1b15] p-6 shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-500/20 rounded-lg text-orange-600">
                  ℹ️
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Basic Info</h3>
              </div>
              <button className="flex items-center gap-1 text-orange-600 dark:text-orange-500 font-bold text-sm hover:bg-orange-100/50 dark:hover:bg-orange-500/10 px-3 py-1.5 rounded-lg transition-colors">
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                  Store Name
                </p>
                <p className="text-gray-900 dark:text-white font-medium">Gourmet Italian Kitchen</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                  Contact Phone
                </p>
                <p className="text-gray-900 dark:text-white font-medium">+1 (555) 123-4567</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-gray-600 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
                  Business Email
                </p>
                <p className="text-gray-900 dark:text-white font-medium">contact@gourmetkitchen.com</p>
              </div>
            </div>
          </div>

          {/* Location Card */}
          <div className="rounded-xl bg-white dark:bg-[#2d1b15] p-6 shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-500/20 rounded-lg text-orange-600">
                  📍
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Location</h3>
              </div>
              <button className="flex items-center gap-1 text-orange-600 dark:text-orange-500 font-bold text-sm hover:bg-orange-100/50 dark:hover:bg-orange-500/10 px-3 py-1.5 rounded-lg transition-colors">
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            </div>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white font-medium text-lg leading-relaxed">
                  123 Culinary Avenue, Suite 400<br />
                  Downtown Gastronomy District<br />
                  New York, NY 10001
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Zone: Mid-Manhattan South</p>
              </div>
              <div
                className="flex-1 min-h-[160px] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-inner bg-cover bg-center"
                style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=200&fit=crop)',
                  backgroundPosition: 'center'
                }}
              ></div>
            </div>
          </div>

          {/* Business Stats Card */}
          <div className="rounded-xl bg-white dark:bg-[#2d1b15] p-6 shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-500/20 rounded-lg text-orange-600">
                  📊
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Business Performance</h3>
              </div>
              <button className="flex items-center gap-1 text-orange-600 dark:text-orange-500 font-bold text-sm hover:bg-orange-100/50 dark:hover:bg-orange-500/10 px-3 py-1.5 rounded-lg transition-colors">
                View Details
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-col p-4 rounded-xl bg-gray-100 dark:bg-gray-900">
                <p className="text-gray-600 dark:text-gray-400 text-xs font-bold uppercase mb-2">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">1,482</p>
                <span className="text-xs text-green-600 font-medium mt-1">↑ 12% vs last month</span>
              </div>
              <div className="flex flex-col p-4 rounded-xl bg-gray-100 dark:bg-gray-900">
                <p className="text-gray-600 dark:text-gray-400 text-xs font-bold uppercase mb-2">Avg Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">4.8</p>
                  <span>⭐</span>
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">Based on 250 reviews</span>
              </div>
              <div className="flex flex-col p-4 rounded-xl bg-gray-100 dark:bg-gray-900">
                <p className="text-gray-600 dark:text-gray-400 text-xs font-bold uppercase mb-2">Monthly Revenue</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-500">$42,390</p>
                <span className="text-xs text-green-600 font-medium mt-1">↑ 8.4% vs last month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4/12) */}
        <div className="md:col-span-4 flex flex-col gap-6">
          {/* Operating Hours Card */}
          <div className="rounded-xl bg-white dark:bg-[#2d1b15] p-6 shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-500/20 rounded-lg text-orange-600">
                  🕐
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Operating Hours</h3>
              </div>
              <button
                onClick={() => setIsEditingHours(!isEditingHours)}
                className="flex items-center justify-center rounded-lg size-8 text-orange-600 dark:text-orange-500 hover:bg-orange-100/50 dark:hover:bg-orange-500/10 transition-colors"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {hours.map((hour, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-800 ${
                    index === 0 ? 'text-orange-600 font-bold' : 'opacity-80'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {index === 0 && <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>}
                    {hour.day}
                  </span>
                  <span>{hour.time}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-xl bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-3">
              <span>✓</span>
              <div>
                <p className="text-sm font-bold text-green-800 dark:text-green-200 leading-none">Status: Open Now</p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">Accepting orders until 10:00 PM</p>
              </div>
            </div>
          </div>

          {/* Quick Settings Card */}
          <div className="rounded-xl bg-orange-600 p-6 text-white shadow-lg shadow-orange-600/30">
            <h3 className="text-lg font-bold mb-4">Quick Settings</h3>
            <div className="flex flex-col gap-4">
              <button className="flex items-center justify-between w-full px-4 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors border border-white/20">
                <span className="font-medium">Accepting New Orders</span>
                <div className={`relative w-10 h-6 rounded-full transition-all ${isAcceptingOrders ? 'bg-white' : 'bg-white/30'}`}>
                  <div
                    className={`size-4 bg-orange-600 rounded-full absolute top-1 transition-all ${
                      isAcceptingOrders ? 'right-1' : 'left-1'
                    }`}
                    onClick={() => setIsAcceptingOrders(!isAcceptingOrders)}
                  ></div>
                </div>
              </button>
              <button className="flex items-center justify-between w-full px-4 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors border border-white/20">
                <span className="font-medium">Holiday Mode</span>
                <div className={`relative w-10 h-6 rounded-full transition-all ${isHolidayMode ? 'bg-white' : 'bg-white/30'}`}>
                  <div
                    className={`size-4 bg-white rounded-full absolute top-1 transition-all ${
                      isHolidayMode ? 'right-1' : 'left-1'
                    }`}
                    onClick={() => setIsHolidayMode(!isHolidayMode)}
                  ></div>
                </div>
              </button>
              <div className="mt-4 pt-4 border-t border-white/20">
                <button className="w-full py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-sm">
                  Preview Public Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreProfile;
