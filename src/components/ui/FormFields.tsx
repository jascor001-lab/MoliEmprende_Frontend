interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
}

export function InputField({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  maxLength,
  required,
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full rounded-xl border-2 bg-white/80 px-4 py-3 text-slate-800 placeholder:text-slate-400 backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 focus:ring-molina/30 ${
          error ? "border-red-400" : "border-slate-200 focus:border-molina"
        }`}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

interface TextAreaFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  required?: boolean;
}

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  maxLength,
  rows = 4,
  required,
}: TextAreaFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full rounded-xl border-2 bg-white/80 px-4 py-3 text-slate-800 placeholder:text-slate-400 backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 focus:ring-molina/30 resize-none ${
          error ? "border-red-400" : "border-slate-200 focus:border-molina"
        }`}
      />
      {maxLength && (
        <div className="flex justify-between text-xs text-slate-400">
          {error ? <p className="text-red-500">{error}</p> : <span />}
          <span>{value.length}/{maxLength}</span>
        </div>
      )}
      {error && !maxLength && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  placeholder?: string;
  required?: boolean;
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  error,
  placeholder = "Selecciona una opción",
  required,
}: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none rounded-xl border-2 bg-white/80 px-4 py-3 pr-10 text-left text-slate-800 backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 focus:ring-molina/30 ${
            error ? "border-red-400" : "border-slate-200 focus:border-molina"
          } ${!value ? "text-slate-400" : ""}`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="text-slate-800">
              {option.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="border-b border-molina/20 pb-3">
      <h4 className="font-semibold text-molina-dark">{title}</h4>
      {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
    </div>
  );
}
