import { getCustomer } from '@/lib/medusa/api';
import { Alert } from '@mantine/core';

interface Props {
  children: any;
  elseif?: boolean;
}

export default async function B2BProtectedPrice({ children, elseif }: Props) {
  const customer = await getCustomer();

  if (customer) {
    return elseif ? <Notice /> : children;
  }

  return elseif ? children : <Notice />;
}

function Notice() {
  return <Alert>Log in to see the price.</Alert>;
}
