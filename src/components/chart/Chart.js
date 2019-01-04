import './Chart.styl'

import React, { PropTypes } from 'react'
import echarts from 'echarts'
import classnames from 'classnames'
import Helper from '../helper'
import dom from '../../utils/dom'

class Chart extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      width: this.props.width,
      height: this.props.height
    }
  }

  componentDidMount () {
    let timeout
    let responsive = this.props.responsive

    if (responsive) {
      this.setPieSize(() => {
        this.chartInstance = echarts.init(this.refs.chart)
      })
    } else {
      this.chartInstance = echarts.init(this.refs.chart)
    }

    this.resizeHandler = () => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        this.setPieSize(() => {
          this.chartInstance.resize()
        })
      }, 50)
    }

    dom.on(window, "resize", this.resizeHandler)

  }

  setPieSize (cb) {
    let responsive = this.props.responsive
    if (responsive) {
      this.setState({
        width: window.innerWidth,
        height: Math.max(this.props.minHeight, window.innerHeight - dom.offset(this.refs.chart).top - 10)
      }, cb)
    } else {
      this.setState({
        width: this.refs.chart.parentNode.offsetWidth
      }, cb)
    }
  }

  hideToolTip () {
    this.chartInstance.dispatchAction({
      type: 'hideTip'
    })
  }

  componentWillUnmount () {
    dom.off(window, "resize", this.resizeHandler)
    this.chartInstance.dispose()
  }

  refresh () {
    this.chartInstance.clear()
    this.chartInstance.setOption(this.props.data)
  }

  render () {
    let { width, height } = this.state
    let { title, titleCenter, alignCenter, helpText, data } = this.props
    return (
      <div className="t-FB1 card">
        {title &&
        <div className={classnames("chart-title", { center: titleCenter, alignCenter: alignCenter })}>
          <span>{title}</span>
          {
            helpText &&
            <Helper text={helpText}/>
          }
        </div>
        }
        <div ref="chart"
             className="chart"
             style={{
               width: width + "px",
               height: height + "px"
             }}
        >
        </div>

      </div>
    )
  }
}

Chart.defaultProps = {
  title: '',
  titleCenter: false,
  alignCenter: false,
  responsive: false,
  smooth: false,
  visible: true,
  width: window.innerWidth,
  minHeight: 300,
  helpText: ''
}

Chart.propTypes = {
  title: PropTypes.string,
  titleCenter: PropTypes.bool,
  responsive: PropTypes.bool,
  smooth: PropTypes.bool,
  visible: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
  minHeight: PropTypes.number,
  helpText: PropTypes.string
}

module.exports = Chart
