import React from 'react';
import $ from 'jquery';
import './order.css';
import {Table, Button,Modal} from 'antd';
import { Spin } from 'antd';



class Order extends React.Component{

    constructor(){
        super();
        this.state={
            users:[],
            orders:[],
            selectedRowKeys:[],
            visible:false,
            loading: false,
            form:{
                orderTime:"",
                status:"",
                userId:""
            }
        }
    }

    changeHandler=(event)=>{
        //获取当前的目标事件，改变表单里的值，则改变state里的值，想当于反向绑定
        let name=event.target.name;
        let value=event.target.value;
        this.setState({
            form:{...this.state.form,...{[name]:value}}
        })
    }

    componentDidMount(){
        //1.加载用户信息
        this.loadUsers();
        //2.加载订单信息
        this.loadOrders();

    }

    //1.加载用户信息
    loadUsers(){
        let url='http://127.0.0.1:9999/User/findAll';
        $.get(url,({status,message,data})=>{
            if(status===200){
              
                this.setState({
                    "users":data,
                    loading: true,
                    //拿到后台信息后，要重新给默认值。
                    form:{...this.state.form,...{userId:data[0].id}}
                })
            }else{
                alert(message)
            }
        })
    }

    //2.加载订单信息
    loadOrders(){
        let url='http://127.0.0.1:9999/Order/orderanduser';
        $.get(url,({status,message,data})=>{
            if(status===200){
                this.setState({
                    "orders":data,
                    loading: false,

                    form:{...this.state.form,...{orders:data[0].id}}
                })
            }else{
                alert(message)
            }
        })
    }


    handleOk=(event)=>{
        let url="http://127.0.0.1:9999/Order/saveOrUpdate";
        $.post(url,this.state.form,({message})=>{
            alert(message)
            //刷新页面
            this.loadOrders();
        })
        event.preventDefault();
        this.setState({
            visible:false
       })
    }
 
    handleCancel=()=>{
        //一旦涉及更改state里的值，就因该写这句代码
         this.setState({
             visible:false
         })
     }


    toAdd=()=>{
        this.setState({
            visible:true,
            form:{
                orderTime:"",
                status:"",
                userId:"",
            }
        })
    }


    toUpdate=(id)=>{
        this.setState({
            visible:true
       })
        //1,通过id查找课程信息
        //2，将返回结果设置到this.state.form中
        //state->form
        console.log(id);
        $.get("http://127.0.0.1:9999/Order/findById?id="+id,({status,message,data})=>{
            if(status===200){
                //将查询数据库设置到state中
                this.setState({
                    visible:true,
                    "form":data
                })
                this.loadOrders();
            }else{
                alert(message)
            }
        })
    }


    toDelete=(id)=>{
        //1,通过id查找课程信息
        //2，将返回结果设置到this.state.form中
        //state->form
        console.log(id);
        $.get("http://127.0.0.1:9999/Order/Delete?id="+id,({status,message,data})=>{
            alert(message)
            //刷新页面
            this.loadOrders();
        })
    }

    state = {
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
      };
    
    //可以完成向后台传递一个数组id值
    start = () => {
    this.setState({ loading: true });
    //批量删除
    let url="http://127.0.0.1:9999/Order/batchDelete";
    $.ajax({
        url:url,
        method:'POST',
        processData:false,
        contentType:'application/json',
        data:JSON.stringify(this.state.selectedRowKeys),
        success:({status,message,data})=>{
            alert(message)
            //刷新页面
            this.loadOrders();
        }
    })
    console.log(this.state.selectedRowKeys);
     // 完成后的ajax请求
    setTimeout(() => {
        this.setState({
        selectedRowKeys: [],
        loading: false,
        });
    }, 1000);
    };
//箭头函数，解决手动绑定事件。
    onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
    };
    toggle = value => {
        this.setState({ loading: this.state.orders });
      };
    render(){
        let {users,form}=this.state;
        const columns = [
            {
              title: '订单时间',
              dataIndex: 'orderTime',
            },
            {
              title: '订单状态',
              dataIndex: 'status',
            },
            {
              title: '用户名',
              dataIndex: 'user.name',
            },
            {
                title: '操作',
                render: (record) => (
                  <span>
                    <Button onClick={this.toUpdate.bind(this,record.id)}>更新订单</Button>
                    <div></div>
                    <Button type="danger" onClick={this.toDelete.bind(this,record.id)}>删除订单</Button>
    
                  </span>
                ),
              },
          ];
    
        
        const { loading, selectedRowKeys} = this.state;
        const rowSelection = {
          selectedRowKeys,
          onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        
        return (
            <div className="dd">

                       <Spin spinning={this.state.loading} delay={50} />

                <div className ="ddgl" style={{display: 'inline'}}>订单管理</div>
                <div style={{display: 'inline',marginLeft:160}}>
                <Button type="primary" onClick={this.toAdd} className="butt" style={{marginRight:0}}> 添加订单 </Button>
                <Button type="danger" onClick={this.start} disabled={!hasSelected} loading={loading}>批量删除</Button>
                </div>
                <span style={{ marginLeft: 8 }}>
                    {hasSelected ? `选中 ${selectedRowKeys.length} 项` : ''}
                </span>
                <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.orders} rowKey={record=>record.id}/>

                <Modal
                title="是否保存或更新订单？"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                >
                    <form onSubmit={this.handleOk} style={{fontSize:'20px',fontFamily:'楷体',fontWeight:'900'}}>
                    *订单时间:<br/>
                    <input type="text" name="orderTime" value={form.orderTime} onChange={this.changeHandler} style={{width:'470px',height:'40px',borderRadius:'5px'}}/><br/><br/>
                    *订单状态:<br/>
                    <input type="text" name="status" value={form.status} onChange={this.changeHandler} style={{width:'470px',height:'40px',borderRadius:'5px'}}/><br/><br/>
                    *用户名称:<br/>
                    <select name="userId" value={form.userId} onChange={this.changeHandler} style={{width:'230px',height:'40px',borderRadius:'5px'}}>
                        {
                        users.map((record)=>{
                            return <option value={record.id} key={record.id}>{record.name}</option>
                        })
                        }
                    </select>
                    </form>
                </Modal>
                {JSON.stringify(form)}
            </div>
        )
    }
}
export default Order;