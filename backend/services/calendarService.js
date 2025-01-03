const Communication = require("../Models/Communication");

const fetchCalendarData = async () => {
    return await Communication.find().populate("companyId");
};

module.exports = { fetchCalendarData };
