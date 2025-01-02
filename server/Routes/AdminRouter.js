// Updated Routes to Support Calendar Features
const express = require("express");
const adminController = require("../Controllers/adminController");
const router = express.Router();

// Company Management Routes
router.get("/companies", adminController.getCompanies);
router.post("/companies", adminController.addCompany);
router.put("/companies/:id", adminController.editCompany);
router.delete("/companies/:id", adminController.deleteCompany);

// Communication Method Management Routes
router.get("/communication-methods", adminController.getCommunicationMethods);
router.post("/communication-methods", adminController.addCommunicationMethod);
router.put("/communication-methods/:id", adminController.editCommunicationMethod);
router.delete("/communication-methods/:id", adminController.deleteCommunicationMethod);

// New Routes for Calendar Application
// Fetch Overdue and Due Communications
router.get("/communications/status", adminController.getOverdueAndDueCommunications);

// Log Communication
router.post("/communications/log", adminController.logCommunication);

// Fetch Dashboard Data
router.get("/dashboard", adminController.getDashboardData);


// New Routes
router.get("/communications/calendar", adminController.getCalendarData); // Calendar Data
router.get("/notifications", adminController.getNotifications);          // Notifications


module.exports = router;