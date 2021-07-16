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
import { Layout, Menu, Breadcrumb, message, Alert } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined, BarChartOutlined } from '@ant-design/icons';
import { Button } from "antd/lib/radio";
import Problems from "./pages/Problems";
import Results from "./pages/Results";
import { getHistory } from "./utils/utils";
import Myself from "./pages/Myself";
import About from "./pages/About";
import Submit from "./pages/Submit";
import store from "./data/store";
import { setErrorInfo, setMessage, setConfig } from "./data/action";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;


let subscribers = {};
let last_data = {
  config: null
};

store.subscribe(async () => {
  let state = store.getState();
  // console.log('redux update to', state);
  // 保存 config
  if (state.config.data) {
    if (JSON.stringify(state.config.data) !== JSON.stringify(last_data.config)) {
      // console.log('Config will change:', state.config.data);
      state.config.save();
      // if (store.getState().user && store.getState().config.data.settings_async) {
      //   await api.request('sync', 'POST', { config: state.config.data });
      // }
    } else {
      // console.log('Not change:', state.config.data);
    }
    last_data.config = state.config.data;
  }
  for (let subFunc in subscribers) {
    subscribers[subFunc](state);
  }
});

const App = () => {
  const hashNow = window.location.hash.slice(2);
  const defaultPage = 'problems';
  if (hashNow === '') {
    getHistory().push(defaultPage);
  }
  const pageNow = hashNow === '' ? defaultPage : hashNow;
  const [errorInfoData, setErrorInfoData] = React.useState(null);
  const [myMessage, setMyMessage] = React.useState(null);

  // 注册一个当遇到错误的时候调用的钩子，用来显示错误信息
  subscribers['Error'] = function (state) {
    if (state.errorInfo) {
      console.log('Error Hook: ', state.errorInfo);
      setErrorInfoData(state.errorInfo);
      // 清空错误信息
      store.dispatch(setErrorInfo(null));
    }
  };
  // 注册一个消息钩子
  subscribers['Message'] = function (state) {
    if (state.message) {
      console.log('message: ', state.message);
      // setMyMessage(state.message);
      message.info(state.message);
      store.dispatch(setMessage(null));
    }
  };

  return (
    <div style={{ height: "100%" }}>
      {errorInfoData ? <Alert
        message="Error"
        description={`${errorInfoData}`}
        type="error"
        showIcon
        closable
        onClose={() => {
          setErrorInfo(null);
        }}
      /> : null}
      <Router>
        <Layout style={{ height: "100%" }}>
          <Header className="header">
            <div className="logo" />
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[pageNow]} onClick={e => {
              getHistory().push(e.key);
            }}>
              <Menu.Item key="problems">题目</Menu.Item>
              <Menu.Item key="submit">提交(调试)</Menu.Item>
              <Menu.Item key="results">评测记录</Menu.Item>
              <Menu.Item key="myself">我的</Menu.Item>
              <Menu.Item key="about">关于</Menu.Item>
            </Menu>
          </Header>
          <Switch>
            <Route path="/problems" component={Problems} />
            <Route path="/submit" component={Submit} />
            <Route path="/results" component={Results} />
            <Route path="/myself" component={Myself} />
            <Route path="/about" component={About} />
          </Switch>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
