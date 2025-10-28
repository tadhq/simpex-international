import { UseFormReturnType } from '@mantine/form';

export default function SummaryWidget({}: { form: UseFormReturnType<any, (values: any) => any> }) {
  return (
    <div className="md:col-span-2">
      <p>Please verify again if you have filled in the form correctly.</p>
    </div>
  );
}
