const Company = require("../Models/Company");

// Create a new company
exports.createCompany = async (companyData) => {
  const company = new Company(companyData);
  return await company.save();
};

// Update an existing company
exports.updateCompany = async (id, updatedData) => {
  return await Company.findByIdAndUpdate(id, updatedData, { new: true });
};

// Delete a company
exports.deleteCompany = async (id) => {
  await Company.findByIdAndDelete(id);
};

// Fetch a list of companies (if needed)
exports.getAllCompanies = async () => {
  return await Company.find();
};
