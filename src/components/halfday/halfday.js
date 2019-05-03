import React from "react";
import Anchor from "../anchor/anchor.js";

const Halfday = ({
  data: { teacher, lession, comment },
  teachers,
  lessions
}) => {
  // console.log('Halfday', data);

  let teacherObj = teachers.find(item => item.id === teacher);
  let lessionObj = lessions.find(item => item.id === lession);

  if (teacher && !teacherObj) {
    console.log("coudn't find teacher", teacher);
  }

  return (
    <Anchor prefix={"detail-"} anchor={lession}>
      <div className="halfday">
        <div
          className={`halfday--inner halfday-bg--${(lessionObj &&
            lessionObj.color) ||
            "gray"}`}
        >
          {teacherObj && (
            <div className="halfday--teacher">
              <span className="bg">{teacherObj.name}</span>
            </div>
          )}
          {lessionObj && (
            <div className="halfday--lession">
              <span className="bg">{lessionObj.title}</span>
            </div>
          )}
          {comment && (
            <div className="halfday--comment">
              <span className="bg">{comment}</span>
            </div>
          )}
        </div>
      </div>
    </Anchor>
  );
};

export default Halfday;
