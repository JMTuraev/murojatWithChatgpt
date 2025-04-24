'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const MurojaatContext = createContext();

export const MurojaatProvider = ({ children }) => {
  const [murojaatCount, setMurojaatCount] = useState(0);

  const fetchCount = async () => {
    try {
      const res = await fetch('/api/webhook');
      if (!res.ok) throw new Error('❌ Xatolik');
      const result = await res.json();
      const count = typeof result.count === 'number' ? result.count : 0;
      setMurojaatCount(count);
    } catch (err) {
      console.error('❌ Murojaat count olishda xatolik:', err);
    }
  };

  useEffect(() => {
    fetchCount(); // sahifa yuklanganda count
  }, []);

  return (
    <MurojaatContext.Provider value={{ murojaatCount, setMurojaatCount, fetchCount }}>
      {children}
    </MurojaatContext.Provider>
  );
};

export const useMurojaat = () => useContext(MurojaatContext);
