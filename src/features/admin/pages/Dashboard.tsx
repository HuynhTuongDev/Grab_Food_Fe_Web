export function AdminDashboard() {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-blue-100 p-4 rounded">
                    <h2 className="font-bold">Orders</h2>
                    <p className="text-gray-600">Manage orders</p>
                </div>
                <div className="bg-green-100 p-4 rounded">
                    <h2 className="font-bold">Stores</h2>
                    <p className="text-gray-600">Manage stores</p>
                </div>
                <div className="bg-yellow-100 p-4 rounded">
                    <h2 className="font-bold">Users</h2>
                    <p className="text-gray-600">Manage users</p>
                </div>
            </div>
        </div>
    );
}
