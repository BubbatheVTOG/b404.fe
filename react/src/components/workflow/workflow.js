import React from "react";
import { Tabs } from "antd";
import Templates from "./tabs/templates";
import ActiveWorkflows from "./tabs/activeWorkflow";
import ArchivedWorkflows from "./tabs/archivedWorkflows";

const { TabPane } = Tabs;

class WorkflowTable extends React.Component {
  callback(key) {
    console.log(key);
  }

  render() {
    return (
      <Tabs defaultActiveKey="1" onChange={this.callback}>
        <TabPane tab="Templates" key="1">
          <Templates />
        </TabPane>
        <TabPane tab="Active Workflows" key="2">
          <ActiveWorkflows />
        </TabPane>
        <TabPane tab="Archived Workflows" key="3">
          <ArchivedWorkflows />
        </TabPane>
      </Tabs>
    );
  }
}
export default WorkflowTable;
