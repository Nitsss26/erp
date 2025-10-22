const StudentModel = require("../models/StudentModel");
const CourseModel = require("../models/CoursesModel");
const ClassesModel = require("../models/ClassesModel");
const FeesModel = require("../models/FeesModel");
const TransactionsModel = require("../models/TransactionsModel");
const bcrypt = require("bcrypt");
const { login, changePassword } = require("../middlewares/validate");
const { role } = require("../middlewares/variables");
const { sendRegisterSMS } = require("../services/SmsService");
const fs = require("fs");
const csv = require("csv-parser");
const xlsx = require("xlsx");

exports.parseStudentFileHeaders = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "No file uploaded." });
  }

  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    // Get headers from the first row of the sheet
    const headers = xlsx.utils.sheet_to_json(worksheet, { header: 1 })[0];

    fs.unlinkSync(req.file.path); // Clean up the uploaded file immediately

    res.json({ success: true, headers });
  } catch (error) {
    fs.unlinkSync(req.file.path); // Clean up on error too
    console.error("Error parsing file headers:", error);
    res.status(500).json({ success: false, error: "Could not parse file headers." });
  }
};

exports.processMappedStudentFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "No file uploaded." });
  }

  const { columnMapping } = req.body; // e.g., { "Student Name": "name", "Admission No.": "userID" }
  if (!columnMapping) {
    return res.status(400).json({ success: false, error: "Column mapping is required." });
  }

  try {
    const mapping = JSON.parse(columnMapping);
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    const studentsToCreate = [];
    let studentCounter = await StudentModel.countDocuments({ role: role.Student });

    for (const row of data) {
      const studentObject = { guardian: [{}] }; // Initialize with guardian structure

      for (const fileHeader in mapping) {
        const modelField = mapping[fileHeader];
        if (row[fileHeader] !== undefined && modelField) {
          // Handle nested fields like 'guardian.name'
          if (modelField.startsWith("guardian.")) {
            const guardianField = modelField.split(".")[1];
            studentObject.guardian[0][guardianField] = row[fileHeader];
          } else {
            studentObject[modelField] = row[fileHeader];
          }
        }
      }

      // --- Auto-generate required fields if not mapped ---
      if (!studentObject.userID) {
        const currentYear = new Date().getFullYear();
        studentObject.userID = `BK${currentYear}${studentCounter + 1}`;
        studentCounter++;
      }

      if (!studentObject.password) {
        const hash = await bcrypt.hash(studentObject.userID, 10);
        studentObject.password = hash;
      }

      studentsToCreate.push(studentObject);
    }

    if (studentsToCreate.length > 0) {
      const result = await StudentModel.insertMany(studentsToCreate, { ordered: false });
      res.status(201).json({
        success: true,
        message: `${result.length} students created successfully.`,
        createdCount: result.length,
      });
    } else {
      res.status(400).json({ success: false, error: "No valid student data found to process." });
    }

  } catch (error) {
    console.error("Error processing mapped file:", error);
    if (error.code === 11000) { // Handle duplicate key errors
      return res.status(409).json({ success: false, error: "Import failed. One or more students have a duplicate User ID or Email." });
    }
    res.status(500).json({ success: false, error: "An error occurred during processing." });
  } finally {
    fs.unlinkSync(req.file.path); // Always clean up the file
  }
};

