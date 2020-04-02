import React from "react";
import axios from "axios";
import { Button, Progress, Card } from "antd";
import { TOKEN_KEY /*, UUID_KEY*/ } from "../../constants/auth";
import { Link } from "react-router-dom";

class DashWorkflow extends React.Component {
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
      method: "get",
      url: window.__env__.API_URL + "/blink/api/workflow/active",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem(TOKEN_KEY)
      },
      response: {
        results: 4,
        params
      },
      type: "json"
    })
      .then(response => {
        let conf = [];
        for (let entry of response.data) {
          conf.push({
            id: entry.workflowID,
            name: entry.name,
            description: entry.description,
            dateC: entry.createdDate,
            dateM: entry.lastUpdatedDate,
            percentComplete: entry.percentComplete
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
          pagination: false
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  render() {
    return (
      <React.Fragment>
        <br />
        <h3>Your Workflows</h3>
        {this.state.data.map(record => (
          <div
            style={{
              display: "inline-block",
              padding: "1.2em",
              textAlign: "center"
            }}
            key={record.id}
          >
            <Card style={{ width: 265, maxHeight: 300 }}>
              <Progress type="circle" percent={record.percentComplete * 100} />
              <p />
              <p>
                <b>{record.name}</b>
              </p>
              <p>Last Modified:</p>
              <p>{record.dateM}</p>
            </Card>
          </div>
        ))}
        <br />
        <div className="viewAllBlockBtn">
          <Button type="default" block>
            <Link to="/workflow">View All</Link>
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

export default DashWorkflow;
