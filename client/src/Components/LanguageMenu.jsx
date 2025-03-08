import React from "react";
import { Select, Space } from "antd";
import { LANGUAGE_VERSIONS } from "../constants";

const LanguageMenu = ({ onSelectChange, language }) => {
  const handleChange = (value, label) => {
    onSelectChange(value);
  };
  return (
    <Space wrap>
      <Select
        defaultValue="javascript (18.15.0)"
        style={{
          width: 220,
          margin: "16px",
          marginLeft: "0",
        }}
        onChange={handleChange}
        options={[
          {
            value: 1,
            label: (
              <div>
                javascript <span style={{ color: "grey" }}>(18.15.0)</span>
              </div>
            ),
          },
          {
            value: 2,
            label: (
              <div>
                typescript <span style={{ color: "grey" }}>(5.0.3)</span>
              </div>
            ),
          },
          {
            value: 3,
            label: (
              <div>
                python <span style={{ color: "grey" }}>(3.10.3)</span>
              </div>
            ),
          },
          {
            value: 4,
            label: (
              <div>
                java <span style={{ color: "grey" }}>(15.0.2)</span>
              </div>
            ),
          },
          {
            value: 5,
            label: (
              <div>
                chsarp <span style={{ color: "grey" }}>(6.12.0)</span>
              </div>
            ),
          },
          {
            value: 6,
            label: (
              <div>
                php <span style={{ color: "grey" }}>(8.2.3)</span>
              </div>
            ),
          },
          {
            value: 7,
            label: (
              <div>
                C++ <span style={{ color: "grey" }}>(10.2.0)</span>
              </div>
            ),
          },
        ]}
      />
    </Space>
  );
};

export default LanguageMenu;
