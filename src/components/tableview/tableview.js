import React from 'react';
import moment from 'moment'
// import './style.scss';

const Tableview = ({ data, filter }) => {

  return (<div className="tableview">
    <ul>
        {data.map((week) => {
          return [
            (week.FR && week.FR.morning.lession === filter) && <li>{moment(week.id, '[KW]ww-YYYY').add(5, 'days').format('[KW]ww · [Fr] · DD.MM.YYYY')} · 08:15 – 11:40</li>,
            (week.FR && week.FR.afternoon.lession === filter) && <li>{moment(week.id, '[KW]ww-YYYY').add(5, 'days').format('[KW]ww · [Fr] · DD.MM.YYYY')} · 13:15 – 16:45</li>,
            (week.SA && week.SA.morning.lession === filter) && <li>{moment(week.id, '[KW]ww-YYYY').add(6, 'days').format('[KW]ww · [Sa] · DD.MM.YYYY')} · 08:15 – 11:40</li>,
            (week.SA && week.SA.afternoon.lession === filter) && <li>{moment(week.id, '[KW]ww-YYYY').add(6, 'days').format('[KW]ww · [Sa] · DD.MM.YYYY')} · 13:15 – 16:45</li>,
          ];
        })}
    </ul>
  </div>)
}

export default Tableview
