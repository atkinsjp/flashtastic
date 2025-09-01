export default function TestSubscribe() {
  return (
    <div className="min-h-screen bg-red-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          ✅ SUBSCRIBE ROUTE WORKS!
        </h1>
        <p className="text-gray-600">
          The /subscribe route is correctly routing to this component.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          URL: {window.location.href}
        </p>
        <p className="text-sm text-gray-500">
          Pathname: {window.location.pathname}
        </p>
        <p className="text-sm text-gray-500">
          Search: {window.location.search}
        </p>
      </div>
    </div>
  );
}