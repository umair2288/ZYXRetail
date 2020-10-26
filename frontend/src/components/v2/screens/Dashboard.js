import React, { Component, useState, useEffect } from 'react';
import { Col , Row , Select, Empty , Button, message} from 'antd';
import axios from 'axios'
import TopNavBar from '../components/TopNavBar';
import TopBrandBar from '../components/TopBrandBar';
import RowCard from '../components/RowCard';
import Search from '../components/Search';
import keys from '../../../keys';
import { fetchReports } from '../../../redux/reports/actions/actionCreators';
import { connect } from 'react-redux';
import { updateReports, selectReport } from '../../../redux/reports/actions/actions';

const {Option} =  Select


const ReportFilter =(props)=> {

    const [filters , setFilters] = useState([])
    const [loaded , setLoaded] = useState(false)

    useEffect(
        ()=>{
            if(!loaded){
                message.loading()
                axios.get(props.filter_url)
                .then(
                    response => {
                        message.destroy()
                        setFilters(response.data)
                        console.log(response.data)
                        setLoaded(true)
                    }
                )
                .catch(
                    error => {
                        message.destroy()
                        message.error("Loading failed!")
                    }
                )
            }
        }
    )

    return <Select  placeholder="Select Category" 
                    value={props.value} 
                    onChange={v=> props.onChange(props.title,v)}  
                    style={{width:"100%"}}>
                        {filters.map((option)=><Option key={option.id} value={option.id}>{option.title}</Option>)}
            </Select>
}

class Dashboard extends Component {

    state = {
        reports : []
    }

    componentDidMount = ()=>{
        message.loading("Loading...")
        this.props.fetchReports(
            ()=>{
                message.destroy()
                message.success("Loading successfull!")
            }
            ,
            ()=>{
                message.error("Loading reports failed!")
            }
        )
      
    }


    onReportFilterChange = (title,value)=>{
        const reports = this.props.reports.reports.map(
            report => {
                if (title === report.title){ return {...report , value:value} } else {return report}
            }
        )
        this.props.updateReports(reports)
        // this.setState(
        //    { reports : reports}
        // )
        console.log(title,value)
    }



    navigate = (link) =>{
        this.props.history.push(link) 
    }
   
    render() { 
        return ( 
            <>
            <TopNavBar navigate={this.navigate} title={"Dashboard"}/>
            <Row>
                <Col span={24}>    
                    <Row >
                        <Row style={{padding:"20px"}}>
                            <Col offset={6} span={12}>
                                <Search onValueChange={(id)=>this.navigate(`sales/order/${id}`)}/>
                            </Col>
                        </Row>
                        <Row>
                        <Col offset={1} span={7}>
                            <Row style={{marginBottom:"20px" , paddingBottom:"10px" , borderBottom:"0.5px solid lightgrey"}}>
                                <Col style={{fontSize:"24px"}} span={14}> Reports </Col>
                                <Col style={{fontSize:"24px" }} span={10}>
                                    <Select  style={{width:"150px"}}>
                                       { ["Daily" , "Montly" , "Weekly"].map(
                                            (reportCategory ,index) => <Option value={reportCategory} key={index}>{reportCategory}</Option>
                                        )
                                       }
                                    </Select> 
                                </Col>
                            </Row>
                            <Row>
                                <Col offset={1} span={22}> 
                                {   
                                       this.props.reports.reports.map(report =>< RowCard 
                                                                    title={report.title} 
                                                                    onClick = {
                                                                            ()=> {
                                                                                this.props.selectReport(report)
                                                                                this.navigate(report.link+"?"+report.filter_param+"="+report.value)
                                                                            }}
                                                                    filter = {
                                                                        ()=><ReportFilter 
                                                                                title = {report.title}
                                                                                options={report.filters}
                                                                                onChange = {this.onReportFilterChange}
                                                                                value = {report.value}
                                                                                filter_url= { keys.server + report.filter_url}                                                                   
                                                                            />
                                                                    }
                                                                    />
                                       )       
                                }       
                                </Col>
                            </Row>
                        </Col>
                        <Col offset={1} span={14}>
                            <Row style={{marginBottom:"20px" , paddingBottom:"10px" , borderBottom:"0.5px solid lightgrey"}}>
                                <Col style={{fontSize:"24px"}} span={24}> Analytics </Col>
                            </Row>
                            <Empty></Empty>
                        </Col>
                        </Row>
                    </Row>
                </Col>
            </Row>
            </>
         );
    }
}


const mapStateToProps = state => ({
    categories : state.product.categories,
    reports : state.reports
})

const mapDispatchToProps = dispatch => ({
    fetchReports : (sc , ec) => dispatch(fetchReports(sc,ec)),
    updateReports : (reports) => dispatch(updateReports(reports)),
    selectReport : report => dispatch(selectReport(report))
})
 

export default connect(mapStateToProps,mapDispatchToProps)(Dashboard);