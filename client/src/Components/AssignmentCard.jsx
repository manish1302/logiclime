import React from "react";
import { Card, Button, Tag } from "antd";
import PropTypes from "prop-types";

const difficultyColors = {
  Easy: "green",
  Medium: "orange",
  Hard: "red",
};

const AssignmentCard = ({
  title,
  difficulty,
  tags,
  onSolve, // Function to handle solve button click
}) => {
  return (
    <Card
      hoverable
      style={{
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        width: "49.5%",
        marginBottom: "16px",
      }}
      bodyStyle={{ padding: "16px" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h4 style={{ margin: 0, marginRight: "16px" }}>{title}</h4>
        <Tag
          style={{ alignSelf: "flex-start" }}
          color={difficultyColors[difficulty] || "default"}
        >
          {difficulty}
        </Tag>
      </div>

      <div style={{ margin: "8px 0" }}>
        {tags &&
          tags.split(",").map((tag) => (
            <Tag key={tag.trim()} color="blue" style={{ marginBottom: "4px" }}>
              {tag.trim()}
            </Tag>
          ))}
      </div>

      <Button
        onClick={onSolve}
        style={{
          backgroundColor: "#00CC00",
          borderRadius: "8px",
          border : "none",
          cursor : "pointer",
          fontWeight : 600,
          color : "white"
        }}
      >
        Solve
      </Button>
    </Card>
  );
};

AssignmentCard.propTypes = {
  title: PropTypes.string.isRequired,
  difficulty: PropTypes.oneOf(["Easy", "Medium", "Hard"]).isRequired,
  tags: PropTypes.string, // Comma-separated string of tags
  onSolve: PropTypes.func.isRequired,
};

export default AssignmentCard;