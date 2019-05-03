import React from "react";

// let stylesStr;
// if (process.env.NODE_ENV === `production`) {
//   try {
//     stylesStr = require(`!raw-loader!../public/styles.css`);
//   } catch (e) {
//     console.log(e);
//   }
// }

class HTML extends React.Component {
  render() {
    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <meta name="viewport" content="width=640" />
          {/*<meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />*/}
          {this.props.headComponents}
        </head>
        <body>
          {this.props.preBodyComponents}
          <div
            key={`body`}
            id="___gatsby"
            dangerouslySetInnerHTML={{ __html: this.props.body }}
          />
          {this.props.postBodyComponents}
        </body>
      </html>
    );
  }
};

export default HTML;
