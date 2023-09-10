interface InputRefImperativeHandleProps {
  inputValue: string;
  onClear: () => void;
  changeInput: (e: ChangeEvent<HTMLInputElement>) => void;
  focusInput: () => void;
}