const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');
// const User = mongoose.model('users');
const Story = mongoose.model('stories');

// STORIES INDEX
router.get('/', (req, res) => {
  Story.find({ status: 'public' })
    .populate('user')
    .sort({ date: 'desc' })
    .then((stories) => {
      res.render('stories/index', {
        stories,
      });
    });
});
// STORIES FROM A USER
router.get('/user/:userId', (req, res) => {
  Story.find({ user: req.params.userId, status: 'public' })
    .populate('user')
    .then((stories) => {
      res.render('stories/index', {
        stories,
      });
    });
});
// MY STORIES: LOGGEDIN USER STORIES
router.get('/my', ensureAuthenticated, (req, res) => {
  Story.find({ user: req.user.id })
    .populate('user')
    .then((stories) => {
      res.render('stories/index', {
        stories,
      });
    });
});
// STORIES: SHOW SINGLE STORY
router.get('/show/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id,
  })
    .populate('user')
    .populate('comments.commentUser')
    .then((story) => {
      if (story.status === 'public') {
        res.render('stories/show', {
          story,
        });
      } else if (req.user) {
        if (req.user.id === story.user.id) {
          res.render('stories/show', {
            story,
          });
        } else {
          res.redirect('/stories');
        }
      } else {
        res.redirect('/stories');
      }
    });
});

// STORIES: ADD FORM
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add');
});

// POST STORY
router.post('/', ensureAuthenticated, (req, res) => {
  let allowComments;

  if (req.body.allowComments) {
    allowComments = true;
  } else {
    allowComments = false;
  }

  const newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments,
    user: req.user.id,
  };
  // Create Story
  new Story(newStory).save().then((story) => {
    res.redirect(`/stories/show/${story.id}`);
  });
});
// STORIES EDIT FORM
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Story.findOne({
    _id: req.params.id,
  }).then((story) => {
    if (story.user != req.user.id) {
      res.redirect('/stories');
    } else {
      res.render('stories/edit', {
        story,
      });
    }
  });
});
// EDIT PUT REQUEST
router.put('/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id,
  }).then((story) => {
    let allowComments;

    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }

    // New values
    story.title = req.body.title;
    story.body = req.body.body;
    story.status = req.body.status;
    story.allowComments = allowComments;

    // console.log(story);

    story.save().then((story) => {
      res.redirect('/dashboard');
    });
  });
});

// DELETE STORY
router.delete('/:id', (req, res) => {
  Story.deleteOne({ _id: req.params.id }).then(() => {
    res.redirect('/dashboard');
  });
});
// ADD COMMENTS
router.post('/comment/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id,
  }).then((story) => {
    const newComment = {
      commentBody: req.body.commentBody,
      commentUser: req.user.id,
    };

    // Add to comment array at the beginning
    story.comments.unshift(newComment);

    story.save().then((story) => {
      res.redirect(`/stories/show/${story.id}`);
    });
  });
});

module.exports = router;
