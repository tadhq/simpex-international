'use client';

import { Switcher } from '@/components/common';
import { languages } from '@/config/i18n';
import { usePathname, useRouter } from 'next/navigation';

interface Props {
  defaultValue: string;
}

export default function LanguageSwitcherSelect({ defaultValue }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const onSelectChange = (value: string | null) => {
    if (!value) return;
    const route = pathname.split('/');
    // Replace locale in the path
    route[1] = value;
    const newPath = route.join('/');
    router.replace(newPath);
  };

  return <Switcher data={languages} value={defaultValue} onChange={onSelectChange} />;
}
