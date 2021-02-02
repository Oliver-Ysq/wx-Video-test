import {Col, Layout, Row, Form, Input, Button, Tabs, Radio, Upload, message} from 'antd';
import React, {useState} from 'react';
import './App.css';
import {UploadOutlined} from '@ant-design/icons';
import mainIcon from "./assets/videoimg.png";
import instance from "./request/request";
import Tags from "./components/Tags/Tags";
import MyPlayer from "./components/MyPlayer/MyPlayer";

// https://mp.weixin.qq.com/s/2lK0M76AHcEpnUK2n2LqJw

const useEventConfig = () => {
  const [page, setPage] = useState("1");  //url上传 / 文件上传
  const [state, setState] = useState(0);  //0：提交页  1：结果页面
  const [data, setData] = useState({result: [], hasResult: false});
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const init = () => {
    setPage("1");
    setState(0);
    setData({result: [], hasResult: false});
    setUrl("");
    setTitle("");
  };
  const layout = {
    labelCol: {span: 6},
    wrapperCol: {span: 18},
  };
  const tailLayout = {
    wrapperCol: {offset: 6, span: 18},
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const onFinish = async (values) => {
    if (page === "1") {
      let {url, type, title} = values;
      console.log('Success:', values);

      if (url.includes("mp.weixin.qq.com")) {
        try {
          let res = await instance.post(`/proc_page`, {
            url
          });
          console.log(res);
          if (res.data.err_code === 1 || res.data.err_code === '1') {
            message.error(`error: ${res.data.err_msg}`);
            return;
          }
          url = res.data.url;
          title = res.data.title;
          setUrl(() => url);
          setTitle(() => title);
        } catch (e) {
          message.error("网络出错");
          return;
        }
      } else {
        title = !title ? "" : title;
        setUrl(() => url);
        setTitle(() => title);
      }
      setState(1);

      try {
        let res = await instance.post(`/proc_video`, {
          url, type, title
        });
        console.log(res);
        if (res.data.err_code === 1 || res.data.err_code === '1') {
          message.error(`error: ${res.data.err_msg}`);
          setState(0);
          init();
          return;
        }
        setData({
          result: Array.isArray(res.tag) ? res.data.tag : [{value: res.data.tag, score: res.data.score}],
          hasResult: true
        });
      } catch (e) {
        message.error("网络错误");
        setState(0);
        init();
        return;
      }
    }
    if (page === "2") {
      console.log('Success:', values);
      const status = values.upload[0].status;
      console.log(values.upload[0].status);
      if (status === "error") {
        message.error("加载失败");
      } else if (status === "uploading") {
        message.loading("加载中");
      } else if (status === "success") {
        message.success("上传成功");
      }
    }
  };

  const normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) return e;
    return e && e.fileList;
  };
  const changeTab = (key) => {
    setPage(key);
  };
  return {
    layout,
    tailLayout,
    onFinish,
    onFinishFailed,
    normFile,
    changeTab,
    state,
    result: data.result,
    url,
    hasResult: data.hasResult,
    title: title,
    init
  };
};

function App() {

  const {
    layout,
    tailLayout,
    onFinish, onFinishFailed, normFile, changeTab,
    state, result, url, hasResult, title,
    init
  } = useEventConfig();

  const urlForm = (
    <Form
      {...layout}
      name="basic"
      initialValues={{remember: false}}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Url"
        name="url"
        rules={[{required: true, message: '请输入视频的url!'}]}
        extra="请输入[mp.weixin.qq.com]开头的url 或 视频文件的url"
      >
        <Input autoComplete="off"/>
      </Form.Item>

      <Form.Item
        label="输入标题"
        name="title"
        rules={[{required: false, message: '请输入视频标题'}]}
        extra="（可选，输入标题效果更佳哦）"
      >
        <Input autoComplete="off"/>
      </Form.Item>

      <Form.Item name="type" label="识别模型" rules={[{required: true, message: '请选择模型'}]}>
        <Radio.Group defaultValue="0">
          <Radio value="0">多模态融合</Radio>
          <Radio value="1">transformer</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );

  const fileForm = (
    <Form {...layout}
          name="basic"
          initialValues={{remember: true}}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
    >
      <Form.Item
        name="upload"
        label="Upload"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        extra="选择要上传到的视频文件"
      >
        <Upload name="logo" action="/upload.do" listType="picture" maxCount={1}>
          <Button icon={<UploadOutlined/>}>Click to upload</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        label="输入标题"
        name="title"
        rules={[{required: false, message: '请输入视频标题'}]}
        extra="（可选，输入标题效果更佳哦）"
      >
        <Input autoComplete="off"/>
      </Form.Item>

      <Form.Item name="method" label="识别模型" rules={[{required: true, message: '请输入视频标题'}]}>
        <Radio.Group defaultValue="0">
          <Radio value="0">多模态融合</Radio>
          <Radio value="1">transformer</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <Layout className="layout">
      <Layout.Header className="header">
        <img src={mainIcon} className="icon" alt="" mode="aspectFit"/>
      </Layout.Header>


      <Layout.Content className="content">
        <Row style={{height: "100%", flex: 1}}>

          <Col span={11} className="left">
            {state === 0
              ? (
                <Tabs defaultActiveKey="1" onChange={changeTab}>
                  <Tabs.TabPane tab="url上传" key="1">
                    {urlForm}
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="视频文件" key="2">
                    {fileForm}
                  </Tabs.TabPane>
                </Tabs>
              )
              : <Tags title={title} result={result} hasResult={hasResult} init={init}/>}
          </Col>

          <Col span={1}>
          </Col>

          <Col span={12}>
            <MyPlayer url={url}/>
          </Col>
        </Row>
      </Layout.Content>


      <Layout.Footer className="footer">WeiXin - 2021</Layout.Footer>
    </Layout>
  );
}

export default App;
