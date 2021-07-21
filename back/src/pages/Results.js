import { Alert, Divider, Spin, Typography } from "antd";
import { List } from "antd/lib/form/Form";
import React from "react";
import api from "../api/api";
import { setResults } from "../data/action";
import store from "../data/store";
import { isIterator, objectUpdate } from "../utils/utils";

const Results = () => {
  const results = store.getState().results || [];
  const [state, setInnerState] = React.useState({
    requesting: false
  });
  const setState = (update) => setInnerState(objectUpdate(state, update));
  const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0);

  const loadingContent = <Spin tip="Loading results..."></Spin>;

  if ((!results || (results && results.length === 0))) {
    if (!state.requesting) {
      setState({ requesting: true });
      (async () => {
        const resp = await api.request_key("judge/record/page", 1, "GET");
        console.log(resp);
        if (!isIterator(resp)) return;
        store.dispatch(setResults(resp));
        forceUpdate();
      })();
    }
    return loadingContent;
  }

  const data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
  ];

  // return <List
  //   // itemLayout="horizontal"
  //   bordered
  //   dataSource={data}
  //   renderItem={item => (
  //     <List.Item>
  //       {/* <List.Item.Meta
  //         // avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
  //         title={<a href="https://ant.design">{"dfsaadsf"}</a>}
  //         description="Ant Design, a design language for background applications, is refined by Ant UED Team"
  //       /> */}
  //       {item}
  //     </List.Item>
  //   )}>

  // </List>;

  return <>
    <Divider orientation="left">Default Size</Divider>
    <List
      header={<div>Header</div>}
      footer={<div>Footer</div>}
      bordered
      dataSource={data}
      renderItem={item => (
        <List.Item>
          <Typography.Text mark>[ITEM]</Typography.Text> {item}
        </List.Item>
      )}
    />
    <Divider orientation="left">Small Size</Divider>
    <List
      size="small"
      header={<div>Header</div>}
      footer={<div>Footer</div>}
      bordered
      dataSource={data}
      renderItem={item => <List.Item>{item}</List.Item>}
    />
    <Divider orientation="left">Large Size</Divider>
    <List
      size="large"
      header={<div>Header</div>}
      footer={<div>Footer</div>}
      bordered
      dataSource={data}
      renderItem={item => <List.Item>{item}</List.Item>}
    />
  </>;
};

export default Results;