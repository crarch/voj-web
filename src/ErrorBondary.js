import React from 'react';
import api from './api/api';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      requesting: false,
      requested: false,
    };
  }

  componentDidCatch(error, info) {
    this.setState({ error: { error, info }, requesting: true });
    // logErrorToMyService(error, info);
    console.error('catched error', error);
    console.error('catched info', info);
    // api.request('error_report', 'POST', { error: { error, info } }).then(resp => {
    //   this.setState({ requested: true });
    // });
  }

  render() {
    if (this.state.error) {
      const content = (this.state.requesting && !this.state.requested) ?
        <div style={{ color: 'orange' }}>正在收集数据并且上报开发者...</div> :
        <div style={{ color: 'green' }}>错误数据上报完成！<div>
          {window.location.hash === '#/' ? null : <div><br />你可以选择：<a href="/">回到主页</a></div>}
        </div>
        </div>;
      return <div>
        <b><h3>很抱歉</h3></b>
        <p>页面崩溃了！</p>
        <hr />
        {content}
        <p>对您造成的困扰我们表示抱歉，如果有其他需要解决的问题，请联系：</p>
        <p>开发者邮箱：<a href="mailto:chiro2001@163.com">chiro2001@163.com</a></p>
        <hr></hr>
        <p>详细错误：</p>
        <pre style={{ overflowX: "auto" }}>{JSON.stringify(this.state.error, "", "  ")}</pre>
        {this.state.error.info && this.state.error.info.componentStack ? <pre>{this.state.error.info.componentStack}</pre> : null}
      </div>;
    }
    return this.props.children;
  }
}