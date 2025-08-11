import React from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface PhoneNumberFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const PhoneNumberField: React.FC<PhoneNumberFieldProps> = ({
  value,
  onChange,
}) => {
  return (
    <div style={{ margin: "1rem 0 1.5rem" }}>
      <PhoneInput
        international
        defaultCountry="IN"
        placeholder="Enter phone number"
        value={value}
        onChange={(val) => onChange(val || "")}
      />
      {!isValidPhoneNumber(value) && value && (
        <small style={{ color: "red" }}>Invalid phone number</small>
      )}
    </div>
  );
};
export default PhoneNumberField;
