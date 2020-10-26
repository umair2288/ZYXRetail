import React,{Component} from 'react'
import { Table , Button , Input ,Icon , Drawer} from 'antd';
import Highlighter from 'react-highlight-words';

import * as titleActions from '../../Actions/TitleActions'
import * as customerActions from '../../Actions/CustomerActions'
import customerStore from '../../store/CustomerStore'
import CustomerProfile from './CustomerProfile';



class ViewCustomers extends Component{
    

    state = {
        searchText: '',
        data: [],
        drawer_visible:false,
        CustomerID : null
        // pagination: {},
        // loading: false,
    };


    formatTableData(customer){
        return {
            key: customer.id,
            nic: customer.NIC,
            name: customer.contact.FirstName + " " + customer.contact.LastName,
            contact: customer.contact.ContactNo,
            address:    customer.contact.Address.No + "," +
                        customer.contact.Address.Street + ',' + 
                        customer.contact.Address.Town + "." + customer.contact.Address.District,
            view_customer:customer.id

        }
    }

   

    
      getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={node => {
                this.searchInput = node;
              }}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Button
              type="primary"
              onClick={() => this.handleSearch(selectedKeys, confirm)}
              icon="search"
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Search
            </Button>
            <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </div>
        ),
        filterIcon: filtered => (
          <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
          record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => this.searchInput.select());
          }
        },
        render: text => (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[this.state.searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        ),
      });
    
      handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
      };
    
      handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
      };
    

    componentDidMount(){
        titleActions.changeTitle("Customers")  
        customerActions.updateCustomers() //fetching data and updates the store

        customerStore.on('update',()=>{
            const customers =  customerStore.getAllCustomers()
            const tableData = customers.map(this.formatTableData)
            this.setState({data:tableData})
        })   
    } 
    
      
    showDrawer = (event) =>{
        var state = {...this.state}
        state.drawer_visible = true
        state.CustomerID=parseInt(event.target.id)       
        this.setState(state,()=>console.log(this.state))

    }    
    
    onClose = () => {
        var state = {...this.state}
        state.drawer_visible = false
        this.setState(state)
    }

    

    columns = [
        {
          title: 'NIC',
          dataIndex: 'nic',
          key: 'nic',
          render: text => <span>{text}</span>,
          ...this.getColumnSearchProps('nic')
        },
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          ...this.getColumnSearchProps('name')
        },
        {
            title: 'Contact No',
            dataIndex: 'contact',
            key: 'contact',
          },   
        {
          title: 'Address',
          dataIndex: 'address',
          key: 'address',
        },  
        {
            title: '',
            dataIndex: 'view_customer',
            key: 'view_customer',
            render: id => <Button type="primary" icon="user" onClick={this.showDrawer} id={id}>View</Button>,
          },   
      ];

    render(){

        

        return (
          <div>
            <Table columns={this.columns} pagination={{ pageSize: 10 }}  dataSource={this.state.data} size="small" /> 
            <Drawer
                title="Customer Details"
                placement="right"
                width= {600}
                destroyOnClose
                closable={true}
                onClose={this.onClose}
                visible={this.state.drawer_visible}
              >
              <CustomerProfile {...this.props} CustomerID={this.state.CustomerID}/>
          </Drawer>
          </div>
        )
    }
}

export default ViewCustomers;