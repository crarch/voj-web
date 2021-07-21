---
title:点灯
tid:3001
order:1
---

下面这个电路输出的是1（高电平）
```wavedrom
{ signal: [
  ["out",{ name: "a", wave: '1.......' }],
  {},
  ["ref",{ name: "a", wave: '1.......' }],
]}
```

请修改示例代码让它输出0（低电平）

```wavedrom
{ signal: [
  ["out",{ name: "a", wave: '0.......' }],
  {},
  ["ref",{ name: "a", wave: '1.......' }],
]}
```

你能帮帮我吗.jpg

预估代码量：大约一行
```verilog
module top_module(
    output a,
);
    assign a=1;//fix me
endmodule
```
