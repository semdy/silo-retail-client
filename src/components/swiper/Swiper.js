import './Swiper.styl';

import {Scroller} from 'saltui';
import React, {PropTypes} from 'react';

import classnames from 'classnames';

class Swiper extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      containerW: window.innerWidth
    };
  }

  componentDidMount(){

    let containerW = this.refs.container.offsetWidth;
    this.scroller = this.refs.swiper.scroller;

    this.scroller.on("scrollEnd", () => {
      let snapX = Math.floor(-this.scroller.x/containerW);
      this.setState({
        activeIndex: snapX
      });
    });

    this.setState({
      containerW: containerW
    });
  }

  render(){
    let {activeIndex, containerW} = this.state;
    return (
      <div ref="container" className="swiper-container">
        <Scroller ref="swiper"
                  scrollX={true}
                  scrollY={false}
                  snap={true}
                  eventPassthrough={true}
        >
          <div className="t-FBH swiper-wrapper" style={{
            width: this.props.children.length*containerW + "px"
          }}>
            {this.props.children}
          </div>
        </Scroller>
        <div className="swiper-navs">
          {
            this.props.children.map((child, i) => {
              return (
                <span key={i}
                      className={classnames("swiper-dot", {actived: activeIndex === i})}
                >
                </span>
              )
            })
          }
        </div>
      </div>
    )
  }

}

module.exports = Swiper;
