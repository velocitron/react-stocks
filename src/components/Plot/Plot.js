/* global Highcharts */
import React from 'react';

class Plot extends React.Component{

	drawPlot() {
		Highcharts.chart('plot', {
			chart:{
				backgroundColor:null,
				gridLineColor: null
			},
			title: {
				text: ''
			},
			yAxis: {
				title: {
					text: 'USD'
				},
				gridLineColor: null
			},
			xAxis: {
				categories: this.props.xData,
			},
			legend:{
				enabled:false
			},
			series: [{
				name: 'Stock Price',
				data: this.props.yData,
				color:'#546E7A'
			}]
		});
	}
componentWillReceiveProps(nextProps) {
    if(JSON.stringify(this.props.xData) !== JSON.stringify(nextProps.xData) || (this.props.yData) !== JSON.stringify(nextProps.yData)) // Check if it's a new user, you can also use some unique, like the ID
    {
        this.drawPlot();
    }
} 
	// componentDidUpdate(prevProps, prevState) {
	// 	if(this.props !== prevProps)
	// 		this.drawPlot();
	// }
	componentDidMount() {
		 console.log(this.props.xData,this.props.xData)
    // window.setInterval(function () {
	    	this.drawPlot();
    // }.bind(this), 10000);
	}

	render(){
		return (
			<div id="plot"></div>
		);
	}
}

export default Plot;
