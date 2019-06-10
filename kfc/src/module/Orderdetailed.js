import React from 'react';
import {Button,Table,Modal, Divider} from 'antd';
import $ from 'jquery';
import './Orderdetailed.css';

class Orderdetailed extends React.Component{

    constructor(){
        super();
        this.state = {
            orderdetaileds:[],
            orders:[],
            products:[],
            selectedRowKeys: [], // Check here to configure the default column
            loading: false,
            visible: false,
            visible1:false,
            form:{
                num:"",
                orderId:"",
                productId:""
            }
          };
    }

    componentDidMount() {
        //加载订单详情数据
        this.loadOrderdetaileds();
        //向orderdetaileds中放入priceadd
        // this.addprice();
        //加载订单数据
        this.loadOrders();
        //加载食品数据
        this.loadProducts();
        
    }

    //加载订单详情数据
    loadOrderdetaileds() {
        $.get("http://localhost:9999/OrderDetails/findAll", ({ status, message, data }) => {
          if (status === 200) {
            this.setState({
              "orderdetaileds": data,
            })
          } else { alert(message) }
        })
      }
      
    //加载订单数据
    loadOrders() {
        $.get("http://localhost:9999/Order/findAll", ({ status, message, data }) => {
          if (status === 200) {
            this.setState({
              "orders": data,
              form: { ...this.state.form, ...{ orderId: data[0].id } }
            })
          } else { alert(message) }
        })
      }

    //加载食品数据
    loadProducts() {
        $.get("http://localhost:9999/Product/findAll", ({ status, message, data }) => {
          if (status === 200) {
            this.setState({
              "products": data,
              form: { ...this.state.form, ...{ productId: data[0].id } }
            })
          } else { alert(message) }
        })
      }
    //更新
    toUpdate(id){
        this.setState({
            visible1: true,
            });
        // 1. 通过id查找课程信息
        // 2. 将返回结果设置到this.state.form中
        // state->form
        $.get("http://localhost:9999/OrderDetails/findById?id=" + id, ({ status, message, data }) => {
            if (status === 200) {
            // 将查询数据设置到state中
            this.setState({ flag: true, "form": data })
            } else { alert(message) }
        })
    }

    //删除
    toDel(id){
        let url = "http://localhost:9999/OrderDetails/Delete"
        $.post(url, {"id":id}, ({ message }) => {
        alert(message);
        //刷新
        this.loadOrderdetaileds();
        })
    }

    //展示Model
    showModal = () => {
        this.setState({
        visible: true,
        });
    }

    //Model确定
    handleOk(id) {
        this.toDel(id)
        this.setState({
        visible: false,
        });
    };

    //Model取消
    handleCancel = () => {
        this.setState({
        visible: false,
        });
    };

    //展示信息Model
    showModal1 = () => {
        this.setState({
        visible1: true,
        form:{
            num:"",
            orderId:this.state.form.orderId,
            productId:this.state.form.productId
           
        }
        });
    }

    //信息Model确定(提交信息)
    handleOk1() {
        let url = "http://localhost:9999/OrderDetails/saveOrUpdate"
        $.post(url, this.state.form, ({ message }) => {
        alert(message);
        //刷新
        this.loadOrderdetaileds();
        })
        this.setState({
        visible1: false,
        });
        
    };

    //信息Model取消
    handleCancel1 = () => {
        this.setState({
        visible1: false,
        });
    };

    //批量删除
    start = () => {
        this.setState({ loading: true });
        // ajax request after empty completing
        //批量删除使用selectedRowKeys向后台传数组
        let url = "http://localhost:9999/OrderDetails/batchDelete";
        $.ajax({
          url:url,
          method:'POST',
          processData:false,
          contentType:'application/json',
          data:JSON.stringify(this.state.selectedRowKeys),
          success:({ message })=>{
            alert(message);
            // 刷新页面
            this.loadOrderdetaileds();
          }
        })
        console.log(this.state.selectedRowKeys)
        setTimeout(() => {
          this.setState({
            selectedRowKeys: [],
            loading: false,
          });
        }, 1000);
        
      };
    
