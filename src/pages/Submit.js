import { Input } from "antd";
import React from "react";
import api from "../api/api";
import Editor from "../components/Editor"
import { objectUpdate } from "../utils/utils";

const Submit = (props) => {
  const [state, setInnerState] = React.useState({
    problemId: "1001",
    result: null
  });
  const setState = (update) => setInnerState(objectUpdate(state, update));
  return <div>
    <Input placeholder="题目序号" value={state.problemId} onChange={e => {
      setState({ problemId: e.target.value });
    }}></Input>
    <div>Code (verilog):</div>
    <Editor onChange={value => { }} onSubmit={async value => {
      console.log(value);
      const resp = await api.request('judge', "POST", {
        question_id: parseInt(state.problemId),
        code: value
      });
      const oid = resp._id['$oid'];
      console.log('oid', oid);
      const resp2 = await api.request('queue', "GET");
      console.log(resp2);
    }} onSave={value => { }}></Editor>
  </div>;
};

export default Submit;