import { Container, LinearProgress, List, ListItem, ListItemText, Typography } from "@material-ui/core";
import moment from "moment";
import React from "react";
import api from "../api/api";
import { setResults } from "../data/action";
import store from "../data/store";
import { isIterator, objectUpdate } from "../utils/utils";
import Pagination from '@material-ui/lab/Pagination';

const ResultItem = (props) => {
  const { result, onClick, key } = props;
  return <ListItem button key={key} onClick={() => { onClick && onClick(result); }}>
    {/* <ListItemText>{`${result.question_id} ${moment(result.submit_time * 1000).calendar()}`}</ListItemText> */}
    <div>
      <Typography variant="h4" color={result.success ? "primary" : "error"}>{result.success ? "Success" : "Failure"}</Typography>
      <Typography variant="body1">{`题目编号:${result.question_id}/提交时间:${moment(result.submit_time * 1000).calendar()}`}</Typography>
    </div>
  </ListItem>
}

const Results = () => {
  // const results = store.getState().results || [];
  const [state, setInnerState] = React.useState({
    requesting: false,
    page: 1,
    pageTotal: 100,
    results: []
  });
  const setState = (update) => setInnerState(objectUpdate(state, update));
  const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0);

  const loading = state.requesting && (!state.results || (state.results && state.results.length === 0));

  console.log('state.requesting', state.requesting);

  // if (loading) {
  if (!state.requesting) {
    setState({ requesting: true });
    api.request_key("judge/record/page", state.page, "GET").then(resp => {
      if (!isIterator(resp)) return;
      setState({ results: resp, requesting: true });
    });
    // (async () => {
    //   const resp = await api.request_key("judge/record/page", state.page, "GET");
    //   // console.log(resp);
    //   if (!isIterator(resp)) return;
    //   // store.dispatch(setResults(resp));
    //   // forceUpdate();
    //   setState({ results: resp });
    // })();
  }
  // }

  return <Container maxWidth="lg">
    <Typography variant="body" color="textSecondary">评测记录第{state.page}页，共{state.pageTotal}页。</Typography>
    {loading ? <LinearProgress color="secondary"></LinearProgress> : null}
    <List>
      {state.results.map(result => <ResultItem result={result}></ResultItem>)}
    </List>
    <Pagination fullWidth count={state.pageTotal} defaultPage={1}
      page={state.page}
      onChange={(e, value) => { setState({ page: value, requesting: false, results: [] }) }}
      boundaryCount={2} />
  </Container>;
};

export default Results;