import React from 'react';
import xhr from 'xhr';
import MaterialUIAutocomplete from '../Multi/MaterialUIAutocomplete.js'
import Plot from '../Plot/Plot.js'


class App extends React.Component {
	constructor() {
		super();
		this.state = {
			jsonData:"0.0",
			changePercent:0,
			arrowD:"",
			changePe:0,
			options:[],
			stock: '',
			dataSeries:[],
			dates:[]
		}
		this.changeLocation = this.changeLocation.bind(this)
	}

	changeLocation(evt){
		
		var stock = document.getElementById('autocomp').value.trim();
		if(stock.indexOf('(')!==-1)
			stock = stock.substring(0, stock.indexOf('(')).trim();
		var self = this;
		self.setState({
			stock:stock
		});
		

	}
	fetchData(){

		document.getElementById('spinner').style.visibility='hidden';
		var urlPrefix = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=';
		var stock = this.state.stock;
		var urlSuffix = '&interval=15min&outputsize=compact&apikey=2A1LR0JOB2TX5O43';
		var url = urlPrefix + stock+urlSuffix;
		var self = this;

		xhr({
			url:'convertcsv.json'
		}, function(err, data) {
				self.setState({

					options:JSON.parse(data.body)
				});
		});

		xhr({
			url:url
		}, function(err, data) {
				
					var myData, dataArray, key, keyArray;
					
					myData = JSON.parse(data.body);
					console.log(myData);
					if (!myData["Error Message"]){
						myData = myData["Time Series (15min)"]
						dataArray = [];
						keyArray = []

						for (key in myData) {
						    if (myData.hasOwnProperty(key)) {
						        keyArray.push(key);         // Push the key on the array
						        dataArray.push(myData[key]); // Push the key's value on the array
						    }
						}


						var dataSeries = dataArray.map(function(x){
							return Math.round(parseFloat(x["4. close"])*1e2)/1e2;
						})



						var index = 0;
						var arrow = 'arrow_drop_up';
					
						for(var x = 1; x < keyArray.length;x++) {
							if(keyArray[x].indexOf('16:00:00')!==-1){
								index = x;
								break;
							}
						}
						var closeNext = parseFloat(dataArray.slice(0,1)[0]["4. close"]);
						var data3 = closeNext;
						var closePrevious,change, changeP
						if(dataArray[index]["4. close"]){
							closePrevious =parseFloat(dataArray[index]["4. close"]);
							change = closeNext - closePrevious;
							changeP = (change/closePrevious)*100;
						}
						if(change < 0){
							arrow = 'arrow_drop_down';
							document.getElementById('change-info').style.color='#B71C1C'
						}
						else{
							document.getElementById('change-info').style.color='#2E7D32'
						}

						
					self.setState({
						dataSeries:dataSeries.slice(0,24).reverse(),
						dates:keyArray.slice(0,24).reverse(),
						jsonData: data3,
						changePercent: Math.abs(change.toFixed(2)),
						arrowD: arrow,
						changePe:Math.abs(changeP.toFixed(2))
					});
				
				}



		});
	}
  // componentWillMount() {
		// this.fetchData();
  // }
	componentDidMount() {

    window.setInterval(function () {
    	if(this.state.stock){
	    	this.fetchData();
	    	document.getElementById('spinner').style.visibility='hidden'
	    	document.getElementById('stock-info').style.display='block';
	    	document.getElementById('stock-market-location').style.display='inline';

    	}
    }.bind(this), 50000);
		}
	
	


	render() {


		var d1 = new Date()
		var date = new Date(d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate(), d1.getUTCHours(), d1.getUTCMinutes(), d1.getUTCSeconds() );
		date = date.toString();

		return (
			<div>
			<div className ='container' id='container'>
					<MaterialUIAutocomplete
						id = 'autocomp'
						changeLocation = {this.changeLocation}
					/>
					<div className="spinner" id='spinner'>
					  <div className="sk-circle1 sk-child"></div>
					  <div className="sk-circle2 sk-child"></div>
					  <div className="sk-circle3 sk-child"></div>
					  <div className="sk-circle4 sk-child"></div>
					  <div className="sk-circle5 sk-child"></div>
					  <div className="sk-circle6 sk-child"></div>
					  <div className="sk-circle7 sk-child"></div>
					  <div className="sk-circle8 sk-child"></div>
					  <div className="sk-circle9 sk-child"></div>
					  <div className="sk-circle10 sk-child"></div>
					  <div className="sk-circle11 sk-child"></div>
					  <div className="sk-circle12 sk-child"></div>
					</div>
						<div id = 'stock-info' className='stock-info'>
							<div className='close-price'>
								{this.state.jsonData}
							</div>
							<div className='close-price-currency'>
							USD
							</div>						
							<div className='change-info' id='change-info'>
								{this.state.changePercent} 
								<span id = 'arrow'><i className="material-icons">{this.state.arrowD}</i></span>
								{this.state.changePe}%
							</div>
							<br></br>
					</div>
					<div className='stock-graph' id='stock-graph'>
						<Plot
							xData = {this.state.dates}
							yData = {this.state.dataSeries}
						/>
					</div>
					<div className='stock-market-info'>
						<div className='stock-market-location' id='stock-market-location'>
							NASDAQ: {this.state.stock}
						</div>
						<div className='date-info'>
						 {date}
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default App;
