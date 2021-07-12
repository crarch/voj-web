import React from "react";
import './App.less';
import './css/main.css';
import { Layout, Menu, Breadcrumb, Button, Space } from 'antd';
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

const { Header, Content, Footer } = Layout;

// function App() {
//   return (
//     // <Layout className="layout">
//     //   <Header>
//     //     <div className="logo" />
//     //     <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
//     //       {new Array(15).fill(null).map((_, index) => {
//     //         const key = index + 1;
//     //         return <Menu.Item key={key}>{`nav ${key}`}</Menu.Item>;
//     //       })}
//     //     </Menu>
//     //   </Header>
//     //   <Content style={{ padding: '0 50px' }}>
//     //     <Breadcrumb style={{ margin: '16px 0' }}>
//     //       <Breadcrumb.Item>Home</Breadcrumb.Item>
//     //       <Breadcrumb.Item>List</Breadcrumb.Item>
//     //       <Breadcrumb.Item>App</Breadcrumb.Item>
//     //     </Breadcrumb>
//     //     <div className="site-layout-content">Content</div>
//     //   </Content>
//     //   <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
//     // </Layout>
//     <div>
//       <Button>TEST</Button>
//     </div>
//   );
// }

const App = () => {
  return <div>
    {/* <Alert message="Ant Design 测试" type="success" /> */}
    {/* 单页切换功能需要在 <Router/> 组件内 */}
    <Router>
      {/* <Space/> 功能是为包括的组件之间添加合适的间隔 */}
      <Space>
        {/* <Link/> 是单页跳转链接，鼠标点击切换单页应用页面 */}
        {/* 当然也有直接用 js 方法切换的方法 */}
        导航：<Link to={'/'}>主页</Link><Link to={'/regist'}>注册</Link>
      </Space>
      <main>
        {/* 单页切换的内容就在 <Switch/> 内进行切换 */}
        <Switch>
          {/* exact={true} 表示只有当 url 完全等于 path 的时候才会加载这个页面 */}
          {/* 如果 exact={false}，以这个 path 开头的部分也会加载而不显示，加载相关代码会被执行 */}
          <Route path={"/"} exact={true}>
            {/* 这里可以直接写也可以引入其他页面 */}
            <div>
              <h1>主页</h1>
              <p>
                段落测试
              </p>
            </div>
          </Route>
          <Route path={"/regist"} exact={true}>
            {/* <Regist></Regist> */}
            <Button>Test</Button>
          </Route>
        </Switch>
      </main>
    </Router>
  </div>
};

export default App;
