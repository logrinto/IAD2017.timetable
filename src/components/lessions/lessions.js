import React from "react";
import moment from "moment";
import Lession from "../lession/lession.js";
// import './style.scss';

const Lessions = ({ data, teachers, lessions, details }) => {
  // console.log('Lessions', data);
  let sortLession = lessions.sort((a, b) => {
    let titleA = a.title.toUpperCase(); // ignore upper and lowercase
    let titleB = b.title.toUpperCase(); // ignore upper and lowercase
    if (titleA < titleB) return -1;
    if (titleA > titleB) return 1;
    return 0;
  });

  return (
    <div className="lessions">
      {sortLession.map(lession => {
        return (
          <Lession
            key={lession.id}
            data={data}
            teachers={teachers}
            lession={lession}
            details={details}
          />
        );
      })}
    </div>
  );
};

export default Lessions;
