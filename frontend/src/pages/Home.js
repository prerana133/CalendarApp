import React, { useEffect, useState } from "react";
import { fetchCompanies } from "../api";
import { Tooltip, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const Home = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetchCompanies()
      .then((data) => setCompanies(data))
      .catch(() => setCompanies([]));
  }, []);

  const getRowStyle = (nextCommunicationDate) => {
    const today = new Date();
    const nextDate = new Date(nextCommunicationDate);
    if (nextDate < today) return { backgroundColor: "red", color: "white" };
    if (nextDate.toDateString() === today.toDateString()) return { backgroundColor: "yellow" };
    return {};
  };

  const handleLogCommunication = (companyId) => {
    console.log(`Log communication for company: ${companyId}`);
    // Implement modal or redirect to a communication logging form
  };

  return (
    <div>
      <h1>User Dashboard</h1>
      <div className="dashboard">
        <h2>Companies</h2>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Company Name</TableCell>
                <TableCell>Last Five Communications</TableCell>
                <TableCell>Next Scheduled Communication</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company._id} style={getRowStyle(company.nextCommunication?.date)}>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>
                    {company.lastCommunications
                      ? company.lastCommunications.map((comm, index) => (
                          <Tooltip title={comm.notes || "No notes available"} key={index}>
                            <div>
                              {comm.type} - {new Date(comm.date).toLocaleDateString()}
                            </div>
                          </Tooltip>
                        ))
                      : "No communications available"}
                  </TableCell>
                  <TableCell>
                    {company.nextCommunication
                      ? `${company.nextCommunication.type} - ${new Date(company.nextCommunication.date).toLocaleDateString()}`
                      : "Not Scheduled"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleLogCommunication(company._id)}
                    >
                      Log Communication
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Home;
