import React from "react";
import Link from "gatsby-link";
import Semester from "../components/semester/semester.js";

const IndexPage = ({ data }) => {
  let root = data.allIad2017Yaml.edges[0].node.data;
  let teachers = data.teachers.edges[0].node.data.teachers;

  // for root index-page links
  root.semester.links.forEach(element => {
    element.href = element.href.replace("../", "./");
  });

  return (
    <Semester
      semester={root.semester}
      data={root.date}
      teachers={teachers}
      lessions={root.lessions}
    />
  );
};

export const query = graphql`
  query SemesterQueryIndex {
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

    allIad2017Yaml(filter: { id: { eq: "IAD2017-2018FS" } }) {
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
