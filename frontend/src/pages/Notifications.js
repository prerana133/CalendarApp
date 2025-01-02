import React, { useEffect, useState } from "react";
import { fetchOverdueAndDue } from "../api";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Badge,
  Box,
} from "@mui/material";

const Notifications = () => {
  const [notifications, setNotifications] = useState({ overdue: [], dueToday: [] });

  useEffect(() => {
    fetchOverdueAndDue()
      .then((data) => {
        console.log("Notifications Data:", data); // Debugging
        setNotifications(data);
      })
      .catch((err) => {
        console.error("Error fetching notifications:", err);
        setNotifications({ overdue: [], dueToday: [] });
      });
  }, []);

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Notifications</Typography>
        <Badge
          badgeContent={notifications.overdue.length + notifications.dueToday.length}
          color="primary"
        >
          <Typography variant="body1">Total Notifications</Typography>
        </Badge>
      </Box>

      <Typography variant="h5" gutterBottom>
        Overdue Communications
      </Typography>
      <List>
        {notifications.overdue.length > 0 ? (
          notifications.overdue.map((comm, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={comm.companyName}
                secondary={`Scheduled on: ${new Date(
                  comm.nextScheduled
                ).toLocaleDateString()}`}
              />
            </ListItem>
          ))
        ) : (
          <Typography>No overdue communications.</Typography>
        )}
      </List>

      <Typography variant="h5" gutterBottom mt={4}>
        Communications Due Today
      </Typography>
      <List>
        {notifications.overdue.length > 0 ? (
          notifications.overdue.map((comm, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={comm.companyName}
                secondary={`Scheduled on: ${new Date(comm.nextScheduled).toLocaleDateString()}`}
              />
            </ListItem>
          ))
        ) : (
          <Typography>No overdue communications.</Typography>
        )}
      </List>

    </Container>
  );
};

export default Notifications;
