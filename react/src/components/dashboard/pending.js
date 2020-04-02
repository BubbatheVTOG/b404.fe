import React from 'react';
import axios from 'axios';
import { Card, Button } from 'antd';
import { TOKEN_KEY /*, UUID_KEY*/ } from '../../constants/auth';
import { Link } from 'react-router-dom';

class Pending extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      visible: false,
      pagination: {}
    };
  }

  componentDidMount() {
    this.setState({
      loading: true
    });
    this.fetch();
  }

  fetch = (params = {}) => {
    axios({
      method: 'get',
      url: window.__env__.API_URL + '/blink/api/workflow/pending',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(TOKEN_KEY)
      },
      response: {
        results: 4,
        params
      },
      type: 'json'
    })
      .then(response => {
        console.log(response);
        let conf = [];
        for (let entry of response.data) {
          conf.push({
            id: entry.stepID,
            name: entry.subtitle,
            title: entry.title,
            workflowID: entry.workflowID,
            fileID: entry.fileID
          });
        }

        let newConf = [];

        if (conf.length > 4) {
          newConf = conf.slice(0, 4);
        } else {
          newConf = conf;
        }

        const pagination = { ...this.state.pagination };
        pagination.pageSize = 4;
        this.setState({
          loading: false,
          data: newConf,
          pagination
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  navigate(id) {
    let action;
    //console.log(id);
    this.state.data.forEach(element => {
      if(element.id === id) {
        localStorage.setItem("stepId", element.id);
        if(element.fileID !== 0) {
          localStorage.setItem("fileId", element.fileID);
        } else localStorage.setItem("fileId", 0);
        switch(element.title) {
          case 1:
            action = '/approve'
            break
          case 2:
            action = '/upload'
            break
          case 3:
            action = '/complete'
            break
          case 4:
            action = '/submission'
            break  
          default:
            action = '/'
            break
        }
      }
    });
    return action
  }

  render() {
    return (
      <React.Fragment>
        <h3>Pending Tasks</h3>
        {this.state.data ? 
          this.state.data.map(record => (
          <div
            style={{ display: 'inline-block', padding: '2em' }}
            key={record.id}
          >
            <Card style={{ width: 300, height: 70, display: 'inline-block' }}>
              <p>
                <b>{record.name}</b>
                <Button
                  type='primary'
                  shape='round'
                  size='small'
                  style={{ float: 'right' }}
                  onClick={e => this.navigate(record.id)}
                >
                <Link to={this.navigate(record.id)}>View</Link>
                </Button>
              </p>
            </Card>
          </div>
        )): 
          <div
              style={{ display: 'inline-block', padding: '2em' }}
          >
            <Card style={{ width: 300, height: 70, display: 'inline-block', textAlign: 'center' }}>
              <p>No Current Tasks</p>
            </Card>
          </div>
        }
        <br />
      </React.Fragment>
    );
  }
}

export default Pending;
