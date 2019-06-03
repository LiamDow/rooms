import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import './CurrentEvent.css'

export default class CurrentEvent extends PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      showRemoveButton: false
    }
  }

  render() {
    const { event, prevEvent, nextEvent, onBook, onRemoveBooking } = this.props;

    if( ! event ) {
      return <div></div>
    }

    const now = moment();
    const remainingMinutes = -now.diff(event.end, 'minutes');
    const remainingSeconds = -now.diff(event.end, 'seconds');
    const showRemoveButton = event.isFlashEvent && event.id;

    if( event.available ) {
      return (
        <div className="CurrentEvent is-available">
          { remainingMinutes <= 120 ?
              remainingMinutes > 0 ?
                <div className="time">For {remainingMinutes} minutes</div>
                :
                <div className="time">For {remainingSeconds} seconds</div>
            :
            now.isSame(event.end, 'day') ?
              <div className="time">Until {moment(event.end).format('HH:mm')}hs</div>
              :
              now.isSame(prevEvent.end, 'day') ?
                <div className="time">The rest of the day</div>
                :
                <div className="time">All day</div>
          }

          <div className="title">Free Room</div>

          { remainingMinutes >= 5 &&
            <div className="actions">
              <button className="Button" onClick={() => onBook({
                start: now.clone().startOf('minute'),
                end: moment.min(now.clone().add(15, 'minutes').endOf('minute'), moment(event.end))
              })}>{`Reserve ${Math.min(15, remainingMinutes)} minutes`}</button>

              <a className="Link" onClick={() => onBook({
                start: now.clone().startOf('minute'),
                end: moment.min(now.clone().add(60, 'minutes').endOf('minute'), moment(event.end))
              })}>{ remainingMinutes >= 60 ? `Reserve for an hour` : `Reserve until the next meeting` }</a>
            </div>
          }

        </div>
      ) 
    }

    return (
      <div className="CurrentEvent">
        {now.isSame(event.end, 'day') ?
          remainingMinutes < 60 ?
            remainingMinutes > 0 ?
              <div className="time">There are {remainingMinutes} minutes left</div>
              :
              <div className="time">There are {remainingSeconds} seconds left</div>
            :
            <div className="time">Until {moment(event.end).format('HH:mm')}hs</div>
          :
          <div className="time">The rest of the day</div>
        }

        <div className={`title ${event.summary && event.summary.length > 30 ? 'small' : ''} `}>{event.summary ? event.summary : 'Private Event'}</div>

        {event.organizer && ! event.isFlashEvent && 
          <div className="booker">Booked by <strong>{event.organizer.displayName || event.organizer.email}</strong></div>
        }

        {event.isFlashEvent &&
          <div className={`actions ${showRemoveButton ? 'is-visible' : 'is-hidden'} `}>
            <a className="Link" onClick={() => showRemoveButton && onRemoveBooking(event)}>Release Room</a>
          </div>
        }
      </div>
    )
  }
}
