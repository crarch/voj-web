import { Alert, Button, Divider, Input, Progress, Result, Select, Spin, Typography } from "antd";
import { Content } from "antd/lib/layout/layout";
import { LoadingOutlined } from '@ant-design/icons';
import Paragraph from "antd/lib/typography/Paragraph";
import Title from "antd/lib/typography/Title";
import { sha256 } from "js-sha256";
import React from "react";
import api from "../api/api";
import Container from "../components/Container";
import Constants from "../config/Constants";
import { getMailHost, objectUpdate } from "../utils/utils";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

// 自定义组件，如果 open 为真则在 dom 中加载对应内容
function If(props) {
  const { open, children, style } = props;
  return <div style={open ? style : Object.assign({ display: "none" }, style && {})}>{children}</div>;
}

// 自定义组件，如果 open 为真则调整不透明度使组件可见
function IfShow(props) {
  const { open, children, style } = props;
  return <div style={open ? style : Object.assign({ opacity: 0 }, style && {})}>{children}</div>;
}

// 密码逻辑检查函数
function passwordCheck(password) {
  if (password.length < 8) return false;
  return true;
}

// 逻辑检查函数
function valueCheck(valueType, value) {
  if (!value) return false;
  if (typeof (valueType === 'string')) {
    if (valueType === 'password') {
      return passwordCheck(value);
    } else if (valueType === 'securityCode') {
      return /^[0-9]{6}$/.test(value);
    } else if (valueType === 'phone') {
      return /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/.test(value);
    } else if (valueType === 'email') {
      if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value))
        return false;
      if (Constants.authorizedEmailProviders.indexOf(getMailHost(value)) === -1)
        return false;
      return true;
    } else if (valueType === 'username') {
      return /^[a-zA-Z0-9_-]{3,15}$/.test(value);
    } else if (valueType === 'captcha') {
      return /^[a-z0-9]{6}$/.test(value);
    }
  } else {
    for (const type of Object.keys(valueType))
      if (!valueCheck(type, valueType[type]))
        return false;
    return true;
  }
}

function getPassCode(password) {
  return sha256.update(`CrosStPass${password}CrosStPass`).hex();
}

