import api from "../api/api";
console.log('api', api);

const ITEM_NAME = "voj_config";

class Config {
  constructor() {
    this.load = this.load.bind(this);
    this.save = this.save.bind(this);
    this.theme_avaliable = {
      "默认主题": null
    }
    // 在构造函数执行的时候加载保存的数据
    this.data_default = {
      debug: true,
      version_frontend: 0.1,
      theme_name: "默认主题",
      theme_avaliable: [
        '默认主题',
      ],
      api_token: {
        access_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE2MzQwMTg4NjI3NDB9.dnFnMq3giXDyeUEtAO0l5kkFaSCvT42mNhP_fk8v87k",
        refresh_token: ""
      }
    };
    this.data = this.data_default;
    this.theme = this.theme_avaliable["默认主题"];
    this.load();
  }

  load() {
    console.log("Config: loading config...");
    if (this.data.debug) {
      console.log("Config: load default config.");
      this.save();
    }
    try {
      this.data = JSON.parse(localStorage.getItem(ITEM_NAME));
      if (!this.data) throw new Error("Null data");
      console.log("Got data:", this.data);
      if (!this.data.version_frontend || this.data.version_frontend < this.data_default.version_frontend) {
        // 版本升级，增量更新
        console.log(`Config: update ${this.data.version_frontend} -> ${this.data_default.version_frontend}`);
        this.data.version_frontend = this.data_default.version_frontend;
        for (let k in this.data_default) {
          if (!this.data[k]) {
            console.log(`    Config: add value ${k}`);
            this.data[k] = this.data_default[k];
          }
        }
        this.save();
      }
    } catch (e) {
      console.warn(`Can not find ${ITEM_NAME} in localStorage, use default config.`);
      this.data = this.data_default;
      this.save();
    }
    this.theme = this.theme_avaliable[this.data.theme_name];
    if (!this.theme) this.theme = this.theme_avaliable["default"];
    api.set_token(this.data.api_token.access_token, this.data.api_token.refresh_token);
  }

  save() {
    console.log("Config: saving config...");
    const tokens = api.get_token();
    if (tokens.access_token || tokens.refresh_token)
      this.data.api_token = tokens;
    const s = JSON.stringify(this.data);
    localStorage.setItem(ITEM_NAME, s);
    return s;
  }

  static clear() {
    console.log("Config: clearing all data...");
    localStorage.setItem(ITEM_NAME, undefined);
  }
};

export default Config;