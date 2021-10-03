import { Accordion, AccordionDetails, Container, AccordionSummary, Button, Grid, List, ListItem, ListSubheader, ListItemText, Typography, ListItemSecondaryAction } from '@material-ui/core';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../api/api';
import problemInfo from '../problems_build/problems.json';
import { getHistory, isIterator, objectUpdate } from '../utils/utils';
import { monokai } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { verilog } from "react-syntax-highlighter/dist/esm/languages/prism";
// import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/default-highlight';
import PropTypes from "prop-types";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import Wavedrom from "wavedrom";
import Submit from './Submit';

// const ProblemList = (props) => {
//   const { data, title, setProblem } = props;
//   if (data.problem) return <Button fullWidth onClick={() => { setProblem && setProblem(data) }}>{title}</Button>;
//   if (!data) return null;
//   return <List>
//     {/* <ListSubheader>{title}</ListSubheader> */}
//     {Object.keys(data).map(v => (data[v].problem ?
//       <ProblemList key={v} data={data[v]} title={v} setProblem={setProblem}></ProblemList> :
//       <ListItem key={v} style={{ padding: 0 }}>
//         <Accordion key={v} style={{ width: "100%" }}>
//           <AccordionSummary>{v}</AccordionSummary>
//           <AccordionDetails style={{ padding: 0 }}><ProblemList data={data[v]} title={v} setProblem={setProblem}></ProblemList></AccordionDetails>
//         </Accordion>
//       </ListItem>))}
//   </List>;
// }

const ProblemList = (props) => {
  const { data, setProblem, passedId } = props;
  const passed = (passedId && passedId.reduce(function (target, key, index) {
    target[key] = true;
    return target;
  }, {})) || {};
  const [expand, setExpand] = React.useState({});
  return <>
    {data.problem_set.map((problemSet, k) => <Accordion expanded={expand[k] === undefined || expand[k] === true}
      key={JSON.stringify(problemSet)}
      onChange={(e, expanded) => {
        // expand[k] = expanded;
        setExpand(objectUpdate(expand, { [k]: expanded }));
      }}>
      <AccordionSummary>{problemSet.name}</AccordionSummary>
      <AccordionDetails>
        <List style={{ width: "100%" }}>
          {problemSet.problems.map(problem => <ListItem fullWidth key={JSON.stringify(problem)} button onClick={() => { setProblem && setProblem(problem); }}>
            <ListItemText primary={`T${problem.tid} ${problem.title}`}></ListItemText>
            {passed[problem.tid] ? <ListItemSecondaryAction>
              <Typography color="primary">通过</Typography>
            </ListItemSecondaryAction> : null}
          </ListItem>)}
        </List>
      </AccordionDetails>
    </Accordion>)
    }
  </>;
}

// class CodeBlock extends React.Component {
//   constructor(props) {
//     super(props);
//     this.wavedromRef = React.createRef();
//   }

//   componentWillMount() {
//     // 注册要高亮的语法，
//     // 注意：如果不设置打包后供第三方使用是不起作用的
//     SyntaxHighlighter.registerLanguage("verilog", verilog);
//   }

//   render() {
//     const value = this.props.children[0];
//     const language = this.props.className.slice('language-'.length);
//     console.log(language, value, this.wavedromRef);
//     if (language === 'wavedrom' && this.wavedromRef.current) {
//       Wavedrom.renderWaveElement(null, value, this.wavedromRef.current, Wavedrom.waveSkin);
//       Wavedrom.processAll();
//       return <div className="WaveDrom" style={{ overflowX: "auto" }} ref={this.wavedromRef}></div>;
//     }
//     return (
//       <figure className="highlight">
//         <div ref={this.wavedromRef}></div>
//         <SyntaxHighlighter language={language} style={monokai}>
//           {value}
//         </SyntaxHighlighter>
//       </figure>
//       // <div>{value}</div>
//     );
//   }
// }

const CodeBlock = (props) => {
  const [ignore, setIgnore] = React.useState(() => { SyntaxHighlighter.registerLanguage("verilog", verilog); });
  const wavedromRef = React.useRef();
  const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0);

  const value = props.children[0];
  const language = props.className.slice('language-'.length);
  console.log(language, value, wavedromRef);
  if (language === 'wavedrom') {
    // setTimeout((async () => {
    //   console.log(eval(value));
    //   if (wavedromRef.current) {
    //     Wavedrom.renderWaveElement(null, eval(value), wavedromRef.current, Wavedrom.waveSkin);
    //     Wavedrom.processAll();
    //   }
    // }), 1000);
    // if (!wavedromRef.current)
    //   forceUpdate();
    return <div><div className="WaveDromWrapper" style={{ overflowX: "auto" }} ref={wavedromRef}></div></div>;
  }
  return <div>
    <div className="WaveDromWrapper" style={{ overflowX: "auto" }} ref={wavedromRef}></div>
    <figure className="highlight">
      <SyntaxHighlighter language={language} style={monokai}>
        {value}
      </SyntaxHighlighter>
    </figure>
  </div>;
}

