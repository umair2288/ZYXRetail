import React, { Component } from 'react';
import NewWindow from 'react-new-window'    




class CardToPrint extends Component {

    style = {
        tableCell : {
            paddingRight : "10px",
            fontSize : "12px",
            textAlign : "center"
            // border:"1px solid black"
        }
    }

    static defaultProps = {
        visible : true,
        data : {
            invoiceNo : "RM1",
            issueDate : "2020-02-02",
            endDate : "2020-04-02",
            salesPersonID : "95241314000V",
            vehicleNo : "XXXX",
            customerName : "Test Customer",
            customerID : "01",
            customerAddress : "00,Test Street, Test Town",
            customerNIC : "952413147V",
            contactNo : "077671864",
            initialPayment : 1000,
            numberOfTerms: 10,
            totalBill : 6000
        }
    }
    
    render(){
        
     
        const {data} = this.props
         
        return (
         <NewWindow title={`Instalment Card - ${data.invoiceNo}`} onUnload={this.props.onClose}>
                <div style={{width:"147mm" , height:"207mm" , padding:"10mm 5mm 10mm 5mm"  }}>
                <div style={{width:"137mm" , height:"187mm"  }}>
                   <table style={{width:"100%" , height:"100%" }}>
                        <tr style={{height:"9%" }}>
                            <td colSpan="5"></td>
                        </tr>
                        <tr style={{height:"4.3%" }}>
                            <td colSpan="5"></td>
                        </tr>
                        <tr style={{height:"4.8%" }}>
                            <td style={this.style.tableCell} > {data.invoiceNo} </td>
                            <td style={this.style.tableCell} > {data.issueDate}</td>
                            <td style={this.style.tableCell} > {data.endDate}</td>
                            <td style={this.style.tableCell} > {data.salesPersonID}</td>
                            <td style={this.style.tableCell} > {data.vehicleNo}</td>
                        </tr>
                        <tr style={{height:"3.2%" }}>
                            <td style={this.style.tableCell} ></td>
                            <td colSpan="3" style={this.style.tableCell} > {data.customerName}</td>           
                            <td style={this.style.tableCell} > {data.customerID}</td>
                        </tr>
                        <tr style={{height:"5.3%" }}>
                            <td style={this.style.tableCell} ></td>
                            <td colSpan="4" style={this.style.tableCell} > {data.customerAddress}</td>           
                        </tr>
                        <tr style={{height:"3.7%" }}>  
                            <td colSpan="2" style={{textAlign:"right",...this.style.tableCell}} > {data.customerNIC}</td> 
                            <td style={this.style.tableCell} > {data.contactNo}</td> 
                            <td  style={this.style.tableCell} > </td> 
                            <td  style={this.style.tableCell} > {data.initialPayment}</td> 
                        </tr>
                        <tr style={{height:"56.3%" }}>  
                            <td colSpan="5"  style={this.style.tableCell} > </td>                  
                        </tr>      
                        <tr style={{height:"6.4%" }}>  
                            <td  style={this.style.tableCell} > </td>                  
                            <td colSpan="3"  style={this.style.tableCell} > {data.numberOfTerms} </td>                  
                            <td   style={this.style.tableCell} > {data.totalBill} </td>                  
                        </tr>
                        <tr style={{height:"8%"}}>                                   
                            <td colSpan="5"  style={{textAlign:"center",...this.style.tableCell}} > {data.items}</td>                                                 
                        </tr>             
                   </table>
                </div>
                </div>
            </NewWindow>
        )
    }
}
 
export default CardToPrint;
