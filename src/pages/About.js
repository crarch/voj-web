import { Button, Container, Typography } from "@material-ui/core";

const About = () => {
  // return <div>关于</div>;
  return <Container>
    <Typography variant="h2">作者</Typography>
    <Typography variant="body1" color="secondary">bilibili@嘉然今天吃什么</Typography>
    <Button variant="outlined" color="primary" onClick={() => {
      window.location.href = "https://space.bilibili.com/672328094";
    }}>懂了吗，点击跳转</Button>

    <Typography variant="h2">为什么UI这么丑/BUG这么多？</Typography>
    <Typography variant="body1" color="secondary">因为作者不是全职开发这个OJ<br>这个OJ本来是软件开发与实践A的作业，然而软A大幅度改版，相当于这个程序全部木大了。现在作者用爱发电来维护这个项目。如果你觉得作者写的不好，欢迎交PR。<s>review都不review直接给merge，owner直接转给你都行</s></Typography>

  </Container>;
};

export default About;
