import React from 'react';
import {
  Table,
  Button,
  Row,
  Col,
  Card,
  Tag,
  Divider,
  Modal,
  message,
} from 'antd';
import axios from 'axios';
import qs from 'qs';
import { PeopleModal } from './PeopleModal';
import { axiosError } from '../../utils/axiosError';
import { getAllCompanies, getPerson } from '../../utils/api';
import { hash } from './../../utils/hash';
import { FETCH_REFRESH_TIME } from '../../constants/routes';
import { AUTH } from '../../constants';

const { confirm } = Modal;

const optionsR = [
  {
    value: AUTH.ADMIN,
    label: 'Admin',
  },
  {
    value: AUTH.DIRECTOR,
    label: 'Director',
  },
  {
    value: AUTH.COACH,
    label: 'Coach',
  },
  {
    value: AUTH.CUSTOMER,
    label: 'Customer',
  },
  {
    value: AUTH.PROVIDER,
    label: 'Provider',
  },
];

class AdminTable extends React.Component {
  state = {
    data: [],
    loading: true,
    editingUser: undefined,
    editingUserCompanies: undefined,
    editingUserID: undefined,
    addvisible: false,
    editvisible: false,
    companyOptions: [],
    pagination: {},
  };

  constructor(props) {
    super(props);
    this.columns = [
      { title: 'Name', dataIndex: 'nameW', key: 'nameW' },
      {
        title: 'Company',
        dataIndex: 'companies',
        key: 'companies',
        ellipsis: true,
      },
      {
        title: 'Role',
        dataIndex: 'accessLevelID',
        key: 'accessLevelID',
        render: (accessLevelID) => (
          <React.Fragment>
            <Tag color={this.color(accessLevelID)}>
              {this.name(accessLevelID)}
            </Tag>
          </React.Fragment>
        ),
      },
      {
        title: 'Actions',
        dataIndex: '',
        key: 'x',
        render: (record) => (
          <React.Fragment>
            <Button
              type="link"
              size="small"
              onClick={(e) => this.showEditModal(record)}
            >
              Edit
            </Button>
            <Divider type="vertical" />
            <Button
              type="link"
              size="small"
              onClick={(e) => this.showDeleteConfirm(e, record.id)}
            >
              Delete
            </Button>
          </React.Fragment>
        ),
      },
    ];
  }

  name(dataN) {
    let name = '';
    switch (dataN) {
      case AUTH.ADMIN:
        name = 'Admin';
        break;
      case AUTH.DIRECTOR:
        name = 'Director';
        break;
      case AUTH.COACH:
        name = 'Coach';
        break;
      case AUTH.CUSTOMER:
        name = 'Customer';
        break;
      case AUTH.PROVIDER:
        name = 'Provider';
        break;
      default:
        return;
    }
    return name;
  }

  color(dataC) {
    let color = '';
    switch (dataC) {
      case 1:
        color = 'geekblue';
        break;
      case 2:
        color = 'green';
        break;
      case 3:
        color = 'cyan';
        break;
      case 4:
        color = 'lime';
        break;
      case 5:
        color = 'purple';
        break;
      default:
        return;
    }
    return color;
  }

