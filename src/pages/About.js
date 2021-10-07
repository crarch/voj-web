import { Button, Container, Typography } from "@material-ui/core";

const About = () => {
  // return <div>关于</div>;
  return <Container>
    <Typography variant="h2">作者</Typography>
    <Typography variant="body1" color="secondary">bilibili@嘉然今天吃什么</Typography>
    <Button variant="outlined" color="primary" onClick={() => {
      window.location.href = "https://space.bilibili.com/672328094";
    }}>懂了吗，点击跳转</Button>
  </Container>;
};

export default About;