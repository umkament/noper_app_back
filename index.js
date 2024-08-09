import express, {json} from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import {registerValidation, loginValidation, postCreateValidation} from "./validations/validations.js";
import {checkAuth, handleValidationErrors} from "./utils/index.js";
import {UserController, PostController} from "./controllers/index.js";

import * as path from "path";
import dotenv from 'dotenv';

const PORT = process.env.PORT || 4411

dotenv.config()

//делаем подключение к базе данных mongodb
//с помощью then проверяем, удалось ли нам подключиться
mongoose
   .connect(process.env.MONGODB_URI)
   .then(() => console.log('DB ok'))
   .catch((err) => console.log(' DB error', err))

//вызывая функцию express() - создается приложение
// вся логика express хранится в переменной app
const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb)=>{
cb(null, path.resolve('./uploads'))
  },
  filename: (_, file, cb)=>{
    cb(null, file.originalname)
  }
})


const upload = multer({storage})

//указываем, что в приложении нужно использовать json из самого express
//благодаря этому наше приложение может читать json формат
app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))


// если придет запрос на '/auth/register', тогда мы проверим этот запрос на валидацию, прописанную в registerValidation
// и если валидация проходит, то только после этого начнет выполняться колбэк функция

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register )
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.get('/auth/me', checkAuth, UserController.getMe)
app.get('/users', UserController.getAllUsers)
app.get('/user/:userId', UserController.getOneUser)
app.get('/user/:userId/posts', PostController.getUserPosts)

 app.get('/posts', PostController.getAll)
 app.get('/post/:id', PostController.getOne)
 app.post('/post',checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
 app.delete('/post/:id', checkAuth, PostController.remove)
 app.patch('/post/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)

app.post('/upload', checkAuth, upload.single('image'), (req, res) =>{
  res.json({
    url: `/uploads/${req.file.originalname}`
  })
})

//следующий код запускает непосредственно веб-сервер
// функция listen первым параметром принимает порт, а вторым (необязательным) функцию, в которой
// мы говорим: если наш сервер не смог запуститься, то мы вернем об этом сообщение
// если ошибки нет, то функция вернет сообщение 'server ok'

app.listen(PORT, (err) => {
  if (err) {
    return console.log(err)
  }
  console.log('SERVER OK')
})

