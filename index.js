import Koa from 'koa'
import Stimulsoft from 'stimulsoft-reports-js'

Stimulsoft.Base.StiFontCollection.addOpentypeFontFile('./fonts/Roboto-Black.ttf')

const app = new Koa()
app.listen(3000)

const connectionString = [
  'Server=development',
  'Database=testDb',
  `Domain=${process.env.TEST_DOMAIN}`,
  `User=${process.env.TEST_USERNAME}`,
  `Password=${process.env.TEST_PASSWORD}`,
  'Trusted_Connection=Yes'
].join(';')

app.use(async ctx => {
  const report = new Stimulsoft.Report.StiReport()
  report.loadFile('./Test.mrt')

  const database = new Stimulsoft.Report.Dictionary.StiSqlDatabase('foo', 'bar')
  database.connectionString = connectionString
  
  report.dictionary.databases.clear()
  report.dictionary.databases.add(database)

  await report.renderAsync2()
  ctx.body = report.exportDocument(Stimulsoft.Report.StiExportFormat.Html)
  ctx.response.status = 200
})