'use client';

import { useEffect, useState } from 'react';

export default function CountdownTimer({ deadline }) {
  const [remaining, setRemaining] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const target = new Date(deadline);
      const diff = target - now;

      if (diff <= 0) {
        setRemaining("⏱ Muddati tugagan");
        clearInterval(interval);
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setRemaining(
        `${d} kun ${h} soat ${m} daqiqa ${s} soniya`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <span className="text-sm text-indigo-600 font-medium">
      {remaining}
    </span>
  );
}
