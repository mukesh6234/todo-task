import React from "react";
import { Spinner } from "@blueprintjs/core";

const LoadingBackdrop: React.FC = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spinner size={50} intent="primary" />
    </div>
  );
};

export default LoadingBackdrop;
