import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import './TimelineEvent.css'

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default class TimelineEvent extends Component {

  render() {
    const {event, isPrev, isNext} = this.props;
    
    if( ! event ) {
      return (
      <div className="TimelineEvent">
        {isNext ?
          <div className="subtitle">Next meeting:</div>
          :
          <div className="subtitle">Previous meeting:</div>
        }
        <div className="title">Free room</div>
      </div>
      )
    }

    const startDate = event ? moment(event.start) : null;
    const endDate = event ? moment(event.end) : null;
    const duration = endDate.diff(startDate, 'minutes');
    const now = moment();

    if( event.available ) {
      return (
        <div className="TimelineEvent">
          {isNext ?
            now.isSame(startDate, 'day') ?
              <div className="subtitle">Starting at {startDate.format('HH:mm')}hs</div>
              :
              <div className="subtitle">From {startDate.format('dddd')} till {startDate.format('HH:mm')}hs</div>
            :
            now.isSame(endDate, 'day') ?
              <div className="subtitle">Before the {endDate.format('HH:mm')}hs</div>
              :
              <div className="subtitle">Previously the {endDate.format('dddd')} till {endDate.format('HH:mm')}hs</div>
          }
          {isNext ? 
            now.isSame(endDate, 'day') ?
              <div className="title">Free room for {duration >= 120 ? `${Math.floor(duration/60)} hours` : `${duration} minutes`}</div>
              :
              <div className="title">Free room for the rest of the day</div>
            :
            <div className="title">Free room</div>
          }
        </div>
      )
    }

    return (
      <div className="TimelineEvent">
        {isNext ?
          now.isSame(startDate, 'day') ?
            <div className="subtitle">Next meeting at {startDate.format('HH:mm')} till {endDate.format('HH:mm')}hs</div>
            :
            now.clone().add(1, 'day').isSame(startDate, 'day') ?
              <div className="subtitle">Next meeting tomorrow at {startDate.format('HH:mm')} till {endDate.format('HH:mm')}hs</div>
              :
              <div className="subtitle">Next meeting on {startDate.format('dddd')} at {startDate.format('HH:mm')} till {endDate.format('HH:mm')}hs</div>
          :
          now.isSame(endDate, 'day') ?
            <div className="subtitle">Last meeting at {startDate.format('HH:mm')} till {endDate.format('HH:mm')}hs</div>
            :
            now.clone().add(-1, 'day').isSame(startDate, 'day') ?
              <div className="subtitle">Last meeting yesterday from {startDate.format('HH:mm')} till {endDate.format('HH:mm')}hs</div>
              :
              <div className="subtitle">A long time ago, in a Cloud far far away...</div>
        }
        <div className="title">{event.summary}</div>
      </div>
    )
  }

}
