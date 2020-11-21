import React from "react";
import * as d3 from "d3";
import csvData from "./data/h1bs.csv";

class MyD3Component extends React.Component {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
    this.state = {
      rawData: [],
    };
    this.get = this.get.bind(this);
    this.drawChart = this.drawChart.bind(this);
  }

  componentDidMount() {
    this.loadRawData();
    console.log("loaded raw data");
    // this.drawChart();
  }

  loadRawData() {
    let dataCopy = csvData;
    d3.csv(dataCopy).then(this.row.bind(this)).then(this.get.bind(this));
  }

  row(data) {
    data.forEach(this.reformatEachRow);
    return data;
  }

  get(rows) {
    if (!rows) {
      console.log("ERROR --- No rows");
    } else {
      this.setState({ rawData: rows });
    }
  }

  reformatEachRow(row, index, dataArray) {
    const dateParse = d3.timeParse("%m/%d/%Y");

    if (!row["base salary"]) {
      console.log("base salary not found");
    } else {
      dataArray[index] = {
        employer: row.employer,
        submitDate: dateParse(row["submit date"]),
        startDate: dateParse(row["start date"]),
        caseStatus: row["case status"],
        jobTitle: row["job title"],
        baseSalary: parseFloat(row["base salary"].replace(/,/g, "")),
        city: row["city"],
        USstate: row["state"],
        county: row["county"],
        countyID: row["countyID"],
      };
    }
  }

  forEachBin(bin, index, binsArray) {
    if (isNaN(bin.x0) || isNaN(bin.x1)) {
      console.log("Removed bin");
      binsArray.splice(index, 1);
    }
  }

  drawChart() {
    let margin = { top: 20, right: 20, bottom: 30, left: 40 };
    let height = 500;
    let width = 800;
    let data = this.state.rawData.map((d) => +d["baseSalary"]);
    let bins = d3.bin().thresholds(40)(data);
    let x = d3
      .scaleLinear()
      .domain([bins[0].x0, bins[bins.length - 1].x1])
      .range([margin.left, width - margin.right]);
    let y = d3
      .scaleLinear()
      .domain([0, d3.max(bins, (d) => d.length)])
      .nice()
      .range([height - margin.bottom, margin.top]);
    let yAxis = (g) =>
      g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(height / 40))
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g
            .select(".tick:last-of-type text")
            .clone()
            .attr("x", 4)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(data.y)
        );
    let xAxis = (g) =>
      g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(
          d3
            .axisBottom(x)
            .ticks(width / 80)
            .tickSizeOuter(0)
        )
        .call((g) =>
          g
            .append("text")
            .attr("x", width - margin.right)
            .attr("y", -4)
            .attr("fill", "currentColor")
            .attr("font-weight", "bold")
            .attr("text-anchor", "end")
            .text(data.x)
        );

    console.log("Bin SAMPLE: --------", bins[5]);
    bins.forEach(this.forEachBin);
    let svg = d3
      .select(this.chartRef.current)
      .append("svg")
      .attr("viewBox", [0, 0, width, height]);
    svg
      .append("g")
      .attr("fill", "steelblue")
      .selectAll("rect")
      .data(bins)
      .join("rect")
      .attr("x", (d) => x(d.x0) + 1)
      .attr("width", (d) => Math.max(0, x(d.x1) - x(d.x0) - 1))
      .attr("y", (d) => y(d.length))
      .attr("height", (d) => y(0) - y(d.length));
    svg.append("g").call(xAxis);
    svg.append("g").call(yAxis);

    console.log("svg NODE: -------", svg.node());
    console.log("chartRef -------", this.chartRef);
    console.log("chartRef.current: ", this.chartRef.current);
  }

  render() {
    this.drawChart();
    return <div ref={this.chartRef}></div>;
  }
}

export default MyD3Component;
