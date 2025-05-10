export default function NotFound() {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-4xl font-bold text-red-600 mb-4">404 - Sahifa topilmadi</h1>
        <p className="text-lg text-gray-600 mb-6">
          Kechirasiz, siz izlagan sahifa mavjud emas.
        </p>
        <a
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Bosh sahifaga qaytish
        </a>
      </div>
    );
  }
  