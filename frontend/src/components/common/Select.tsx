import React from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: FieldError;
  placeholder?: string;
  registration: UseFormRegisterReturn;
}

const Select: React.FC<SelectProps> = ({ label, options, error, registration, ...props }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium text-sm text-gray-700 dark:text-gray-200">{label}</label>
      <select
        {...registration}
        {...props}
        className={`input input-bordered ${error ? 'border-red-500' : ''} ${props.className || ''}`}
      >
        <option value="" disabled>{props.placeholder || 'Select an option'}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="text-red-500 text-xs">{error.message}</span>}
    </div>
  );
};

export default Select;
