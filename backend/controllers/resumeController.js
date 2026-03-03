const Resume = require("../models/resume");

// POST /api/resume
const createResume = async (req, res) => {
    try {
        const resume = await Resume.create({
            userId: req.user.id,
            title: req.body.title || "Untitled Resume",
        });
        res.status(201).json(resume);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// GET /api/resume
const getResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.user.id }).sort({
            updatedAt: -1,
        });
        res.json(resumes);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// GET /api/resume/:id
const getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        if (resume.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        res.json(resume);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// PUT /api/resume/:id
const updateResume = async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        if (resume.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const updatedResume = await Resume.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedResume);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// DELETE /api/resume/:id
const deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        if (resume.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await Resume.findByIdAndDelete(req.params.id);
        res.json({ message: "Resume deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    createResume,
    getResumes,
    getResumeById,
    updateResume,
    deleteResume,
};
