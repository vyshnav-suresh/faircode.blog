import React from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  registration: UseFormRegisterReturn;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, error, registration, ...props }) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        {...registration}
        {...props}
        className={`checkbox ${error ? 'border-red-500' : ''} ${props.className || ''}`}
      />
      <label className="text-sm text-gray-700 dark:text-gray-200">{label}</label>
      {error && <span className="text-red-500 text-xs ml-2">{error.message}</span>}
    </div>
  );
};

export default Checkbox;
