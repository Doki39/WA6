import express from 'express'
import { movies } from '../database/movies.js'
import { body, validationResult, query, param } from 'express-validator';

const router = express.Router();
const app = express()
app.use(express.json())

const GetMovie = (req, res, next) => {
    const id_route_params = parseInt(req.params.id);
    const foundMovie = movies.find(f => f.id === id_route_params);

    if(foundMovie){
        req.movie = foundMovie;
        next();
    } else
    return res.status(404).json({ message: 'Movie does not exist'});
}

const CheckAllMovieBody = (req, res ,next) => {
    const requiredFields = [ title, year, genre, director]

    for ( field in requiredFields){
        if (req.body[field]){
            return res.status(400).json({ message: `Missing field: ${field}`})
        }
    } 
    next()
}

const CheckMovieBody = (req,res,next) => {
    
    if(!req.body){
        return res.status(400).json({message: 'Missing data'})
    }
    next()
    
}

const yearValidation = (req, res, next) => {
    const { min_year, max_year } = req.query;

    if (!min_year || !max_year) {
        return next();
    }

    const min = Number(min_year);
    const max = Number(max_year);

    if (min >= max) {
        return res.status(400).json({
            message: 'min_year must be smaller than max_year'
        });
    }

    next();
};

const validateQuery = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};


app.get('/', (req, res) => {
  res.send('Server radi')
})

router.get('/', [query('min_year').isInt(), query('max_year').isInt()],[yearValidation, validateQuery],(req,res) =>{
    res.json(movies);
})

router.get('/:id', [GetMovie],[param('id').isInt()], async (req,res) => {


    res.status(200).json(req.movie)

})

router.post('/', [CheckAllMovieBody], [body('year').isInt()], async (req,res) => {


    try{
        const newMovie = {
            id: movies.length + 1,
            ...req.body
        }

        movies.push(newMovie);

        res.status(201).json(newMovie)
    } catch (error){
        res.status(500).json({ message: 'Failed to create a movie'})
    }
})

router.patch('/:id', [GetMovie], [CheckMovieBody], async (req,res) => {

    try{
        Object.assign(req.movie,req.body)
        res.json(req.movie)
    } catch (err){
        res.status(500).json({message: 'Failed to update the movie', error: err})
    }
})

export default router;