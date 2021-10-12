import { LinearProgress, TextField } from "@material-ui/core";
import React from "react";
import api from "../api/api";
import Editor from "../components/Editor"
import { objectUpdate, saveCode, sleep } from "../utils/utils";
import Wavedrom from "wavedrom";
import store from "../data/store";
import { setMessage } from "../data/action";
import { Alert, AlertTitle } from "@material-ui/lab";

const Submit = (props) => {
  const [state, setInnerState] = React.useState({
    problemId: props.problemId || "1001",
    result: null,
    mode: "writing",
    errorMessage: null,
    respData: null
  });
  const [myMessage, setMyMessage] = React.useState(null);
  const setState = (update) => setInnerState(objectUpdate(state, update));
  const refs = [React.useRef(), React.useRef(), React.useRef(), React.useRef(), React.useRef(), React.useRef(), React.useRef(), React.useRef(), React.useRef(), React.useRef()];

  const problemId = props.problemId || state.problemId;
  // console.log('problemId', problemId, props.problemId, state.problemId);
  // console.log("respData", state.respData);

  const testBench = state.respData && state.respData.test_bench;
  console.log("mode", state.mode);
  const isSuccess = state.respData && state.respData.success;
  let stateContent = null;
  if (state.mode === "writing") {
    stateContent = null;
  } else if (state.mode === "submitting") {
    stateContent = <LinearProgress color="primary" variant="determinate" value={30} />;
  } else if (state.mode === "error") {
    stateContent = <LinearProgress color="secondary" variant="determinate" value={100} />;
  } else if (state.mode === "success") {
    stateContent = <LinearProgress color="primary" variant="determinate" value={100} />;
  }
  return <div>
    {stateContent ? <div>{stateContent}<br /></div> : null}
    {props.problemId ? null : <TextField fullWidth variant="outlined" placeholder="题目序号" value={state.problemId} onChange={e => {
      setState({ problemId: e.target.value });
    }}></TextField>}
    {/* <div>Code (verilog):</div> */}
    <Editor defaultValue={props.codeDefault || `\`timescale 1ns/1ps
module top_module(output reg a);
  initial begin
    a <= 1'b0;
    #1000
    a <= 1'b1;
  end
endmodule`} problemId={problemId} onChange={value => { }} requesting={state.mode === "submitting"} onSubmit={async value => {
        console.log(value);
        setState({ mode: "submitting", errorMessage: null });
        const resp = await api.request('judge', "POST", {
          question_id: parseInt(problemId),
          code: value
        });
        if (!resp._id) {
          setState({ mode: "error", errorMessage: "找不到题目" });
          return;
        }
        const oid = resp._id['$oid'];
        console.log('oid', oid);
        let isSuccess_ = false;
        let testBench_ = null;
        let resp2 = null;
        await sleep(100);
        do {
          resp2 = await api.request_key('judge/record', oid, "GET");
          console.log(resp2);
          isSuccess_ = resp2.success;
          testBench_ = resp2.test_bench;
          if (isSuccess_ === false) {
            console.log(resp2.test_bench);
          }
          if (testBench_) {
            if (testBench_.compile_error) {
              setState({ mode: "error", errorMessage: testBench_.compile_error, respData: resp2 });
              setMyMessage({
                type: 'error',
                text: "编译错误。"
              });
            } else if (testBench_.error) {
              setState({ mode: "error", errorMessage: testBench_.error, respData: resp2 });
              setMyMessage({
                type: 'error',
                text: `发生错误：${testBench_.error}`
              });
            } else {
              if (isSuccess_) {
                setState({ mode: "success", errorMessage: null, respData: resp2 });
                setMyMessage({
                  type: 'success',
                  text: "恭喜你完成了这道题目！"
                });
              } else {
                setState({ mode: "unaccepted", errorMessage: null, respData: resp2 });
                console.log(testBench_);
                for (const testName in testBench_) {
                  Wavedrom.renderWaveElement(null, testBench_[testName], refs[parseInt(testName)].current, Wavedrom.waveSkin);
                }
                Wavedrom.processAll();
                setMyMessage({
                  type: 'warning',
                  text: "答案不正确。"
                });
              }
            }
          }
          await sleep(1000);
        } while (isSuccess_ === undefined);
        // setState({ respData: resp2 });
      }} onSave={value => {
        saveCode(problemId, value);
      }}></Editor>
    <br /><br />
    {(myMessage && myMessage.type) ? <Alert severity={myMessage.type} onClose={() => setMyMessage(null)}>
      <AlertTitle>{myMessage.title ? myMessage.title : myMessage.type}</AlertTitle>
      <span style={{ minWidth: 250, display: "block" }}>{myMessage.text}</span>
    </Alert> : null}
    <br /><br />
    {state.errorMessage ? <div style={{ overflowX: "auto" }}><pre style={{ color: 'red' }}><code>{state.errorMessage}</code></pre></div> : null}
    {state.mode === "unaccepted" ? <>
      {testBench && Object.keys(testBench).map((v, k) => {
        if (v === "") {
          return <>passed</>;
        } else {
          return <div className="WaveDrom" style={{ overflowX: "auto" }} ref={refs[k]}></div>;
        }
      })}
    </> : null}
  </div>;
};


export default Submit;