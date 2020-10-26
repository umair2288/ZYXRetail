import React ,{Component} from 'react';
import * as titleActions from '../../Actions/TitleActions'
import salesStore from  '../../store/SalesStore'
import {Card , Row , Col} from 'antd' 
import { LineChart, Line, Legend, XAxis, YAxis , Tooltip} from 'recharts';
import paymentStore from '../../store/PaymentStore';

class Dashboard extends Component{

   state = {
       todaySales: 0,
       todayCollection:0,
       amountOverDue:0,

       dailySales: []
       
   }

    componentDidMount(){
        titleActions.changeTitle("Dashboard")
        this.setState(
            {
                todaySales: salesStore.getTotalSales(),
                todayCollection : paymentStore.getTotalCollection(),
                dailySales: salesStore.dailySales.length ? salesStore.dailySales : salesStore.getDailySales(),
                dailyCollection: paymentStore.dailyCollection.length ? paymentStore.dailyCollection : paymentStore.getDailyCollection()

            } , () => console.log(this.state)
        )

        paymentStore.on("update", () => {
            this.setState(
                {
                    todaySales: salesStore.getTotalSales(),
                    todayCollection : paymentStore.getTotalCollection(),
                    dailySales: salesStore.dailySales.length ? salesStore.dailySales : salesStore.getDailySales(),
                    dailyCollection:  paymentStore.getDailyCollection()
    
                } , () => console.log(this.state)
            )
        })
    }
   

    render(){
        return (
            <div style={{  padding: '10px' }}>
            <Row gutter={16}>
              <Col span={8}>
                <Card title="Today Sales" bordered={false}>
                    {"LKR " + this.state.todaySales}
                </Card>
              </Col>
              <Col span={8}>
                <Card title="Today Collection" bordered={false}>
                    {"LKR " + this.state.todayCollection}
                </Card>
              </Col>
              <Col span={8}>
                <Card title="Amount Over Due" bordered={false}>
                    {"LKR " + this.state.amountOverDue}
                </Card>
              </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <h3>Sales By Date</h3>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                <LineChart width={900} height={200} data={this.state.dailySales} >
                    <Line type="monotone" dataKey="Sale Amount" stroke="#8884d8" />
                   
                    <Tooltip/>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Legend verticalAlign="center" />
                </LineChart>
                </Col>
            </Row>
          </div>
        )
           
        
    }
}

export default Dashboard
