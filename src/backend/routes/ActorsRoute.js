import express from 'express'
import { glumci } from '../database/glumci.js'
import { body, validationResult, query, param } from 'express-validator';

const router = express.Router();
const app = express()
app.use(express.json())

const GetActor = (req, res, next) => {
    const id_route_params = parseInt(req.params.id);
    const foundActor = glumci.find(f => f.id === id_route_params);

    if(foundActor){
        req.actor = foundActor;
        next();
    } else
    return res.status(404).json({ message: 'Actor does not exist'});
}

const CheckAllActorBody = (req, res ,next) => {
    const requiredFields = [ name, birthyear, movies]

    for ( field in requiredFields){
        if (req.body[field]){
            return res.status(400).json({ message: `Missing field: ${field}`})
        }
    } 
    next()
}

const CheckActorBody = (req,res,next) => {
    
    if(!req.body){
        return res.status(400).json({message: 'Missing data'})
    }
    next()
    
}

const validateQuery = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get('/', [query('name').optional().isString().trim()],[validateQuery], (req,res) =>{
    res.json(glumci);
})

router.get('/:id', [GetActor],[param('id').isInt()], async (req,res) => {

    res.status(200).json(req.actor)

})

router.post('/', [CheckAllActorBody], async (req,res) => {

    try{
        const newActor = {
            id: glumci.length + 1,
            ...req.body
        }

        movies.push(newActor);

        res.status(201).json(newActor)
    } catch (error){
        res.status(500).json({ message: 'Failed to create an actor'})
    }
})

router.patch('/:id', [GetActor], [CheckActorBody],[body('birthYear').optional().isInt()], async (req,res) => {

    try{
        Object.assign(req.actor,req.body)
        res.json(req.actor)
    } catch (err){
        res.status(500).json({message: 'Failed to update actor', error: err})
    }
})

export default router;