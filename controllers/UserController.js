import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import {validationResult} from "express-validator";
import UserModel from "../models/user.js"

export const register = async (req, res) => {
  try {
    //вынесли указанный код в утилитную функцию handleValidstionErrors
    /*//..1.. после того, как информация прошла валидацию , ее нужно спарсить, для проверки ошибок используем функцию
    //поэтому в переменную errors мы хотим получить все ошибки validationResult
    // передав в функцию validationResult req, мы говорим, что хотим получить все, что пришло в запросе
    const errors = validationResult(req)
    // если ошибки не пустые (или если ошибка существует) , то верни статус 400 - неверный запрос, и все ошибки, которые получилось провалидировать
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array())
    }*/

    //..2..
    const password = req.body.password
    //генерируем алгоритм шифрования пароля
    const salt = await bcrypt.genSalt(10)
    //создаем переменную в которую попадет зашифрованный пароль
    //с помощью bcrypt и функции hash передаем открытый пароль(password) и алгоритм(salt) по которому пароль будет зашифрован
    const hash = await bcrypt.hash(password, salt)

    //..3.. готовим документ на создание пользователя с помощью mongo DB
    const doc = new UserModel({
      email: req.body.email,
      passwordHash: hash,
      fullName: req.body.fullName,
      username: req.body.username,
      avatarUrl: req.body.avatarUrl
    });

    //..4.. создаем пользователя в базе данных
    const user = await doc.save();

    //1. если нет ошибок, 2. пароль зашифрован, 3. создан документ и 4. сохранен в DB
    //после этого создаем токен, в объект помещаем информацию, которая подлежит шифрованию
    //третий параметр у sign - это срок жизни токена

    const token = jwt.sign({
         _id: user._id
       },
       'secret123',
       {
         expiresIn: '30d'
       }
    )

    //исключим свойство password из объекта user, чтобы оно не приходило в res

    const {passwordHash, ...userData} = user._doc

//  возвращаем информацию о пользователе в виде json и токен
    res.json({
      ...userData,
      token
    })

  } catch (err) {
    console.log(err) //конкретную ошибку выводим для себя в консоль
// возвращаем пользователю ответ, с указанием статуса ошибки
    res.status(500).json({
      message: "failed to register"
    })
  }
}
export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({email: req.body.email})
    if (!user) {
      res.status(404).json({
        message: "user is not found"
      })
    }
    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

    if (!isValidPass) {
      res.status(400).json({
        message: "incorrect email or password"
      })
    }
    const token = jwt.sign({
         _id: user._id
       },
       'secret123',
       {
         expiresIn: '30d'
       }
    )
    const {passwordHash, ...userData} = user._doc

    res.json({
      ...userData,
      token
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "failed to login"
    })
  }
}
export const getMe = async (req, res) => {
  try {
    // производим расшифровку токена в checkAuth
//ищем пользователя по id
    const user = await UserModel.findById(req.userId) //не понимаю, откуда берется userId?????

    if (!user) {
      return res.status(404).json({
        message: "user is not found"
      })
    }

    const {passwordHash, ...userData} = user._doc

    res.json(userData)
  } catch (e) {
    return res.status(500).json({
      message: "no access"
    })
  }
}