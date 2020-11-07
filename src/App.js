import React from "react";
import * as d3 from "d3";
import csvData from "./data/h1bs.csv";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.dataset = [100, 200, 300, 400, 500];
    this.state = {
      rawData: [],
    };
  }
  // UNSAFE_componentWillMount() {
  //   this.loadRawData();
  // }

  getInitialState() {
    return { rawData: [] };
  }

  componentDidMount() {
    this.loadRawData();
    console.log(this.myRef);
    d3.select(this.myRef.current).append("p").text("Hello from D3");
    let size = 500;
    let svg = d3
      .select(this.myRef.current)
      .append("svg")
      .attr("width", size)
      .attr("height", size);
    let rect_width = 95;
    svg
      .selectAll("rect")
      .data(this.dataset)
      .enter()
      .append("rect")
      .attr("x", (d, i) => 5 + i * (rect_width + 5))
      .attr("y", (d) => size - d)
      .attr("width", rect_width)
      .attr("height", (d) => d)
      .attr("fill", "teal");
  }

  reformatRow(row) {
    const dateParser = d3.timeParse("%m/%d/%Y");
    const dateFormat = d3.timeFormat("%m/%d/%Y");

    if (!row["base salary"]) {
      console.log("base salary not found");
      return null;
    }
    return {
      employer: row.employer,
      submit_date: dateParser(row["submit date"]),
      start_date: dateParser(row["start date"]),
      case_status: row["case status"],
      job_title: row["job title"],
      base_salary: Number(row["base salary"]),
      salary_to: row["salary to"] ? Number(row["salary to"]) : null,
      city: row.city,
      state: row.state,
    };
  }

  row(data) {
    console.log("data", data);
    data.forEach(this.reformatRow);
    return data;
  }

  get(rows) {
    //console.log(error);
    console.log("Row 3: ", rows[3]);
    if (!rows) {
      // console.error(error);
      // console.error(error.stack);
    } else {
      console.log("Set State: rawData");
      this.setState({ rawData: rows });
    }
  }

  loadRawData() {
    // d3.csv("public/data/h1bs.csv", function (data) {
    //   console.log(data);
    // });
    d3.csv(csvData).then(this.row.bind(this)).then(this.get.bind(this));
  }

  render() {
    // try {
    //   if (!this.state.rawData.length) {
    //     return (
    //       <h2>Loading data about 81,000 H1B visas in the software industry\</h2>
    //     );
    //   }
    // } catch {
    //   return (
    //     <h2>Loading data about 81,000 H1B visas in the software industry\</h2>
    //   );
    // }

    if (!this.state.rawData.length) {
      return (
        <h2>Loading data about 81,000 H1B visas in the software industry\</h2>
      );
    }

    return <div ref={this.myRef}></div>;
  }
}

export default App;
