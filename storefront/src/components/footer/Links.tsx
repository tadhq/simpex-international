import type { Route } from 'next';
import Link from 'next/link';

interface Props {
  heading: string;
  links: {
    label: string;
    url: string;
  }[];
}

export default function Links({ heading, links }: Props) {
  return (
    <div className="flex-1">
      {heading && <h4 className="font-bold mb-3">{heading}</h4>}
      <nav className="flex flex-col items-start gap-3">
        {links?.map((link, index) => (
          <Link
            key={index}
            className="text-white transition hover:text-primary-200 text-sm"
            href={link.url as Route}
            prefetch={false}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
