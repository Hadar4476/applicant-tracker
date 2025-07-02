import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  BusinessCenter as BusinessCenterIcon,
  ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material";
import { useRouter } from "next/router";

interface MenuItem {
  id: string;
  text: string;
  icon: React.JSX.Element;
  path: string;
}

const AppDrawer = () => {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const drawerWidth = isExpanded ? 240 : 64;

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
    },
    {
      id: "jobs",
      text: "Jobs",
      icon: <BusinessCenterIcon />,
      path: "/dashboard/jobs",
    },
  ];

  const generateMenuListItems = (items: MenuItem[]) => {
    return items.map((item) => (
      <ListItem
        key={item.id}
        className="flex items-center cursor-pointer hover:bg-blue-50 transition-colors duration-200"
        onClick={() => {
          router.push(item.path);
        }}
      >
        <ListItemIcon className="mx-1">{item.icon}</ListItemIcon>
        <ListItemText
          primary={item.text}
          sx={{
            opacity: isExpanded ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
          }}
        />
      </ListItem>
    ));
  };

  const menuItemsList = generateMenuListItems(menuItems);

  const toggleDrawer = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          transition: "width 0.3s ease-in-out",
          overflowX: "hidden",
          border: "none",
          boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
        },
      }}
    >
      <Box className="flex items-center px-4" sx={{ minHeight: "64px" }}>
        <IconButton
          onClick={toggleDrawer}
          className={`transition-all duration-300 ${
            !isExpanded ? "mx-auto" : ""
          }`}
          size="small"
        >
          {isExpanded ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      <List className="flex-1 py-2">{menuItemsList}</List>
    </Drawer>
  );
};

export default AppDrawer;
