import { Icon } from '@/components/iconify';

export default function ContactInfo({
  contactInfo,
}: {
  contactInfo?: Record<string, any>[] | null;
}) {
  return (
    <div className="mt-8 flex flex-col gap-4">
      {contactInfo?.map(({ icon, value }, i) =>
        value != null ? (
          <div key={i} className="flex gap-4">
            <Icon className="text-primary-500 flex-shrink-0" height={24} icon={icon} />
            <p className="break-words text-neutral-600">{value}</p>
          </div>
        ) : null
      )}
    </div>
  );
}
