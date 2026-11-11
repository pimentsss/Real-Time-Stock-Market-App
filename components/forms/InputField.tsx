import type { FieldError, RegisterOptions, UseFormRegister, FieldValues, Path } from "react-hook-form";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
  register: UseFormRegister<T>;
  error?: FieldError;
  validation?: RegisterOptions<T, Path<T>>;
};

export default function InputField<T extends FieldValues>({ name, label, placeholder, type = "text", register, error, validation }: Props<T>) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="form-label">{label}</label>
      <input id={name} type={type} placeholder={placeholder} className="form-input" aria-invalid={!!error} {...register(name, validation)} />
      {error && <p className="form-error">{error.message}</p>}
    </div>
  );
}
