import PetModel from '../models/pet.js'

export const getAll = async (req, res) => {
  try {
    const pets = await PetModel.find().populate('user', '-passwordHash').exec()
    res.json(pets)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'failed to return pets'
    })
  }
}
export const getOne = async (req, res) =>{
  try {
    const petId = req.params.id

    const doc = await PetModel.findOneAndUpdate(
       {_id: petId},
       {$inc: {viewCount: 1}},
       {returnDocument: 'after'}
    )
       if(!doc) {
         res.status(404).json({
           message: 'pet not found'
         })
       }

         res.json(doc)
  }catch (err){
    console.log(err)
    res.status(500).json({
      message: 'failed to return the pet'
    })
  }
}
export const createPet = async (req, res) => {
  try {
    const doc = new PetModel({
      titleAdvt: req.body.titleAdvt,
      description: req.body.description,
      name: req.body.name,
      kindOfPet: req.body.kindOfPet,
      mainImageUrl: req.body.mainImageUrl,
      user: req.userId
    })
    const pet = await doc.save()
    res.json(pet)
  } catch(err) {
    console.log(err)
    res.status(500).json({
      message: 'failed to create petAdvt'
    })
  }
}
export const removePet = async (req, res) =>{
  try {
    const petId = req.params.id

    const doc = await PetModel.findOneAndDelete({_id: petId})
    if(!doc) {
      res.status(404).json({
        message: 'pet not found'
      })
    }
    res.json({
      success: true 
    })
  }catch (err){
    console.log(err)
    res.status(500).json({
      message: 'failed to remove the pet'
    })
  }
}
export const updatePet = async (req, res) =>{
  try {
    const petId = req.params.id

    const doc = await PetModel.updateOne(
       {_id: petId},
       {
         titleAdvt: req.body.titleAdvt,
         description: req.body.description,
         name: req.body.name,
         kindOfPet: req.body.kindOfPet,
         mainImageUrl: req.body.mainImageUrl,
         user: req.userId
       })

    if(!doc) {
      res.status(404).json({
        message: 'pet not found'
      })
    }

    res.json({
      success: true
    })
  }catch (err){
    console.log(err)
    res.status(500).json({
      message: 'failed to update the pet'
    })
  }
}