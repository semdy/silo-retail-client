import './StoreSelector.styl';

let { PropTypes } = React;
let {Button, Boxs, Icon, Context} = SaltUI;
let HBox = Boxs.HBox;
let Box = Boxs.Box;
import Animate from '../../components/Animation';

let noop = function () {};

class Page extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          isShow: false
        };
        this.selectedStack = [];
    }

    addData (data){
        this.selectedStack.push(data);
    }

    removeData(storeId){
        var index = -1;
        for(var i = 0; i < this.selectedStack.length; i++) {
          if(this.selectedStack[i].storeId == storeId){
              index = i;
              break;
          }
        }
        if( index > -1 ) {
          this.selectedStack.splice(index, 1);
        }
    }

    getData(){
        return this.selectedStack;
    }

    handleConfirm(){
      this.props.onConfirm(this.getData());
    }

    handleCancel(){
        this.hide();
        this.props.onCancel(this.getData());
    }

    handleItemClick(storeId, storeName, e){
        let $target = $(e.target);
        if( $target.hasClass("selected") ){
            this.removeData(storeId);
            $target.removeClass("selected");
        } else {
            this.addData({storeId, storeName});
            $target.addClass("selected");
        }
        this.props.onItemClick({storeId, storeName, target: e.target});
    }

    show(){
        this.setState({
            isShow: true
        });
    }

    hide(){
        this.setState({
            isShow: false
        });
    }

    toggle(){
      this.setState({
        isShow: !this.state.isShow
      });
    }

    render() {
        let {isShow} = this.state;
        let { isFullScreen } = this.props;
        return (
          <div className="store-container">
              <Animate
                className="store-backdrop"
                transitionName="fade"
                visible={isShow}
                onClick={()=>this.setState({isShow: false})}
                >
              </Animate>
              <Animate transitionName={isFullScreen ? "rotate-popup" : "popup"} className="store-selector" visible={isShow} style={{
                width: isFullScreen ? "400px" : "",
                height: isFullScreen ? window.innerWidth + "px" : "",
                left: isFullScreen ? "-200px" : "",
                top: isFullScreen ? window.innerHeight - 400 - window.innerWidth/2 + "px" : ""
              }}>
                  <h4 className="store-header">请选择对比的门店(最多3个)</h4>
                  <ul className="store-list" style={{height: isFullScreen ? window.innerWidth - 94 + "px" : ""}}>
                    {
                      this.props.data.map((item, index) => {
                        return (
                          <li key={index} onClick={this.handleItemClick.bind(this, item.storeId, item.name)}>
                              <Icon name="check" />
                              <span>{item.name}</span>
                          </li>
                        )
                      })
                    }
                  </ul>
                  <div className="store-actions t-PL16 t-PR16">
                      <HBox>
                          <Box flex={1} className="t-PR8">
                              <Button type="minor" onClick={this.handleCancel.bind(this)}>取消</Button>
                          </Box>
                          <Box flex={1} className="t-PL8">
                              <Button type="primary" onClick={this.handleConfirm.bind(this)}>确定</Button>
                          </Box>
                      </HBox>
                  </div>
              </Animate>
          </div>
        );
    }
}

Page.propTypes = {
  onItemClick: PropTypes.func,
  onCancel: PropTypes.func
};

Page.defaultProps = {
    onItemClick: Context.noop,
    onCancel: Context.noop
};

module.exports = Page;
