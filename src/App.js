import React from "react";
import './App.less';
import './css/main.css';
import {
  // HashRouter 能够在不改变真实网络请求地址的情况下做到页面切换
  // 比如 http://localhost/#/login，在刷新的时候还是对http://localhost/ 做网络请求
  // #/login 部分被浏览器解析成一个页面内跳转标签
  HashRouter as Router,
  // BrowserRouter 就会和文件夹一样，需要保证后端静态文件请求到的是同一部分静态文件
  // 比如对 /login /regist 都后端重定向到 / 才行
  // BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined, BarChartOutlined } from '@ant-design/icons';
import { Button } from "antd/lib/radio";
import api from "./api/api";
import Problems from "./pages/Problems";
import Results from "./pages/Results";
import { getHistory } from "./utils/utils";
import Myself from "./pages/Myself";
import About from "./pages/About";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;


const App = () => {
  const hashNow = window.location.hash.slice(2);
  const defaultPage = 'problems';
  if (hashNow === '') {
    getHistory().push(defaultPage);
  }
  const pageNow = hashNow === '' ? defaultPage : hashNow;

  return (
    <Router>
      <Layout>
        <Header className="header">
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[pageNow]} onClick={e => {
            getHistory().push(e.key);
          }}>
            <Menu.Item key="problems">题目</Menu.Item>
            <Menu.Item key="results">评测记录</Menu.Item>
            <Menu.Item key="myself">我的</Menu.Item>
            <Menu.Item key="about">关于</Menu.Item>
          </Menu>
        </Header>
        <Switch>
          {/* <Route path="/">
            
          </Route> */}
          <Route path="/problems" component={Problems} />
          <Route path="/results" component={Results} />
          <Route path="/myself" component={Myself} />
          <Route path="/about" component={About} />
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
