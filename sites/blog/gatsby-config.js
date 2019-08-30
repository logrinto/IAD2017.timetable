module.exports = {
  pathPrefix: `/IAD2017.timetable`,

  __experimentalThemes: [
    {
      resolve: "gatsby-theme-timetable",
      options: {
        root: __dirname
      }
    }
  ],

  siteMetadata: {
    generation: "2017",
    title: "Semesterplan",
    author: "Stefan Huber",
    authorUrl: "http://signalwerk.ch/",
    description: "Semesterplan für IAD"
  }
};
