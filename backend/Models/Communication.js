const mongoose = require("mongoose");

const CommunicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    sequence: { type: Number, required: true },
    mandatory: { type: Boolean, default: false },
    performedAt: { type: Date },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
}, { timestamps: true });

module.exports = mongoose.model("Communication", CommunicationSchema);
