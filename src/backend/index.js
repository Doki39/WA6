import express from 'express'
import { body, validationResult, query, param } from 'express-validator';
import MoviesRoute from './routes/MoviesRoute.js';
import ActorRoute from './routes/ActorsRoute.js';

const app = express()
app.use(express.json())
const PORT = 3000


app.listen(PORT, () => {
  console.log(`Server pokrenut na http://localhost:${PORT}`)
})

app.get('/', (req, res) => {
  res.send('Server radi')
})


app.use('/movies', MoviesRoute)
app.use('/actors', ActorRoute)
