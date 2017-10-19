import React from 'react';
import Weeks from '../weeks/weeks.js'
import Lessions from '../lessions/lessions.js'
// import './style.scss';

const Semester = ({ semester, data, teachers, lessions }) => {
  // console.log('Semester', data);
  return (<div className="semester">
    <h1>{semester.title}</h1>
    <h3>{semester.room}</h3>
    <p>Klasse {semester.class} · Änderungen vorbehalten.</p>

    <div className="navigation noPrint">
      <ul>
        {semester.links.map((link) => <li><a key={link.href} href={link.href}>→ {link.title}</a></li>)}
      </ul>
    </div>

    <Lessions
        data={data}
        teachers={teachers}
        lessions={lessions}
      />
    <Weeks
        data={data}
        teachers={teachers}
        lessions={lessions}
      />

      <div className="pagebreak"></div>

    <Lessions
        data={data}
        teachers={teachers}
        lessions={lessions}
        details={true}
      />


    <br /><br /><br /><br /><br />


    <h3>{semester.notes}</h3>


    <div className="noPrint">

        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />

        <div>
          <a href="https://github.com/logrinto/IAD2017.timetable" target="_blank">→ Stundenplan auf Github </a>
          <a href="webcal://logrinto.github.io/IAD2017.timetable/IAD.ics" target="_blank">→ Stundenplan abonnieren</a>
        </div>

    </div>

  </div>)
}

export default Semester
