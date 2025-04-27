/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Eye, EyeOff, LucideIcon } from "lucide-react";

interface InputFieldProps {
  icon: LucideIcon;
  type?: string;
  placeholder?: string;
  value: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | null;
  disabled?: boolean;
  [key: string]: any; // For additional props like min, max, etc.
}

// Input field component
function InputField({
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  ...props
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-4">
      <div
        className={`flex items-center border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md p-3 bg-white shadow-sm focus-within:ring-2 focus-within:ring-red-300 focus-within:border-red-400 ${
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
      >
        {Icon && (
          <Icon
            className={`mr-3 flex-shrink-0 ${
              disabled ? "text-gray-400" : "text-gray-500"
            }`}
            size={20}
          />
        )}
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`flex-grow focus:outline-none text-sm bg-transparent ${
            disabled ? "text-gray-500 cursor-not-allowed" : ""
          }`}
          required
          disabled={disabled}
          {...props} // Pass other props like min, step for number input
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="text-gray-500 focus:outline-none ml-2"
            disabled={disabled}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
    </div>
  );
}

export default InputField;
