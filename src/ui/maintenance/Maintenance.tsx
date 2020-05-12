import React from "react";
import Text from "../components/Text";

export const Maintenance: React.FunctionComponent = () => (
  <>
    <article style={{ textAlign: "center", padding: 150 }}>
      <h1 style={{ fontSize: 50 }}>
        <Text translation="maintenance.back.soon" />
      </h1>
      <div
        style={{
          font: "20px Helvetica, sans-serif",
          color: "#333",
          display: "block",
          textAlign: "center",
          margin: "0 auto",
        }}
      >
        <p>
          <Text translation="maintenance.inconvinience" />
        </p>
      </div>
    </article>
  </>
);

export default Maintenance;
