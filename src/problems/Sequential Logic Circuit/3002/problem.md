---
title:Shift Light II
tid:3002
order:2
---

See https://hitsz-cslab.gitee.io/diglogic/lab2/s2/

```verilog
module top_module(
    input  wire       clk   ,
	input  wire       rst   ,
	input  wire       button,
	input wire [2:0] switch,
	output reg  [15:0] led
);
    always@(posedge clk or posedge rst)begin
        led<=16'b0;//fix me
    end
endmodule
```
