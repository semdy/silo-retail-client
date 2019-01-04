import './Stats.styl';

import React from 'react';

class StatItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        let suffix = "";
        if( this.props.suffix ){
            suffix = (
              <em>{this.props.suffix}</em>
            );
        }
        return (
            <div className="stats-item">
                <h4 className="stats-name">{this.props.name}</h4>
                <div className="stats-value">{this.props.value}{suffix}</div>
            </div>
        );
    }
}

class Stats extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (<div className="stats-container">
            <div className="stats-bd t-clear">
                {
                    this.props.statsData.map((item, index) => {
                        return (
                            <StatItem key={index} name={item.name} value={item.value} suffix={item.suffix}></StatItem>
                        )
                    })
                }
            </div>
        </div>);
    }
}

module.exports = Stats;
