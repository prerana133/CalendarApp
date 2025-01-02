import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { fetchCalendarData } from "../api";
import { Container, Typography, List, ListItem, ListItemText, Box } from "@mui/material";

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [communications, setCommunications] = useState([]);
  const [filteredCommunications, setFilteredCommunications] = useState([]);

  useEffect(() => {
    fetchCalendarData()
      .then((data) => {
        console.log("Calendar Data:", data); // Debugging
        setCommunications(data);
      })
      .catch((err) => {
        console.error("Error fetching calendar data:", err);
        setCommunications([]);
      });
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const filtered = communications.filter(
      (comm) => new Date(comm.date).toDateString() === date.toDateString()
    );
    setFilteredCommunications(filtered);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Calendar
      </Typography>
      <Calendar
        onChange={handleDateChange}
        tileClassName={({ date }) => {
          const comms = communications.filter(
            (comm) => new Date(comm.date).toDateString() === date.toDateString()
          );
          if (comms.some((comm) => new Date(comm.date) < new Date())) return "overdue";
          if (comms.some((comm) => new Date(comm.date).toDateString() === new Date().toDateString()))
            return "due-today";
          return "";
        }}
      />
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Communications for {selectedDate.toDateString()}
        </Typography>
        <List>
          {filteredCommunications.length > 0 ? (
            filteredCommunications.map((comm, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`${comm.company}: ${comm.title}`}
                  secondary={`Mandatory: ${comm.mandatory ? "Yes" : "No"}`}
                />
              </ListItem>
            ))
          ) : (
            <Typography>No communications for this date.</Typography>
          )}
        </List>

      </Box>
    </Container>
  );
};

export default CalendarView;
