import tvIcon from "../../assets/tv.png";
import ReactPlayer from "react-player";
import React from "react";
import "./style.css";

const MyPlayer = props => {
  const {url} = props;
  return (
    <>
      {!url ?
        <div className="react-player tvimg-wrapper">
          <img src={tvIcon} alt="" className="tvimg"/>
        </div> :
        <ReactPlayer
          className='react-player'
          url={url}
          width='100%'
          height='100%'
          playing={true}
          controls
        />}
    </>);
};

export default MyPlayer;