exports.bulkDeleteStudents = async (req, res) => {
  try {
    const { ids } = req.body;
    await StudentModel.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: "Selected students deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.bulkUpdateStudents = (req, res) => {
  const updates = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => updates.push(data))
    .on("end", async () => {
      try {
        for (let update of updates) {
          await StudentModel.findByIdAndUpdate(update._id, update, { new: true });
        }
        res.status(200).json({ message: "Students updated successfully" });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
};

exports.getAllActiveStudents = async (req, res) => {
  const { user, query } = req;
  try {
    // Build the campus filter based on user role
    let campusFilter = {};
    if (user.campusID) { // This is a Campus Admin
      // Admins default to their own campus, but can view others via query param
      const campusId = query.campusID || user.campusID?._id;
      if (campusId) campusFilter.campusID = campusId;
    } else if (!user.campusID && query.campusID) { // This is a Global Admin filtering by campus
      // Global admins can filter by any campus
      campusFilter.campusID = query.campusID;
    }

    const data = await StudentModel.find({
      enrollmentStatus: "active",
      ...campusFilter,
    })
    .populate('classID', 'name classCode') // Populates the class details
    .populate('campusID', 'name') // Populates the campus name
    .populate('scholarship', 'name discountType discountValue') // Populates scholarship details
    .populate({ path: 'classHistory.classID', select: 'name classCode' }) // Populates class details within history
    .sort({ createdAt: "desc" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getWithdrawnStudents = async (req, res) => {
  const { user, query } = req;
  try {
    // Build the campus filter based on user role
    let campusFilter = {};
    if (user.campusID) { // This is a Campus Admin
      const campusId = query.campusID || user.campusID?._id;
      if (campusId) campusFilter.campusID = campusId;
    } else if (!user.campusID && query.campusID) { // This is a Global Admin filtering by campus
      campusFilter.campusID = query.campusID;
    }

    const data = await StudentModel.find({
      enrollmentStatus: "withdrawn",
      ...campusFilter,
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getPastStudents = async (req, res) => {
  const { user, query } = req;
  try {
    // Build the campus filter based on user role
    let campusFilter = {};
    if (user.campusID) { // This is a Campus Admin
      const campusId = query.campusID || user.campusID?._id;
      if (campusId) campusFilter.campusID = campusId;
    } else if (!user.campusID && query.campusID) { // This is a Global Admin filtering by campus
      campusFilter.campusID = query.campusID;
    }

    const data = await StudentModel.find({
      enrollmentStatus: "graduated",
      ...campusFilter,
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getUnpaidFees = async (req, res) => {
  try {
    const { year, term } = req.params;
    const transactions = await TransactionsModel.find({
      category: { $regex: "fees" },
      type: "income",
      "fees.term": term,
      "fees.academicYear": year,
    });
    const feesData = await FeesModel.find();
    const students = await StudentModel.find({ role: role.Student });

    const results = students.map((student) => {
      const payment = transactions.find((t) => t.studentID.toString() === student._id.toString());
      const feeStructure = feesData.find((f) => f.code === student.classID);
      const type = "day"; // This seems hardcoded, might need review
      let bill = 0;
      if (feeStructure && feeStructure[type]) {
        bill = Object.values(feeStructure[type]).reduce((t, value) => Number(t) + Number(value), 0);
      }
      return {
        userID: student.userID,
        campus: student.campus,
        name: `${student.name} ${student.surname}`,
        classID: student.classID,
        amount: payment?.amount || 0,
        academicYear: year,
        term: term,
        status: student?.status,
        fees: bill,
      };
    });
    res.json(results);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await StudentModel.findOne({ userID: req.params.id, role: role.Student })
      .populate([
        { path: 'classID', select: 'name classCode' },
        { path: 'campusID', select: 'name' },
        { path: 'scholarship', select: 'name discountType discountValue' },
        { path: 'classHistory.classID', select: 'name classCode' } // Deep populate
      ]);
    if (student) {
      return res.json({ success: true, student });
    }
    res.status(404).json({ success: false, error: "Student does not exist" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAdmissionStats = async (req, res) => {
  try {
    const { from, to } = req.params;
    const query = { role: role.Student, createdAt: { $gte: from, $lte: to } };
    const admission = await StudentModel.countDocuments(query);
    const border = await StudentModel.countDocuments({ ...query, status: "border" });
    const day = await StudentModel.countDocuments({ ...query, status: "day" });
    res.json({ admission, border, day });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getStudentCourses = async (req, res) => {
  try {
    const user = await StudentModel.findOne({ userID: req.params.id, role: role.Student });
    if (user) {
      const courses = await CourseModel.find({ code: user?.classID });
      return res.json({ success: true, courses: user?.courses });
    }
    res.status(404).json({ success: false, error: "Student does not exist" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getStudentCountByCategory = async (req, res) => {
  try {
    const users = await StudentModel.find({ role: role.Student, [req.params.category]: req.params.value });
    const docs = users.map((e) => ({ status: e.status, fees: e.fees }));
    res.json({ success: true, docs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.searchStudents = async (req, res) => {
  try {
    const users = await StudentModel.find({
      role: role.Student,
      $or: [
        { userID: req.params.id },
        { name: { $regex: req.params.id, $options: "i" } },
        { surname: { $regex: req.params.id, $options: "i" } },
      ],
    });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAllParents = async (req, res) => {
  try {
    const users = await StudentModel.find({ enrollmentStatus: "active" }).select("guardian");
    const allGuardians = users.flatMap((user) => user.guardian);
    res.json({ success: true, docs: allGuardians });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getParentsByStudentId = async (req, res) => {
  try {
    const user = await StudentModel.findById(req.params.id).select("guardian");
    if (user && user.guardian?.length > 0) {
      return res.json({ success: true, docs: user.guardian });
    }
    res.status(404).json({ success: false, error: "No parents details available" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getStudentsByClass = async (req, res) => {
  try {
    const users = await StudentModel.find({
      classID: req.params.id,
      enrollmentStatus: "active"
    });
    // It's often better to return an empty array with a 200 OK status
    // than a 404 if no students are found. This simplifies frontend logic.
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createStudent = async (req, res) => {
  try {
    // --- ROBUST User ID Generation ---
    // This logic is more resilient to race conditions than a simple count.
    let finalUserID = req.body.setuserID;
    if (!finalUserID) {
      const currentYear = new Date().getFullYear();
      let isUnique = false;
      let counter = await StudentModel.countDocuments({ role: role.Student });
      while (!isUnique) {
        counter++;
        const potentialUserID = `BK${currentYear}${counter}`;
        const studentExists = await StudentModel.findOne({ userID: potentialUserID });
        if (!studentExists) {
          finalUserID = potentialUserID;
          isUnique = true;
        }
      }
    }
    const hash = await bcrypt.hash(finalUserID, 10);

    const studentData = { ...req.body, password: hash, userID: finalUserID };

    // --- CAMPUS SECURITY ENHANCEMENT ---
    // If the user creating the student is a campus admin,
    // force the student's campus to be the admin's own campus.
    // This prevents an admin from creating students in other campuses.
    if (req.user.campusID) { // This is a Campus Admin
      studentData.campusID = req.user.campusID._id;
    }

    const newUser = await StudentModel.create(studentData);

    // Populate the necessary fields before sending the response
    const populatedUser = await newUser.populate([
      { path: 'classID', select: 'name classCode' },
      { path: 'campusID', select: 'name' },
      { path: 'scholarship', select: 'name discountType discountValue' },
      { path: 'classHistory.classID', select: 'name classCode' }
    ]);
    await sendRegisterSMS(populatedUser.mobilenumber, populatedUser.name);
    res.status(201).json({ success: true, student: populatedUser });
  } catch (err) {
    // Handle potential duplicate key errors from email/userID
    if (err.code === 11000) {
      return res.status(409).json({ success: false, error: "A student with this User ID or Email already exists." });
    }
    res.status(500).json({ success: false, error: "Something went wrong", details: err.message });
  }
};

exports.signInStudent = async (req, res) => {
  const { error } = login.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const user = await StudentModel.findOne({ userID: req.body.userID })
      .populate([
        { path: 'classID', select: 'name classCode' },
        { path: 'campusID', select: 'name' },
        { path: 'scholarship', select: 'name discountType discountValue' },
        { path: 'classHistory.classID', select: 'name classCode' }
      ]);
    if (user) {
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (isMatch) {
        return res.json({ success: true, student: user });
      }
    }
    res.status(401).json({ error: "Wrong Password or Student ID" });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.changeStudentPassword = async (req, res) => {
  const { error } = changePassword.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, error: error.details[0].message });
  }

  try {
    const user = await StudentModel.findOne({ userID: req.params.id });
    if (!user) {
      return res.status(404).json({ success: false, error: "Student does not exist" });
    }

    const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Wrong old password" });
    }

    const hash = await bcrypt.hash(req.body.newPassword, 10);
    await StudentModel.updateOne({ userID: req.params.id }, { password: hash });
    res.json({ success: true, message: "Password successfully changed" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.readmitStudent = async (req, res) => {
  try {
    const doc = await StudentModel.findOneAndUpdate(
      { userID: req.params.id },
      { classID: req.body.classID, enrollmentStatus: "active" },
      { new: true }
    );
    if (!doc) {
      return res.status(404).json({ success: false, error: "Student does not exist" });
    }
    res.json({ success: true, student: doc });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const doc = await StudentModel.findOneAndUpdate({ userID: req.params.id }, req.body, { new: true })
      .populate([
        { path: 'classID', select: 'name classCode' },
        { path: 'campusID', select: 'name' },
        { path: 'scholarship', select: 'name discountType discountValue' },
        { path: 'classHistory.classID', select: 'name classCode' }
      ]);

    if (!doc) {
      return res.status(404).json({ success: false, error: "Student does not exist" });
    }

    res.json({ success: true, student: doc });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, error: "Update failed. Email or other unique field already in use." });
    }
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.promoteStudent = async (req, res) => {
  const { userID, nextClassID, academicYear } = req.body;

  if (!userID || !nextClassID || !academicYear) {
    return res.status(400).json({ success: false, error: "userID, nextClassID, and academicYear are required." });
  }

  try {
    const student = await StudentModel.findOne({ userID });
    if (!student) {
      return res.status(404).json({ success: false, error: "Student not found." });
    }

    // Add to class history
    student.classHistory.push({
      classID: student.classID,
      academicYear: academicYear,
      status: 'promoted'
    });

    // Update to new class
    student.classID = nextClassID;

    await student.save();

    res.json({ success: true, message: `Student ${userID} promoted successfully to new class.`, student });

  } catch (err) {
    console.error("Error promoting student:", err);
    res.status(500).json({ success: false, error: "Server error while promoting student." });
  }
};

exports.upgradeClass = async (req, res) => {
  try {
    const { currentclass, nextclass, academicYear } = req.body;
    if (!currentclass || !nextclass || !academicYear) {
      return res.status(400).json({ success: false, error: "currentclass, nextclass, and academicYear are required." });
    }

    const result = await StudentModel.updateMany(
      { role: role.Student, classID: currentclass, enrollmentStatus: "active" },
      [
        { $set: { classID: nextclass } },
        { $set: { classHistory: { $concatArrays: ["$classHistory", [{ classID: "$classID", academicYear: academicYear, status: "promoted" }]] } } }
      ]
    );

    if (result.nModified === 0) {
      return res.status(404).json({ success: false, message: "No active students found in the specified class to upgrade." });
    }

    res.json({ success: true, message: `${result.nModified} students were upgraded successfully.` });
  } catch (err) {
    console.error("Error upgrading class:", err);
    res.status(500).json({ success: false, error: "Server error during class upgrade." });
  }
};

exports.graduateClass = async (req, res) => {
  try {
    const { currentclass } = req.body;
    const studentUpdate = await StudentModel.updateMany(
      { classID: currentclass, enrollmentStatus: "active" }, // Find all active students in the class
      { $set: { enrollmentStatus: "graduated", statusChangeDate: new Date() } } // Set their status to graduated
    );
    await ClassesModel.findByIdAndUpdate(currentclass, { isArchived: true }); // Archive the class itself
    res.json({ success: true, docs: studentUpdate });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.upgradeCampus = async (req, res) => {
  try {
    const { currentcampus, nextcampus } = req.body;
    const doc = await StudentModel.updateMany({ role: role.Student, campusID: currentcampus }, { campusID: nextcampus });
    res.json({ success: true, student: doc });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const doc = await StudentModel.findOneAndDelete({ userID: req.params.id });
    if (!doc) {
      return res.status(404).json({ success: false, error: "Student not found" });
    }
    res.json({ success: true, message: `Student ${req.params.id} was successfully deleted.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
