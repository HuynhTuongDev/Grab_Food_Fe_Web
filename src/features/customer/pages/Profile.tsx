export function CustomerProfile() {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>
            <div className="max-w-2xl">
                <div className="bg-white p-6 rounded shadow">
                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold mb-2">Name</label>
                        <input type="text" className="w-full border rounded px-3 py-2" placeholder="Your Name" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold mb-2">Email</label>
                        <input type="email" className="w-full border rounded px-3 py-2" placeholder="your@email.com" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold mb-2">Phone</label>
                        <input type="tel" className="w-full border rounded px-3 py-2" placeholder="+1 234 567 8900" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold mb-2">Balance</label>
                        <p className="text-2xl font-bold text-green-600">$150.50</p>
                    </div>
                    <button className="bg-blue-500 text-white px-6 py-2 rounded mr-2">Save</button>
                    <button className="bg-green-500 text-white px-6 py-2 rounded">Top Up</button>
                </div>
            </div>
        </div>
    );
}
