import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Snackbar,
  Alert,
  Switch,
} from "@mui/material";
import {
  fetchCompanies,
  fetchMethods,
  addOrUpdateCompany,
  addOrUpdateMethod,
  deleteCompany,
  deleteMethod,
} from "../api";

const Admin = () => {
  const [companies, setCompanies] = useState([]);
  const [methods, setMethods] = useState([]);
  const [companyForm, setCompanyForm] = useState({
    _id: null,
    name: "",
    location: "",
    linkedInProfile: "",
    emails: "",
    phoneNumbers: "",
    comments: "",
    communicationPeriodicity: "2weeks",
  });
  const [methodForm, setMethodForm] = useState({
    _id: null,
    name: "",
    description: "",
    sequence: "",
    mandatory: false,
  });
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [showMethodForm, setShowMethodForm] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchCompanies().then(setCompanies).catch(() => setCompanies([]));
    fetchMethods().then(setMethods).catch(() => setMethods([]));
  }, []);

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanyForm({ ...companyForm, [name]: value });
  };

  const handleMethodChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMethodForm({ ...methodForm, [name]: type === "checkbox" ? checked : value });
  };

  const handleCompanySubmit = (e) => {
    e.preventDefault();
    addOrUpdateCompany({
      ...companyForm,
      emails: companyForm.emails.split(",").map((email) => email.trim()),
      phoneNumbers: companyForm.phoneNumbers.split(",").map((phone) => phone.trim()),
    })
      .then((updatedCompany) => {
        setCompanies((prev) =>
          companyForm._id
            ? prev.map((c) => (c._id === updatedCompany._id ? updatedCompany : c))
            : [...prev, updatedCompany]
        );
        resetCompanyForm();
        setSnackbar({ open: true, message: "Company saved successfully", severity: "success" });
      })
      .catch(() =>
        setSnackbar({ open: true, message: "Failed to save company", severity: "error" })
      );
  };

  const handleMethodSubmit = (e) => {
    e.preventDefault();
    addOrUpdateMethod(methodForm)
      .then((updatedMethod) => {
        setMethods((prev) =>
          methodForm._id
            ? prev.map((m) => (m._id === updatedMethod._id ? updatedMethod : m))
            : [...prev, updatedMethod]
        );
        resetMethodForm();
        setSnackbar({ open: true, message: "Method saved successfully", severity: "success" });
      })
      .catch(() =>
        setSnackbar({ open: true, message: "Failed to save method", severity: "error" })
      );
  };

  const resetCompanyForm = () => {
    setCompanyForm({
      _id: null,
      name: "",
      location: "",
      linkedInProfile: "",
      emails: "",
      phoneNumbers: "",
      comments: "",
      communicationPeriodicity: "2weeks",
    });
    setShowCompanyForm(false);
  };

  const resetMethodForm = () => {
    setMethodForm({ _id: null, name: "", description: "", sequence: "", mandatory: false });
    setShowMethodForm(false);
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Company Management */}
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Company Management</Typography>
          <Switch
            checked={showCompanyForm}
            onChange={() => setShowCompanyForm(!showCompanyForm)}
          />
        </Box>
        {showCompanyForm && (
          <form onSubmit={handleCompanySubmit}>
            <TextField
              name="name"
              label="Name"
              value={companyForm.name}
              onChange={handleCompanyChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="location"
              label="Location"
              value={companyForm.location}
              onChange={handleCompanyChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="linkedInProfile"
              label="LinkedIn Profile (URL)"
              value={companyForm.linkedInProfile}
              onChange={handleCompanyChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="emails"
              label="Emails (comma-separated)"
              value={companyForm.emails}
              onChange={handleCompanyChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="phoneNumbers"
              label="Phone Numbers (comma-separated)"
              value={companyForm.phoneNumbers}
              onChange={handleCompanyChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="comments"
              label="Comments"
              value={companyForm.comments}
              onChange={handleCompanyChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="communicationPeriodicity"
              label="Communication Periodicity (e.g., '2weeks')"
              value={companyForm.communicationPeriodicity}
              onChange={handleCompanyChange}
              fullWidth
              margin="normal"
              required
            />
            <Button type="submit" variant="contained" color="primary">
              {companyForm._id ? "Update Company" : "Add Company"}
            </Button>
          </form>
        )}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Emails</TableCell>
                <TableCell>Phone Numbers</TableCell>
                <TableCell>LinkedIn Profile</TableCell>
                <TableCell>Communication Periodicity</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company._id}>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>{company.location}</TableCell>
                  <TableCell>{company.emails.join(", ")}</TableCell>
                  <TableCell>{company.phoneNumbers.join(", ")}</TableCell>
                  <TableCell>
                    <a href={company.linkedInProfile} target="_blank" rel="noopener noreferrer">
                      LinkedIn
                    </a>
                  </TableCell>
                  <TableCell>{company.communicationPeriodicity}</TableCell>
                  <TableCell>
                    <Button onClick={() => setCompanyForm(company)}>Edit</Button>
                    <Button color="error" onClick={() => deleteCompany(company._id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Communication Method Management */}
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Communication Methods</Typography>
          <Switch
            checked={showMethodForm}
            onChange={() => setShowMethodForm(!showMethodForm)}
          />
        </Box>
        {showMethodForm && (
          <form onSubmit={handleMethodSubmit}>
            <TextField
              name="name"
              label="Name"
              value={methodForm.name}
              onChange={handleMethodChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="description"
              label="Description"
              value={methodForm.description}
              onChange={handleMethodChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="sequence"
              label="Sequence (Order of Communication)"
              value={methodForm.sequence}
              onChange={handleMethodChange}
              type="number"
              fullWidth
              margin="normal"
              required
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="mandatory"
                  checked={methodForm.mandatory}
                  onChange={handleMethodChange}
                />
              }
              label="Mandatory"
            />
            <Button type="submit" variant="contained" color="primary">
              {methodForm._id ? "Update Method" : "Add Method"}
            </Button>
          </form>
        )}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Sequence</TableCell>
                <TableCell>Mandatory</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {methods.map((method) => (
                <TableRow key={method._id}>
                  <TableCell>{method.name}</TableCell>
                  <TableCell>{method.description}</TableCell>
                  <TableCell>{method.sequence}</TableCell>
                  <TableCell>{method.mandatory ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <Button onClick={() => setMethodForm(method)}>Edit</Button>
                    <Button color="error" onClick={() => deleteMethod(method._id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Admin;
