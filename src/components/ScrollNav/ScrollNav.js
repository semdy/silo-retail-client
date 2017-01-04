require('./ScrollNav.styl');
let { hashHistory } = ReactRouter;

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
                }
            ]
        };
    }

    componentDidMount() {
        let className = document.body.className;
        document.body.className = className + ' page-scrollNav';
    }

    handleRoute(route) {
        hashHistory.replace(route);
    }

    render() {
        let leftBar = "";
        let rightBar = "";

        if( this.props.showLeftBar ){
            leftBar = (
                <div className="scroll-nav-toolbar left" onClick={this.props.leftBarClick}>
                    <i className="icon icon-menu"></i>
                </div>
            )
        }

        if( this.props.showRightBar ) {
            rightBar = (
                <div className="scroll-nav-toolbar right" onClick={this.props.rightBarClick}>
                    <i className="icon icon-home"></i>
                </div>
            )
        }


        return (
            <div className="scroll-nav">
                {leftBar}
                <div className="scroll-nav-bd">
                    {
                        this.state.navs.map((item, index) => {
                            return (
                                <a href="javascript:;"
                                   key={'nav' + index}
                                   className={"scroll-nav-item " + ( this.props.activeIndex === index ? "active" : "" )}
                                   onClick={this.handleRoute.bind(this, item.route)}>
                                    <span>{item.text}</span>
                                </a>
                            )
                        })
                    }
                </div>
                {rightBar}
            </div>
        );
    }
}

module.exports = Page;
