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
    input clk,rst,enable,
    input [2:0] switch,
    output [7:0] led 
);
    
    assign led=8'hff;//fix me
    
endmodule
```
