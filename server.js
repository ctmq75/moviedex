require('dotenv').config()
const express = require('express')


const app = express()

const helmet = require('helmet')
app.use(helmet())


const morgan = require('morgan')
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))

const cors = require('cors')
app.use(cors())



const MOVIELIST = require('./moviedata.json')

app.use(function validateBearerToken(req, res, next) {

  const authToken = req.get('Authorization')
  const apiToken = 'Bearer ' + process.env.API_TOKEN

  if ( authToken !== apiToken) {
    return res.status(401).json({ error: 'unauthorized' })
  }
  next()
})
function handleGetHome(req, res){
    res.send('hello!')
}
app.get('/', handleGetHome)


app.get('/movie', function handleGetMovie(req, res) {

  let responce = MOVIELIST;
  if (req.query.genre) {
    responce = responce.filter(mov =>
      mov.genre
      .toLowerCase()
      .includes(req.query.genre.toLowerCase())
    )
  }

  if (req.query.country) {
    responce = responce.filter(mov =>
      mov.country
      .toLowerCase()
      .includes(req.query.country.toLowerCase())
    )
  }

  if (req.query.avg_vote) {
    responce = responce.filter(mov =>
      Number(mov.avg_vote) > Number(req.query.avg_vote)
    )
  }
  res.json(responce)
})

// 4 parameters in middleware, express knows to treat this as error handler
app.use((error, req, res, next) => {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})

const port = process.env.PORT || 8000
app.listen(PORT, function(){
  console.log(`Server is listening at http://localhost:${PORT}`)
})