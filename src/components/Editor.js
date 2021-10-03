import { Button, Select, MenuItem } from '@material-ui/core';
import moment from 'moment';
import React from 'react';
import CodeMirror from 'react-codemirror';
import { delCode, loadCode, loadCodeIndex, objectUpdate } from '../utils/utils';
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
      {selected !== 0 ? <>
        <Button style={{ marginRight: 10 }} color="primary" variant="outlined" onClick={() => {
          const code = loadCode(problemId, selected);
          console.log('code', code, setValue);
          setValue && setValue(code);
          forceUpdate();
        }}>加载代码</Button>
        <Button style={{ marginRight: 10 }} color="secondary" variant="outlined" onClick={() => {
          delCode(problemId, selected);
          setSelected(0);
          forceUpdate();
        }}>删除已保存代码</Button></> : null}
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
    // codeValue: defaultValue || '',
    options: {
      lineNumbers: true,
      mode: 'verilog',
      // autoFocus: true,
      // autoSave: true
    }
  };
  const [codeValue, setCodeValue] = React.useState(defaultValue || '');
  const [state, setInnerState] = React.useState(defaultState);
  const setState = (update) => setInnerState(objectUpdate(state, update));
  const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0);

  // console.log(state.codeValue);

  const handleChange = (value, other) => {
    // console.log(value);
    // console.log('other', other);
    // setState({ codeValue: value });
    setCodeValue(value);
    forceUpdate();
  };

  // console.log('code now', state.codeValue);

  // TODO: 修复储存的代码插入失败
  return <div>
    {/* <EditorBar {...props} value={state.codeValue} setValue={handleChange}></EditorBar>
    <CodeMirror onChange={handleChange} value={state.codeValue} options={state.options}></CodeMirror>
    <code>{state.codeValue}</code> */}
    <EditorBar {...props} value={codeValue} defaultValue={defaultValue || ''} setValue={handleChange}></EditorBar>
    <CodeMirror onChange={handleChange} value={codeValue} options={state.options}></CodeMirror>
    {/* <code>{codeValue}</code> */}
  </div>;
};

export default Editor;