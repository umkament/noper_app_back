import {body} from 'express-validator'

export const registerValidation = [
  body('fullName', 'enter fullName').isLength({min: 2}),
  body('username', 'enter username').isLength({min: 2}),
  body('email', 'invalid email format').isEmail(),
  body('password', 'password must contain at least 5 characters').isLength({min: 5}),
  body('avatarUrl', 'wrong avatar link').optional().isURL(),
  //body('dateOfBirth', 'wrong date of birth').optional().isDate()
]
export const loginValidation = [
  body('email', 'invalid email format').isEmail(),
  body('password', 'password must contain at least 5 characters').isLength({min: 5}),
]

export const petCreateValidation = [
  body('titleAdvt', 'enter article title').isLength({min: 1}).isString(),
  body('description', 'describe your pet').isLength({min: 1}).isString(),
  body('name', 'enter pet name').isLength({min: 1}).isString(),
  body('kindOfPet', 'enter kind of pet').isLength({min: 1}).isString(),
  body('mainImageUrl', 'invalid image link').optional().isString(),
]



