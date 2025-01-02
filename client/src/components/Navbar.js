import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";

const Navbar = ({ isAuthenticated, userName, userRole, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const navItems = [
    { label: "Home", link: "/home" },
    { label: "Notifications", link: "/notifications", badge: 3 },
    { label: "Calendar", link: "/calendar" },
    ...(userRole === "admin"
      ? [{ label: "Admin Dashboard", link: "/admin" }]
      : []),
    { label: "Logout", link: "#", action: onLogout },
  ];

  const unauthItems = [
    { label: "Login", link: "/login" },
    { label: "Signup", link: "/signup" },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MyApplication
      </Typography>
      <Divider />
      <List>
        {(isAuthenticated ? navItems : unauthItems).map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              component={Link}
              to={item.link}
              onClick={item.action || null}
              sx={{ textAlign: "center" }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        component="nav"
        position="static"
        sx={{
          borderRadius: "20px",
          backgroundColor: "#1976d2",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            MyApplication
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "flex" } }}>
            {(isAuthenticated ? navItems : unauthItems).map((item) =>
              item.badge ? (
                <Link to={item.link} key={item.label}>
                  <Badge badgeContent={item.badge} color="secondary">
                    <Button color="inherit">{item.label}</Button>
                  </Badge>
                </Link>
              ) : (
                <Button
                  key={item.label}
                  color="inherit"
                  component={Link}
                  to={item.link}
                  onClick={item.action || null}
                >
                  {item.label}
                </Button>
              )
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
};

export default Navbar;
