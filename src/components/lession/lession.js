import React from "react";
import moment from "moment";
import Tableview from "../tableview/tableview.js";
import Anchor from "../anchor/anchor.js";

// https://stackoverflow.com/questions/5366849/convert-1-to-0001-in-javascript
function padLeft(nr, n, str) {
  return Array(n - String(nr).length + 1).join(str || "0") + nr;
}

const Lession = ({ data, teachers, lession, details }) => {
  // console.log('lession data', data);

  var total = data.reduce((sum, item) => {
    let newSum = sum;
    newSum += 4 * ((item.FR && item.FR.morning.lession) === lession.id || 0);
    newSum += 4 * ((item.FR && item.FR.afternoon.lession) === lession.id || 0);
    newSum += 4 * ((item.SA && item.SA.morning.lession) === lession.id || 0);
    newSum += 4 * ((item.SA && item.SA.afternoon.lession) === lession.id || 0);
    newSum += 40 * ((item.week && item.week.lession) === lession.id || 0);
    return newSum;
  }, 0);

  if (total === 0) {
    return null;
  }

  return (
    <div id={details && `detail-${lession.id}`} className="lession">
      <span className={`lession-bg lession-bg--${lession.color || "gray"}`} />
      <span>{padLeft(total, 2)} Lektionen&nbsp;&nbsp;·&nbsp;&nbsp;</span>

      <Anchor prefix={"detail-"} anchor={lession.id}>
        <span className="bold">{lession.title} </span>
      </Anchor>
      {details && <Tableview data={data} filter={lession.id} />}
    </div>
  );
};

export default Lession;
