// /backend/src/controllers/adminController.js
const companyService = require("../services/companyService");
const communicationService = require("../services/communicationService");


exports.getCompanies = async (req, res) => {
    try {
      const companies = await companyService.getAllCompanies();
      res.status(200).json(companies);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  


// Company Management APIs
exports.addCompany = async (req, res) => {
  try {
    const companyData = req.body;
    const newCompany = await companyService.createCompany(companyData);
    res.status(201).json(newCompany);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.editCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedCompany = await companyService.updateCompany(id, updatedData);
    res.status(200).json(updatedCompany);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    await companyService.deleteCompany(id);
    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Communication Method Management APIs
exports.getCommunicationMethods = async (req, res) => {
  try {
    const methods = await communicationService.getAllMethods();
    res.status(200).json(methods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addCommunicationMethod = async (req, res) => {
  try {
    const methodData = req.body;
    const newMethod = await communicationService.createMethod(methodData);
    res.status(201).json(newMethod);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.editCommunicationMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedMethod = await communicationService.updateMethod(id, updatedData);
    res.status(200).json(updatedMethod);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCommunicationMethod = async (req, res) => {
  try {
    const { id } = req.params;
    await communicationService.deleteMethod(id);
    res.status(200).json({ message: "Communication method deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// --- Updated Controller Logic ---
const Company = require("../Models/Company");
const Communication = require("../models/Communication");

// Fetch Overdue and Due Communications
exports.getOverdueAndDueCommunications = async (req, res) => {
  try {
    const today = new Date();

    const companies = await Company.find().populate("communications");
    const overdue = [];
    const dueToday = [];

    companies.forEach((company) => {
      const lastCommunication = company.communications.sort((a, b) => new Date(b.performedAt) - new Date(a.performedAt))[0];
      const nextDate = new Date(lastCommunication ? lastCommunication.performedAt : company.createdAt);
      const periodicity = parseInt(company.communicationPeriodicity.split(" ")[0], 10);
      nextDate.setDate(nextDate.getDate() + periodicity * 7);

      if (nextDate < today) {
        overdue.push({
          companyName: company.name,
          nextScheduled: nextDate,
        });
      } else if (nextDate.toDateString() === today.toDateString()) {
        dueToday.push({
          companyName: company.name,
          nextScheduled: nextDate,
        });
      }
    });

    res.status(200).json({ overdue, dueToday });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Log New Communication and Reset Highlights
exports.logCommunication = async (req, res) => {
  try {
    const { companyId, type, date, notes } = req.body;
    const communicationMethod = await Communication.findOne({ name: type });

    if (!communicationMethod) {
      return res.status(400).json({ message: "Invalid communication type" });
    }

    const communication = new Communication({
      name: type,
      description: communicationMethod.description,
      sequence: communicationMethod.sequence,
      mandatory: communicationMethod.mandatory,
      performedAt: new Date(date),
      companyId,
    });

    await communication.save();

    await Company.findByIdAndUpdate(companyId, {
      $push: { communications: communication._id },
    });

    res.status(201).json({ message: "Communication logged successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch Dashboard Data
exports.getDashboardData = async (req, res) => {
  try {
    const companies = await Company.find().populate("communications");

    const dashboardData = companies.map((company) => {
      const communications = company.communications.sort((a, b) => new Date(b.performedAt) - new Date(a.performedAt));
      const lastFiveCommunications = communications.slice(0, 5).map((c) => ({
        type: c.name,
        date: c.performedAt,
      }));
      const nextScheduledCommunication = communications.length
        ? communications[0].performedAt
        : company.createdAt;

      return {
        companyName: company.name,
        lastFiveCommunications,
        nextScheduledCommunication,
      };
    });

    res.status(200).json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// Fetch calendar data for communications
exports.getCalendarData = async (req, res) => {
  try {
    const communications = await Communication.find().populate("companyId");
    const calendarData = communications
      .filter((comm) => comm.performedAt) // Filter out null dates
      .map((comm) => ({
        title: comm.name,
        date: comm.performedAt ? comm.performedAt.toISOString().split("T")[0] : null,
        company: comm.companyId ? comm.companyId.name : "Unknown Company",
        mandatory: comm.mandatory,
      }));

    res.status(200).json(calendarData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Fetch overdue and due notifications
exports.getNotifications = async (req, res) => {
  try {
    const today = new Date();
    const companies = await Company.find().populate("communications");
    const overdue = [];
    const dueToday = [];

    companies.forEach((company) => {
      const lastComm = company.communications
        .sort((a, b) => new Date(b.performedAt) - new Date(a.performedAt))[0];
      const nextDate = new Date(lastComm ? lastComm.performedAt : company.createdAt);
      const periodicity = parseInt(company.communicationPeriodicity, 10) || 2; // Default to 2 weeks
      nextDate.setDate(nextDate.getDate() + periodicity * 7);

      if (nextDate < today) {
        overdue.push({
          companyName: company.name,
          nextScheduled: nextDate,
        });
      } else if (nextDate.toDateString() === today.toDateString()) {
        dueToday.push({
          companyName: company.name,
          nextScheduled: nextDate,
        });
      }
    });

    res.status(200).json({ overdue, dueToday });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
