import React from 'react';

export default class SignIn extends React.Component {

  render() {
    const imgUrl = 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ8_5_tR-TwcWhgMpLeYG7Be1dlXtzaP2VPrnpmEv38IcxxU5nA';
    return (
      <div>
        <a href="http://oneovern.com/auth/google/">
          <img src={imgUrl} className="signIn" />
        </a>
      </div>
    );
  }
}
