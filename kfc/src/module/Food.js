import React from 'react';
import $ from 'jquery';
import {Table, Divider} from 'antd';
import { Button, Modal, Form, Input } from 'antd';

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  class extends React.Component {

    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="添加食物"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">


          <Form.Item label="">
              {getFieldDecorator('id',{initialValue: null})(<Input type="hidden" />)}
            </Form.Item>


      
            <Form.Item label="食品名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '这里不可以为空' }],
              })(<Input placeholder={"name"}/>)}
            </Form.Item>
            <Form.Item label="食品描述">
              {getFieldDecorator('description')(<Input type="textarea" />)}
            </Form.Item>
            <Form.Item label="食品价格">
              {getFieldDecorator('price')(<Input type="textarea" />)}
            </Form.Item>
            <Form.Item label="食品图片">
              {getFieldDecorator('photo')(<Input type="textarea" />)}
            </Form.Item>
            <Form.Item label="食品状态">
              {getFieldDecorator('status')(<Input type="textarea" />)}
            </Form.Item>
            <Form.Item label="食品销量">
              {getFieldDecorator('xiaoliang')(<Input type="textarea" />)}
            </Form.Item>
            <Form.Item label="食品分类">
              {getFieldDecorator('category_id')(<Input type="textarea" />)}
            </Form.Item>
            
          </Form>
        </Modal>
      );
    }
  },
);


class Food extends React.Component{

constructor(){
    super();
    this.state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    visible: false,
    product:[],
    }
  }

componentDidMount(){
	this.load();
  }

  load(){
    $.get("http://127.0.0.1:9999/Product/findAll",({status,message,data})=>{
      if(status === 200){
        // 将查询数据设置到state中
        this.setState({ "product":data })
      } else {alert (message)}
    })
  }

  showModal = (record,selectedRowKeys) => {
    this.setState({ visible: true });
    this.handleSelectChange(record);
  };

  handleSelectChange = (value) => {
      console.log(value);
      // 删除form表单里的提交，用ok取代。
      this.formRef.props.form.setFieldsValue({
        id: value.id,
        name: value.name,
        description: value.description,
        price: value.price,
        photo: value.photo,
        status: value.status,
        xiaoliang: value.xiaoliang,
        category_id: value.category_id,
      });
    };

  handleCancel = () => {
    this.setState({ visible: false });
  };



  saveFormRef = (formRef) => {
    this.formRef = formRef;
  };

handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log('form:',values);
      let url = "http://127.0.0.1:9999/Product/saveOrUpdate"
    $.post(url,values,({message})=>{
      alert(message);
      this.load();
      })
      form.resetFields();
      this.setState({ visible: false });
    });

  };

  start = () => {
    this.setState({ loading: true });

    let url="http://127.0.0.1:9999/Product/batchDelete";
    $.ajax({
        url:url,
        method:'POST',
        processData:false,
        contentType:'application/json',
        data:JSON.stringify(this.state.selectedRowKeys),
        success:({message})=>{
            alert(message)
            this.load();
        }
    })

    setTimeout(() => {
      this.setState({
        //selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  };
  
  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };


delete(record){
	let url = 'http://127.0.0.1:9999/Product/Delete?id='+record.id;
    $.get(url,({status,message})=>{
      if(status === 200){
        this.load();
      }
      alert(message);
    })
}

render(){
	const columns = [
  {
    title: '食品名称',
    dataIndex: 'name',
  },
  {
    title: '食品描述',
    dataIndex: 'description',
  },
  {
    title: '食品价格',
    dataIndex: 'price',
  },
  {
    title: '食品图片',
    dataIndex: 'photo',
  },
  {
    title: '食品状态',
    dataIndex: 'status',
  },
  {
    title: '食品销量',
    dataIndex: 'xiaoliang',
  },
  {
    title: '食品分类',
    dataIndex: 'category_id',
  },
  {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <Button type="primary" onClick={this.showModal.bind(this,record)}> 更新 </Button>
        <Divider type="vertical" />
        <Button type="primary" onClick={this.delete.bind(this,record)}> 删除 </Button>
      </span>
    ),
  },
];
	const paginations={pageSize:8};
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
	return(
		<div>
		<div style={{ marginBottom: 8}}>
          <Button type="primary" onClick={this.start} disabled={!hasSelected} loading={loading}>
            批量删除
          </Button>
	        <Button type="primary" onClick={this.showModal} style={{ marginLeft: 8}}>
	          添加
	        </Button>
	        <CollectionCreateForm
	          wrappedComponentRef={this.saveFormRef}
	          visible={this.state.visible}
	          onCancel={this.handleCancel}
	          onCreate={this.handleCreate}
	        />
          <span style={{ marginLeft: 4}}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </span>
        </div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.product} pagination={paginations} rowKey={record=>record.id} />
		</div>
		)

	}
}
export default Food;