  componentDidMount() {
    this.fetch();
    this.intervalID = setInterval(this.fetch, FETCH_REFRESH_TIME);
    getAllCompanies()
      .then((response) => {
        this.setState({
          companyOptions: response.data.map((company) => ({
            value: company.companyID,
            key: company.companyID,
            label: company.companyName,
          })),
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  showAddModal = () => {
    this.setState({
      addvisible: true,
    });
  };

  showEditModal = async (record) => {
    await getPerson(record.id)
      .then((response) => {
        this.setState({
          editingUserCompanies: response.data.companies.map((company) => {
            return company.companyID;
          }),
        });
      })
      .catch((error) => {
        console.error(error);
      });
    this.setState({
      editingUser: {
        username: record.username,
        fName: record.fName,
        lName: record.lName,
        email: record.email,
        title: record.title,
        companies: this.state.editingUserCompanies,
        accessLevelID: record.accessLevelID,
      },
      editingUserID: record.id,
      previousJobIsEmpty: record.title === '',
      editvisible: true,
    });
  };

  onAddSubmit = async (values) => {
    if (!this.state.data.some((user) => user.username === values.username)) {
      await axios({
        method: 'post',
        url: window.__env__.API_URL + '/blink/api/person',
        headers: {
          Authorization: localStorage.getItem('token'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify({
          ...values,
          password: hash(values.password),
        }),
        type: 'json',
      })
        .then((response) => {
          this.fetch();
          if (response.status === 200 && values.companies) {
            // needed the response of the first call to make the second found
            // grabbing ID from the first one to send into the next request
            for (let company of values.companies) {
              axios({
                method: 'post',
                url: window.__env__.API_URL + '/blink/api/company/person/add',
                headers: {
                  Authorization: localStorage.getItem('token'),
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: qs.stringify({
                  companyID: company,
                  personID: response.data.uuid,
                }),
                // making query string with key and value, that's why we're wrapping it in an object and using it this way
                // object names need to match variables from API endpoint
                type: 'json',
              })
                .then(() => {
                  this.fetch();
                })
                .catch(axiosError);
            }
          }
        })
        .catch(axiosError);
      this.setState({
        addvisible: false,
      });
    } else {
      message.destroy();
      message.error(`Username ${values.username} is already taken`);
    }
  };

  showDeleteConfirm = (e, id) => {
    const { fetch } = this;
    confirm({
      title: 'Are you sure delete this user?',
      content: 'If you delete this user they will no longer be able to login!',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        axios
          .delete(window.__env__.API_URL + '/blink/api/person/id/' + id, {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          })
          .then((response) => {
            if (response.status === 200) {
              fetch();
            } else {
            }
          });
      },
      onCancel() {},
    });
  };

  handleAddCancel = (e) => {
    this.setState({
      addvisible: false,
    });
  };

  handleEditCancel = (e) => {
    this.setState({
      editvisible: false,
    });
  };

  onEditSubmit = async (values) => {
    if (!this.state.previousJobIsEmpty && values.title === '') {
      values.title = ' ';
    }
    await axios({
      method: 'put',
      url: window.__env__.API_URL + '/blink/api/person',
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify({
        id: this.state.editingUserID,
        username: values.username,
        password: hash(values.password),
        fName: values.fName,
        lName: values.lName,
        email: values.email,
        title: values.title,
        accessLevelID: values.accessLevelID,
      }),
      type: 'json',
    }).then(async (response) => {
      for (let company of this.state.editingUserCompanies) {
        await axios({
          method: 'post',
          url: window.__env__.API_URL + '/blink/api/company/person/delete',
          headers: {
            Authorization: localStorage.getItem('token'),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          data: qs.stringify({
            companyID: company,
            personID: response.data.uuid,
          }),
          type: 'json',
        })
          .then(() => {
            this.fetch();
          })
          .catch(axiosError);
      }
      if (response.status === 200 && values.companies) {
        for (let company of values.companies) {
          await axios({
            method: 'post',
            url: window.__env__.API_URL + '/blink/api/company/person/add',
            headers: {
              Authorization: localStorage.getItem('token'),
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: qs.stringify({
              companyID: company,
              personID: response.data.uuid,
            }),
            type: 'json',
          })
            .then(() => {
              this.fetch();
            })
            .catch(axiosError);
        }
      } else {
        this.fetch();
      }
    });
    this.setState({
      editvisible: false,
    });
    this.fetch();
  };

  fetch = (params = {}) => {
    axios({
      method: 'get',
      url: window.__env__.API_URL + '/blink/api/person',
      headers: { Authorization: localStorage.getItem('token') },
      response: {
        results: 4,
        params,
      },
      type: 'json',
    })
      .then((response) => {
        let conf = [];
        for (let entry of response.data) {
          conf.push({
            key: entry.uuid,
            id: entry.uuid,
            fName: entry.fName,
            lName: entry.lName,
            username: entry.username,
            nameW: entry.fName + ' ' + entry.lName,
            email: entry.email,
            title: entry.title,
            companies: entry.companies
              .map((company) => company.companyName)
              .join(', '),
            // entry.companies.length > 0 ? entry.companies[0].companyName : '',
            accessLevelID: entry.accessLevelID,
          });
        }
        const pagination = { ...this.state.pagination };
        pagination.pageSize = 4;
        this.setState({
          loading: false,
          data: conf,
          pagination,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  render() {
    return (
      <React.Fragment>
        <div>
          <Card>
            <h3 className="headers">Users</h3>
            <Table
              columns={this.columns}
              rowKey={(record) => record.id}
              expandedRowRender={(record) => (
                <Row key={record.key}>
                  <Col span={6}>
                    <p>
                      <b>Username: </b>
                      {record.username}
                    </p>
                  </Col>
                  <Col span={6}>
                    <p>
                      <b>Email: </b>
                      {record.email}
                    </p>
                  </Col>
                  <Col span={6}>
                    <p>
                      <b>Job Title: </b>
                      {record.title}
                    </p>
                  </Col>
                  <Col span={6}>
                    <p>
                      <b>Companies: </b>
                      {record.companies}
                    </p>
                  </Col>
                </Row>
              )}
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
              <PeopleModal
                onSubmit={this.onAddSubmit}
                companies={this.state.companyOptions}
                onCancel={this.handleAddCancel}
                roles={optionsR}
                title="Add User"
                isAddModal={true}
              />
            )}
            {this.state.editvisible && (
              <PeopleModal
                initialValues={this.state.editingUser}
                onSubmit={this.onEditSubmit}
                companies={this.state.companyOptions}
                onCancel={this.handleEditCancel}
                roles={optionsR}
                title="Edit User"
                isAddModal={false}
              />
            )}
          </Card>
        </div>
      </React.Fragment>
    );
  }
}

export default AdminTable;
