'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OperatorPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/operator/murojaatlar');
  }, [router]);

  return null;
}
