import { Icon } from '@/components/iconify';
import {
  Checkbox,
  FileInput,
  Group,
  NativeSelect,
  NumberInput,
  Radio,
  Select,
  Space,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { UseFormReturnType } from '@mantine/form';
import DateField from './fields/DateField';
import FileInputValueComponent from './fields/FileInputValueComponent';
import PhoneField from './fields/PhoneField';
import { ConditionRuleOperator, FormWizardField } from './types';
import ButtonWidget from './widgets/ButtonWidget';
import GroupWidget from './widgets/GroupWidget';
import RepeaterWidget from './widgets/RepeaterWidget';
import SummaryWidget from './widgets/SummaryWidget';

export const renderFields = ({
  fields,
  form,
  prefixKey = '',
  shouldPrefixInputProp,
}: {
  fields?: FormWizardField[];
  form: UseFormReturnType<any, (values: any) => any>;
  /** Prefix to make each field unique when rendering */
  prefixKey?: string;
  /** Useful for nested values */
  shouldPrefixInputProp?: boolean;
}) => {
  return fields?.map((field) => {
    const { name, type, meta, required, schema, ...fieldProps } = field;

    const fieldName = shouldPrefixInputProp ? `${prefixKey}${name}` : name;
    const metaProps: Record<string, any> = {};
    if (meta?.width === 'full') {
      Object.assign(metaProps, { className: 'md:col-span-2' });
    }
    if (meta?.hidden) {
      Object.assign(metaProps, { style: { display: 'none' } });
    }
    // HACK better way to handle conditions
    if (meta?.conditions) {
      meta?.conditions.forEach((condition) => {
        const fieldName = Object.keys(condition.rule)[0];
        const operandLeft = form.values[fieldName];
        const operator = Object.keys(condition.rule[fieldName])[0] as ConditionRuleOperator;
        const operandRight = condition.rule[fieldName][operator];
        switch (operator) {
          case '_eq':
            if ('hidden' in condition) {
              if (operandLeft === operandRight) {
                if (condition.hidden === false) {
                  delete metaProps.style;
                }
              }
            }
            // HACK group nested field validation work by modifying the original meta object
            if ('validation' in condition) {
              if (operandLeft === operandRight) {
                // Apply the validation from the condition
                meta.validation = condition.validation;
              } else {
                // Reset the predefined validation
                meta.validation = undefined;
              }
            }
            break;
          case '_neq':
            if ('hidden' in condition) {
              if (operandLeft !== operandRight) {
                if (condition.hidden === false) {
                  delete metaProps.style;
                }
              }
            }
            if ('validation' in condition) {
              if (operandLeft !== operandRight) {
                meta.validation = condition.validation;
              } else {
                meta.validation = undefined;
              }
            }
            break;
          // Same as _eq
          case '_contains':
            if ('hidden' in condition) {
              if (operandLeft.includes(operandRight)) {
                if (condition.hidden === false) {
                  delete metaProps.style;
                }
              }
            }
            if ('validation' in condition) {
              if (operandLeft.includes(operandRight)) {
                meta.validation = condition.validation;
              } else {
                meta.validation = undefined;
              }
            }
            break;
        }
      });
    }
    if (meta?.uppercase) {
      Object.assign(metaProps, {
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
          form.getInputProps(fieldName).onChange((event.currentTarget.value || '').toUpperCase());
        },
      });
    }

    // Default fields props
    const fieldDefaultProps: Record<string, any> = {
      inputWrapperOrder: ['label', 'description', 'input', 'error'],
    };

    switch (type) {
      /**
       * Native
       */
      case 'email':
      case 'hidden':
      case 'number':
      case 'text':
        return (
          <TextInput
            key={prefixKey + name}
            classNames={{ input: prefixKey + name }}
            type={type}
            withAsterisk={required}
            {...fieldDefaultProps}
            {...form.getInputProps(fieldName)}
            {...fieldProps}
            {...metaProps}
          />
        );
      case 'file':
        return (
          <FileInput
            key={prefixKey + name}
            clearable
            classNames={{ root: prefixKey + name }}
            leftSection={<Icon icon="ph:file" />}
            placeholder={field.multiple ? 'Upload file' : 'Upload file'}
            valueComponent={FileInputValueComponent}
            withAsterisk={required}
            {...fieldDefaultProps}
            {...form.getInputProps(fieldName)}
            {...fieldProps}
            {...metaProps}
          />
        );
      case 'textarea':
        return (
          <Textarea
            key={prefixKey + name}
            classNames={{ input: prefixKey + name }}
            withAsterisk={required}
            {...fieldDefaultProps}
            {...form.getInputProps(fieldName)}
            {...fieldProps}
            {...metaProps}
          />
        );
      case 'select':
        return (
          <NativeSelect
            key={prefixKey + name}
            classNames={{ input: prefixKey + name }}
            withAsterisk={required}
            {...fieldDefaultProps}
            {...form.getInputProps(fieldName)}
            {...fieldProps}
            {...metaProps}
          />
        );
      /**
       * Mantine
       */
      case 'checkbox':
        return (
          <Checkbox
            key={prefixKey + name}
            checked={form.getInputProps(fieldName).value}
            classNames={{ input: prefixKey + name }}
            {...form.getInputProps(fieldName)}
            {...fieldProps}
            {...metaProps}
          />
        );
      case 'checkboxes':
        return (
          <Checkbox.Group
            key={prefixKey + name}
            withAsterisk={required}
            {...fieldDefaultProps}
            {...form.getInputProps(fieldName)}
            {...fieldProps}
            {...metaProps}
          >
            <Group mt={8}>
              {meta?.options?.map((option, index) => (
                <Checkbox
                  key={index}
                  classNames={{ input: prefixKey + name + '.' + option.value }}
                  {...option}
                />
              ))}
            </Group>
          </Checkbox.Group>
        );
      case 'combobox':
        return (
          <Select
            key={prefixKey + name}
            classNames={{ input: prefixKey + name }}
            withAsterisk={required}
            {...fieldDefaultProps}
            {...form.getInputProps(fieldName)}
            {...fieldProps}
            {...metaProps}
          />
        );
      case 'datepicker':
        return (
          <DateInput
            key={prefixKey + name}
            classNames={{ input: prefixKey + name }}
            withAsterisk={required}
            {...fieldDefaultProps}
            {...form.getInputProps(fieldName)}
            {...fieldProps}
            {...metaProps}
          />
        );
      case 'numbers':
        return (
          <NumberInput
            key={prefixKey + name}
            classNames={{ input: prefixKey + name }}
            withAsterisk={required}
            {...fieldDefaultProps}
            {...form.getInputProps(fieldName)}
            {...fieldProps}
            {...metaProps}
          />
        );
      case 'radio':
        return (
          <Radio.Group
            key={prefixKey + name}
            withAsterisk={required}
            {...fieldDefaultProps}
            {...form.getInputProps(fieldName)}
            {...fieldProps}
            {...metaProps}
          >
            <Group mt={8}>
              {meta?.options?.map((option, index) => (
                <Radio
                  key={index}
                  classNames={{ radio: prefixKey + name + '.' + option.value }}
                  {...option}
                />
              ))}
            </Group>
          </Radio.Group>
        );
      /**
       * Fields
       */
      case 'date':
        return (
          <DateField
            key={prefixKey + name}
            classNames={{ input: prefixKey + name }}
            inputProps={form.getInputProps(fieldName)}
            withAsterisk={required}
            {...fieldDefaultProps}
            {...fieldProps}
            {...metaProps}
          />
        );
      case 'phone':
        return (
          <PhoneField
            key={prefixKey + name}
            classNames={{ input: prefixKey + name }}
            inputProps={form.getInputProps(fieldName)}
            withAsterisk={required}
            {...fieldDefaultProps}
            {...fieldProps}
            {...metaProps}
          />
        );
      /**
       * Widgets
       */
      case 'button':
        return (
          <ButtonWidget
            key={prefixKey + name}
            field={field}
            uniqueId={prefixKey + name}
            {...fieldProps}
            {...metaProps}
          />
        );
      case 'group':
        return <GroupWidget key={prefixKey + name} field={field} form={form} {...metaProps} />;
      case 'repeater':
        return (
          <RepeaterWidget
            key={prefixKey + name}
            field={field}
            form={form}
            uniqueId={prefixKey + name}
            {...metaProps}
          />
        );
      /**
       * Display
       */
      case 'heading':
        return (
          <Title key={prefixKey + name} fw="normal" {...fieldProps} {...metaProps}>
            {field.label}
          </Title>
        );
      case 'space':
        return <Space key={prefixKey + name} {...fieldProps} {...metaProps} />;
      case 'summary':
        return <SummaryWidget key={prefixKey + name} form={form} />;
    }
  });
};
