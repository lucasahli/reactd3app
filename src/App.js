import React from "react";
import * as d3 from "d3";

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

  row(data) {
    const dateFormat = d3.timeFormat("%m/%d/%Y");
    console.log("data", data);
    if (!data["base salary"]) {
      return null;
    }
    return {
      employer: d.employer,
      submit_date: dateFormat.parse(d["submit date"]),
      start_date: dateFormat.parse(d["start date"]),
      case_status: d["case status"],
      job_title: d["job title"],
      base_salary: Number(d["base salary"]),
      salary_to: d["salary to"] ? Number(d["salary to"]) : null,
      city: d.city,
      state: d.state,
    };
  }

  get(error, rows) {
    console.log(error);
    console.log(rows[3]);
    if (error) {
      console.error(error);
      console.error(error.stack);
    } else {
      this.setState({ rawData: rows });
    }
  }

  loadRawData() {
    console.log("URL", this.props.url);
    d3.csv(this.props.url).then(this.row.bind(this)).then(this.get.bind(this));
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
