import { FormWizardField, FormWizardStep } from '../types';

type MetaKey = 'initialValue' | 'fakeValue';

const processFields = (fields: FormWizardField[], metaKey: MetaKey, obj: Record<string, any>) => {
  fields.forEach((field) => {
    if (!field.name.includes('mantine')) {
      if ('schema' in field) {
        // @ts-ignore
        if (metaKey in field.schema) {
          if (metaKey === 'fakeValue') {
            obj[field.name] = field.schema?.[metaKey]?.();
          } else {
            obj[field.name] = field.schema?.[metaKey];
          }
        }
      }
    }
    if (field.type === 'group' && field.fields) {
      processFields(field.fields, metaKey, obj);
    }
  });
};

export const getInitialValues = (fields: FormWizardField[], metaKey: MetaKey = 'initialValue') => {
  const initialValues: Record<string, any> = {};

  processFields(fields, metaKey, initialValues);

  return initialValues;
};

export const getInitialValuesByStep = (
  steps: FormWizardStep[],
  metaKey: MetaKey = 'initialValue'
) => {
  const initialValues: Record<string, any> = {};

  steps.forEach((step) => {
    if (step.fields) {
      processFields(step.fields, metaKey, initialValues);
    }
  });

  return initialValues;
};