const Problem = (props) => {
  const { problem } = props;
  if (!problem) return null;
  // return <pre>{JSON.stringify(problem)}</pre>;
  return <>
    <Typography variant="h4">{problem.title}</Typography>
    <Typography variant="body2" color="textSecondary">{`T${problem.tid}`}</Typography>
    <ReactMarkdown components={{
      code: CodeBlock,
    }}>{problem.content}</ReactMarkdown>
  </>;
};

const Problems = (props) => {
  const [state, setInnerState] = React.useState({
    problem: problemInfo.problem_set[0].problems[0],
    passedId: null,
    requesting: false
  });
  const setState = (update) => setInnerState(objectUpdate(state, update));
  let problemTidPool = {};

  let problemIds = [];
  let problemLeft = null, problemRight = null;
  for (const problemSet of problemInfo.problem_set) {
    for (const problem of problemSet.problems) {
      problemIds.push(problem.tid);
      problemTidPool[problem.tid] = problem;
      if (problem.tid < (state.problem ? state.problem.tid : 999999999999) && ((problemLeft && problem.tid > problemLeft.tid) || !problemLeft)) problemLeft = problem;
      if (problem.tid > (state.problem ? state.problem.tid : 0) && ((problemRight && problem.tid < problemRight.tid) || !problemRight)) problemRight = problem;
      // if (problem.tid > (state.problem ? state.problem.tid : 0)) problemRight = problem;
    }
  }

  // console.log("problemLeft", problemLeft, 'problemRight', problemRight);
  // console.log('tids', problemIds);

  if (window.location.hash.split('/').length > 3) {
    getHistory().push('/problems/1001');
    return <></>;
  }
  const target_tid = parseInt(window.location.hash.split('/')[window.location.hash.split('/').length - 1]);
  if (isNaN(target_tid)) {
    getHistory().push('/problems/1001');
    return <></>;
  }
  // console.log('target_tid', target_tid);
  if (!state.problem || (state.problem && state.problem.tid !== target_tid)) {
    if (!problemTidPool[target_tid]) {
      return <>没这个题目哈。</>;
    }
    setState({ problem: problemTidPool[target_tid] });
    return <></>;
  }

  const codes = state.problem && /```verilog.*```/gims.exec(state.problem.content);
  const codeDefault = codes && codes[codes.length - 1].slice('```verilog\n'.length, -3);
  // console.log()

  if (!state.requesting) {
    setState({ requesting: true });
    api.request('profile/pass').then(resp => {
      if (!isIterator(resp.pass)) return;
      setState({ requesting: true, passedId: resp.pass });
    });
  }
  return <Grid container>
    <Grid item xs={12} lg={3} sm={4}>
      <ProblemList passedId={state.passedId} data={problemInfo} setProblem={problem => {
        // setState({ problem: problem });
        // console.log(problem);
        getHistory().push(`/problems/${problem.tid}`);
      }}></ProblemList>
    </Grid>
    <Grid item xs={12} lg={9} sm={8}>
      <Container maxWidth="lg">
        <Grid container>
          {problemLeft ? <Grid item xs={6}>
            <Button variant="text" size="small" fullWidth color="textSecondary" onClick={() => {
              getHistory().push(`/problems/${problemLeft.tid}`);
            }}>上一题：T{problemLeft.tid} {problemLeft.title}</Button>
          </Grid> : null}
          {problemRight ? <Grid item xs={6}>
            <Button variant="text" size="small" fullWidth color="textSecondary" onClick={() => {
              getHistory().push(`/problems/${problemRight.tid}`);
            }}>下一题：T{problemRight.tid} {problemRight.title}</Button>
          </Grid> : null}
        </Grid>
        <Problem problem={state.problem}></Problem>
        <Submit problemId={state.problem && state.problem.tid} codeDefault={codeDefault}></Submit>
      </Container>
    </Grid>
    {/* <CodeBlock className="language-wavedrom">{[{
      signal: [
        ["out", { name: "a", wave: '0.......' }],
        {},
        ["ref", { name: "a", wave: '1.......' }],
      ]
    },]}</CodeBlock> */}
  </Grid>
};

export default Problems;