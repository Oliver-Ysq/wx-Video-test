import {List, Spin, Button} from "antd";
import React from "react";
import "./style.css";

const Tags = (props) => {
  const {hasResult, result, title, init} = props;
  return (
    <>
      {!!title && (<>
          <div className="ant-statistic-title">标题</div>
          <div style={{marginBottom: 12}}>{title}</div>
        </>
      )}
      <div className="ant-statistic-title">预测结果：</div>
      {!hasResult
        ? <Spin size="large" style={{marginTop: 8}}/>
        :
        <>
          <List
            size="large"
            bordered={false}
            dataSource={result}
            renderItem={(item, index) => {
              return (<List.Item key={index}>
                <span className="my-span">{index + 1}</span>
                {item.value}({item.score})
              </List.Item>);
            }}
          /> <Button style={{float: "right"}} onClick={() => init()}>再来一次</Button>
        </>
      }
    </>
  );
};

export default Tags;