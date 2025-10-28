import { Icon } from '@/components/iconify';
import { ActionIcon, Badge, Button } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import clsx from 'clsx';
import { renderFields } from '../renderFields';
import { FormWizardField } from '../types';

export default function RepeaterWidget({
  className,
  form,
  field,
  uniqueId,
  ...props
}: {
  className?: string;
  form: UseFormReturnType<any, (values: any) => any>;
  field: FormWizardField;
  uniqueId?: string;
}) {
  const values = (form?.values[field.name] as any[]) || [];

  const insertListItem = () => {
    const emptyValues = field.fields?.reduce((obj: Record<string, any>, item) => {
      obj[item.name] = '';
      return obj;
    }, {});
    form.insertListItem(field.name, emptyValues);
  };

  return (
    <div className={clsx(uniqueId, className)} {...props}>
      <div>
        {field.label && <h6>{field.label}</h6>}
        {field.description && (
          <p className="mt-0.5 text-xs text-base-500 dark:text-base-200">{field.description}</p>
        )}
      </div>
      {values.length > 0 && (
        <div className="mt-2 space-y-2">
          {values.map((_, index) => (
            <RepeaterItem key={index} field={field} form={form} index={index} />
          ))}
        </div>
      )}
      {!field.hideAddButton && (
        <Button
          className="mt-3"
          leftSection={<Icon icon="ph:plus" />}
          size="xs"
          onClick={insertListItem}
        >
          Voeg toe
        </Button>
      )}
    </div>
  );
}

function RepeaterItem({
  form,
  field,
  index,
}: {
  form: UseFormReturnType<any, (values: any) => any>;
  field: FormWizardField;
  index: number;
}) {
  const fields = renderFields({
    fields: field.fields,
    form,
    prefixKey: `${field.name}.${index}.`,
    shouldPrefixInputProp: true,
  });

  const initialValueLength = (field.schema?.initialValue as []).length ?? 0;
  const shouldShowRemoveButton = field?.showFirstRemoveButton || index > initialValueLength - 1;

  const removeListItem = () => {
    form.removeListItem(field.name, index);
  };

  return (
    <div className="grid grid-cols-[2rem_1fr_2.5rem] border-t border-base-200 py-3 dark:border-base-600">
      <div className="self-center">
        <Badge circle variant="default">
          {index + 1}
        </Badge>
      </div>
      <div className="grid grid-cols-1 gap-x-3 gap-y-2 md:grid-cols-2">{fields}</div>
      <div className="ml-auto self-center">
        {shouldShowRemoveButton && (
          <ActionIcon color="red" size="md" onClick={removeListItem}>
            <Icon icon="ph:trash-simple" />
          </ActionIcon>
        )}
      </div>
    </div>
  );
}