export default function Regist(props) {
  const [title, setTitle] = React.useState((() => {
    const t = '注册十字街账号 - 十字街';
    document.title = t;
    return t;
  })());
  // 默认变量状态
  // 由于每一次更新 dom，这个函数都会被执行，所以需要使用 React 的 state 变量保存变量信息
  // 在函数内的直接变量一般都会使用 const，是考虑性能的原因
  const defaultState = {
    username: 'chiro',
    email: 'chiro2001@163.com',
    phone: '17166775545',
    useEmail: true,
    nick: 'Chiro',
    password: '1352040930',
    passwordRepeate: '1352040930',
    captcha: '',
    securityCode: '',
    inviteCode: 'invite',
    stage: 1,   // 当前注册阶段
    stageAll: 3,
    requesting: false,
    responseStage1: null,
    responseStage2: null,
    responseStage3: null,
    messageInfo: null,
    regPolicy: null,
    requestingRegPolicy: false,
  };
  // const defaultState = {
  //   username: '',
  //   email: '',
  //   phone: '',
  //   useEmail: true,
  //   nick: '',
  //   password: '',
  //   passwordRepeate: '',
  //   captcha: '',
  //   inviteCode: '',
  //   stage: 1,   // 当前注册阶段
  //   stageAll: 3,
  //   requesting: false,
  // };
  // React 定义变量的方式如下：
  // const [变量名, 设置变量函数] = React.useState(默认值);
  const [state, setInnerState] = React.useState(defaultState);
  // 在这里自定义一个 setState，对于 state 内的部分数据做部分更新而不是全部替换
  // 方便变量使用（但是部分影响性能
  const setState = (update) => setInnerState(objectUpdate(state, update));
  const setRequesting = (now) => { setState({ requesting: (now === undefined ? true : now) }); };

  // 请求注册状态
  if (state.regPolicy === null && !state.requestingRegPolicy) {
    setState({ regPolicy: undefined, requestingRegPolicy: true });
    (async () => {
      let resp = await api.request("crs", {}, 'GET');
      // resp.regPolicy = 3;
      if (resp.regPolicy !== undefined) {
        if (resp.regPolicy === 1 || resp.regPolicy === 2)
          setState({ regPolicy: resp.regPolicy, useEmail: false });
        else
          setState({ regPolicy: resp.regPolicy });
      }
    })();
  }

  // 网络请求负责函数
  const handleNextStage = async () => {
    if (state.stage === 1) {
      setRequesting(true);
      const resp = await api.request("rs1", Object.assign({
        username: state.username,
        nickname: state.nick,
        deviceID: ""
      }, state.useEmail ? { email: state.email } : { phone: state.phone }), 'POST', '', false);
      // console.log(resp);
      setRequesting(false);
      if (!(resp.sessionID && resp.captcha)) {
        setState({ messageInfo: { msg: resp.msg || "Unkown Error", type: "error" } });
        return;
      }
      setState({ stage: 2, responseStage1: resp, messageInfo: null });
    } else if (state.stage === 2) {
      setRequesting(true);
      const resp = await api.request("rs2", {
        sessionID: state.responseStage1.sessionID,
        captcha: state.captcha.toLocaleLowerCase(),
      }, 'POST', '', false);
      console.log(resp);
      setRequesting(false);
      if (JSON.stringify(resp) !== '{}') {
        setState({ messageInfo: { msg: resp.msg || "Unkown Error", type: "error" } });
        return;
      }
      setState({ stage: 3, responseStage2: resp, messageInfo: null });
    } else if (state.stage === 3) {
      setRequesting(true);
      const passCode = getPassCode(state.password);
      console.log('passCode', passCode);
      const resp = await api.request("rs3", {
        sessionID: state.responseStage1.sessionID,
        passcode: passCode,
        securityCode: state.securityCode
      }, 'POST', '', false);
      console.log(resp);
      setRequesting(false);
      if (!resp.cookie) {
        setState({ messageInfo: { msg: resp.msg || "Unkown Error", type: "error" } });
        return;
      }
      setState({ stage: 4, responseStage3: resp, messageInfo: null });
    }
  };

  const stageData = (state.stage === 1 ? <div>
    {/* 第一阶段 */}
    <div>
      <div>
        <IfShow open={state.username !== ''}><span>用户名</span></IfShow>
        <Input placeholder="用户名" value={state.username} onChange={e => {
          setState({ username: e.target.value });
        }}></Input>
        <If open={state.username !== '' && !valueCheck('username', state.username)}>
          <Alert type="error" message="用户名不满足格式要求"></Alert>
        </If>
      </div>
    </div>
    <div>
      <div>
        <IfShow open={state.nick !== ''}>
          <span>昵称</span>
        </IfShow>
        <Input placeholder="昵称" value={state.nick} onChange={e => {
          setState({ nick: e.target.value });
        }}></Input>
      </div>
    </div>
    <div>
      <IfShow open={false && (state.useEmail ? (state.email !== '') : (state.phone !== ''))}>
        {state.useEmail ? <span>邮箱</span> : <span>手机</span>}
      </IfShow>
      <Input.Group compact>
        <Select style={{ width: "20%", display: (state.regPolicy === 1 || state.regPolicy === 2) ? "none" : null }} defaultValue={defaultState.useEmail ? "email" : "phone"} onChange={e => {
          // console.log(e);
          setState({ useEmail: e === 'email' });
        }}>
          <Select.Option value="email">邮箱</Select.Option>
          <Select.Option value="phone">手机</Select.Option>
        </Select>
        <Input style={{ width: (state.regPolicy === 1 || state.regPolicy === 2) ? "100%" : "80%" }} placeholder={state.useEmail ? "邮箱" : "手机"} value={state.useEmail ? state.email : state.phone} onChange={e => {
          state.useEmail ?
            setState({ email: e.target.value }) :
            setState({ phone: e.target.value });
        }}></Input>
      </Input.Group>
      <If open={state.useEmail ?
        (state.email !== '' && !valueCheck('email', state.email)) :
        (state.phone !== '' && !valueCheck('phone', state.phone))}>
        <Alert type="error" message={(state.useEmail ? "邮箱" : "手机") + "不满足格式要求"}></Alert>
      </If>
    </div>
  </div> : (state.stage === 2 ?
    <div>
      {/* 第二阶段 */}
      <IfShow>
        <span>占位置的</span>
      </IfShow>
      <div className="center">
        <img src={`data:image/gif;base64,${state.responseStage1.captcha}`}></img>
      </div>
      <div>
        <IfShow open={state.captcha !== ''}>
          <span>图形验证码</span>
        </IfShow>
        <Input placeholder="图形验证码" value={state.captcha} onChange={e => {
          setState({ captcha: e.target.value });
        }}></Input>
        <If open={state.captcha !== '' && !valueCheck('captcha', state.captcha)}>
          <Alert type="error" message="验证码不满足格式要求"></Alert>
        </If>
      </div>
    </div> : (state.stage === 3 ? <div>
      {/* 第三阶段 */}
      <div>
        <div>
          <IfShow open={state.securityCode !== ''}>
            <span>{state.useEmail ? "邮箱" : "手机"}验证码</span>
          </IfShow>
          <Input placeholder="输入收到的验证码" value={state.securityCode} onChange={e => {
            setState({ securityCode: e.target.value });
          }}></Input>
          <If open={state.securityCode !== '' && !valueCheck('securityCode', state.securityCode)}>
            <Alert type="error" message="验证码格式不正确"></Alert>
          </If>
        </div>
        <div>
          <IfShow open={state.password !== ''}>
            <span>密码</span>
          </IfShow>
          <Input type="password" placeholder="密码" value={state.password} onChange={e => {
            setState({ password: e.target.value });
          }}></Input>
          <If open={state.password !== '' && !valueCheck('password', state.password)}>
            <Alert type="error" message="密码不满足要求"></Alert>
          </If>
        </div>
      </div>
      <div>
        <div>
          <IfShow open={state.passwordRepeate !== ''}>
            <span>再次输入密码</span>
          </IfShow>
          <Input type="password" placeholder="再次输入密码" value={state.passwordRepeate} onChange={e => {
            setState({ passwordRepeate: e.target.value });
          }}></Input>
          <If open={state.passwordRepeate !== '' && state.passwordRepeate !== state.password}>
            <Alert type="error" message="两次输入密码不一致"></Alert>
          </If>
        </div>
      </div>
      <div>
        <div>
          <IfShow open={state.inviteCode !== ''}>
            <span>邀请码</span>
          </IfShow>
          <Input placeholder={"邀请码" + (state.regPolicy === 2 ? "(必须输入)" : "(可选)")} value={state.inviteCode} onChange={e => {
            setState({ inviteCode: e.target.value });
          }}></Input>
        </div>
      </div>
    </div> : <Result
      // 第四阶段
      status="success"
      title="恭喜你成功注册十字街！"
      subTitle="欢迎来到十字街，一起来无拘无束地聊天吧。"
      extra={[
        <Button key={1} type="secondary">回到主页</Button>,
        <Button key={2} type="primary">去登录</Button>,
      ]}
    />)));
  return <Container maxWidth="sm">
    <Container maxWidth="lg" style={{ background: "rgba(0, 0, 0, 0.5)" }}>
      <Typography>
        <Title className="center">注册十字街账号</Title>
        <IfShow open={state.stage <= 3 && state.regPolicy !== 3}>
          <Paragraph>注册十字街账号后，您可以更方便地使用十字街，并可以通过十字街登录其他受支持的服务。</Paragraph>
        </IfShow>
      </Typography>

      <IfShow open={state.stage <= 3 && state.regPolicy !== 3}>
        <div className="landscape">
          <Progress strokeLinecap="square" percent={100 * state.stage / state.stageAll} showInfo={false}></Progress>
          <span className="single-line">第{state.stage}步，共{state.stageAll}步</span>
        </div>
      </IfShow>
      <br />
      {state.messageInfo ? <Alert message={state.messageInfo.msg} type={state.messageInfo.type} showIcon /> : null}

      {(state.regPolicy === null || state.regPolicy === undefined) ? <div className="center">
        <span>获取注册状态</span><Spin indicator={antIcon} />
      </div> : (state.regPolicy === 3 ? <div>
        <Result
          status="error"
          title="注册失败！"
          subTitle="十字街目前禁止注册，对于造成您的困扰我们表示抱歉。"
          extra={[
            <Button key={1} type="secondary">回到主页</Button>
          ]}
        />
      </div> : stageData)}
      <IfShow open={state.stage <= 3 && state.regPolicy !== 3}>
        <div className="landscape" style={{ marginTop: "6%" }}>
          <If open={state.stage !== 1}>
            <Button
              disabled={state.requesting || !(state.stage <= 3 && state.regPolicy !== 3)}
              onClick={() => {
                setState({ stage: (state.stage === 1) ? 1 : (state.stage - 1) });
              }}>上一步</Button>
          </If>
          <Button
            disabled={state.requesting || !(state.stage <= 3 && state.regPolicy !== 3)}
            style={{ width: state.stage === 1 ? "100%" : "100%" }}
            onClick={handleNextStage}>
            {state.stage === state.stageAll ? "确认注册" : "下一步"}
            {state.requesting ? <Spin indicator={antIcon} /> : null}
          </Button>
        </div>
      </IfShow>
    </Container>
  </Container>;
}
