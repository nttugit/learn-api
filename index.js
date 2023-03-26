const express = require("express")
const cors = require("cors")
const lowDb = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")
const bodyParser = require("body-parser")
const { nanoid } = require("nanoid")
require('dotenv').config();
const db = lowDb(new FileSync('db.json'))
const fs = require('fs');
let rawData = fs.readFileSync('db.json');
let routes = JSON.parse(rawData);

const PORT = process.env.PORT || 3001;
db.defaults({ products: [] }).write()

const app = express()

const modules = Object.keys(routes)
const { response } = require('./utils');

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send(`<h2 align="center" style="margin-top: 100px;">customized an powered by nttu</h2>`)
})

app.post('/api/suntech/login', (req, res) => {
  const user = db.get('users').find({ email: req.body.email, password: req.body.password }).value()

  if (!user) {
    res.json({ success: false })
  } else {
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    })
  }
})

modules.forEach(moduleName => {
  // console.log(moduleName)
  app.get(`/api/suntech/${moduleName}`, (req, res) => {
    const data = db.get(`${moduleName}`).value()
    return res.json(response.ok(data))
  })

  app.get(`/api/suntech/${moduleName}/:id`, (req, res) => {
    const data = db.get(`${moduleName}`).find({ id: req.params.id })
    console.log("data", data)
    return res.json(response.ok(data))
  })

  app.post(`/api/suntech/${moduleName}`, (req, res) => {
    const note = req.body;
    const id = nanoid();
    db.get(`${moduleName}`).push({
      ...note, id
    }).write()
    const data = db.get(`${moduleName}`).find({ id })
    return res.json(response.created(data))
  })

  app.put(`/api/suntech/${moduleName}/:id`, (req, res) => {
    const note = req.body;
    const { id } = req.params;
    db.get(`${moduleName}`).find({ id }).assign(note).write();
    const data = db.get(`${moduleName}`).find({ id });
    res.json(response.ok(data));
  })

  app.delete(`/api/suntech/${moduleName}/:id`, (req, res) => {
    const { id } = req.params;
    db.get(`${moduleName}`).remove({ id: req.params.id }).write();
    const data = db.get(`${moduleName}`).find({ id });
    res.json(response.ok(data));
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
