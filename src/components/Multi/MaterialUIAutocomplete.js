import React, {Component} from 'react';
import { AutoComplete }   from 'material-ui';
import getMuiTheme        from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider   from 'material-ui/styles/MuiThemeProvider';
import xhr              from 'xhr';
var dataArray = []

xhr({
  url:'convertcsv.json'
    },function(err, data) {
        var values = [];
        data = JSON.parse(data.body);
        var key;
        for(key in data){
          values.push(data[key]);
        }
        dataArray = values.map(function(result) {
          return result["Symbol"] +' ('+ result["Name"]+')';
        });
      }
);

class MaterialUIAutocomplete extends Component {
  constructor(props) {
    super(props);
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.state = {
      dataSource : [],
      inputValue : ''
    }
  }

  onUpdateInput(inputValue) {
    const self = this;
    this.setState({
      inputValue: inputValue
    }, function() {
      self.performSearch();
    });
  }

  performSearch() {
    const
      self = this

    if(this.state.inputValue !== '') {
      self.setState({
          dataSource: dataArray
      });
  }
}

  render() {
    return <MuiThemeProvider muiTheme={getMuiTheme()}>
      <AutoComplete
        filter={AutoComplete.caseInsensitiveFilter}
        placeholder = 'Enter stock symbol'
        onNewRequest={this.props.changeLocation}
        id = 'autocomp'
        dataSource    = {this.state.dataSource}
        onUpdateInput = {this.onUpdateInput} 
        style={{
          color:"pink"
        }}

        />
      </MuiThemeProvider>
  }
}

export default MaterialUIAutocomplete;