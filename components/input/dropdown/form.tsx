import { Control, Controller, RegisterOptions } from "react-hook-form";
import { BaseDropdownProps } from "./dropdownStyles";
import { TextStyle, ViewStyle } from "react-native";
import { BaseDropdown } from "./dropdown";


type FormDropdownProps<T> = {
  name: string;
  control?: Control<any, any, any>;
  label?: string;
  rules?: Omit<RegisterOptions<any, string>, "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"> | undefined;
  inputProps?: BaseDropdownProps<T>;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  info?: string;
};

export const FormDropdown = <T,>(props: FormDropdownProps<T>) => {
  const { name, control, label, rules, inputProps, style, labelStyle, info } = props;
  const multi = inputProps?.multiSelect ? { multiSelect: true } : { multiSelect: false };
  if (!control) {
    console.warn("FormDropdown requires a control prop from react-hook-form");
    return <BaseDropdown
      {...inputProps}
      label={label}
      style={style}
      labelStyle={labelStyle}
      info={info}
    />;
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, onBlur, value, ref }, fieldState }) => (
        <BaseDropdown
          {...inputProps}
          {...multi}
          label={label}
          onSelect={(selected: T | T[]) => onChange(selected)}
          selectedValue={value}
          error={fieldState.error?.message}
          style={style}
          labelStyle={labelStyle}
          info={info}
          required={rules?.required}
        />
      )}
    />
  );
}