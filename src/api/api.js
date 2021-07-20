import Constants from "../config/Constants";
// import { objectUpdate, urlEncode } from "../utils/utils";
import { setConfig, setErrorInfo } from "../data/action";
import store from "../data/store";

class API {
  constructor(props) {
    // this.host = window.location.hostname === 'localhost' ? 'localhost' : Constants.API_HOST_RELEASE;
    this.host = Constants.API_HOST_RELEASE;
    this.port = Constants.API_PORT_RELEASE;
    this.protocol = Constants.API_PROTOCOL_RELEASE;
    this.api_prefix = ``;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    // this.url = `http://localhost:8000/${this.protocol}://${this.host}${this.port === null ? "" : (':' + this.port)}${this.api_prefix}`;
    this.url = `${this.protocol}://${this.host}${this.port === null ? "" : (':' + this.port)}${this.api_prefix}`;
    this.access_token = '';
    this.refresh_token = '';
  }
  set_token(access_token, refresh_token) {
    // this.access_token = access_token || this.access_token;
    // this.refresh_token = refresh_token || this.refresh_token;
    if (access_token !== undefined)
      this.access_token = access_token;
    if (refresh_token !== undefined)
      this.refresh_token = refresh_token;
  }
  get_token() {
    return {
      access_token: this.access_token === '' ? undefined : this.access_token, refresh_token: this.refresh_token === '' ? undefined : this.refresh_token
    }
  }
  request_key(router, key, method = "GET", data) {
    return this.request(`${router}/${key}`, method, data);
  }
  update_config() {
    // let config = store.getState().config;
    // config.data.api_token = this.get_token();
    // console.log('config.data.api_token', config.data.api_token)
    // config.save();
    // store.dispatch(setConfig(config));
  }
  load_from_config() {
    // const config = store.getState().config;
    // this.set_token(config.data.api_token.access_token, config.data.api_token.refresh_token);
  }
  get_headers(refresh = false, access = true) {
    let headers = {
      'Content-Type': 'application/json',
    };
    if (refresh) {
      headers['Refresh'] = this.refresh_token;
    }
    if (access) {
      if (this.access_token !== '') headers['Authorization'] = this.access_token;
    }
    return headers;
  }
  async request(router, method = "GET", data) {
    const payload = {
      method: method,
      mode: 'cors',
      body: data ? JSON.stringify(data) : undefined,
      // 注销的时候自带 refresh_token
      headers: this.get_headers(Boolean(router === 'session' && method === 'DELETE')),
    };
    // console.log('request', router, method, data, payload);
    // console.log(`${this.url}/${router}`);
    let resp = null;
    try {
      resp = await fetch(`${this.url}/${router}`, payload);
    } catch (e) {
      console.error(e);
      store.dispatch(setErrorInfo(e));
      resp = { status: 433, error: "Error when fetching internet" };
      return { code: resp.status, error: resp.statusText };
    }
    let js = null;
    try { js = await resp.json(); } catch (e) {
      console.error(e);
      store.dispatch(setErrorInfo(e));
      return { code: resp.status, error: resp.statusText };
    }
    console.log('raw js:', js);
    if (!js) {
      // console.log(await resp.json());
      js = {};
      js.message = resp.statusText;
    }
    if (js.code === undefined) js.code = resp.status;
    if (js.code === 422) {
      if (this.refresh_token === '') {
        // 过期勒
        return null;
      }
      // ac_token到期，准备更新
      // console.log(this.get_headers(true));
      const resp2 = await fetch(`${this.url}/session`, {
        method: 'GET',
        mode: 'cors',
        headers: this.get_headers(true),
        // body: JSON.stringify({ refresh_token: this.refresh_token })
      });
      try {
        const js2 = await resp2.json();
        // console.log('updating ac_token', js2);
        if (js2.code === 200) {
          // this.set_token(js2.data.access_token, js2.data.refresh_token);
          this.set_token(js2.Authorization);
          this.update_config();
          // // 更新user
          // const res = this.request('user', 'GET');
          // if (res.code === 200) {
          //   // store.dispatch(setUser(res.data.user));
          //   console.log('user', res);
          // }
        }
        else {
          // 判定为 update_token 也过期，要求重新登录
          // store.dispatch(setErrorInfo("登录过期，请重新登录"));
          return null;
        }
      } catch (e) {
        // console.error(e);
        return { code: resp2.status, error: resp2.statusText };
      }
      return this.request(router, method, data);
    }
    if (js.code === 200) {
      // 登录自动储存 JWT 数据
      if (router === 'session' && method === 'POST') {
        const { access_token, refresh_token } = js.data;
        // console.log('jwt', access_token, refresh_token);
        this.set_token(access_token, refresh_token);
        this.update_config();
      } else if (router === 'session' && method === 'DELETE') {
        // 注销
        // console.warn('注销');
        this.set_token('', '');
        this.update_config();
      }
    } else {
      store.dispatch(setErrorInfo(js));
    }
    return js;
  }
}

const api = new API();

export default api;