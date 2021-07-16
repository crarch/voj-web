import { LinearProgress, TextField } from "@material-ui/core";
import React from "react";
import api from "../api/api";
import Editor from "../components/Editor"
import { objectUpdate, saveCode, sleep } from "../utils/utils";
import Wavedrom from "wavedrom";

const Submit = (props) => {
  const [state, setInnerState] = React.useState({
    problemId: "1001",
    result: null,
    mode: "writing",
    errorMessage: null,
    waveData: null
  });
  const setState = (update) => setInnerState(objectUpdate(state, update));
  const wavedromRef = React.useRef();
  const wavedromRef2 = React.useRef();

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
    <TextField fullWidth variant="outlined" placeholder="题目序号" value={state.problemId} onChange={e => {
      setState({ problemId: e.target.value });
    }}></TextField>
    <div>Code (verilog):</div>
    <Editor defaultValue={`\`timescale 1ns/1ps
module top_module(output reg a);
  initial begin
    a <= 1'b0;
    #1000
    a <= 1'b1;
  end
endmodule`} problemId={state.problemId} onChange={value => { }} onSubmit={async value => {
      console.log(value);
      setState({ mode: "submitting", errorMessage: null });
      const resp = await api.request('judge', "POST", {
        question_id: parseInt(state.problemId),
        code: value
      });
      if (!resp._id) {
        setState({ mode: "error", errorMessage: "找不到题目" });
        return;
      }
      const oid = resp._id['$oid'];
      console.log('oid', oid);
      let isSucess = false;
      let testBench = null;
      do {
        await sleep(1000);
        const resp2 = await api.request_key('judge/record', oid, "GET");
        console.log(resp2);
        isSucess = resp2.success;
        testBench = resp2.test_bench;
        if (isSucess === false) {
          console.log(testBench);
        }
      } while (isSucess === undefined);
      if (testBench.compile_error) {
        setState({ mode: "error", errorMessage: testBench.compile_error });
      } else {
        setState({ mode: "success", errorMessage: null });
        console.log(testBench);
        Wavedrom.renderWaveElement(null, testBench[0], wavedromRef.current, Wavedrom.waveSkin);
        Wavedrom.renderWaveElement(null, testBench[1], wavedromRef2.current, Wavedrom.waveSkin);
        Wavedrom.processAll();
      }
    }} onSave={value => {
      saveCode(state.problemId, value);
    }}></Editor>
    {state.errorMessage ? <div style={{ overflowX: "auto" }}><pre style={{ color: 'red' }}><code>{state.errorMessage}</code></pre></div> : null}
    {state.mode === "success" ? <><div className="WaveDrom" style={{ overflowX: "auto" }} ref={wavedromRef}></div>
      <div className="WaveDrom" style={{ overflowX: "auto" }} ref={wavedromRef2}></div></> : null}
  </div>;
};

export default Submit;