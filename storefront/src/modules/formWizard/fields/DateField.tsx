import { Icon } from '@/components/iconify';
import { ActionIcon, Popover, TextInput, TextInputProps } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import { useEffect, useState } from 'react';
import { IMask, useIMask } from 'react-imask';
import { GetInputPropsReturnType } from '../types';
import { extractDateObject, formatDateJson } from '../utils/date';

interface Props extends TextInputProps {
  inputProps: GetInputPropsReturnType;
}

export default function DateField({ inputProps, ...props }: Props) {
  const { value: defaultValue, onChange, ...otherInputProps } = inputProps;

  const { ref, value, setValue } = useIMask<HTMLInputElement>(
    // @ts-ignore
    {
      autofix: true,
      lazy: false,
      overwrite: true,
      mask: Date,
      pattern: 'd-m-Y',
      blocks: {
        d: {
          mask: IMask.MaskedRange,
          placeholderChar: 'd',
          from: 1,
          to: 31,
          maxLength: 2,
        },
        m: {
          mask: IMask.MaskedRange,
          placeholderChar: 'm',
          from: 1,
          to: 12,
          maxLength: 2,
        },
        Y: {
          mask: IMask.MaskedRange,
          placeholderChar: 'y',
          from: 1900,
          to: 2999,
          maxLength: 4,
        },
      },
      format: (date: Date) => {
        const { day, month, year } = extractDateObject(date);
        return [day, month, year].join('-');
      },
      parse: (str: string) => {
        const [day, month, year] = str.split('-');
        return new Date(+year, +month - 1, +day);
      },
    },
    {
      onAccept: (val: string) => {
        const regex = /[dmy\s]/gi;
        // Make the value empty when it includes d, m, y or space
        if (regex.test(val)) onChange('');
      },
      onComplete: (val: string) => {
        // BUG side effect that causes the onChange to be called again
        onChange(formatDateJson(val));
      },
    }
  );

  // BUG side effect that causes the onChange to be called again
  useEffect(() => {
    if (defaultValue) {
      setValue(formatDateJson(defaultValue, true));
    }
  }, [defaultValue]); // eslint-disable-line

  return (
    <TextInput
      ref={ref}
      rightSection={<CalendarDropdown value={formatDateJson(value)} onChange={setValue} />}
      value={value}
      onChange={() => {
        // This should do nothing, it's only defined to suppress React error
      }}
      {...otherInputProps}
      {...props}
    />
  );
}

function CalendarDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (dateStr: string) => void;
}) {
  const [opened, setOpened] = useState(false);
  const [changedDate, setChangedDate] = useState<Date | undefined>(undefined);

  // BUG side effect that causes the onChange to be called again
  useEffect(() => {
    if (value) {
      setChangedDate(new Date(value));
    }
  }, [value]);

  return (
    <Popover opened={opened} shadow="sm" onChange={setOpened}>
      <Popover.Target>
        <ActionIcon color="gray.6" variant="subtle" onClick={() => setOpened((o) => !o)}>
          <Icon icon="ph:calendar-blank" />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Calendar
          date={changedDate}
          getDayProps={(date) => {
            const { day, month, year } = extractDateObject(date);
            return {
              selected: [year, month, day].join('-') === value,
              onClick: () => {
                onChange([day, month, year].join('-'));
                setOpened(false);
              },
            };
          }}
          onDateChange={setChangedDate}
        />
      </Popover.Dropdown>
    </Popover>
  );
}
