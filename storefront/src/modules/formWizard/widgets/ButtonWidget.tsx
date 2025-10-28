import { Button } from '@mantine/core';
import { FormWizardField } from '../types';

export default function ButtonWidget({
  className,
  field,
  style,
  uniqueId,
  ...props
}: {
  className?: string;
  field: FormWizardField;
  style?: any;
  uniqueId?: string;
}) {
  return (
    <div className={className} style={style}>
      <Button classNames={{ root: uniqueId }} {...props}>
        {field.label}
      </Button>
    </div>
  );
}
