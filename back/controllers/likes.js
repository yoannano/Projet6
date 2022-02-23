//liker une sauce

 //j'importe le modèle de la sauce
 const Sauce = require('../Models/Sauce');

 //middleware like
 exports.addLike = (req, res, next) => {
    const userLike = req.body.like;
    const userId = req.body.userId;
  
    Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const usersLiked = sauce.usersLiked
      const usersDisliked = sauce.usersDisliked
  
      //si 0
      if (userLike == 0) {
        //où est l'utisisateur?
        const foundUserLiked = usersLiked.find(usersId => usersId == userId);
        const foundUserDisliked = usersDisliked.find(usersId => usersId == userId);
  
        //si dans liked
        if (foundUserLiked) {
          //suppression dans Usersliked et -1 dans likes
          Sauce.updateOne({ _id: req.params.id },
          { $pull: { usersLiked: userId }, $inc : {likes: -1}})
          .then(() => res.status(200).json({ message: "L'utilisateur n'aime plus"}))
          .catch(error => res.status(400).json({ error }));
  
        //si dans disliked
        } else if (foundUserDisliked){
          //suppression dans Usersdisliked et -1 dans dislikes
          Sauce.updateOne({ _id: req.params.id },
          { $pull: { usersDisliked: userId }, $inc : {dislikes: -1}})
          .then(() => res.status(200).json({ message: "L'utilisateur ne déteste plus"}))
          .catch(error => res.status(400).json({ error }));
        }
  
      //si 1
      }else if (userLike == 1) {
        //ajout dans Usersliked et +1 dans likes
        Sauce.updateOne({ _id: req.params.id },
        { $push: { usersLiked: userId }, $inc : {likes: 1}})
        .then(() => res.status(200).json({ message: "L'utilisateur aime"}))
        .catch(error => res.status(400).json({ error }));
  
      //si -1
      } else if (userLike == -1){
        //ajout dans Usersdisliked et +1 dans dislikes
        Sauce.updateOne({ _id: req.params.id },
        { $push: { usersDisliked: userId }, $inc : {dislikes: 1}})
        .then(() => res.status(200).json({ message: "L'utilisateur n'aime pas"}))
        .catch(error => res.status(400).json({ error }));
      }
    })
    .catch((error) => {res.status(404).json({error: error})});
  };