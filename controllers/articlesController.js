const Article = require('../models/Article');
const NotFoundError = require('../middleware/handleErrors');
const ForbiddenError = require('../middleware/handleErrors');
const logger = require('../middleware/logger');


exports.getArticlesByUser = async (req, res, next) => {
  try {
    const articles = await Article.find({ owner: req.user.id });
    return res.json(articles);
  } catch (err) {
    logger.error(
      `Error fetching articles by user ${req.user.id}: ${err.message}`,
    );
    return next(err);
  }
};

/*exports.createArticle = async (req, res, next) => {
  try {
    const newArticle = new Article({ ...req.body, owner: req.user.id });
    const article = await newArticle.save();
    return res.status(201).json(article);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation Error',
        message: err.message,
      });
    }
    logger.error(
      `Error creating article for user ${req.user.id}: ${err.message}`,
    );
    return next(err);
  }
};*/

exports.createArticle = async (req, res, next) => {
  try {
    const { keyword, title, text, date, source, link, image } = req.body;
    Article.create({
      keyword,
      title,
      text,
      date,
      source,
      link,
      image,
      owner: req.user._id,
    })
      .then((article) => res.send(article))
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation Error',
        message: err.message,
      });
    }
    logger.error(
      `Error creating article for user ${req.user.id}: ${err.message}`,
    );
    return next(err);
  }
};

exports.deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.articleId).populate(
      'owner',
    );
    if (!article) {
      throw new NotFoundError('Artículo no encontrdo');
    }
    if (!article.owner || article.owner._id.toString() !== req.user.id) {
      throw new ForbiddenError('Usuario no autorizado a borrar este artículo');
    }
    await Article.findByIdAndDelete(req.params.articleId);
    return res.json({ msg: 'Artículo eliminado' });
  } catch (err) {
    logger.error(
      `Error eliminando el artículo ${req.params.articleId}: ${err.message}`,
    );
    return next(err);
  }
};