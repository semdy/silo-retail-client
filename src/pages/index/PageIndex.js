require('./PageIndex.styl');

let { Toast } = SaltUI;
import ScrollNav from '../../components/ScrollNav';
import StoreSelector from '../../components/StoreSelector';
import {httpRequestStoreList} from '../../services/StoreService';

class Index extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0
    };
  }

  showStoreList() {
    if (this.state.isDataLoaded) {
      this.refs.storeSelector.show();
    }
  }

  handleConfirm(storeList) {
    if (storeList.length > 3) {
      return Toast.show({
        type: 'error',
        content: "门店最多只能选3个"
      });
    }

    this.refs.storeSelector.hide();
  }

  componentDidMount() {
    //获得门店列表的数据
    httpRequestStoreList().then((storeList) => {
      /*this.setState({
        storeList: storeList,
        isDataLoaded: true
      });*/
      //取第一家店铺的storeId
      let storeId = storeList[0].storeId;
    });
  }

  render() {
    return (
      <div>
{/*        <ScrollNav activeIndex={this.state.activeIndex}
                   showLeftBar={true}
                   showRightBar={true}
                   rightBarClick={this.showStoreList.bind(this)}>
        </ScrollNav>
        {
          !this.state.isDataLoaded ? "" :
            <StoreSelector ref="storeSelector"
                           onConfirm={this.handleConfirm.bind(this)}
                           data={this.state.storeList}
            >
            </StoreSelector>
        }*/}
      </div>
    );
  }
}

module.exports = Index;
