type TypingInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
};

export function TypingInput({
  value,
  onChange,
  disabled,
}: TypingInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      autoFocus
    />
  );
}
