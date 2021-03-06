import React from 'react';
import { Link, browserHistory } from 'react-router';
import axios from 'axios';
import SignOut from './signOut';
import History from './history';
import NewEvent from './newEvent';
import Navbar from './func/navbar';

const Loader = require('react-loader');

export default class Mypage extends React.Component {
  constructor() {
    super();
    this.state = {
      groupList: [],
      sumList: [],
      myEmail: '',
      pendingUserList: [],
      testtest: '',
      rendingPage: '',
      loaded: false,
    };
    this.handleDone = this.handleDone.bind(this);
    this.reset = this.reset.bind(this);
    this.handleHistoryPage = this.handleHistoryPage.bind(this);
    this.handleEventPage = this.handleEventPage.bind(this);

  }

  componentWillMount() {
    this.reset();
    // const myData = axios.get('https://oneovern.com/api/misc');
    // const groupData = axios.get('https://oneovern.com/api/mypage');
    // Promise.all([myData, groupData]).then(res => {
    //   const myEmailData = JSON.parse(res[0].data)[0].email
    //   const groupStorage = [];
    //   const getData = JSON.parse(res[1].data);
    //   // console.log()
    //   console.log('getData!!!!!:', getData);
    //
    //   getData.groupList.forEach((group) => {
    //     groupStorage.push(group.groupname);
    //   });
    //     console.log(getData.pendingUserList)
    //
    //   this.setState({
    //     groupList: groupStorage,
    //     sumList: getData.sumList,
    //     myEmail: myEmailData,
    //     pendingUserList: getData.pendingUserList,
    //   });
    // })
  }

  reset() {

    const myData = axios.get('https://oneovern.com/api/misc');
    const groupData = axios.get('https://oneovern.com/api/mypage');
    Promise.all([myData, groupData]).then((res) => {
      const myEmailData = JSON.parse(res[0].data)[0].email;
      const groupStorage = [];
      const getData = JSON.parse(res[1].data);
      getData.groupList.forEach((group) => {
        groupStorage.push(group.groupname);
      });
      console.log('pending',getData.pendingUserList)
      this.setState({
        groupList: groupStorage,
        sumList: getData.sumList,
        myEmail: myEmailData,
        pendingUserList: getData.pendingUserList,
      });
    })
    .then(() => {
      this.setState({
        loaded: true,
      });
    });
  }

  handleHistoryPage(event) {
    this.setState({
      rendingPage: 'history',
    })
  }

  handleEventPage() {
    this.setState({
      rendingPage: 'newEvent',
    })
  }

  handleDone(event, index) {
    const nextSumList = [...this.state.sumList];
    //promise callback에 넘기기 위한 변수 지정//
    const eventValue = event.target.value;
    let actionType = 'pending';
    let answer = true;
    console.log(event.target)
    if (event.target.value === '수락') {
      actionType = 'accept';
    }
    else if (event.target.value === '거절') {
      actionType = 'reject';
    }

    const individualTransacionDone = {
      recipientemail: nextSumList[index].email,
      action: actionType,
    };

    if (event.target.value === '수락') {
      answer = confirm('정말로 정산을 완료하시겠습니다?');
    }

    if (answer) {

      axios.put(`https://oneovern.com/api/misc`, individualTransacionDone)
      .then((res) => {
        if (res.status === 200) {
          if (eventValue === '정산요청') {
            alert('정산중! 상대가 수락하면 정산이 완료됩니다.');
            browserHistory.push('/mypage');
          }
          else if (eventValue === '거절') {
            browserHistory.push('/mypage');
          }
          else if (eventValue === '수락') {
            nextSumList.splice(index, 1);
            this.setState({
              sumList: nextSumList,
            });
          }
        }
        this.reset();
      });
    }
  }

  render() {
    const List = [];
    const {
      groupList,
      sumList,
    } = this.state;

    let rendingPage = '';

    if (sumList && this.state.myEmail) {
      sumList.forEach((data, index) => {
        let declineButton = '';
        let actionButton =
        <button className="btn btn-outline-success" value="정산요청" onClick={(event) => this.handleDone(event, index)}>정산요청</button>;
        console.log('data', data)
        //render all sumlist except me//
        if (data.email !== this.state.myEmail) {
          actionButton =
          <button className="btn btn-outline-success" value="정산요청" onClick={(event) => this.handleDone(event, index)}>정산요청</button>;

          this.state.pendingUserList.forEach((member) => {
            if (data.email === member.applicantemail || data.email === member.acceptoremail) {
              // actionButton = '정산요청';
              if (member.applicantemail === this.state.myEmail && member.status === 1) {
                actionButton =
                <button className="btn btn-outline-info">정산중</button>;

              }
              else if (member.acceptoremail === this.state.myEmail && member.status === 1) {
                console.log('what???');
                actionButton =
                <button className="btn btn-outline-info" value="수락" onClick={(event) => this.handleDone(event, index)}>수락</button>;
                declineButton =
                <button className="btn btn-outline-info" value="거절" onClick={(event) => this.handleDone(event, index)}>거절</button>;
              }
              else if (member.status === null) {
                actionButton =
                <button className="btn btn-outline-success" value="정산요청" onClick={(event) => this.handleDone(event, index)}>정산요청</button>;
              }
            }
          });

          List.push(
            <tr>
              <td>{data.username}</td>
              <td>{data.email}</td>
              <td>{data.cost}</td>
              <td>
                {actionButton}
                {declineButton}
              </td>
            </tr>,
          );
        }
      })
    }

    // const groups = this.state.groupList.map((data) => {
    //   return <li className="myPageGroupName"><Link to={"grouppage/"+data}><b>{data}</b></Link></li>;
    // });


    if (this.state.rendingPage === "history") {
      rendingPage = <History />
    }
    else if (this.state.rendingPage === 'newEvent') {
      rendingPage = <NewEvent />
    }
    else {
      rendingPage =
      <div className="container mypage">
        <div className="col-md-1"></div>
        <div className="col-md-10">
        <center><h1 className="mypageHeader">내가 정산해야 할 내역</h1></center>
        <br />
      {/* <h3 className="mypageHeaderMessage"></h3> */}
          <br />
          <br />
          <table className="table table-striped">
            <thead>
            <tr className="mypageTableRow">
              <th>이름</th>
            <th>이메일</th>
          <th>총액</th>
              <th></th>
            </tr>
        </thead>
        <tbody>
        {List}
        </tbody>
      </table>
      <br />
      </div>
      <div className="col-md-1"></div>
    </div>
    }

    console.log('rendingPage', rendingPage)


    return (
      <div>
        <Navbar />
        <Loader loaded={this.state.loaded}>
        {rendingPage}
        </Loader>
      </div>
    );
  }
}
