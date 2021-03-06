import React from "react";
import * as d3 from "d3";
import csvData from "./data/h1bs.csv";
import Histogram from "./drawers";
import MyD3Component from "./MyD3Component";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //this.loadRawData();
    //   console.log(this.myRef);
    //   d3.select(this.myRef.current).append("p").text("Hello from D3");
    //   let size = 1000;
    //   let svg = d3
    //     .select(this.myRef.current)
    //     .append("svg")
    //     .attr("width", size)
    //     .attr("height", size);
    //   let rect_width = 95;
    //   svg
    //     .selectAll("rect")
    //     .data(this.dataset)
    //     .enter()
    //     .append("rect")
    //     .attr("x", (d, i) => 5 + i * (rect_width + 5))
    //     .attr("y", (d) => size - d)
    //     .attr("width", rect_width)
    //     .attr("height", (d) => d)
    //     .attr("fill", "teal");
  }

  render() {
    return <MyD3Component />;
  }
}

export default App;
