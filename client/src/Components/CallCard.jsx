import React from "react";
import ReactPlayer from "react-player";

const CallCard = ({ username, stream }) => {
  return (
    <div className="call-card">
      {stream ? (
        <ReactPlayer url={stream} playing width="300px" height="150px" />
      ) : (
        <div className="caller-name">{username && username[4]}</div>
      )}
    </div>
  );
};

export default CallCard;
