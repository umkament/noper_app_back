import PostModel from '../models/post.js';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';



export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить тэги',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();
    console.log('Received posts:', posts);

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};
export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        message: 'Неверный идентификатор статьи',
      });
    }
    const objectId = new ObjectId(postId)

    const doc = await PostModel.findOneAndUpdate(
      { _id: objectId },
      { $inc: { viewsCount: 1 } },
      { returnDocument: 'after' }
    ).populate('user');

    if (!doc) {
      return res.status(404).json({
        message: 'Статья не найдена',
      });
    }

    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Не удалось вернуть статью',
    });
  }
};

export const getUserPosts = async (req, res)=>{
try{
const {userId} = req.params
if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
  return res.status(400).json({
    message: 'Неверный идентификатор пользователя',
  });
}
const objectId = new mongoose.Types.ObjectId(userId)
const posts = await PostModel.find({user: objectId}).exec()
if (!posts.length) {
  return res.status(404).json({
    message: 'Посты пользователя не найдены',
  });
}
res.json(posts)
}catch(err){
  console.error(err);
  res.status(500).json({
    message: 'Не удалось получить посты пользователя',
  });
}
}

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось удалить статью',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена',
          });
        }

        res.json({
          success: true,
        });
      },
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const create = async (req, res) => {
  try {
    const {title, text, imageUrl, tags} = req.body
    console.log('Received imageUrl:', imageUrl);

    const doc = new PostModel({
      title,
      text,
      imageUrl,
      tags,  /*.split(','),*/
      user: req.userId
    });

    console.log('Received imageUrl:', );

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать статью',
    });
  }
};
export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags
        //tags: req.body.tags.split(','),
      },
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить статью',
    });
  }
};
