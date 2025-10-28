'use client';

import { Icon } from '@/components/iconify';
import { ActionIcon } from '@mantine/core';
import { cn } from '@tadsr/web-core/tailwindcss';
import {
  SelectHTMLAttributes,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

type NativeSelectProps = {
  placeholder?: string;
  errors?: Record<string, unknown>;
  touched?: Record<string, unknown>;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'>;

const CartItemSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ placeholder = 'Select...', className, children, ...props }, ref) => {
    const innerRef = useRef<HTMLSelectElement>(null);
    const [isPlaceholder, setIsPlaceholder] = useState(false);

    useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
      ref,
      () => innerRef.current
    );

    useEffect(() => {
      if (innerRef.current && innerRef.current.value === '') {
        setIsPlaceholder(true);
      } else {
        setIsPlaceholder(false);
      }
    }, [innerRef.current?.value]);

    return (
      <div>
        <ActionIcon
          className={cn('relative flex items-center border group', className, {
            'text-base-600': isPlaceholder,
          })}
          variant="default"
          onBlur={() => innerRef.current?.blur()}
          onFocus={() => innerRef.current?.focus()}
        >
          <select
            ref={innerRef}
            {...props}
            className="appearance-none bg-transparent border-none px-4 transition-colors duration-150 focus:border-base-700 outline-none w-16 h-16 items-center justify-center"
          >
            <option disabled value="">
              {placeholder}
            </option>
            {children}
          </select>
          <span className="absolute flex pointer-events-none justify-end w-8 group-hover:animate-pulse">
            <Icon icon="ph:caret-down-bold" width={12} />
          </span>
        </ActionIcon>
      </div>
    );
  }
);

CartItemSelect.displayName = 'CartItemSelect';

export default CartItemSelect;
