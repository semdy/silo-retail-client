import './GoodsInfo.styl'

import React from 'react'
import GoodsInfoStats from '../../components/goodsInfoStats'
import DateNavigator from '../../components/datenavigator'
import Top10Tab from '../../components/top10Tab'
import GoodsInfoPieChart from '../../components/goodsInfoPieChart'
import GoodsInfoBarChart from '../../components/goodsInfoBarChart'

class GoodsInfo extends React.Component {

  render () {
    return (
      <div>
        <GoodsInfoStats/>
        <DateNavigator/>
        <Top10Tab/>
        <GoodsInfoPieChart/>
        <GoodsInfoBarChart/>
      </div>
    )

  }
}

module.exports = GoodsInfo
