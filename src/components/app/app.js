import React from "react";
import "./style.scss";
import Semester from "../semester/semester";
import yaml from "js-yaml";
import request from "superagent";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };

    request.get("/static/data/data.yml").end((err, res) => {
      if (err || !res.ok) {
        console.log("Oh no! error");
      } else {
        this.setState({ data: yaml.safeLoad(res.text) });
        console.log("yay got ", yaml.safeLoad(res.text));
      }
    });
  }

  render() {
    if (!this.state.data) {
      return null;
    }

    return (
      <div>
        <Semester data={this.state.data} />
      </div>
    );
  }
}
