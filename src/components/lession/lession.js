import React from 'react';
import moment from 'moment'
import Tableview from '../tableview/tableview.js'
// import './style.scss';

const Lession = ({ data, teachers, lession, details }) => {
  // console.log('lession data', data);

  var total = data.reduce( (sum, item) => {
    let newSum = sum;
    newSum += 4 * ((item.FR && item.FR.morning.lession) === lession.id || 0)
    newSum += 4 * ((item.FR && item.FR.afternoon.lession) === lession.id || 0)
    newSum += 4 * ((item.SA && item.SA.morning.lession) === lession.id || 0)
    newSum += 4 * ((item.SA && item.SA.afternoon.lession) === lession.id || 0)
    return newSum;
  }, 0);

  if (total === 0) {
    return null;
  }

  return (<div id={details && `detail-${lession.id}`} className="lession">
    <span className={`lession-bg lession-bg--${lession.color||'gray'}`} />
    <span>{total} Lektionen&nbsp;&nbsp;·&nbsp;&nbsp;</span>
    <span className="bold">{lession.title}</span> <span className="id">{lession.id}</span>
    {details && <Tableview
      data={data}
      filter={lession.id}
    />}
  </div>)
}

export default Lession
