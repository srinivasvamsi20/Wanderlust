const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const Listing = require("../models/listing.js");
// const upload = multer({ dest: "uploads/" });
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const AWS = require("aws-sdk");

const {
  isLoggedIn,
  isOwner,
  validateListing,
} = require("../middleware/middleware.js");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new S3Client();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,

    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + ".jpg");
    },
  }),
});
// Set up multer to use multer-s3

router
  .route("/")
  .get(wrapAsync(listingController.index))

  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing),
    validateListing
  );

// NEW listing
router.get("/new", isLoggedIn, listingController.renderForm);

router.get("/rooms", async (req, res) => {
  let alllistings = await Listing.find({ category: "Rooms" });
  console.log(alllistings[0]);
  res.render("listings/rooms.ejs", { alllistings });
});
router
  .route("/:id")
  .get(wrapAsync(listingController.showlisting))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    // validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
