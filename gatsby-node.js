// https://github.com/gatsbyjs/gatsby/issues/1583

exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
  const { createNodeField } = boundActionCreators;
  //   // console.log(node);
  //   // if (node.internal && node.internal.type === "SitePage") {
  //   // const jsFrontmatterNode = getNode(`${node.component} absPath of file >>> JSFrontmatter`);
  //   // if (jsFrontmatterNode) {
  //   createNodeField({
  //     node,
  //     name: "testsh___NODE",
  //     value: "IAD2017-students"
  //   });

  if (
    node.internal.owner === "gatsby-transformer-yaml" &&
    node.internal.type === "Iad2017SemestersYaml"
  ) {
    // const jsFrontmatterNode = getNode(`${node.component} absPath of file >>> JSFrontmatter`);
    const jsFrontmatterNode = getNode(`IAD2017-semester-01`);
    // if (jsFrontmatterNode) {
    console.log(
      "-------------------------------- found node",
      jsFrontmatterNode
    );
    // console.log(
    //   "-------------------------------- found node",
    //   jsFrontmatterNode
    // );
    createNodeField({
      node,
      name: "tsource",
      // name: "tsource___NODE",
      value: Object.assign({}, jsFrontmatterNode)

      // value: `/Users/glender/Dropbox/CODE_GIT/IAD2017.timetable/src/data/IAD2017/semester2018HS.yaml absPath of file`
    });
    // }
  }

  // if (
  //   // node.internal.owner === "internal-data-bridge" &&
  //   node.internal &&
  //   node.internal.type === `SitePage`
  // ) {
  //   console.log("-------------------------------- create node");
  //
  //   createNodeField({
  //     node,
  //     name: "newtestlink___NODE",
  //     value: `/Users/glender/Dropbox/CODE_GIT/IAD2017.timetable/src/data/IAD2017/semester01.yaml absPath of file`
  //   });
  //
  //   // createNodeField({
  //   //   node,
  //   //   name: "newtest",
  //   //   value: "IAD2017-semester-01"
  //   // });
  // }

  //   // }
  //   // }
};
