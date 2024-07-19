// создаем утилитную функцию-посредник (подобие middleWare)
//функция будет решать, можно ли возвращать какую-то секретную информацию или нет

import jwt from 'jsonwebtoken';


export const checkAuth = (req, res, next) => {
  //парсим токен, исключаем слово Bearer, которое приходит в Insomnia
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
  if (token) {
    try {
      //расшифровываем токен
      const decoded = jwt.verify(token, 'secret123');
      req.userId = decoded._id;
      next();
    } catch (e) {
      return res.status(403).json({
        message: "no access"
      })
    }

  } else {
    return res.status(403).json({
      message: "no access"
    })
  }
}

