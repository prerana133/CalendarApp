const Communication = require("../Models/Communication");

// Fetch all communication methods
exports.getAllMethods = async () => {
  return await Communication.find();
};

// Create a new communication method
exports.createMethod = async (methodData) => {
  if (!methodData.name || !methodData.description) {
    throw new Error("Name and description are required.");
  }
  const newMethod = new Method(methodData);
  return await newMethod.save();
};

// Update an existing communication method
exports.updateMethod = async (id, updatedData) => {
  return await Communication.findByIdAndUpdate(id, updatedData, { new: true });
};

// Delete a communication method
exports.deleteMethod = async (id) => {
  await Communication.findByIdAndDelete(id);
};