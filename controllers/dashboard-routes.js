const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

// router.get('/', (req, res) => {
//     res.render('dashboard', { loggedIn: true });
//   });

  router.get('/', (req, res) => {
    Post.findAll({
      where: {
        user_id: req.session.user_id
        },
      attributes: [
        'id', 
        'title',
        'post_text', 
        'created_at', 
        ],
      order: [['created_at', 'DESC']],
      include: [
          //include User model
        {
            model: User,
            attributes: ['username']
          },
         // include the Comment model here:
     {
      model: Comment,
      attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
      include: {
        model: User,
        attributes: ['username']
      }
    },
       ]
    })
    .then(dbPostData => {
      // serialize data before passing to template
      const posts = dbPostData.map(post => post.get({ plain: true }));
      res.render('dashboard', { posts, loggedIn: true });
    })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  
module.exports = router;