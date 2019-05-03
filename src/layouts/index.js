import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'


import './normalize.css';
import './index.scss'



const TemplateWrapper = ({ children }) => (
  <div>
    <Helmet
      title="Semesterplan"
      meta={[
        { name: 'description', content: 'Semesterplan für IAD' },
        { name: 'keywords', content: 'IAD, Semesterplan' },
      ]}
    />
    <div>
      {children()}
    </div>
  </div>
)

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper
