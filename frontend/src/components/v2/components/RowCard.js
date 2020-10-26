import React, { Component } from 'react';
import { Row , Col , Button} from 'antd'

class RowCard extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 

        <Row className="custom-row-card" style={{ height:"45px" ,boxShadow:"0px 6px 8px 0px lightgrey" , marginBottom:"20px"}}>
            <Col style={{ height:"inherit" , paddingLeft:"10px"}} span={10}>
                <div style={{ transform: "translateY(-50%)",top:"50%" , fontWeight:"bold" , paddingLeft:"10px" , position:"relative"}}>
                    {this.props.title}
                </div>
            </Col>
            <Col style={{ height:"inherit" , textAlign:"right", paddingRight:"10px"}} span={10}>
                <div style={{ transform: "translateY(-50%)",top:"50%" , position:"relative" }}> 
                    {this.props.filter()}
                    {/* <Button size="small" type="link"> Download</Button> */}
                </div>
            </Col>
            <Col onClick={this.props.onClick} className="custom-row-card-button" style={{ height:"inherit" , textAlign:"center"}} span={4}>
                <div  style={{ transform: "translateY(-50%)",top:"50%" , position:"relative", color:"white" }}> View</div>
            </Col>
        </Row>  
    );
    }
}
 
export default RowCard;