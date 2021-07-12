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

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;


const App = () => {
  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">题目</Menu.Item>
          <Menu.Item key="2">评测记录</Menu.Item>
          <Menu.Item key="3">我的</Menu.Item>
          <Menu.Item key="4">关于</Menu.Item>
        </Menu>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['problem-set-1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <SubMenu key="problem-set-1" icon={<UserOutlined />} title="Verilog基础">
              <Menu.Item key="1">option1</Menu.Item>
              <Menu.Item key="2">option2</Menu.Item>
              <Menu.Item key="3">option3</Menu.Item>
              <Menu.Item key="4">option4</Menu.Item>
            </SubMenu>
            <SubMenu key="problem-set-2" icon={<LaptopOutlined />} title="组合逻辑电路">
              <Menu.Item key="5">option5</Menu.Item>
              <Menu.Item key="6">option6</Menu.Item>
              <Menu.Item key="7">option7</Menu.Item>
              <Menu.Item key="8">option8</Menu.Item>
            </SubMenu>
            <SubMenu key="problem-set-3" icon={<NotificationOutlined />} title="时序逻辑电路">
              <Menu.Item key="9">option9</Menu.Item>
              <Menu.Item key="10">option10</Menu.Item>
              <Menu.Item key="11">option11</Menu.Item>
              <Menu.Item key="12">option12</Menu.Item>
            </SubMenu>
            <SubMenu key="problem-set-4" icon={<BarChartOutlined />} title="其他">
              <Menu.Item key="13">option9</Menu.Item>
              <Menu.Item key="14">option10</Menu.Item>
              <Menu.Item key="15">option11</Menu.Item>
              <Menu.Item key="16">option12</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>题目列表</Breadcrumb.Item>
            <Breadcrumb.Item>Verilog基础</Breadcrumb.Item>
            <Breadcrumb.Item>P1001</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <Button onClick={async function() {
              const resp = await api.request("version", "GET");
              console.log(resp);
            }}>
              测试
            </Button>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default App;
