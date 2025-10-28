import { getB2BSettings } from '@/lib/directus/api';
import { useEffect, useState } from 'react';

export function useCompanies() {
  const [companies, setCompanies] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getB2BSettings();
        if (settings?.companies?.length > 0) {
          setCompanies(settings.companies as any);
        }
      } catch (error) {
        console.error('Error fetching B2B settings', error);
      }
    };
    fetchSettings();
  }, []);

  return {
    companies,
    setCompanies,
  };
}
