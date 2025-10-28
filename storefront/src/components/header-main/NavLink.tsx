import { Icon } from '@/components/iconify';
import { cn } from '@tadsr/web-core/tailwindcss';
import Link from 'next/link';

interface Props extends React.ComponentProps<'button'> {
  icon: string;
  href?: string;
  badgeCount?: number; // <-- add this
}

export default function NavLink({ icon, badgeCount, children, className, ...props }: Props) {
  let Component: any = 'button';

  if (props.href) {
    Component = Link;
  }

  return (
    <Component
      className={cn(
        'flex flex-col gap-2 text-center items-center hover:bg-primary-600 active:bg-primary-100 transition rounded-lg py-2 w-10 xs:w-[4.6rem] px-1 text-white relative', // <-- relative added here
        className
      )}
      {...props}
    >
      <div className="relative">
        <Icon className="shrink-0" height={20} icon={icon} />

        {badgeCount !== undefined && badgeCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {badgeCount}
          </span>
        )}
      </div>

      <span className="text-xs overflow-hidden truncate w-full hidden xs:inline">{children}</span>
    </Component>
  );
}
