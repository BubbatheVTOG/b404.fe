import React, { Component } from 'react';
import SortableTree from 'react-sortable-tree';
import {
  addNodeUnderParent,
  removeNodeAtPath,
  changeNodeAtPath
} from 'react-sortable-tree';
import { axiosError } from '../../utils/axiosError';
import { Button, Input, Select, message, Switch } from 'antd';
import 'react-sortable-tree/style.css';
//import qs from 'qs';
import axios from 'axios';
import { TOKEN_KEY, DEFAULT_TREE } from '../../constants';
import { getVerbs, getPerson } from '../../utils/api';

const { Option } = Select;

export default class WorkflowBuilder extends Component {
  constructor(props) {
    super(props);
    this.updateTreeData = this.updateTreeData.bind(this);
    this.addNode = this.addNewNode.bind(this);
    this.removeNode = this.removeNode.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getAllVerbs = this.getAllVerbs.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.setTreeData = this.setTreeData.bind(this);
    message.config({
      maxCount: 1
    });

    this.state = {
      workflowID: 0,
      wfName: '',
      wfDescription: '',
      visible: false,
      loading: false,
      verbs: [],
      people: [],
      treeData: [DEFAULT_TREE]
    };
  }

  componentDidMount() {
    this.getAllVerbs();
    this.getAllPeople();
  }

  getAllVerbs() {
    getVerbs()
      .then(response => {
        if (response.status === 200) {
          this.setState({
            workflowID: this.props.workflow.workflowID,
            wfName: this.props.workflow.name,
            wfDescription: this.props.workflow.description,
            verbs: response.data,
            treeData: this.props.workflow.steps
          });
        }
      })
      .catch(axiosError);
  }
  getAllPeople() {
    getPerson()
      .then(response => {
        response.status === 200 &&
          this.setState({
            people: response.data
          });
      })
      .catch(axiosError);
  }

  componentDidUpdate(prevProps) {
    if (this.props.workflow !== prevProps.workflow) {
      if (this.props.workflow !== null) {
        this.setState({
          workflowID: this.props.workflow.workflowID,
          treeData: this.props.workflow.steps,
          wfName: this.props.workflow.name,
          wfDescription: this.props.workflow.description
        });
      }
    }
  }

