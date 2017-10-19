import React from 'react';
// import Week from '../week/week.js'
// import './style.scss';


// const Halfday = ({ teacher, lession, comment }) => (

const Wrapper = ({ children, anchor }) => {


  return (
    <div>
      {anchor && <a href={`#detail-${anchor}`}>
        {children}
      </a>}
      {!anchor && children}
    </div>
  )

}


const Halfday = ({ data: {teacher, lession, comment}, teachers, lessions }) => {
  // console.log('Halfday', data);

  let teacherObj = teachers.find(item => item.id == teacher)
  let lessionObj = lessions.find(item => item.id == lession)

  return (
    <Wrapper
      anchor={lession}
      >
      <div className="halfday">
        <div className={`halfday--inner halfday-bg--${lessionObj && lessionObj.color||'gray'}`}>
          {teacherObj && <div className="halfday--teacher"><span className="bg">{teacherObj.name}</span></div>}
          {lessionObj && <div className="halfday--lession"><span className="bg">{lessionObj.title}</span></div>}
          {comment && <div className="halfday--comment"><span className="bg">{comment}</span></div>}
        </div>
      </div>
    </Wrapper>
  )
}

export default Halfday
