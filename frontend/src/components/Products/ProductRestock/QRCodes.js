import React, {Component} from 'react'
import QRCode from 'qrcode.react'
import { Row , Col } from 'antd'



class QRCodes extends Component{

    state = {
        data:[
            [
                {
                value : '1',
                label : 1
                 },
                {
                    value : '1',
                    label : 1
                }
            ],
            [
                {
                value : '1',
                label : 1
                 },
                {
                    value : '1',
                    label : 1
                }
            ]
            
        ]
    }


   




    render(){
        return(
            <div>
{
   



  this.state.data.map(
        (data) =>{
            return (
            <Row gutter={10} style={{margin:"20px"}}>
                {
                     data.map(
                        (data) => {
                            return(
                                <Col span={4} align="center">
                                     <QRCode  size = {128} value={data.value}></QRCode>
                                     <div>{data.label}</div>
                                 </Col>
                            )
                            }
                    )
                }
            </Row>    
                )


           
           
            
        }
    )
}


              
            </div>
        )
    }

}



export default QRCodes