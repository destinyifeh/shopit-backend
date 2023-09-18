const Item = require("../models/Item.model");
const uploadFile = require("../helpers/fileUpload.helper");
exports.addItem = async (req, res) => {
  console.log(req.body, "file");
  try {
    await uploadFile.upload(
      req.body.base64,
      {
        folder: "trust",
      },
      (err, result) => {
        if (err) {
          console.log(err, "file error");
          return false;
        }
        console.log(result, "response from Cloudinary");
        const postDocument = {
          title: req.body.title,
          desc: req.body.desc,
          price: req.body.price,
          image: result?.secure_url,
          imageId: result?.public_id,
          label: req.body.category,
          qty: 1,
        };
        console.log(postDocument, "doc");
        Item.create(postDocument)
          .then((response) => {
            console.log(response, "datas");
            res.status(200).send(response);
          })
          .catch((err) => {
            console.log(err.message);
          });
      }
    );
  } catch (err) {
    console.log("Add-item error:" + err);
    res.status(500).send(err);
  }
};

exports.getItems = async (req, res) => {
  try {
    let items = await Item.find({}).sort({ createdAt: -1 });
    console.log(items, "all items");
    res.status(200).send(items);
  } catch (err) {
    console.log(err.message, "get item error");

    res.status(500).send(err);
  }
};

exports.getItem = async (req, res) => {
  try {
    let item = await Item.findOne({ _id: req.params.id });
    console.log(item, " item");
    res.status(200).send(item);
  } catch (err) {
    console.log(err.message, "get item error");

    res.status(500).send(err);
  }
};

exports.deleteItem = async (req, res) => {
  try {
    let item = await Item.findOne({ _id: req.params.id });
    if (item.imageId) {
      uploadFile.destroy(item.imageId, (err, result) => {
        if (err) {
          console.log(err, "image deleting error");
          res.send("Item image deleting error");
        }
        Item.findOneAndDelete({ _id: req.params.id });

        console.log(result, "ree");
        //item.deleteOne();
        res.status(200).json({ message: "Item deleted", itemId: item._id });
      });
    } else {
      //  Item.findOneAndDelete({ _id: req.params.id });

      item.deleteOne();
      res.status(200).json({ message: "Item deleted", itemId: item._id });
    }
  } catch (err) {
    console.log(err);

    res.status(500).json({ err: err });
  }
};

exports.updateItem = async (req, res) => {
  try {
    let item = await Item.findOne({ _id: req.params.id });
    if (item) {
      item.title = req.body.title;
      item.desc = req.body.desc;
      item.price = req.body.price;
      item.label = req.body.category;
      item
        .save()
        .then((response) => {
          console.log(response, "found");
          res.status(200).send(response);
        })
        .catch((err) => {
          console.log(err.message);
          res.send(err);
        });
      if (req.body.newImage === true) {
        await uploadFile.upload(
          req.body.base64,
          {
            folder: "trust",
          },
          (err, result) => {
            if (err) {
              console.log(err, "file error");
              return false;
            }
            console.log(result, "response from Cloudinary");
            item.title = req.body.title;
            item.desc = req.body.desc;
            item.price = req.body.price;
            item.image = result?.secure_url;
            item.imageId = result?.public_id;
            item.label = req.body.category;

            console.log(item, "doc");
            item
              .save()
              .then((response) => {
                console.log(response, "datas");
                res.status(200).send(response);
              })
              .catch((err) => {
                console.log(err.message);
              });
          }
        );
      }
    } else {
      console.log("item not found");
      res.status(404).send("Item not found");
    }
  } catch (err) {
    res.status(500).send(err);
    console.log(err.message, "update item error");
  }
};

exports.likeItem = async (req, res) => {
  console.log("get her", req.body.likeBy);

  try {
    let item = await Item.findOne({
      _id: req.params.id,
    });

    console.log(item, " item");
    if (!item.likedBy) {
      item.likedBy = req.body.likedBy;
      item
        .save()
        .then((response) => {
          console.log(response, "like");
          res.status(200).send(response);
        })
        .catch((err) => {
          console.log(err.message);
          res.status(500).send(err);
        });
    } else {
      item.likedBy = null;
      item
        .save()
        .then((response) => {
          console.log(response, "unlike");
          res.status(200).send(response);
        })
        .catch((err) => {
          console.log(err.message);
          res.status(500).send(err);
        });
    }
  } catch (err) {
    console.log(err.message, "like error");

    res.status(500).send(err);
  }
};
