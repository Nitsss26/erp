const QuizModel = require("../models/QuizModel");
const StudentModel = require("../models/StudentModel");
const BadgeModel = require("../models/BadgeModel");
const ClassesModel = require("../models/ClassesModel");


exports.getAllQuizzes = async (req, res) => {
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

    const docs = await QuizModel.find(campusFilter)
      .populate('classID', 'name').populate('courseID', 'name').populate('campusID', 'name')
      .sort({ createdAt: "desc" });
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

exports.getQuizById = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send("Missing URL parameter: id");
  }
  try {
    const doc = await QuizModel.findById(req.params.id);
    if (doc) {
      return res.json({ success: true, doc });
    }
    res.status(404).json({ success: false, error: "Quiz not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.submitQuiz = async (req, res) => {
  const { id: quizId } = req.params;
  const { answers } = req.body; // Expecting an array of strings: ["answer1", "answer2", ...]
  const studentId = req.user._id; // From the 'protect' middleware

  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ success: false, error: "Answers must be provided as an array." });
  }

  try {
    const quiz = await QuizModel.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, error: "Quiz not found." });
    }

    // Check if student has already taken the quiz
    const hasTaken = quiz.participants.some(p => p.type.userID === req.user.userID);
    if (hasTaken) {
      return res.status(409).json({ success: false, error: "You have already submitted this quiz." });
    }

    // --- Score Calculation ---
    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (question.answer.toLowerCase() === answers[index]?.toLowerCase()) {
        correctAnswers++;
      }
    });

    const totalQuestions = quiz.questions.length;
    const scorePercentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    // --- Save Participant Score ---
    const participantData = {
      type: {
        userID: req.user.userID,
        score: scorePercentage,
      }
    };
    quiz.participants.push(participantData);
    await quiz.save();

    // --- Badge Awarding Logic ---
    let awardedBadge = null;
    const badges = await BadgeModel.find({ "criteria.type": "quiz_score_percentage" }).sort({ "criteria.value": -1 });

    for (const badge of badges) {
      if (scorePercentage >= badge.criteria.value) {
        const student = await StudentModel.findById(studentId);
        const alreadyHasBadge = student.earnedBadges.some(b => b.badge.toString() === badge._id.toString());

        if (!alreadyHasBadge) {
          student.earnedBadges.push({ badge: badge._id });
          await student.save();
          awardedBadge = badge;
          break; // Award the highest applicable badge and stop
        }
      }
    }

    res.json({ success: true, message: "Quiz submitted successfully!", results: { score: scorePercentage, correct: correctAnswers, total: totalQuestions }, awardedBadge });

  } catch (err) {
    console.error("Error submitting quiz:", err);
    res.status(500).json({ success: false, error: "Server error while submitting quiz." });
  }
};

exports.createQuiz = async (req, res) => {
  try {
    // Find the campusID from the class to ensure data integrity
    const classDoc = await ClassesModel.findById(req.body.classID).select('campusID').lean();
    if (!classDoc) {
      return res.status(404).json({ success: false, error: "Class not found. Cannot save quiz." });
    }
    const campusID = classDoc.campusID;

    const quizData = { ...req.body, campusID };
    const doc = await QuizModel.create(quizData);
    res.status(201).json({ success: true, doc });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.updateQuiz = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send("Missing URL parameter: id");
  }
  try {
    const doc = await QuizModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) {
      return res.status(404).json({ success: false, error: "Quiz not found" });
    }
    res.json({ success: true, doc });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.addQuestion = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send("Missing URL parameter: id");
  }
  try {
    const doc = await QuizModel.findByIdAndUpdate(req.params.id, { $push: { questions: req.body } }, { new: true });
    res.json({ success: true, doc });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.addParticipant = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send("Missing URL parameter: id");
  }
  try {
    const doc = await QuizModel.findByIdAndUpdate(req.params.id, { $push: { participants: req.body } }, { new: true });
    res.json({ success: true, doc });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send("Missing URL parameter: id");
  }
  try {
    await QuizModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Quiz deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
