import React from 'react';
import './App.css';
import Food from './module/Food';
import Order from './module/Order';
import Orderdetailed from './module/Orderdetailed';

import {BrowserRouter,Route,Link,Switch} from 'react-router-dom'
function App() {
  return (
    <div className="App">
    <div className="head">
	      <h1>KFC点餐系统</h1>
    </div>
        <BrowserRouter>
        <div className="container">
        <div className="nav">
        <h2 className="title">KFC点餐系统</h2>
          <ul>
            <li><Link to="/food">点餐管理</Link></li>
            <li><Link to="/order">订单管理</Link></li>
            <li><Link to="/orderdetailed">订单详情管理</Link></li>
          </ul>
        </div>
        <div className="content">
          {/* 配置路由 */}
          <Switch>
            <Route path="/food" component={Food}/>
            <Route path="/order" component={Order}/>
            <Route path="/orderdetailed" component={Orderdetailed}/>
          </Switch>
        </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
