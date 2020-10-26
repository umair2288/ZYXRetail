import React, {Component} from "react";
import PropTypes from "prop-types";
import {saveAs} from "file-saver";
import { Button } from "antd";
import axios from 'axios'

class JsonToCSV extends Component {
  static propTypes = {
    className: PropTypes.string,
    data: PropTypes.array.isRequired,
    fileformat: PropTypes.string,
    filename: PropTypes.string,
    fields: PropTypes.object,
    separator: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    className: "json-to-excel",
    fileformat: "csv",
    filename: "json-to-excel",
    separator: ",",
    text : "Download",
    style: {}
  };

  constructor() {
    super();
    this.state = {
      data: [],
      fields: [],
      headers: [],
      loading:false
    };
  }

  componentDidMount() {
    const {data, fields} = this.props;
    this.setState({
      data: data,
      fields: Object.keys(fields),
      headers: Object.keys(fields).map((key) => fields[key])
    } , () => console.log(this.state));
  }

  componentDidUpdate(prevProps){
    const {data} = this.props;
    const fields = Object.keys(this.props.fields);
    console.log(fields);
    console.log(this.state.fields)
    
    console.log(JSON.stringify(this.state.fields) !== JSON.stringify(fields))

    if (JSON.stringify(this.state.fields) !== JSON.stringify(fields)) {  
      this.setState({
        data: data,
        fields: Object.keys(this.props.fields),
        headers: Object.keys(this.props.fields).map((key) => this.props.fields[key])
      } , () => console.log(this.state));
    }
  }

  convertToExcel = () => {
    const {headers} = this.state,
      {separator} = this.props,
      body = this.getBodyData(),
      
      header = headers.join(separator);
    return header + "\n" + body;
  }

  getBodyData = () => {
    const {data, fields} = this.state , {separator} = this.props;

    return data.map((row) => { 
      return fields.map((field) => {  
        if (row.hasOwnProperty(field)) {
          return row[field];
        }
        return null;
      }).join(separator);
    }).join("\n");
  }

  saveExcel = () => {
      const {fileformat, filename} = this.props
      const data = this.convertToExcel()
      const blob = new Blob([data],
            {
              type: "text/plain",
              charset: "utf-8"
            }
          );

      saveAs(blob, [filename + "." + fileformat]);
  }


  fetchDataAndDownload = ()=>{
    const {dataUrl} = this.props
    if(dataUrl){
      this.setState({
        loading:true
      })
      axios.get(dataUrl)
      .then(
          response => {
              this.setState({
                  data:response.data,
                  loading:false
              },this.saveExcel)}
      )
      .catch(
          error => {
              console.error(error);
              this.setState({
                  loading:false
              })
          }
      )}}

  render() {
    const {className, style} = this.props;

    return (
      <Button
        type="link"
        loading={this.state.loading}
        className={className}
        onClick={this.fetchDataAndDownload}
        style={style}
      >
        {this.props.text}
      </Button>
    );
  }
}

export default JsonToCSV;