    //chackbox数据的的绑定
    onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
    };
    
    //表单数据绑定事件
    changeHandler = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({
        form: { ...this.state.form, ...{ [name]: value } }
        })
    }

    render(){

        const { loading, selectedRowKeys, orderdetaileds, form, orders, products} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            };
        const hasSelected = selectedRowKeys.length > 0;
        const columns = [
            {
              title: '订单编号',
              dataIndex: 'order.id',
            },
            {
              title: '订单会员',
              dataIndex: 'user.name',
            },
            {
              title: '食物名称',
              dataIndex: 'product.name',
            },
            {
                title: '食物数量',
                dataIndex: 'num',
            },
            {
                title: '食物单价',
                dataIndex: 'product.price',
            },
            // {
            //     title: '订单总价',
            //     dataIndex: 'priceadd',
            // },
            {
                title: '食物余量',
                dataIndex: 'product.status',
            },
            {
                title: '操作',
                render: (text, record) => (
                    <span>
                      <Button onClick={this.toUpdate.bind(this,record.id)}>修改订单</Button>
                      <Divider type="vertical" />
                        <Button type="danger" onClick={this.showModal}>
                        删除订单
                        </Button>
                        <Modal
                            title="确认框"
                            visible={this.state.visible}
                            onOk={this.handleOk.bind(this,record.id)}
                            onCancel={this.handleCancel}
                            cancelText="取消"
                            okText="确认"
                            maskStyle={{backgroundColor:'rgba(255,0,0,0.05)'}}
                        >
                            <p>确认删除？</p>
                        </Modal>
                    </span>
                  ),
            },
          ];
        
        return (
            <div>
                <div className="tit">
                  <span className="ordertitle">订单详情管理</span>
                
                <Button className="but" type="primary" onClick={this.showModal1}>添加</Button>
                <Modal
                    title="信息框"
                    visible={this.state.visible1}
                    onOk={this.handleOk1.bind(this)}
                    onCancel={this.handleCancel1}
                    cancelText="取消"
                    okText="提交"
                    maskStyle={{backgroundColor:'rgba(0,0,0,0.05)'}}
                >
                    <form>
                    <span style={{fontFamily:'宋体',fontSize:20}}>订单号:</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <select style={{width:'350px',height:'30px',borderRadius:'5px',margin:'10px'}} name="orderId" value={form.orderId} onChange={this.changeHandler}>
                        {
                            orders.map((item) => {
                            return <option value={item.id} key={item.id} >{item.id}</option>
                            })
                        }
                        </select><br/>
                    <span style={{fontFamily:'宋体',fontSize:20}}>食物名称:</span>
                        <select style={{width:'350px',height:'30px',borderRadius:'5px',margin:'10px'}} name="productId" value={form.productId} onChange={this.changeHandler}>
                        {
                            products.map((item) => {
                            return <option value={item.id} key={item.id} >{item.name}</option>
                            })
                        }
                        </select><br/>
                    <span style={{fontFamily:'宋体',fontSize:20}}>食物数量:</span>
                        <input style={{width:'350px',height:'30px',borderRadius:'5px',margin:'10px'}} type="number" name="num" value={form.num} onChange={this.changeHandler} required/>
                    </form>
                </Modal>
                <Button className="but" type="danger" onClick={this.start} disabled={!hasSelected} loading={loading}>批量删除</Button>
                </div>
                <div>
                    <span style={{ marginLeft: 1335 ,color: 'teal' ,fontFamily: '宋体'}}>
                            {hasSelected ? `共选中 ${selectedRowKeys.length} 行数据` : ''}
                    </span>
                </div>
                {/* 表格 */}
                <div>
                    <Table rowKey={record => record.id} rowSelection={rowSelection} columns={columns} dataSource={orderdetaileds} />
                </div>
                {JSON.stringify(form)}
            </div>
        )
    }
}
export default Orderdetailed;