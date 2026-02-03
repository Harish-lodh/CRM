import React, { useState } from 'react';
import {
  Box,
  Avatar,
  Typography,
  Checkbox,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Button,
  TextField,
  TablePagination,
  IconButton,
} from '@mui/material';
import { Edit, Save } from '@mui/icons-material';

// Sample contacts
const initialContacts = [
  {
    contactName: 'Ted Watson',
    companyName: 'Zylker Corp',
    email: 'support@bigin.com',
    phone: '',
    contactOwner: 'Pratik Sonawane',
  },
  {
    contactName: 'Jane Doe',
    companyName: 'Alpha Inc',
    email: 'jane@alpha.com',
    phone: '9876543210',
    contactOwner: 'Harish Lodha',
  },
];

// Get initials from name
const getInitials = (name) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('');

const ContactTable = () => {
  const [contacts, setContacts] = useState(initialContacts);
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [editIndex, setEditIndex] = useState(null);
  const [editedRow, setEditedRow] = useState(null);

  const filteredContacts = contacts.filter(
    (c) =>
      c.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedRow({ ...contacts[index] });
  };

  const handleSave = () => {
    if (editedRow !== null && editIndex !== null) {
      const updated = [...contacts];
      updated[editIndex] = editedRow;
      setContacts(updated);
      setEditIndex(null);
      setEditedRow(null);
    }
  };

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography fontWeight={500} variant="subtitle1">
          All Contacts
        </Typography>
        <TextField
          size="small"
          placeholder="Search contacts"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="contained" color="success">
          + Contact
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell>Contact Name</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Contact Owner</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredContacts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((contact, index) => (
                <TableRow key={index} hover>
                  <TableCell padding="checkbox">
                    <Checkbox />
                  </TableCell>

                  <TableCell>
                    {editIndex === index ? (
                      <TextField
                        value={editedRow?.contactName || ''}
                        onChange={(e) =>
                          setEditedRow((prev) => ({ ...prev, contactName: e.target.value }))
                        }
                        size="small"
                      />
                    ) : (
                      <Typography fontWeight="bold">{contact.contactName}</Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    {editIndex === index ? (
                      <TextField
                        value={editedRow?.companyName || ''}
                        onChange={(e) =>
                          setEditedRow((prev) => ({ ...prev, companyName: e.target.value }))
                        }
                        size="small"
                      />
                    ) : (
                      contact.companyName
                    )}
                  </TableCell>

                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone || '-'}</TableCell>

                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar
                        sx={{ bgcolor: 'lightgreen', color: 'black', fontSize: 12, width: 24, height: 24 }}
                      >
                        {getInitials(contact.contactOwner)}
                      </Avatar>
                      <Typography variant="body2">{contact.contactOwner}</Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    {editIndex === index ? (
                      <IconButton onClick={handleSave} size="small">
                        <Save fontSize="small" />
                      </IconButton>
                    ) : (
                      <IconButton onClick={() => handleEdit(index)} size="small">
                        <Edit fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredContacts.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default ContactTable;
