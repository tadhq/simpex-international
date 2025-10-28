import * as v from 'valibot';

export type ConditionRuleOperator = '_eq' | '_neq' | '_contains';

export type FormWizardFieldType =
  | 'button'
  | 'checkbox'
  | 'checkboxes'
  | 'combobox'
  | 'date'
  | 'datepicker'
  | 'email'
  | 'file'
  | 'group'
  | 'heading'
  | 'hidden'
  | 'number'
  | 'numbers'
  | 'phone'
  | 'radio'
  | 'repeater'
  | 'select'
  | 'space'
  | 'summary'
  | 'text'
  | 'textarea';

export interface FormWizardComboboxItem {
  label: string;
  value: string;
}

export interface FormWizardField {
  name: string;
  label?: string;
  type: FormWizardFieldType;
  required?: boolean;
  placeholder?: string;
  description?: string;
  // Mantine
  data?: FormWizardComboboxItem[];
  // Custom
  schema?: {
    initialValue: unknown;
    fakeValue?: () => unknown;
  };
  meta?: {
    conditions?: {
      rule: {
        [key: string]: {
          [key in ConditionRuleOperator]?: unknown;
        };
      };
      hidden?: boolean;
      validation?: v.BaseSchema;
    }[];
    hidden?: boolean;
    options?: FormWizardComboboxItem[];
    uppercase?: boolean;
    validation?: v.BaseSchema;
    width?: 'full';
  };
  // Nested
  fields?: FormWizardField[];
  [key: string]: any;
}

export interface FormWizardStep {
  title: string;
  fields: FormWizardField[];
}

export interface GetInputPropsReturnType {
  onChange: any;
  value?: any;
  checked?: any;
  error?: any;
  onFocus?: any;
  onBlur?: any;
}
