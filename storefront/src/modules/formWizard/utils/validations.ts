import * as v from 'valibot';
import { FormWizardField, FormWizardStep } from '../types';

export const getValidations = (fields: FormWizardField[], values: Record<string, any>) => {
  return fields.reduce((obj: Record<string, any>, field) => {
    if (!field.name.includes('mantine') && field.meta?.validation) {
      try {
        v.parse(field.meta.validation, values[field.name]);
        obj[field.name] = null;
      } catch (ex) {
        (ex as v.ValiError).issues.forEach((error) => {
          if (error.path) {
            const key = error.path.map((p) => p.key).join('.');
            obj[`${field.name}.${key}`] = error.message;
          } else {
            obj[field.name] = error.message;
          }
        });
      }
    }
    // Recursively validate fields in a group
    if (field.type === 'group' && field.fields?.length) {
      const groupValidations = getValidations(field.fields, values);
      obj = Object.assign(obj, groupValidations);
    }
    return obj;
  }, {});
};

export const getValidationsByStep = (
  steps: FormWizardStep[],
  values: Record<string, any>,
  activeStep: number
) => {
  const result = {
    errors: {},
    steps: [] as number[],
  };
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (step.fields) {
      const activeStepErrors = getValidations(step.fields, values);
      result.errors = {
        ...result.errors,
        ...activeStepErrors,
      };
      // Filter out null values
      const hasErrors = Object.values(activeStepErrors).filter((v) => Boolean(v));
      // When this step has errors add to the array
      if (hasErrors.length > 0) {
        result.steps.push(i);
      }
      // Matches the active step and should not be the last step
      if (activeStep === i && activeStep !== steps.length - 1) {
        result.errors = activeStepErrors;
        return result;
      }
    }
  }
  // Last step will check all validations
  if (activeStep === steps.length - 1) {
    return result;
  }
  result.steps = [];
  result.errors = {};
  return result;
};
