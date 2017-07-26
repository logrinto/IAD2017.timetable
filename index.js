import Semesterplan from './src/semesterplan'


let plan = new Semesterplan({
  data: './src/data/data.yml',
  template: './src/template/main.hbs',
  dest: './public/index.html',
});

plan.process()
