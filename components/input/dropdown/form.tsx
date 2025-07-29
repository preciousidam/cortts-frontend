import { Control, Controller, RegisterOptions } from "react-hook-form";
import { BaseDropdownProps } from "./dropdownStyles";
import { TextStyle, ViewStyle } from "react-native";
import { BaseDropdown } from "./dropdown";


type FormDropdownProps = {
  name: string;
  control?: Control<any, any, any>;
  label?: string;
  rules?: Omit<RegisterOptions<any, string>, "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"> | undefined;
  inputProps?: BaseDropdownProps;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  info?: string;
};

export const FormDropdown: React.FC<FormDropdownProps> = (props) => {
  const { name, control, label, rules, inputProps, style, labelStyle, info } = props;
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

  const formatValue = (value: string[]) => {
    if (value.length === 1){
      return value[0]
    }
    return value.join(",");
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, onBlur, value, ref }, fieldState }) => (
        <BaseDropdown
          {...inputProps}
          label={label}
          onSelect={(values) => onChange(formatValue(values))}
          selectedValues={value?.split(',')}
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