---
title:Shift Light I
tid:3001
order:1
---

See https://hitsz-cslab.gitee.io/diglogic/lab2/s2/

```verilog
module top_module(
    input  wire       clk   ,
	input  wire       rst   ,
	input  wire       button,
	output reg  [7:0] led
);
    always@(posedge clk or posedge rst)begin
        if(rst)begin
            led<=8'h1;
        end
        else begin
            led<=led;//fix me
        end
    end
    
    
endmodule
```
