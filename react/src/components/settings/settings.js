import React from 'react';
import { Form, Input, Tooltip, Icon, Card, Button, Spin, message } from 'antd';
import axios from 'axios';
import qs from 'qs';
import { TOKEN_KEY, UUID_KEY } from '../../constants/auth';
import { hash } from './../../utils/hash';
import SignatureCanvas from 'react-signature-canvas';

let currentComponent;

class SettingsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: {},
      confirmDirty: false,
      autoCompleteResult: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    message.config({
      maxCount: 1
    });
  }

  componentDidMount() {
    currentComponent = this;

    this.setState({ loading: true });

    const url =
      window.__env__.API_URL +
      '/blink/api/person/id/' +
      localStorage.getItem(UUID_KEY);
    axios
      .get(url, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: localStorage.getItem(TOKEN_KEY)
        }
      })
      .then(response => {
        if (response.status === 200) {
          this.setState({
            loading: false,
            user: response.data
          });
        }
      })
      .catch(function(error) {
        message.destroy();
        currentComponent.setState({
          loading: false
        });
        if (error.response) {
          // Request made and server responded
          message.error(error.response.data.error);
        } else if (error.request) {
          // The request was made but no response was received
          message.error('Server not responding');
        } else {
          // Something happened in setting up the request that triggered an Error
          message.error('Error setting up request');
        }
      });
  }

  handleSubmit = async e => {
    this.setState({ loading: true });
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {
          uuid,
          username,
          password,
          fName,
          lName,
          email,
          title,
          accessLevelID
        } = this.state.user;
        const id = uuid;
        const url = window.__env__.API_URL + '/blink/api/person';
        axios
          .put(
            url,
            qs.stringify({
              id,
              username,
              password: password ? hash(password) : '',
              fName,
              lName,
              email,
              title,
              accessLevelID
            }),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: localStorage.getItem(TOKEN_KEY)
              }
            }
          )
          .then(response => {
            if (response.status === 200) {
              message.success('Data saved successfully');
              this.setState({ loading: false });
            }
          })
          .catch(function(error) {
            message.destroy();
            currentComponent.setState({
              loading: false
            });
            if (error.response) {
              // Request made and server responded
              message.error(error.response.data.error);
            } else if (error.request) {
              // The request was made but no response was received
              message.error('Server not responding');
            } else {
              // Something happened in setting up the request that triggered an Error
              message.error('Error setting up request');
            }
          });
      } else {
        message.error('Please fill out all fields!');
        this.setState({ loading: false });
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  handleChange = e => {
    this.setState({
      user: { ...this.state.user, [e.target.name]: e.target.value }
    });
    console.log(this.sigCanvas.toDataURL());
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    };

    return (
      <div className="settings-main">
        <Card>
            <h3 className="headers">Main Settings</h3>
            <div className="settings-inner">
              <Spin spinning={this.state.loading}>
                <Form
                  {...formItemLayout}
                  hideRequiredMark
                  name="form"
                  labelAlign="left"
                  onSubmit={this.handleSubmit}
                >
                  <Form.Item style={{ display: 'none' }} label={<span>ID</span>}>
                    {getFieldDecorator('uuid', {
                      initialValue: this.state.user.uuid,
                      valuePropName: 'uuid',
                      rules: [
                        {
                          required: true,
                          message: 'Please input your id!',
                          whitespace: true
                        }
                      ]
                    })(
                      <Input
                        name="uuid"
                        value={this.state.user.uuid}
                        disabled
                        onChange={this.handleChange}
                      />
                    )}
                  </Form.Item>
                  <Form.Item
                    label={
                      <span>
                        Username&nbsp;
                        <Tooltip title="What will your username be within the system?">
                          <Icon type="question-circle-o" />
                        </Tooltip>
                      </span>
                    }
                  >
                    {getFieldDecorator('username', {
                      initialValue: this.state.user.username,
                      valuePropName: 'username',
                      rules: [
                        {
                          required: true,
                          message: 'Please input your username!',
                          whitespace: true
                        }
                      ]
                    })(
                      <Input
                        name="username"
                        value={this.state.user.username}
                        onChange={this.handleChange}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="New password" hasFeedback>
                    {getFieldDecorator('password', {
                      initialValue: this.state.user.password,
                      valuePropName: 'password',
                      rules: [
                        {
                          type: "regexp",
                          pattern: new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
                          message: "Wrong format!"
                        }
                      ]
                    })(
                      <Input.Password
                        name="password"
                        value={this.state.user.password}
                        onChange={this.handleChange}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label={<span>First Name</span>}>
                    {getFieldDecorator('fName', {
                      initialValue: this.state.user.fName,
                      valuePropName: 'fname',
                      rules: [
                        {
                          required: true,
                          message: 'Please input your first name!',
                          whitespace: true
                        }
                      ]
                    })(
                      <Input
                        name="fName"
                        value={this.state.user.fName}
                        onChange={this.handleChange}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label={<span>Last Name</span>}>
                    {getFieldDecorator('lName', {
                      initialValue: this.state.user.lName,
                      valuePropName: 'lname',
                      rules: [
                        {
                          required: true,
                          message: 'Please input your last name!',
                          whitespace: true
                        }
                      ]
                    })(
                      <Input
                        name="lName"
                        value={this.state.user.lName}
                        onChange={this.handleChange}
                      />
                    )}
                  </Form.Item>
                  <Form.Item label="E-mail">
                    {getFieldDecorator('email', {
                      initialValue: this.state.user.email,
                      valuePropName: 'email',
                      rules: [
                        {
                          type: 'email',
                          message: 'The input is not valid E-mail!'
                        },
                        {
                          message: 'Please input your E-mail!'
                        }
                      ]
                    })(
                      <Input
                        name="email"
                        value={this.state.user.email}
                        onChange={this.handleChange}
                      />
                    )}
                  </Form.Item>
                  <Form.Item
                    style={{ display: 'none' }} 
                    label={<span>Title</span>}>
                    {getFieldDecorator('title', {
                      initialValue: this.state.user.title,
                      valuePropName: 'title',
                      rules: [
                        {
                          message: 'Please input your title!',
                          whitespace: true
                        }
                      ]
                    })(
                      <Input
                        name="title"
                        value={this.state.user.title}
                        disabled
                        onChange={this.handleChange}
                      />
                    )}
                  </Form.Item>
                  <Form.Item
                    style={{ display: 'none' }}
                    label={<span>Access Level</span>}
                  >
                    {getFieldDecorator('accessLevelID', {
                      initialValue: this.state.user.accessLevelID,
                      valuePropName: 'accesslevelid'
                    })(
                      <Input
                        name="accessLevelID"
                        value={this.state.user.accessLevelID}
                        disabled
                        onChange={this.handleChange}
                      />
                    )}
                  </Form.Item>
                  <SignatureCanvas ref={(ref) => { this.sigCanvas = ref; }} 
                                       penColor='green'
                                       canvasProps={{width: 500, height: 200, className: 'sigCanvas'}}
                                       onEnd={this.handleChange}
                  />
                  <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                      Update
                    </Button>
                  </Form.Item>
                </Form>
              </Spin>
            </div>
          </Card>
      </div>
    );
  }
}

const Settings = Form.create({ name: 'settings' })(SettingsForm);

export default Settings;

// get actions as props when you connect them
// you get redux state objects
// passing it into login as a prop

// get the logged in state from redux
