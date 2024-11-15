import LikeModel from '../models/likes.js';


export const addDeleteLike = async (req, res) =>{
    const targetId = req.params.targetId;
    const userId = req.user._id;
    const targetType = req.body.targetType; // Тип сущности (например, 'Post', 'Comment', 'User')
  
    try {
      // Проверяем, есть ли уже лайк от этого пользователя
      const existingLike = await LikeModel.findOne({ user: userId, targetId, targetType });
  
      if (existingLike) {
        // Если лайк уже есть, удаляем его (дизлайк)
        await LikeModel.deleteOne({ _id: existingLike._id });
      } else {
        // Если лайка нет, создаем новый
        const newLike = new LikeModel({ user: userId, targetId, targetType });
        await newLike.save();
      }
  
      res.status(200).json({ message: 'Success' });
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
}

export const getLikes = async (req, res) => {
    const targetId = req.params.targetId;
    const targetType = req.query.targetType;
    const userId = req.user._id;
  
    try {
      // Получаем количество лайков для сущности
      const likesCount = await LikeModel.countDocuments({ targetId, targetType });
  
      // Проверяем, лайкнул ли текущий пользователь
      const likedByUser = await LikeModel .exists({ user: userId, targetId, targetType });
  
      res.status(200).json({ likesCount, likedByUser });
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  }

    
  





