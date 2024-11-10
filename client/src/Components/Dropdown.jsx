import React, { useState, useRef } from "react";

const DropdownComp = (props) => {
  const { setFieldValue, values, fieldName, items } = props;
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  const handleOptionClick = (option) => {
    setFieldValue(fieldName, option);
    setIsDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  // Close dropdown if clicked outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownVisible(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <div className="input-wrapper" onClick={toggleDropdown}>
        <input
          type="text"
          value={values[fieldName]}
          placeholder="Select an option"
          readOnly
          className="dropdown-input"
        />
        <button className="dropdown-arrow" onClick={toggleDropdown}>
          ▼
        </button>
      </div>
      {isDropdownVisible && (
        <div className="dropdown-menu">
          {items.map((item, index) => (
            <div
              key={index}
              className="dropdown-item"
              onClick={() => handleOptionClick(item)}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownComp;
