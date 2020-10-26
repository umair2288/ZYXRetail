import React ,{Component} from 'react'
import {Table,  message , Button , Icon , Input} from 'antd'
import Highlighter from 'react-highlight-words';
import saleStore from '../../store/SalesStore'

class SalesTable extends Component{

    state = {
        data:saleStore.getSalesByCustomer(this.props.customer_id)
    }

    componentDidMount(){
    
        saleStore.getAllSales(()=>{
            this.setState(
                {
                    data:saleStore.getSalesByCustomer(this.props.customer_id)}
                ,
                () => {
                    console.log(this.state)
                    console.log("sales data loaded successfully")
                })
        } ,
        ()=>{
            message.error("error in loading sales, check your internet connection")
        })
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



    

    formatTableData = () => {
     return   this.state.data.map (
            (sale) => {
                return {
                    key:sale.id,
                    invoice : sale.invoice_no,
                    product_id : sale.order_lines[0].product.item_code,
                    customer_nic: sale.customer.NIC,
                    paymentStatus: sale.payment_status,
                    instalment_plan_id:sale.instalment_plan_id
                }
            }
        )
    }



   
    columns = [
            {
                title: 'Invoice',
                dataIndex: 'invoice',
                key: 'invoice',
                ...this.getColumnSearchProps('invoice')
              },   
              
              {
                title: 'Product ID',
                dataIndex: 'product_id',
                key: 'productId',
                 ...this.getColumnSearchProps('productId')
              },   
            
                
              {
                title: 'Customer NIC',
                dataIndex: 'customer_nic',
                key: 'customer_nic',
                ...this.getColumnSearchProps('customer_nic')
              },  
    
              {
                title: 'Payment Status',
                dataIndex: 'paymentStatus',
                key: 'paymentStatus',
              },   
              {
                title: '',
                dataIndex: 'instalment_plan_id',
                key: 'instalment_plan_id',
                render: id => <Button type="primary" icon="user" onClick={(e) => this.props.handleViewInstalmentPlan(e.target.id)} id={id}>Instalment Plan</Button>,
              }
    
        ]    

        render(){
            return <Table columns={this.columns} pagination={{ pageSize: 10 }}  dataSource={this.formatTableData()} size="small" /> 
     
            
        }


}



export default SalesTable;