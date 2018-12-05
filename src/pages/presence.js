import React from "react";
import Link from "gatsby-link";
import Semester from "../components/semester/semester.js";

const IndexPage = ({ data }) => {
  // class IndexPage extends React.Component {

  let root = data.allIad2017Yaml.edges[0].node.data;

  let date = Object.assign({}, root.date);
  // let filter = "ProjektWeek";

  if (typeof filter !== "undefined") {
    date = root.date.map(function(item) {
      console.log("filter", item);

      let newItem = Object.assign({}, item);

      Object.keys(newItem).forEach(keyKW => {
        if (newItem[keyKW] && keyKW != "id") {
          Object.keys(newItem[keyKW]).forEach(keyDay => {
            console.log("each", newItem[keyKW][keyDay].lession);

            if (!(newItem[keyKW][keyDay].lession == filter)) {
              newItem[keyKW][keyDay] = null;
            }
          });
        }
      });

      return newItem;
    });
  }

  date = root.date;

  let teachers = data.teachers.edges[0].node.data.teachers;
  let students = data.students.edges[0].node.students;
  let presence = data.presence.edges[0].node.presence;

  let getLession = key => {
    if (key) {
      return root.lessions.find(item => {
        return item.id == key;
      }).title;
    }
  };

  let saveData = ({ id, day, time }, person) => {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:4040/save", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    let newData = Object.assign({}, data.presence.edges[0].node);

    let fKW = newData.presence.find(item => {
      return item.id == id;
    });

    if (!fKW) {
      fKW = {
        id
      };
      newData.presence.push(fKW);
    }

    fKW[day] = fKW[day] || {};
    fKW[day][time] = fKW[day][time] || {};
    fKW[day][time].presence = fKW[day][time].presence || [];

    if (Array.isArray(person)) {
      fKW[day][time].presence = fKW[day][time].presence.concat(person);
    } else {
      var index = fKW[day][time].presence.indexOf(person);

      if (index > -1) {
        fKW[day][time].presence.splice(index, 1);
      } else {
        fKW[day][time].presence.push(person);
      }
    }

    // remove dupplicates
    fKW[day][time].presence = fKW[day][time].presence.filter(function(
      item,
      pos
    ) {
      return fKW[day][time].presence.indexOf(item) == pos;
    });

    console.log("newData = ", newData);
    xhr.send(JSON.stringify(newData));
  };

  console.log("checkPresence", data.presence.edges[0].node.presence);

  let checkPresence = ({ id, day, time }, person) => {
    //
    // id: KW.id,
    // KW: keyKW,
    // day: keyDay

    let fKW = presence.find(item => {
      return item.id == id;
    });

    if (fKW) {
      if (fKW[day] && fKW[day][time]) {
        return fKW[day][time].presence.find(item => {
          return item == person;
        });
      }
      return false;
    }

    return false;
  };

  return (
    <div>
      test
      <table className="rotate">
        <thead>
          <tr className="header">
            <th className="rotated_cell">
              <div className="rotate_text">
                <span>KW</span>
              </div>
            </th>
            {students.map(function(item) {
              return (
                <th className="rotated_cell">
                  <div className="rotate_text">
                    <span>{item.name}</span>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        {date &&
          date.map(function(KW) {
            return Object.keys(KW).map(keyKW => {
              if (KW[keyKW] && keyKW != "id") {
                return Object.keys(KW[keyKW]).map(keyDay => {
                  if (KW[keyKW][keyDay]) {
                    return (
                      <tbody>
                        <tr>
                          <td className="noWrap">
                            {KW.id} · {keyKW} · {keyDay} ·{" "}
                            {getLession(KW[keyKW][keyDay].lession)}{" "}
                            <span
                              onClick={e =>
                                saveData(
                                  {
                                    id: KW.id,
                                    day: keyKW,
                                    time: keyDay
                                  },
                                  students.map(item => item.id)
                                )
                              }
                            >
                              o
                            </span>
                          </td>
                          {students.map(function(item) {
                            let button = "0";
                            if (
                              checkPresence(
                                {
                                  id: KW.id,
                                  day: keyKW,
                                  time: keyDay
                                },
                                item.id
                              )
                            ) {
                              button = "x";
                            } else {
                              button = "o";
                            }

                            return (
                              <td>
                                <span
                                  onClick={e =>
                                    saveData(
                                      {
                                        id: KW.id,
                                        day: keyKW,
                                        time: keyDay
                                      },
                                      item.id
                                    )
                                  }
                                >
                                  {button}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      </tbody>
                    );
                  }
                });
              }
            });
          })}
      </table>
    </div>
  );
};

export const query = graphql`
  query SemesterQueryPresence {
    presence: allIad2017OthersYaml(
      filter: { id: { eq: "IAD2017-semester-01" } }
    ) {
      edges {
        node {
          id
          presence {
            id
            FR {
              morning {
                presence
              }
              afternoon {
                presence
              }
            }
            SA {
              morning {
                presence
              }
              afternoon {
                presence
              }
            }
            week {
              all {
                presence
              }
            }
          }
        }
      }
    }

    students: allIad2017OthersYaml(filter: { id: { eq: "IAD2017-students" } }) {
      edges {
        node {
          students {
            id
            name
          }
        }
      }
    }

    teachers: allIad2017Yaml(filter: { id: { eq: "IAD2017-teachers" } }) {
      edges {
        node {
          id
          data {
            teachers {
              id
              name
            }
          }
        }
      }
    }

    allIad2017Yaml(filter: { id: { eq: "IAD2017-2017HS" } }) {
      edges {
        node {
          data {
            semester {
              title
              class
              room
              notes
              links {
                title
                href
              }
            }
            lessions {
              id
              title
              color
            }
            date {
              id
              FR {
                morning {
                  teacher
                  lession
                  comment
                }
                afternoon {
                  teacher
                  lession
                  comment
                }
              }
              SA {
                morning {
                  teacher
                  lession
                  comment
                }
                afternoon {
                  teacher
                  lession
                  comment
                }
              }
              week {
                all {
                  teacher
                  lession
                  comment
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default IndexPage;
