---
title:Parameterized Mux
tid:2001
order:1
---

See hitsz-cslab.gitee.io/diglogic/lab1/s1/ for detail

The name of Top module should be `top_module`

Following is an example

```verilog
module top_module
#(parameter Port_Num=2,parameter WIDTH=8)
(
    input [(WIDTH-1):0] a,
    input [(WIDTH-1):0] b,
    input [(WIDTH-1):0] c,
    input [(WIDTH-1):0] d,
    input [(WIDTH-1):0] e,
    input [(WIDTH-1):0] f,
    input [(WIDTH-1):0] g,
    input [(WIDTH-1):0] h,
    output reg [(WIDTH-1):0] q
);
    
    assign q=a&b&c&d&e&f&g&h;
    
endmodule
```
