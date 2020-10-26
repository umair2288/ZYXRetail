import React, { Component } from 'react';
import { Row , Col, Select , Button, Table, DatePicker, PageHeader, Descriptions} from 'antd'
import {Redirect}from 'react-router-dom'
import moment from 'moment'
import axios from 'axios'
import JsonToCSV from '../components/JsonToCSV';
import keys from '../../../keys';
import { connect } from 'react-redux';


const {Option} = Select

class Report extends Component {
   
    state = {
        loading : false,
        columns: [],
        date : this.props.date || moment(Date.now()),
        data : [],
        pagination:{
            current:1,
            pageSize:10
        }
        
    }

    dataToColumn = (obj) => {
      return Object.keys(obj).map(
            (key , index) => ({
                key : index,
                dataIndex : key,
                title : key
            })
        )
    }

 

    getColumns = (type) => {
        switch(type){
            case "stock":{
                return [
                    {
                        key: 0,
                        dataIndex : "id",
                        title : "No",
                        width:"80px"
                    }
                    ,
                    {
                        key: 1,
                        dataIndex : "item_code",
                        title : "Item Code",
                        width:"200px"
                    }
                    ,
                    {
                        key: 2,
                        dataIndex : "product",
                        title : "Product",
                        width:"200px"
                    }
                    ,
                    {
                        key: 3,
                        dataIndex : "warehouse",
                        title : "Warehouse",
                        width:"200px"
                    }
                    ,
                    {
                        key: 4,
                        dataIndex : "date_in",
                        title : "Date In",
                        render : (date) => date.substr(0,10)
                        // width:"200px"
                    }

                ]
            }
        }

    }

    componentDidMount(){
        console.log(this.props)
        this.setState({
            loading:true
        })
        const url = keys.server + this.props.report.data_url + this.props.location.search
       // const url = this.reportUrls[this.props.type] + this.props.location.search
        axios.get(url,{params:{limit:10}})
        .then(
            response => {
                const {pagination} = this.state
                pagination.total = response.data.count
                const results = response.data.results
                console.log(response)
                this.setState({
                    data:results,
                    columns: results.length ? this.dataToColumn(results[0]) : [],
                  //  columns:this.getColumns(this.props.type),
                    loading:false,
                    pagination:pagination
                }, () => console.log(this.state))
            }
        )
        .catch(
            error => {
                console.error(error);
                this.setState({
                    loading:false
                })
            }
        )
    }

   

    onTableChange = (pagination)=>{
        this.setState({loading:true})
        const {current , pageSize} = pagination
        const url = keys.server + this.props.report.data_url  + this.props.location.search
       
        axios.get(url,{params:{offset:(current-1)*pageSize ,limit:pageSize}})
        .then(
            response => {
                const results = response.data.results
                this.setState({
                    data:response.data.results,
                    columns: results.length ? this.dataToColumn(results[0]) : [],
                    // columns:this.getColumns(this.props.type),
                    loading:false,
                    pagination:{
                        ...pagination
                    }
                })
            }
        )
        .catch(
            error => {
                console.error(error);
                this.setState({
                    loading:false
                })
            }
        )
    }

   


    columnsToFields = () =>{
        const {columns} = this.state 
        const fields = {}
        columns.map(data => {
                console.log(data.dataIndex)
                console.log(data.title)
                fields[data.dataIndex] = data.title
            }
        )
        console.log("converting..." , fields)
        return fields
    }

    handleBackClick = ()=>{
        this.props.push("/dashboard")
    }




    render() { 

        console.log(this.state)
        return (
            <Row>
            <Col span={24}>               
                <Row style={{position:"relative" , top:"30px" }}>     
                    <Col offset={1} span={22}>
                        <Row >
                            <PageHeader 
                                    onBack={this.handleBackClick}
                                    title={this.props.type + " report"} 
                                    subTitle="General"
                                    extra={
                                        [
                                            <JsonToCSV 
                                                fields={this.columnsToFields()} 
                                                dataUrl={keys.server + this.props.report.data_url + this.props.location.search } 
                                                filename = {`Stock Report`}
                                            />
                                        ]         
                                    }       
                                    >
                                   
                            </PageHeader>
                        </Row>
                        <Row>
                            <Table 
                                rowKey={row => row.id} 
                                onChange={this.onTableChange} 
                                loading={this.state.loading} 
                                scroll={{y:455}}
                                size="middle"
                                columns={this.state.columns} 
                                dataSource={this.state.data} 
                                pagination={this.state.pagination} >
                            </Table>
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row> );
    }
}
 
const mapStateToProps = state =>({
    report : state.reports.selectedReport
})


export default connect(mapStateToProps,null)(Report);