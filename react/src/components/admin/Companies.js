import React from 'react';
import { Table, Button, Card, Divider, Modal} from 'antd';
import axios from 'axios';
import qs from 'qs';
import { CompanyModal } from './CompanyModal';
import { axiosError } from '../../utils/axiosError';

const { confirm } = Modal;

class Companies extends React.Component {
  state = {
    data: [],
    loading: true,
    editingCompany: undefined,
    pagination: {},
    addvisible: false,
    editvisible: false
  };

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'Company',
        dataIndex: 'companies',
        key: 'companies'
      },
      {
        title: 'Actions',
        dataIndex: '',
        key: 'x',
        render: record => (
          <React.Fragment>
            <Button
              type="link"
              size="small"
              onClick={e => this.showEditModal(record)}
            >
              Edit
            </Button>
            <Divider type="vertical" />
            <Button
              type="link"
              size="small"
              onClick={e => this.showDeleteConfirm(e, record.id)}
            >
              Delete
            </Button>
          </React.Fragment>
        )
      }
    ];
  }

  fetch = (params = {}) => {
    axios({
      method: 'get',
      url: window.__env__.API_URL + '/blink/api/company',
      headers: { Authorization: localStorage.getItem('token') },
      response: {
        results: 4,
        params
      },
      type: 'json'
    })
      .then(response => {
        let conf = [];
        for (let entry of response.data) {
          conf.push({
            id: entry.companyID,            
            companies: entry.companyName
          });
        }
        const pagination = { ...this.state.pagination };
        pagination.pageSize = 4;
        this.setState({
          loading: false,
          data: conf,
          pagination
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  componentDidMount() {
    this.fetch()
  }

  showAddModal = () => {
    this.setState({
      addvisible: true
    });
  };

  showEditModal = record => {
    this.setState({
      editingCompany: { id: record.id, name: record.companies },
      editvisible: true
    });
  };

  handleAddCancel = e => {
    console.log(e);
    this.setState({
      addvisible: false
    });
  };

  handleEditCancel = e => {
    console.log(e);
    this.setState({
      editvisible: false
    });
  };

  onAddSubmit = async values => {
    // console.log("Valeus Resoponse " + values)
    console.log(values.companyName)
    await axios({
      method: 'post',
      url: window.__env__.API_URL + '/blink/api/company',
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      // data: qs.stringify({name: values.companyName}), 
      // did it like this because the values in state didn't match the API
      // everything has to line up, endpoints, and state
      data: qs.stringify(values),
      type: 'json'
    })
      .then(response => {
        if (response.status === 200) {
          this.fetch();
        } else {
          console.log(response);
        }
      })
      .catch(axiosError);

    this.setState({
      addvisible: false
    });
  };

  onEditSubmit = async values => {
    await axios({
      method: 'put',
      url: window.__env__.API_URL + '/blink/api/company',
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      // data: qs.stringify({id: values.id, name: values.companyName }),
      data: qs.stringify(values),
      type: 'json'
    })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.error(error);
      });
    this.setState({
      editvisible: false
    });
    this.fetch();
  };

  showDeleteConfirm = (e, id) => {
    const { fetch } = this;
    confirm({
      title: 'Are you sure delete this Company?',
      content: 'If you delete this Company users will no longer be assinged to that company!',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        console.log(id)
        axios
          .delete(window.__env__.API_URL + '/blink/api/company/id/' + id, {
            headers: {
              Authorization: localStorage.getItem('token')
            }
          })
          .then(response => {
            if (response.status === 200) {
              console.log('works');
              fetch();
            } else {
              console.log(response);
            }
          });
      },
      onCancel() {
        console.log('Cancel');
      }
    });
  };

  render() {
    return (
      <div>
        <Card>
            <h3 className="headers">Companies</h3>
            <Table
              columns={this.columns}
              rowKey={record => record.id}
              dataSource={this.state.data}
            />
            <Button
              type="primary"
              //shape="circle"
              size="default"
              onClick={this.showAddModal}
            >
              + Create
            </Button>
            {this.state.addvisible && (
              <CompanyModal
                onSubmit={this.onAddSubmit}
                // companies={this.state.companyOptions}
                onCancel={this.handleAddCancel}
                // roles={optionsR}
                title="Add Company"
              />
            )}
            {this.state.editvisible && (
              <CompanyModal
                initialValues={this.state.editingCompany}
                onSubmit={this.onEditSubmit}
                // companies={this.state.companyOptions}
                onCancel={this.handleEditCancel}
                // roles={optionsR}
                title="Edit Company"
              />
            )}
          </Card>
      </div>
    )
  }
}

export default Companies