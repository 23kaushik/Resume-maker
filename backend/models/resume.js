const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            default: "Untitled Resume",
            trim: true,
        },
        personalInfo: {
            fullName: { type: String, default: "" },
            email: { type: String, default: "" },
            phone: { type: String, default: "" },
            address: { type: String, default: "" },
            linkedin: { type: String, default: "" },
            github: { type: String, default: "" },
            summary: { type: String, default: "" },
        },
        education: [
            {
                degree: { type: String, default: "" },
                institution: { type: String, default: "" },
                startDate: { type: String, default: "" },
                endDate: { type: String, default: "" },
                description: { type: String, default: "" },
            },
        ],
        experience: [
            {
                title: { type: String, default: "" },
                company: { type: String, default: "" },
                startDate: { type: String, default: "" },
                endDate: { type: String, default: "" },
                description: { type: String, default: "" },
            },
        ],
        skills: [{ type: String }],
        projects: [
            {
                title: { type: String, default: "" },
                link: { type: String, default: "" },
                description: { type: String, default: "" },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);