  handleSubmit = async e => {
    e.preventDefault();
    //const {wfName, username, password, fName, lName, email, title, accessLevelID} = this.state.user
    //const id = UUID
    const url = window.__env__.API_URL + '/blink/api/workflow/template';
    const requestObject = {
      workflowID: this.state.workflowID,
      name: this.state.wfName,
      description: this.state.wfDescription,
      steps: this.state.treeData
    };
    this.setState({ loading: true });

    if (this.props.isNew) {
      axios
        .post(url, requestObject, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(TOKEN_KEY)
          }
        })
        .then(response => {
          //this.setState({ loading: true });
          if (response.status === 200) {
            this.setState({ loading: false });
            message.success('Data saved successfully');
            window.location.reload(true);
          }
        })
        .catch(axiosError);
    } else {
      axios
        .put(url, requestObject, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem(TOKEN_KEY)
          }
        })
        .then(response => {
          if (response.status === 200) {
            this.setState({ loading: false });
            message.success('Data saved successfully');
            window.location.reload(true);
          }
        })
        .catch(axiosError);
    }
  };

  addNewNode(rowInfo) {
    const NEW_NODE = {
      ...DEFAULT_TREE,
      title: this.state.verbs[0].verbID
    };
    const newTree = addNodeUnderParent({
      treeData: this.state.treeData,
      newNode: NEW_NODE,
      expandParent: true,
      parentKey: rowInfo ? rowInfo.treeIndex : undefined,
      getNodeKey: ({ treeIndex }) => treeIndex
    });
    this.updateTreeData(newTree.treeData);
  }

  removeNode(rowInfo) {
    const { path } = rowInfo;
    const newTree = removeNodeAtPath({
      treeData: this.state.treeData,
      path,
      getNodeKey: ({ treeIndex }) => treeIndex
    });
    if (newTree.length !== 0) {
      this.updateTreeData(newTree);
    }
  }

  setTreeData(tree) {
    return {
      ...tree,
      title: tree.children && tree.children.length ? 0 : tree.title,
      children: tree.children ? tree.children.map(this.setTreeData) : []
    };
  }

  updateTreeData(treeData) {
    const newTrees = treeData.map(this.setTreeData);
    this.setState({ treeData: newTrees });
  }

  handleNameChange = e => {
    this.setState({
      wfName: e.target.value
    });
  };

  handleDescriptionChange = e => {
    this.setState({
      wfDescription: e.target.value
    });
  };

  render() {
    const getNodeKey = ({ treeIndex }) => treeIndex;
    const children = [];
    this.state.verbs.forEach(element => {
      children.push(<Option key={element.verbID}>{element.name}</Option>);
    });

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ display: 'flex', marginBottom: '30px' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginRight: '35px'
            }}
          >
            <h6 className="wfInputText">Name: </h6>
            <Input
              value={this.state.wfName}
              onChange={this.handleNameChange}
              placeholder="Enter workflow name..."
            ></Input>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <h6 className="wfInputText">Description: </h6>
            <Input
              value={this.state.wfDescription}
              onChange={this.handleDescriptionChange}
              placeholder="Enter description..."
            ></Input>
          </div>
        </div>
        <SortableTree
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            paddingLeft: '5px'
          }}
          treeData={this.state.treeData}
          onChange={this.updateTreeData}
          generateNodeProps={rowInfo => ({
            title: (
              <Select
                value={rowInfo.node.title.toString()}
                size="small"
                disabled={
                  rowInfo.node.children && !!rowInfo.node.children.length
                }
                style={{ width: 120 }}
                onChange={event => {
                  const { path } = rowInfo;
                  const title = parseInt(event);
                  this.setState(state => ({
                    treeData: changeNodeAtPath({
                      treeData: state.treeData,
                      path,
                      getNodeKey,
                      newNode: { ...rowInfo.node, title }
                    })
                  }));
                }}
              >
                {children}
              </Select>
            ),
            subtitle: (
              <Input
                style={{
                  marginTop: '12px'
                }}
                placeholder="Enter a description"
                value={rowInfo.node.subtitle}
                size="small"
                onChange={event => {
                  const { path } = rowInfo;
                  const subtitle = event.target.value;

                  this.setState(state => ({
                    treeData: changeNodeAtPath({
                      treeData: state.treeData,
                      path,
                      getNodeKey,
                      newNode: { ...rowInfo.node, subtitle }
                    })
                  }));
                }}
              />
            ),
            buttons: [
              <div style={{ display: 'flex' }}>
                <Button
                  style={{ marginRight: 5 }}
                  label="Delete"
                  onClick={event => this.removeNode(rowInfo)}
                >
                  Remove
                </Button>
                <Button
                  label="Add"
                  onClick={event => this.addNewNode(rowInfo)}
                  style={{ marginRight: 5 }}
                >
                  Add
                </Button>
                <div>
                  <div>Asynchronous</div>
                  <Switch
                    checked={rowInfo.node.asynchronous}
                    disabled={
                      !(rowInfo.node.children && rowInfo.node.children.length)
                    }
                    onClick={checked => {
                      const { path } = rowInfo;

                      this.setState(state => ({
                        treeData: changeNodeAtPath({
                          treeData: state.treeData,
                          path,
                          getNodeKey,
                          newNode: {
                            ...rowInfo.node,
                            asynchronous: checked
                          }
                        })
                      }));
                    }}
                  />
                </div>
              </div>
            ],
            style: {
              height: '60px'
            }
          })}
        ></SortableTree>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '1rem'
          }}
        >
          <Button
            type="primary"
            loading={this.state.loading}
            label="submit"
            onClick={this.handleSubmit}
          >
            Submit
          </Button>
        </div>
      </div>
    );
  }
}
