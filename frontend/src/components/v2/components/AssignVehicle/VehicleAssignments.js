import React, { Component } from 'react';
import {Row , Col , Table, message, PageHeader, Button} from 'antd'
import axios from "axios"
import keys from '../../../../keys';


class VehilceAssignments extends Component {
    
   

    columns = [
        {
            key: "vehilce_no",
            dataIndex: "vehicle_no",
            title : "Vehicle No"
        }
        ,
        {
            key: "sales_person",
            dataIndex: "sales_person",
            title : "Sales Person"
        }
        ,
        ,
        {
            key: "driver",
            dataIndex: "driver",
            title : "Driver"
        }
        ,
        {
            key: "route",
            dataIndex: "route",
            title : "Route"
        }
        ,
        
        {
            key: "delete",
            dataIndex: "id",
            title : "",
            render: (id) => <Button onClick={()=>this.props.delete(id)} type="danger">Delete Assignment</Button>
        }
    ]

    



    render() { 
        return (
        <Row>
            <PageHeader title="Vehicle Assignments" subTitle={this.props.date}></PageHeader>
            <Table 
                loading={this.props.loading} 
                columns={this.columns} 
                dataSource={this.props.data}                       
            />
        </Row> );
    }
}
 
export default VehilceAssignments;