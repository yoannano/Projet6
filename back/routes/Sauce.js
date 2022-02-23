const express = require("express");
const router = express("router");

const sauceCtrl = require("../controllers/sauce");
const auth = require("../middelware/auth");
const multer = require("../middelware/multer-config");

router.post("/", auth, multer, sauceCtrl.createSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.get("/", auth, sauceCtrl.getAllSauce);
router.post("/:id/like", auth, sauceCtrl.createLike);

module.exports = router;
