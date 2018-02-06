import React from "react";
import moment from "moment";
import Halfday from "../halfday/halfday.js";
// import './style.scss';

const Week = ({ data, teachers, lessions }) => {
  // console.log('Week', data);
  return (
    <div className="week">
      <span className="week--jump" id={data.id} />

      <div className="week--text">
        {data.FR && (
          <div className="week-header">
            <div className="week-header--title">
              <p>
                <span className="bold">
                  KW{moment(data.id, "[KW]ww-YYYY").format("ww · YYYY")}
                </span>
                <br />
                {moment(data.id, "[KW]ww-YYYY")
                  .add(5, "days")
                  .format("DD.MM")}/&shy;
                {moment(data.id, "[KW]ww-YYYY")
                  .add(6, "days")
                  .format("DD.MM.YYYY")}
              </p>
            </div>
            <div className="week-header--day">
              <div className="week-header--fr">
                <p>
                  <span className="bold">FR</span>
                </p>
              </div>
              <div className="week-header--sa">
                <p>
                  <span className="bold">SA</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {data.week && (
          <p>
            <span className="bold">
              KW{moment(data.id, "[KW]ww-YYYY").format("ww · YYYY")}
            </span>
            <br />
            {moment(data.id, "[KW]ww-YYYY")
              .add(1, "days")
              .format("DD.MM")}{" "}
            –{" "}
            {moment(data.id, "[KW]ww-YYYY")
              .add(5, "days")
              .format("DD.MM.YYYY")}
          </p>
        )}
      </div>

      <div className="week--date">
        {data.FR && (
          <div className="week--day week-FR--day">
            <div className="week--morning">
              <Halfday
                data={data.FR.morning}
                teachers={teachers}
                lessions={lessions}
              />
            </div>
            <div className="week--afternoon">
              <Halfday
                data={data.FR.afternoon}
                teachers={teachers}
                lessions={lessions}
              />
            </div>
          </div>
        )}

        {data.SA && (
          <div className="week--day">
            <div className="week--morning">
              <Halfday
                data={data.SA.morning}
                teachers={teachers}
                lessions={lessions}
              />
            </div>
            <div className="week--afternoon">
              <Halfday
                data={data.SA.afternoon}
                teachers={teachers}
                lessions={lessions}
              />
            </div>
          </div>
        )}

        {data.week && (
          <div className="week--week">
            <div className="week--allweek">
              <Halfday
                data={data.week}
                teachers={teachers}
                lessions={lessions}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Week;
