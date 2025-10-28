import { UseFormReturnType } from '@mantine/form';
import clsx from 'clsx';
import { renderFields } from '../renderFields';
import { FormWizardField } from '../types';

export default function GroupWidget({
  className,
  form,
  field,
  ...props
}: {
  className?: string;
  form: UseFormReturnType<any, (values: any) => any>;
  field: FormWizardField;
}) {
  const fields = renderFields({
    fields: field.fields,
    form,
  });

  return (
    <div
      className={clsx(
        'grid grid-cols-1 md:col-span-2 md:grid-cols-2',
        {
          'gap-2 md:pl-6': field?.indent,
          'gap-4': !field?.indent,
        },
        className
      )}
      {...props}
    >
      {fields}
    </div>
  );
}
