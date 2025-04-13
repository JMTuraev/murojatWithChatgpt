'use client';

import { useState } from 'react';

const dropdownOptions = ['Umumiy', 'Tashkilot bo‘yicha', 'Operator bo‘yicha'];

const stats = {
  jami: 30,
  biriktirilgan: 28,
  yangi: 2,
  statuslar: {
    bajarildi: 20,
    'rad etildi': 2,
    tushuntirish: 3,
    jarayonda: 3,
  },
};

export default function StatistikaPage() {
  const [filter, setFilter] = useState('Umumiy');

  return (
    <div className="p-6">
      {/* Dropdown */}
      <div className="flex justify-end mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-4 py-2"
        >
          {dropdownOptions.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* Asosiy Statistika */}
      <div className="text-center space-y-4">
        <div className="bg-yellow-100 text-yellow-800 text-xl font-bold rounded shadow inline-block px-6 py-4">
          Murojaatlar: {stats.jami}
        </div>

        {/* 1-daraja */}
        <div className="flex justify-center gap-4">
          <div className="bg-blue-100 text-blue-700 rounded px-6 py-4 shadow">
            Biriktirilgan: {stats.biriktirilgan}
          </div>
          <div className="bg-gray-100 text-gray-700 rounded px-6 py-4 shadow">
            Yangi: {stats.yangi}
          </div>
        </div>

        {/* 2-daraja */}
        <div className="flex justify-center gap-4 flex-wrap mt-4">
          <div className="bg-green-100 text-green-800 rounded px-6 py-4 shadow">
            Bajarildi: {stats.statuslar.bajarildi}
          </div>
          <div className="bg-red-100 text-red-700 rounded px-6 py-4 shadow">
            Rad etildi: {stats.statuslar['rad etildi']}
          </div>
          <div className="bg-yellow-200 text-yellow-800 rounded px-6 py-4 shadow">
            Tushuntirish: {stats.statuslar.tushuntirish}
          </div>
          <div className="bg-purple-100 text-purple-800 rounded px-6 py-4 shadow">
            Jarayonda: {stats.statuslar.jarayonda}
          </div>
        </div>
      </div>
    </div>
  );
}
