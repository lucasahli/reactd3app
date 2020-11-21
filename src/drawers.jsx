import React, { Component } from "react";
import * as d3 from "d3";

//import Axis from './Axis';

const HistogramBar = ({ percent, x, y, width, height }) => {
  let translate = `translate(${x}, ${y})`,
    label = percent.toFixed(0) + "%";

  if (percent < 1) {
    label = percent.toFixed(2) + "%";
  }

  if (width < 20) {
    label = label.replace("%", "");
  }

  if (width < 10) {
    label = "";
  }

  return (
    <g transform={translate} className="bar">
      <rect
        width={width}
        height={height - 2}
        transform="translate(0, 1)"
      ></rect>
      <text textAnchor="end" x={width - 5} y={height / 2 + 3}>
        {label}
      </text>
    </g>
  );
};

class Histogram extends Component {
  constructor(props) {
    super();

    this.bin = d3.bin();
    this.xScale = d3.scaleLinear();
    this.yScale = d3.scaleLinear();

    this.updateD3(props);
  }

  componentWillReceiveProps(newProps) {
    this.updateD3(newProps);
  }

  updateD3(props) {
    console.log("props.bins: ", props.bins);
    console.log("props.value: ", props.value);
    console.log("props.height: ", props.height);
    console.log("props.y: ", props.y);
    console.log("props.bottomMargin: ", props.bottomMargin);

    console.log("Raw Data: -- :", props.data);
    console.log("data ---- ------ ------", props.data);

    const bins = this.bin.thresholds(props.bins)(
      props.data.map((d) => +d["baseSalary"])
    );

    // counts = bars.map((d) => d.length);
    console.log("update ---- bins", bins);

    this.xScale
      .domain([bins[0].x0, bins[bins.length - 1].x1])
      .range([0, props.width - props.axisMargin]);

    // this.yScale
    //   .domain([0, d3.max(bins, (d) => d.length)])
    //   .nice()
    //   .range([0, props.height - props.y - props.bottomMargin]);

    this.yScale
      .domain([0, d3.max(bins, (d) => d.x1)])
      .range([0, props.height - props.y - props.bottomMargin]);
  }

  makeBar(bar) {
    let percent = (bar.length / this.props.data.length) * 100;

    let props = {
      percent: percent,
      x: this.props.axisMargin,
      y: this.yScale(bar.x0), // problem
      width: this.xScale(bar.length),
      height: this.yScale(bar.x1 - bar.x0), // problem
      key: "histogram-bar-" + bar.x0,
    };

    return <HistogramBar {...props} />;
  }

  render() {
    const translate = `translate(${this.props.x}, ${this.props.y})`,
      bars = this.bin.thresholds(this.props.bins)(
        this.props.data.map((d) => +d["baseSalary"])
      );
    console.log("bars", bars);

    let width = 700;
    let height = 500;

    let svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);

    svg
      .append("g")
      .attr("fill", "steelblue")
      .selectAll("rect")
      .data(this.props.bins)
      .join("rect")
      .attr("x", (d) => x(d.x0) + 1)
      .attr("width", (d) => Math.max(0, x(d.x1) - x(d.x0) - 1))
      .attr("y", (d) => y(d.length))
      .attr("height", (d) => y(0) - y(d.length));

    //svg.append("g").call(this.xAxis);

    //svg.append("g").call(this.yAxis);

    const chart = svg.node();

    return (
      <svg />
      // <g className="histogram" transform={translate}>
      //   <g className="bars">{bars.map(this.makeBar.bind(this))}</g>
      //   {/* <Axis x={this.props.axisMargin-3} y={0} data={bars} scale={this.yScale} /> */}
      // </g>
    );
  }
}

export default Histogram;
