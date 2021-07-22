import { Button, Select, MenuItem } from '@material-ui/core';
import moment from 'moment';
import React from 'react';
import CodeMirror from 'react-codemirror';
import { loadCode, loadCodeIndex, objectUpdate } from '../utils/utils';
require('codemirror/lib/codemirror.css');
require('codemirror/mode/verilog/verilog');

const EditorBar = (props) => {
  const { problemId, onSave, onSubmit, onCheck, value, setValue, requesting } = props;
  const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0);
  const [selected, setSelected] = React.useState(0);
  const codeTimes = loadCodeIndex(problemId);
  // console.log(codeTimes);
  return <div>
    <div className="landscape" style={{ justifyContent: "flex-end" }}>
      <Select style={{ marginRight: 10 }} value={selected} onChange={e => {
        setSelected(e.target.value);
      }}>
        <MenuItem value={0}>无</MenuItem>
        {codeTimes.map(time => <MenuItem value={time} key={time}>{moment(time).calendar()}</MenuItem>)}
      </Select>
      <Button style={{ marginRight: 10 }} disabled={selected === 0} color="primary" variant="outlined" onClick={() => {
        const code = loadCode(problemId, selected);
        // console.log('code', code);
        setValue && setValue(code);
      }}>加载代码</Button>
      <Button style={{ marginRight: 10 }} color="primary" variant="outlined" onClick={() => {
        onSave && onSave(value);
        forceUpdate();
      }}>保存代码</Button>
      <Button color="secondary" variant="contained" onClick={() => { onSubmit && onSubmit(value); }} disabled={requesting}>提交评测</Button>
    </div>
  </div>;
};

const Editor = (props) => {
  const { defaultValue, requesting, problemId, onSave, onSubmit, onCheck, onKeyDown } = props;
  const defaultState = {
    codeValue: defaultValue || '',
    options: {
      lineNumbers: true,
      mode: 'verilog',
      autoFocus: true,
      autoSave: true
    }
  };
  const [state, setInnerState] = React.useState(defaultState);
  const setState = (update) => setInnerState(objectUpdate(state, update));
  const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0);

  // console.log(state.codeValue);

  const handleChange = value => {
    // console.log(value);
    setState({ codeValue: value });
    forceUpdate();
  };

  return <div>
    <EditorBar {...props} value={state.codeValue} setValue={handleChange}></EditorBar>
    <CodeMirror onChange={handleChange} value={state.codeValue} options={state.options}></CodeMirror>
  </div>;
};

export default Editor;