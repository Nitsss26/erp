const PayrowModel = require("../models/PayRow.Model");

exports.getAllPayrows = async (req, res) => {
  const { user, query } = req;
  try {
    // Build the campus filter based on user role
    let campusFilter = {};
    if (user.campusID) { // This is a Campus Admin
      // Admins default to their own campus, but can view others via query param
      const campusId = query.campusID || user.campusID?._id;
      if (campusId) campusFilter.campusID = campusId;
    } else if (!user.campusID && query.campusID) { // This is a Global Admin filtering by campus
      // Super-admins can filter by any campus
      campusFilter.campusID = query.campusID;
    }

    const docs = await PayrowModel.find(campusFilter)
      .populate('campusID', 'name').sort({ createdAt: "desc" });
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

exports.getPayrowByCode = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send("Missing URL parameter: code");
  }
  try {
    const doc = await PayrowModel.findOne({ code: req.params.id });
    if (doc) {
      return res.json({ success: true, docs: doc });
    } else {
      return res.status(404).json({ success: false, error: "Payrow position not found" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.createPayrow = async (req, res) => {
  try {
    const code = req.body.name.toLowerCase();
    const isExist = await PayrowModel.findOne({ code: code });
    if (isExist) {
      return res.status(409).json({ success: false, error: "Position already exists" });
    }

    const doc = await PayrowModel.create({ ...req.body, code });
    res.status(201).json({ success: true, doc });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.updatePayrow = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send("Missing URL parameter: id");
  }
  try {
    const doc = await PayrowModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) {
      return res.status(404).json({ success: false, error: "Payrow position not found" });
    }
    return res.json({ success: true, doc });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.deletePayrow = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send("Missing URL parameter: id");
  }
  try {
    const doc = await PayrowModel.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, error: "Payrow position not found" });
    }
    res.json({ success: true, message: "Payrow position deleted successfully", doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
