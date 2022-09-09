import React, { useEffect, useState } from "react";
import Header from "./Header";
import { instance } from "../instance/instance";
import { AiFillLike } from "react-icons/ai";
import "../styles/Chart.css";

function ChartList({ data, id }) {
  let today = new Date();
  let hour = today.getHours();
  const [pushed, setPushed] = useState(false);

  const pushLike = () => {
    pushed ? cancelLike() : upLike();
  }

  const upLike = async () => {
    if (!localStorage.getItem('access-token')) {
      alert('로그인이 필요합니다!');
      return;
    }
    try {
      await instance.post(`song/${id}/up`, null, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access-token')}`
        }
      });
      setPushed(true);
      console.log('따봉박음!');
    } catch (error) {
      console.log(error);
    }
  }

  const cancelLike = async () => {
    if (!localStorage.getItem('access-token')) {
      alert('로그인이 필요합니다!');
      return;
    }
    try {
      await instance.delete(`song/${id}/up`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access-token')}`
        }
      });
      setPushed(false);
      console.log('따봉취소!');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="ChartList-div">
      {/* <img src={data.imgUrl} alt="앨범커버" /> */}
      <img src="./images/logo.png" alt="앨범커버" />
      <div>
        <span className="ChartList-name">{data.title}</span>
        <span className="ChartList-artist">{data.singer}</span>
        {/* <span className="ChartList-artist">{hour - data.createdHour}</span> */}
        <span className="ChartList-artist">{data.userName}</span>
        <span><button onClick={() => pushLike()}><AiFillLike color={pushed ? 'red' : 'black'} /></button> {data.numberOfUps}</span>
      </div>
    </div>
  );
}

function Chart() {
  const [chart, setChart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getSongChart = async () => {
      try {
        setLoading(true);
        const response = await instance.get("song");
        setChart(response.data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    getSongChart();
  }, []);

  return (
    <div>
      <Header />
      {loading ? (
        <div className="Chart-div">
          <h1 className="title">BSSM 차트</h1>
          <span>로딩중~</span>
          <img src="../images/loading.gif" alt="로딩중~" />
        </div>
      ) : (
        <div className="Chart-div">
          <h1 className="title">BSSM 차트</h1>
          <div className="ChartList">
            {chart.length ?
              chart.map((item) => {
                return <ChartList data={item} key={item.id} id={item.id} />;
              }) : <span>노래가 없습니다.</span>}
          </div>
        </div>
      )}
    </div>
  );
}

export default Chart;
