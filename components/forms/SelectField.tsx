import type { FieldError, FieldValues, Path, UseFormRegister } from "react-hook-form";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder: string;
  options: readonly { value: string; label: string }[];
  register: UseFormRegister<T>;
  error?: FieldError;
  required?: boolean;
};

export default function SelectField<T extends FieldValues>({ name, label, placeholder, options, register, error, required }: Props<T>) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="form-label">{label}</label>
      <select
        id={name}
        className="form-input"
        defaultValue=""
        {...register(name, { required: required ? `Please select ${label.toLowerCase()}` : false })}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-gray-800">{o.label}</option>
        ))}
      </select>
      {error && <p className="form-error">{error.message}</p>}
    </div>
  );
}
