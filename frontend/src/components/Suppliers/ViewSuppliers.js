import React from 'react'
import { Table } from 'antd';
import { Button } from 'antd/lib/radio';
import supplierStore from '../../store/SupplierStore';
import * as supplierActions from '../../Actions/SupplierActions'

class ViewSuppliers extends React.Component {

    state = {
        supplierStore : supplierStore.initialState
    }

    componentWillMount(){
        supplierStore.on('update',()=>{
            this.setState({supplierStore:supplierStore.initialState})
        })
        supplierActions.fetchAllSuppliers(localStorage.getItem('token'))
    }

    columns = [
        {
            title : "Name",
            key : "name",
            dataIndex : "name"
        },
        {
            title : "Phone",
            key : "phone",
            dataIndex : "phone"
        },
        {
            title : "E-mail",
            key : "email",
            dataIndex : "email"
        },
        {
            title : "Address",
            key : "address",
            dataIndex : "address"
        },
        {
            title : "Action",
            render : () => <Button>View</Button>
        }
    ]


    render(){

        const {loading,suppliers} = this.state.supplierStore

        return(
            <Table loading={loading} columns = {this.columns} dataSource = {suppliers} size = "small" />
        )
    }
}

export default ViewSuppliers