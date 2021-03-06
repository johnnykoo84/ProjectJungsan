import React from 'react';

export default class SignIn extends React.Component {

  render() {
    const imgUrl1 = 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQ8_5_tR-TwcWhgMpLeYG7Be1dlXtzaP2VPrnpmEv38IcxxU5nA';
    const imgUrl2 = 'https://i.stack.imgur.com/ZW4QC.png';
    return (
      <div>
        <a href="https://oneovern.com/auth/google/">
          <img className="googleButton" src={imgUrl1} />
        </a>
        <a href="https://oneovern.com/auth/facebook/">
          <img className="facebookButton" src={imgUrl2} />
        </a>
      </div>
    );
  }
}
