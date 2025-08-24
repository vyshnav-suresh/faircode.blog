import React from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  registration: UseFormRegisterReturn;
}

const Input: React.FC<InputProps> = ({ label, error, registration, ...props }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-semibold text-base mb-1 text-gray-800 dark:text-gray-100" htmlFor={props.id}>{label}</label>
      <input
        {...registration}
        {...props}
        id={props.id}
        className={`transition-all px-4 py-2 rounded-lg border bg-white dark:bg-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${error ? 'border-red-500 ring-red-200' : 'border-gray-300 dark:border-gray-700'} ${props.className || ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${props.id}-error` : undefined}
      />
      {error && <span className="text-red-500 text-xs mt-1" id={`${props.id}-error`}>{error.message}</span>}
    </div>
  );
};

export default Input;
