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
    <Typography variant="body1" color="black">因为作者不是全职开发这个OJ.这个OJ本来是软件开发与实践A的作业，然而软A大幅度改版，相当于这个程序全部木大了。现在作者用爱发电来维护这个项目。如果你觉得作者写的不好，欢迎交PR。<s>review都不review直接给merge，owner直接转给你都行</s></Typography>

    <Typography variant="h2">Advertisement</Typography>
    <Typography variant="body1" color="black">Computer Architecture Research,HITSZCRA may undertake ECEI Cloud Infrastructure Project. We are looking for 1)Senior Linux Developer 2)Senior Rust Developer 3)Senior Web Developer 4)Senior DBA(Specialized in TiDB) 5)Distribute Block Storage Expert 6)System Architect Expert(Specialized in Cloud Computing and Virtualization). Please send us your CV if your are interested in our project.</Typography>

  </Container>;
};

export default About;
