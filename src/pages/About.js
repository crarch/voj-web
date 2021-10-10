import React from "react";
import { Button, Container, Typography } from "@material-ui/core";

const About = () => {
  const [clicked, setClicked] = React.useState(0);
  return <Container>
    <Typography variant="h2">作者</Typography>
    <Typography variant="body1" color="secondary">{["Chiro2001@163.com", "bilibili@嘉然今天吃什么"][clicked]};i@phyzait.moe</Typography>
    <Button variant="outlined" color="primary" onClick={() => {
      if (!clicked) {
        setClicked(1);
        window.open("https://space.bilibili.com/672328094", "_blank");
      } else {
        window.open("https://phyzait.moe/", "_blank");
        window.open("https://chiro.work/", "_blank");
      }
    }}>访问作者主页</Button>

    <Typography variant="h2">为什么UI这么丑/BUG这么多？</Typography>
    <Typography variant="body1" color="secondary">因为作者不是全职开发这个OJ<br />这个OJ本来是软件开发与实践A的作业，然而软A大幅度改版，相当于这个程序全部木大了。现在作者用爱发电来维护这个项目。如果你觉得作者写的不好，欢迎交PR。<s>review都不review直接给merge，owner直接转给你都行</s></Typography>

  </Container>;
};

export default About;
