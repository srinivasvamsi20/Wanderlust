const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geoCodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res, next) => {
  try {
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", { alllistings });
  } catch (err) {
    s;
    next(err);
  }
};

module.exports.renderForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showlisting = async (req, res) => {
  let { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  // console.log(res.locals.currUser);
  // console.log(listing.reviews[0].author._id);
  if (!listing) {
    req.flash("error", "Listing requested does not Exists");
    res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  let response = await geoCodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.location;
  let filename = req.file.originalname;

  const newlist = new Listing(req.body.listing);
  newlist.owner = req.user._id;
  newlist.image = { url, filename };
  newlist.geometry = response.body.features[0].geometry;
  console.log(newlist);
  let saved = await newlist.save();
  console.log(saved);
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing requested does not Exists");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let list = req.body.listing;

  const listing = await Listing.findByIdAndUpdate(id, list);
  if (typeof req.file !== "undefined") {
    let url = req.file.location;
    let filename = req.file.originalname;
    listing.image = { url, filename };
  }

  await listing.save();
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  console.log(id);
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
