import { SALES_CHANNEL_IS_B2B } from '@/config/env';

interface Props extends React.PropsWithChildren {
  elseif?: boolean;
}

export default function B2BConditional({ children, elseif }: Props) {
  if (SALES_CHANNEL_IS_B2B) {
    return elseif ? null : children;
  }

  return elseif ? children : null;
}
