---
title:RAM
tid:3003
order:3
---

See https://hitsz-cslab.gitee.io/diglogic/lab3/s3/

```verilog
module top_module(
    input  wire       clk   ,
	input  wire       rst   ,
	input  wire       button,
	output reg  [15:0] led
);
    always@(posedge clk or posedge rst)begin
        led<=16'b0;//fix me
    end
endmodule
```
