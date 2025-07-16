import React from 'react';

type InputFileProps = {
  label: string;
  onChange: (file: File | null) => void;
};

export function InputFile({ label, onChange }: InputFileProps) {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
      />
    </div>
  );
}
