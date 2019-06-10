import React from 'react'
import {Button} from 'antd'
class TestDetails extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      orders:null
    }
  }
  componentWillMount(){
    this.setState({
      orders:this.props.location.payload
    })
  }


  render(){
    let {orders} = this.state;
    return (
      <div className="Details">
        <h2>{orders.realname}同学的详情</h2>
        <Button type="link" onClick={()=>{
          this.props.history.goBack()
        }}>返回</Button>
       
        
      </div>
    )
  }
}

export default TestDetails;