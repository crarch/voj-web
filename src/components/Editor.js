import React from 'react';
import { Button, Space } from 'antd';
import CodeMirror from 'react-codemirror';
import { objectUpdate } from '../utils/utils';
require('codemirror/lib/codemirror.css');
require('codemirror/mode/verilog/verilog');

const EditorBar = (props) => {
  const { onSave, onSubmit, onCheck, value } = props;
  return <div>
    <div className="landspace">
      <Space>
        <Button onClick={() => { onSave && onSave(value); }}>保存代码</Button>
        <Button onClick={() => { onSubmit && onSubmit(value); }}>提交评测</Button>
      </Space>
    </div>
  </div>;
};

const Editor = (props) => {
  const { onSave, onSubmit, onCheck, onKeyDown } = props;
  const defaultState = {
    codeValue: '',
    options: {
      lineNumbers: true,
      mode: 'verilog',
      autoFocus: true,
      autoSave: true
    }
  };
  const [state, setInnerState] = React.useState(defaultState);
  const setState = (update) => setInnerState(objectUpdate(state, update));

  const handleChange = value => {
    setState({ codeValue: value });
  };

  return <div>
    <EditorBar {...props} value={state.codeValue}></EditorBar>
    <CodeMirror onChange={handleChange} value={state.codeValue} options={state.options}></CodeMirror>
  </div>;
};

export default Editor;