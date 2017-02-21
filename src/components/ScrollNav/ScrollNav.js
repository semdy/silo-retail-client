require('./ScrollNav.styl');

let { Context } = SaltUI;
let { PropTypes } = React;
let { hashHistory } = ReactRouter;
import classnames from 'classnames';

class Page extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            navs: [
                {
                    text: "商品信息",
                    route: "goodsInfo"
                },
                {
                    text: "销售数据",
                    route: "saleDataView"
                },
                {
                    text: "优惠",
                    route: "saleDataView"
                },
                {
                    text: "客流",
                    route: "passflow"
                },
              {
                text: "客流",
                route: "passflow"
              },
              {
                text: "客流",
                route: "passflow"
              },
              {
                text: "客流",
                route: "passflow"
              },
              {
                text: "客流",
                route: "passflow"
              }
            ]
        };
    }

    componentDidMount() {
      $("body").addClass("page-scrollNav");
    }

    componentWillUnmount() {
      $("body").removeClass("page-scrollNav");
    }

    handleRoute(route) {
        hashHistory.replace(route);
    }

    render() {
        let leftBar = "";
        let rightBar = "";
        const {showLeftBar, showRightBar, leftBarClick, rightBarClick, activeIndex} = this.props;

        if( showLeftBar ){
            leftBar = (
                <div className="scroll-nav-toolbar left" onClick={leftBarClick}>
                    <i className="icon icon-menu"></i>
                </div>
            )
        }

        if( showRightBar ) {
            rightBar = (
                <div className="scroll-nav-toolbar right" onClick={rightBarClick}>
                    <i className="icon icon-home"></i>
                </div>
            )
        }


        return (
            <div className={classnames("scroll-nav", {padL: showLeftBar, padR: showRightBar})}>
                {leftBar}
                <div className="scroll-nav-contain">
                    <div className="scroll-nav-bd">
                        <div className="scroll-nav-scroller">
                            {
                                this.state.navs.map((item, index) => {
                                    return (
                                        <a href="javascript:;"
                                           key={'nav' + index}
                                           className={classnames("scroll-nav-item", {active: activeIndex === index})}
                                           onClick={this.handleRoute.bind(this, item.route)}>
                                            <span>{item.text}</span>
                                        </a>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                {rightBar}
            </div>
        );
    }
}

Page.propTypes = {
  showLeftBar: PropTypes.bool,
  showRightBar: PropTypes.bool,
  leftBarClick: PropTypes.func,
  rightBarClick: PropTypes.func,
  activeIndex: PropTypes.number
};

Page.defaultProps = {
  showLeftBar: true,
  showRightBar: true,
  leftBarClick: Context.noop,
  rightBarClick: Context.noop,
  activeIndex: 0
};

module.exports = Page;
