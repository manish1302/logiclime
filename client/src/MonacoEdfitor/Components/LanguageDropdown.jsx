import React from "react";
import Select from "react-select";
import { customStyles } from "../Constants/customStyles";
import { languageOptions } from "../Constants/languageoptions";

const LanguageDropdown = ({ onSelectChange }) => {
  const customStyle = {
    control: (styles) => ({
      ...styles,
      width: "260px",
    }),
  };
  return (
    <Select
      placeholder="filter"
      options={languageOptions}
      styles={customStyle}
      defaultValue={languageOptions[0]}
      onChange={(option) => {
        onSelectChange(option);
      }}
    />
  );
};

export default LanguageDropdown;
