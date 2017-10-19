import React from 'react'
import Link from 'gatsby-link'
import Semester from '../components/semester/semester.js'

const IndexPage = ({ data }) => {
  console.log('root', data);
  let root = data.allIad2017Yaml.edges[0].node.data;
  return <Semester
        semester={root.semester}
        data={root.date}
        teachers={root.teachers}
        lessions={root.lessions}
      />
}

export const query = graphql`
query SemesterQuery2017HS {
  allIad2017Yaml {
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
          teachers {
            id
            name
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
              lession
              comment
            }
          }
        }
      }
    }
  }
}

`

export default IndexPage
