import React from "react";
import DashWorkflow from "./dashWork";
import DashMilestones from "./dashMilestones";
import Pending from "./pending";

class Dash extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Pending></Pending>
        <DashWorkflow></DashWorkflow>
        <DashMilestones></DashMilestones>
      </React.Fragment>
    );
  }
}
export default Dash;
