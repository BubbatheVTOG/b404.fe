import React from "react";
import { Divider, Modal, Progress, Select } from "antd";

const { Option } = Select;

export const AssignModal = ({ workflow, companies, onCancel, title, onOk }) => (
  <Modal title={workflow.name} visible onOk={onOk} onCancel={onCancel}>
    <Progress percent={workflow.progress} />
    <Divider type="horizontal" />
    <p>
      <b>Company*</b>
    </p>
    <Select style={{ width: "100%" }} placeholder="Select Company">
    {companies.map((company) => {
      return <Option value={company.value} key={company.value}>{company.label}</Option>;
    })}
    </Select>
  </Modal>
);

export const AssignPeople = ({ workflow, person, document, onCancel, title, onOk }) => (
  <Modal title={workflow.name} visible onOk={onOk} onCancel={onCancel}>
    <Progress percent={workflow.progress} />
    <Divider type="horizontal" />
    <p>
      <b>Person*</b>
    </p>
    <Select style={{ width: "100%" }} placeholder="John Smith">
    {person.map((personIn) => {
      return <Option value={personIn.value} key={personIn.value}>{personIn.label}</Option>;
    })}
    </Select>
    <Divider type="horizontal"> S I G N S </Divider>
    <p>
      <b>Object*</b>
    </p>
    <Select style={{ width: "100%" }} placeholder="Document A"></Select>
  </Modal>
);
