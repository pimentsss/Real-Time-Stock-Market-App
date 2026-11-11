"use client";

import countryList from "react-select-country-list";
import SelectField from "@/components/forms/SelectField";
import type { FieldError, FieldValues, Path, UseFormRegister } from "react-hook-form";

const countries = countryList().getData();

type Props<T extends FieldValues> = { name: Path<T>; label: string; register: UseFormRegister<T>; error?: FieldError; required?: boolean };

export default function CountrySelectField<T extends FieldValues>(props: Props<T>) {
  return (
    <div>
      <SelectField {...props} placeholder="Select your country" options={countries} />
      <p className="mt-1 text-xs text-gray-500">Helps us show market data and news relevant to you.</p>
    </div>
  );
}
