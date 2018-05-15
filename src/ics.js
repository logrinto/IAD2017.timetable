import fs from "fs";
import yaml from "js-yaml";
import moment from "moment";
import uuid from "uuid";
import { Component, Property } from "immutable-ics";

const now = new moment();

class Semesterplan {
  constructor() {
    // all the events we later write out
    this.events = [];
    this.teachers = [];
  }

  // get yml data
  loader(path) {
    try {
      return yaml.safeLoad(fs.readFileSync(path, "utf8"));
    } catch (e) {
      console.log(e);
    }
  }

  // add teachers
  addTeachers(path) {
    let data = this.loader(path);
    this.teachers = data.data.teachers;
  }

  // add events based on a yaml
  add(path) {
    let data = this.loader(path);
    this.process({
      lessions: data.data.lessions,
      date: data.data.date
    });
  }

  // get name of teacher by id
  teacherResolve(teacherFilter) {
    let data = this.teachers.find(teacher => teacher.id == teacherFilter);
    if (data && data.name) {
      return data.name;
    } else {
      return "";
    }
  }

  // get name of lession by id
  lessionResolve(lessions, lessionFilter) {
    let data = lessions.find(lession => lession.id == lessionFilter);
    if (data && data.title) {
      return data.title;
    } else {
      return "";
    }
  }

  // process the dates for each week
  week(week, lessions) {
    if (week.FR) {
      this.events.push({
        dates: {
          start: new moment(week.id, "[KW]ww-YYYY")
            .add(5, "d")
            .hour(8)
            .minute(15),
          end: new moment(week.id, "[KW]ww-YYYY")
            .add(5, "d")
            .hour(11)
            .minute(40)
        },
        comment: week.FR.morning.comment,
        teacher: this.teacherResolve(week.FR.morning.teacher) || "",
        title:
          this.lessionResolve(lessions, week.FR.morning.lession) ||
          (week.FR.morning.comment || "")
      });
      this.events.push({
        dates: {
          start: new moment(week.id, "[KW]ww-YYYY")
            .add(5, "d")
            .hour(13)
            .minute(15),
          end: new moment(week.id, "[KW]ww-YYYY")
            .add(5, "d")
            .hour(16)
            .minute(45)
        },
        comment: week.FR.afternoon.comment,
        teacher: this.teacherResolve(week.FR.afternoon.teacher) || "",
        title:
          this.lessionResolve(lessions, week.FR.afternoon.lession) ||
          (week.FR.afternoon.comment || "")
      });
    }

    if (week.SA) {
      this.events.push({
        dates: {
          start: new moment(week.id, "[KW]ww-YYYY")
            .add(6, "d")
            .hour(8)
            .minute(15),
          end: new moment(week.id, "[KW]ww-YYYY")
            .add(6, "d")
            .hour(11)
            .minute(40)
        },
        comment: week.SA.morning.comment,
        teacher: this.teacherResolve(week.SA.morning.teacher) || "",
        title:
          this.lessionResolve(lessions, week.SA.morning.lession) ||
          (week.SA.morning.comment || "")
      });
      this.events.push({
        dates: {
          start: new moment(week.id, "[KW]ww-YYYY")
            .add(6, "d")
            .hour(13)
            .minute(15),
          end: new moment(week.id, "[KW]ww-YYYY")
            .add(6, "d")
            .hour(16)
            .minute(45)
        },
        comment: week.SA.afternoon.comment,
        teacher: this.teacherResolve(week.SA.afternoon.teacher) || "",
        title:
          this.lessionResolve(lessions, week.SA.afternoon.lession) ||
          (week.SA.afternoon.comment || "")
      });
    }

    if (week.week) {
      this.events.push({
        dates: {
          start: new moment(week.id, "[KW]ww-YYYY")
            .add(1, "d")
            .hour(8)
            .minute(15),
          end: new moment(week.id, "[KW]ww-YYYY")
            .add(1, "d")
            .hour(16)
            .minute(45),
          repeat: true
        },
        comment: week.week.all.comment,
        teacher: this.teacherResolve(week.week.all.teacher) || "",
        title:
          this.lessionResolve(lessions, week.week.all.lession) ||
          (week.week.all.comment || "")
      });
    }
  }

  // process each week
  process({ date, lessions }) {
    date.forEach(item => this.week(item, lessions));
  }

  // generate the icsEvent
  icsEvent(data) {
    var notes = "";

    if (data.teacher) {
      notes += "Lehrer: " + (data.teacher || "noch offen");
      notes += "\n\n";
    }
    if (data.comment) {
      notes += data.comment;
    }

    var properties = [
      new Property({
        name: "UID",
        value: uuid.v1()
      }),
      new Property({
        name: "DTSTAMP",
        value: now.toDate(),
        parameters: {
          // VALUE: 'DATE-TIME',
          TZID: "Europe/Zurich"
        }
      }),
      new Property({
        name: "SUMMARY",
        value: data.title
      }),
      new Property({
        name: "DTSTART",
        value: data.dates.start.toDate(),
        parameters: {
          // VALUE: 'DATE-TIME',
          TZID: "Europe/Zurich"
        }
      }),
      new Property({
        name: "DTEND",
        value: data.dates.end.toDate(),
        parameters: {
          // VALUE: 'DATE-TIME',
          TZID: "Europe/Zurich"
        }
      }),
      new Property({
        name: "DESCRIPTION",

        value: notes
      })
    ];

    if (data.dates.repeat) {
      properties.push(
        new Property({
          name: "RRULE",
          value: "FREQ=DAILY;COUNT=5"
        })
      );
    }

    var event = new Component({
      name: "VEVENT",
      properties
    });

    return event;
  }

  // generate the ics
  ics(path) {
    var events = [];

    this.events.forEach(value => {
      events.push(this.icsEvent(value));
    });

    const calendar = new Component({
      name: "VCALENDAR",
      components: events,
      properties: [
        new Property({
          name: "VERSION",
          value: 2
        }),
        new Property({
          name: "PRODID",
          value: "logrinto"
        })
      ]
    });

    let out = calendar.toString();
    fs.writeFileSync(path, out);
    console.log("ics written to " + path);
  }
}

console.log("-- start ics generation --");
let ics = new Semesterplan();
ics.addTeachers("./src/data/IAD2017/teachers.yaml");
ics.add("./src/data/IAD2017/semester2017HS.yaml");
ics.add("./src/data/IAD2017/semester2018FS.yaml");
ics.add("./src/data/IAD2017/semester2018HS.yaml");
ics.ics("./public/IAD.ics");
console.log("-- end ics generation --");
