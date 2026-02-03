import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import { AddCircleOutline } from '@mui/icons-material';

// No TypeScript interface here
function createData(name, company, email, phone, leadSource, leadOwner) {
  return { name, company, email, phone, leadSource, leadOwner };
}

// Sample data
const rows = [
  createData('Amit Sharma', 'TechNova Pvt Ltd', 'amit.sharma@technova.com', '9876543210', 'Website', 'Ravi Mehra'),
  createData('Pooja Patel', 'HealthCorp', 'pooja.patel@healthcorp.com', '9123456789', 'Referral', 'Meena Joshi'),
  createData('Rahul Verma', 'EduTrack', 'rahul.verma@edutrack.in', '9988776655', 'LinkedIn', 'Ayesha Khan'),
  createData('Sneha Iyer', 'BuildSmart', 'sneha.iyer@buildsmart.com', '9871234567', 'Facebook Ads', 'Suresh Rathi'),
  createData('Vikram Nair', 'FinMatrix', 'vikram.nair@finmatrix.com', '9112233445', 'Email Campaign', 'Tina Dsouza')
];

export default function Users() {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate('/leads/create');
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col mb-4">
        <h2 className="text-3xl font-semibold text-blue-800 mb-2">Leads</h2>
        <button
          onClick={handleCreate}
          className="self-end flex items-center gap-2 text-white bg-blue-900 hover:bg-blue-950 font-medium rounded-md text-md px-3 py-2"
        >
          <AddCircleOutline className="w-5 h-5" />
          Create Lead
        </button>
      </div>

      {/* Table or empty state */}
      {rows.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl font-medium text-gray-600 mb-2">No leads created yet!</p>
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 750 }} aria-label="lead table">
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Company</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Phone</strong></TableCell>
                <TableCell><strong>Lead Source</strong></TableCell>
                <TableCell><strong>Lead Owner</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.company}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.leadSource}</TableCell>
                  <TableCell>{row.leadOwner}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
