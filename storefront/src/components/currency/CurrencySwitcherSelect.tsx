'use client';

import { Switcher } from '@/components/common';
import { currencies } from '@/config/money';
import { setCurrency, useMedusaClient } from '@/lib/medusa/client';
import { setRegionCode } from '@/lib/medusa/region/client';
import { useState } from 'react';

export default function CurrencySwitcherSelect() {
  const { currency } = useMedusaClient();
  const [selected, setSelected] = useState(currency);

  const onSelectChange = (value: string | null) => {
    if (!value) return;
    setSelected(value);
    setCurrency(value);
    setRegionCode(value);
    // HACK Reload the page to reflect the new currency
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return <Switcher data={currencies} value={selected} onChange={onSelectChange} />;
}
