const Sauce = require("../Models/Sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  console.log(sauceObject);
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then((sauce) => res.status(201).json(sauce))
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error });
    });
};
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(400).json({
        error,
      });
    });
};
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((Sauce) => {
    if (!Sauce) {
      return res.status(404).json({
        error: new Error("Sauce non trouvé"),
      });
    }
    if (Sauce.userId !== req.auth.userId) {
      res.status(401).json({
        error: new Error("Requête non autorizé"),
      });
    }
    const filename = Sauce.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: "Sauce supprimé !" }))
        .catch((error) => res.status(400).json({ error }));
    });
  });
};
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error,
      });
    });
};

//Controller pour gérer les likes
exports.createLike = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      //Dans le cas où la personne dislike la sauce
      if (req.body.like == -1) {
        sauce.dislikes = sauce.dislikes >= 0 ? sauce.dislikes++ : 1;
        sauce.usersDisliked.push(req.body.userId);
        console.log(sauce);
        sauce.save();
      }

      //Dans le cas où la personne like la sauce
      if (req.body.like == 1) {
        sauce.likes = sauce.likes >= 0 ? sauce.likes++ : 1; //Ajout d'un like
        sauce.usersLiked.push(req.body.userId); //Push du username et de son dislike dans le tableau
        sauce.save();
      }

      //
      if (req.body.like == 0) {
        if (sauce.usersLiked.indexOf(req.body.userId) != -1) {
          sauce.likes--; //Suppression du like
          sauce.usersLiked.splice(sauce.usersLiked.indexOf(req.body.userId), 1);
        } else {
          sauce.dislikes--; //Suppression du dislike
          sauce.usersDisliked.splice(
            sauce.usersDisliked.indexOf(req.body.userId),
            1
          );
        }
        sauce.save();
      }
      console.log(sauce);
      res.status(200).json(sauce);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error });
    });
};
