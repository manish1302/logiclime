import React from "react";
import { ConfigProvider, Select, Space, theme } from "antd"; // import theme
// const { defaultAlgorithm, darkAlgorithm } = theme
const { darkAlgorithm } = theme;

const LanguageMenu = ({ onSelectChange, language }) => {
  const handleChange = (value) => {
    onSelectChange(value);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1890ff",
          colorBgContainer: "#1f1f1f", // input box background
          colorText: "#ffffff", // input box text
          colorTextPlaceholder: "#aaa",
          colorBorder: "#333",
          colorBgElevated: "#2b2b2b", // dropdown background
          colorItemBgHover: "#1677ff", // hover
          colorItemBgSelected: "#444", // selected item
        },
        algorithm: darkAlgorithm, // ✅ use the imported algorithm
      }}
    >
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
                  csharp <span style={{ color: "grey" }}>(6.12.0)</span>
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
    </ConfigProvider>
  );
};

export default LanguageMenu;
