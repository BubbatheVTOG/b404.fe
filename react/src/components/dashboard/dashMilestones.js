import React from "react";
import axios from "axios";
import { Button, Card } from "antd";
import { TOKEN_KEY /*, UUID_KEY*/ } from "../../constants/auth";
import { Link } from "react-router-dom";

class DashMilestones extends React.Component {
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
      url: window.__env__.API_URL + "/blink/api/milestone/active",
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
            id: entry.mileStoneID,
            name: entry.name,
            date: entry.createdDate,
            company: entry.company.companyName
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
        <h3>Your Milestones</h3>
        {this.state.data.map(record => (
          <div
            style={{ display: "inline-block", padding: "1.2em" }}
            key={record.id}
          >
            <Card title={record.name} style={{ width: 265, height: 250 }} key={record.id}>
              <p>
                <b>Company Name:</b>
              </p>
              <p>{record.company}</p>
              <p>
                <b>Date Started:</b>
              </p>
              <p>{record.date}</p>
            </Card>
          </div>
        ))}
        <br />
        <div className="viewAllBlockBtn">
          <Button type="default" block>
            <Link to="/milestones">View All</Link>
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

export default DashMilestones;
