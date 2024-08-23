'use client';
import { useState, useEffect } from 'react';
import { 
  AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, 
  ListItemText, Card, CardContent, Button, Box, TextField, Grid, 
  Paper, Divider, Fab, Dialog, DialogTitle, DialogContent, DialogActions,
  Select, MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useUser } from '@auth0/nextjs-auth0/client';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageUploader from '../components/ImageUploader';

const websiteSections = [
  { title: 'Contact', description: 'Edit contact information', endpoint: '/api/contact', canAdd: false },
  { title: 'Hours', description: 'Update opening hours', endpoint: '/api/hours', canAdd: true },
  { title: 'Menu', description: 'Modify menu items', endpoint: '/api/menu', canAdd: true },
  { title: 'Slider', description: 'Edit slider content', endpoint: '/api/slider', canAdd: true },
  { title: 'Title', description: 'Change website title', endpoint: '/api/title', canAdd: false },
];

const menuItemTemplate = {
  name: '',
  price: 0,
  image: '',
  spiceLevel: '',
  flavourProfile: '',
  servingSize: '',
  detail: ''
};

export default function CMSPage() {
  const { user, error, isLoading } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [isExpanding, setIsExpanding] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [newItemDialogOpen, setNewItemDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({});

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const toggleCard = async (index) => {
    if (expandedCard === null) {
      setExpandedCard(index);
      setIsExpanding(true);
      await fetchData(websiteSections[index].endpoint);
    } else {
      setIsExpanding(false);
    }
  };

  const fetchData = async (endpoint) => {
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      setCurrentData(data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const updateData = async () => {
    try {
      const response = await fetch(websiteSections[expandedCard].endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update data');
      }
  
      const data = await response.json();
      alert('Data updated successfully!');
      
      // Refresh the current data
      await fetchData(websiteSections[expandedCard].endpoint);
    } catch (error) {
      console.error('Error updating data:', error);
      alert(`Failed to update data. Error: ${error.message}`);
    }
  };

  useEffect(() => {
    if (!isExpanding && expandedCard !== null) {
      const timer = setTimeout(() => setExpandedCard(null), 300);
      return () => clearTimeout(timer);
    }
  }, [isExpanding, expandedCard]);

  const handleDataChange = (path, value) => {
    setCurrentData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      let current = newData;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newData;
    });
  };

  const handleAddNewItem = () => {
    if (expandedCard === 2) { // Menu section
      setCurrentData(prevData => ({
        ...prevData,
        Menu: [...prevData.Menu, newItem]
      }));
    } else if (expandedCard === 1) { // Hours section
      setCurrentData(prevData => ({
        ...prevData,
        time: [...prevData.time, newItem]
      }));
    }
    setNewItemDialogOpen(false);
    setNewItem({});
  };

  const handleRemoveItem = (index) => {
    setCurrentData(prevData => {
      const newData = {...prevData};
      if (expandedCard === 2) { // Menu section
        newData.Menu.splice(index, 1);
      } else if (expandedCard === 1) { // Hours section
        newData.time.splice(index, 1);
      }
      return newData;
    });
  };

  const renderDataFields = (data, path = []) => {
    if (!data) return null;
  
    if (Array.isArray(data)) {
      return data.map((item, index) => (
        <Grid item xs={12} key={index}>
          <Paper elevation={3} className="p-4 mb-4">
            <Typography variant="h6">Item {index + 1}</Typography>
            {renderDataFields(item, [...path, index])}
            <Button 
              startIcon={<DeleteIcon />} 
              color="secondary"
              onClick={() => handleRemoveItem(index)}
            >
              Remove
            </Button>
          </Paper>
        </Grid>
      ));
    }
  
    if (typeof data === 'object' && data !== null) {
      return Object.entries(data).map(([key, value]) => (
        <Grid item xs={12} key={key}>
          <Typography variant="subtitle1">{key}:</Typography>
          {renderDataFields(value, [...path, key])}
        </Grid>
      ));
    }
  
    // Check if the field is an image field
    const isImageField = path[path.length - 1].toLowerCase().includes('image') ||
      (path.length > 1 && typeof path[path.length - 2] === 'string' &&
       (path[path.length - 2].toLowerCase() === 'menu' || path[path.length - 2].toLowerCase() === 'contact') &&
       path[path.length - 1].toLowerCase() === 'image');
  
    if (isImageField) {
      return (
        <ImageUploader
          currentImage={data}
          onImageChange={(newImage) => handleDataChange(path, newImage)}
        />
      );
    }
  
    return (
      <TextField
        fullWidth
        value={data}
        onChange={(e) => handleDataChange(path, e.target.value)}
        variant="outlined"
        multiline={typeof data === 'string' && data.length > 50}
      />
    );
  };

  const renderAddItemDialog = () => {
    if (expandedCard === 2) { // Menu section
      return (
        <Dialog open={newItemDialogOpen} onClose={() => setNewItemDialogOpen(false)}>
          <DialogTitle>Add New Mxenu Item</DialogTitle>
          <DialogContent>
            {Object.entries(menuItemTemplate).map(([key, value]) => (
              
              <TextField
                key={key}
                margin="dense"
                label={key}
                fullWidth
                value={newItem[key] || ''}
                onChange={(e) => setNewItem({...newItem, [key]: e.target.value})}
              />
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNewItemDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddNewItem} color="primary">Add</Button>
          </DialogActions>
        </Dialog>
      );
    } else if (expandedCard === 1) { // Hours section
      return (
        <Dialog open={newItemDialogOpen} onClose={() => setNewItemDialogOpen(false)}>
          <DialogTitle>Add New Operating Hours</DialogTitle>
          <DialogContent>
            <Select
              fullWidth
              value={newItem.day || ''}
              onChange={(e) => setNewItem({...newItem, day: e.target.value})}
            >
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                <MenuItem key={day} value={day}>{day}</MenuItem>
              ))}
            </Select>
            <TextField
              margin="dense"
              label="Hours"
              fullWidth
              value={newItem.hours || ''}
              onChange={(e) => setNewItem({...newItem, hours: e.target.value})}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNewItemDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddNewItem} color="primary">Add</Button>
          </DialogActions>
        </Dialog>
      );
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-4">You must be logged in to access the CMS.</p>
          <a href="/api/auth/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className="flex-grow">
            Restaurant CMS
          </Typography>
          <Button color="inherit">Analytics</Button>
          <Button color="inherit" href="/api/auth/logout">Logout</Button>
</Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer anchor="left" open={sidebarOpen} onClose={toggleSidebar}>
        <div className="w-64">
          <IconButton onClick={toggleSidebar}>
            <ChevronRightIcon />
          </IconButton>
          <List>
            {websiteSections.map((section, index) => (
              <ListItem button key={index} onClick={() => toggleCard(index)}>
                <ListItemText primary={section.title} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>

      {/* Main content area */}
      <main className="p-4">
        <Typography variant="h4" className="mb-4">Website Content</Typography>
        <Grid container spacing={4}>
          {websiteSections.map((section, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                className="transition-all duration-300 ease-in-out cursor-pointer hover:shadow-lg" 
                onClick={() => toggleCard(index)}
              >
                <CardContent>
                  <Typography variant="h6">{section.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {section.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </main>

      {/* Expanded card overlay */}
      {expandedCard !== null && (
        <Dialog 
          open={isExpanding} 
          onClose={() => setIsExpanding(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>
            {websiteSections[expandedCard].title}
            <IconButton 
              onClick={() => setIsExpanding(false)}
              style={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              {renderDataFields(currentData)}
            </Grid>
          </DialogContent>
          <DialogActions>
            {websiteSections[expandedCard].canAdd && (
              <Button onClick={() => setNewItemDialogOpen(true)} startIcon={<AddIcon />}>
                Add New Item
              </Button>
            )}
            <Button onClick={updateData} variant="contained" color="primary">
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {renderAddItemDialog()}
    </div>
  );
}