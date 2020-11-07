import React from "react";
import * as d3 from "d3";

var H1BGraph = React.createClass({
  componentWillMount: function () {
    this.loadRawData();
  },
  getInitialState: function () {
    return { rawData: [] };
  },
  loadRawData: function () {},
});
