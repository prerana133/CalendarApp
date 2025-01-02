const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    linkedInProfile: { type: String },
    emails: [{ type: String, validate: emails => emails.length > 0 }],
    phoneNumbers: [{ type: String, validate: numbers => numbers.length > 0 }],
    comments: { type: String },
    communicationPeriodicity: { type: String, default: "2 weeks" },
    communications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Communication" }],
}, { timestamps: true });

module.exports = mongoose.model("Company", CompanySchema);
