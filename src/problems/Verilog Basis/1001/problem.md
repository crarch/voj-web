---
title:点灯
tid:1001
order:1
---

下面这个电路输出的是0（低电平）
```wavedrom
{ signal: [
  ["out",{ name: "a", wave: '0.......' }],
  {},
  ["ref",{ name: "a", wave: '1.......' }],
]}
```

请修改示例代码让它输出1（高电平）

```wavedrom
{ signal: [
  ["out",{ name: "a", wave: '1.......' }],
  {},
  ["ref",{ name: "a", wave: '1.......' }],
]}
```

你能帮帮我吗.jpg
![](/problem/1001/example.png)

预估代码量：大约一行(不能再多辣!!!
```verilog
module top_module(
    output a
);
    assign a=0;//fix me
endmodule
```
