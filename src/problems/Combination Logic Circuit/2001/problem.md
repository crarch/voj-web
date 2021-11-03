---
title:3-8 Decoder
tid:2001
order:1
---

The name of Top module should be top_module

Following is an example

```verilog
module top_module
(
    input clk,rst,
    input [2:0] enable,
    input [2:0] switch,
    output reg [7:0] led 
);
    always@(posedge clk)begin
        led<=8'hff;//fix me
    end
    
endmodule
```
