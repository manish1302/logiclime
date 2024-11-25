import React from "react";
import Select from "react-select";
import monacoThemes from "monaco-themes/themes/themelist";

const ThemeDropDown = ({ handleThemeChange, theme }) => {
  const customStyle = {
    control: (styles) => ({
      ...styles,
      width: "200px",
    }),
  };

  const themes = {
    dark: "vs-dark",
    light: "light",
  };

  return (
    <Select
      placeholder={`Select Theme`}
      options={Object.entries(themes).map(([themeId, themeName]) => ({
        label: themeName,
        value: themeId,
        key: themeId,
      }))}
      value={theme}
      styles={customStyle}
      onChange={handleThemeChange}
    />
  );
};

export default ThemeDropDown;
