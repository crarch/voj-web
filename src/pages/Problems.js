import { Accordion, AccordionDetails, Container, AccordionSummary, Button, Grid, List, ListItem, ListSubheader, ListItemText, Typography } from '@material-ui/core';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../api/api';
import problemInfo from '../problems_build/problems.json';
import { objectUpdate } from '../utils/utils';
import { monokai } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { verilog } from "react-syntax-highlighter/dist/esm/languages/prism";
// import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/default-highlight';
import PropTypes from "prop-types";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import Wavedrom from "wavedrom";

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
  const { data, setProblem } = props;
  return <>
    {data.problem_set.map(problemSet => <Accordion key={JSON.stringify(problemSet)}>
      <AccordionSummary>{problemSet.name}</AccordionSummary>
      <AccordionDetails>
        <List>
          {problemSet.problems.map(problem => <ListItem key={JSON.stringify(problem)} button onClick={() => { setProblem && setProblem(problem); }}>
            <ListItemText>{`T${problem.tid} ${problem.title}`}</ListItemText>
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
  return <Container maxWidth="lg">
    <Typography variant="h4">{problem.title}</Typography>
    <Typography variant="body2" color="textSecondary">{`T${problem.tid}`}</Typography>
    <ReactMarkdown components={{
      code: CodeBlock,
    }}>{problem.content}</ReactMarkdown>
  </Container>;
};

const Problems = () => {
  const [state, setInnerState] = React.useState({
    problem: null
  });
  const setState = (update) => setInnerState(objectUpdate(state, update));

  return <Grid container>
    <Grid item xs={12} lg={3} sm={4}>
      <ProblemList data={problemInfo} setProblem={problem => {
        setState({ problem: problem });
        console.log(problem);
      }}></ProblemList>
    </Grid>
    <Grid item xs={12} lg={9} sm={8}>
      <Problem problem={state.problem}></Problem>
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