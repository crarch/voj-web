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
  const results = store.getState().results || [];
  const [state, setInnerState] = React.useState({
    requesting: false,
    page: 1
  });
  const setState = (update) => setInnerState(objectUpdate(state, update));
  const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0);

  const loading = (!results || (results && results.length === 0));

  if (loading) {
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
  }

  return <Container maxWidth="lg">
    {loading ? <LinearProgress color="secondary"></LinearProgress> : null}
    <List>
      {results.map(result => <ResultItem result={result}></ResultItem>)}
    </List>
    <Pagination fullWidth count={100} defaultPage={1} page={state.page} onChange={(e, value) => { setState({ page: value }) }} boundaryCount={2} />
  </Container>;
};

export default Results;