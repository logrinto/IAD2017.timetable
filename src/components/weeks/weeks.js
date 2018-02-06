import React from "react";
import Week from "../week/week.js";
// import './style.scss';

const Weeks = ({ data, teachers, lessions }) => {
  // console.log('Weeks', data);
  return (
    <div>
      <div className="weeks-header">
        <div className="weeks-header-inner">
          <div className="weeks-header-inner--morning">
            <p>
              <span className="bold">Vormittag</span>&nbsp;&nbsp;&nbsp;08:15 –
              11:40
            </p>
          </div>
          <div className="weeks-header-inner--afternoon">
            <p>
              <span className="bold">Nachmittag</span>&nbsp;&nbsp;&nbsp;13:15 –
              16:45
            </p>
          </div>
        </div>
      </div>

      {data.map(week => {
        return (
          <Week
            data={week}
            key={week.id}
            teachers={teachers}
            lessions={lessions}
          />
        );
      })}
    </div>
  );
};

export default Weeks;
