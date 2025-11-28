import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';

/*
Reusable JobCard component
Props:
- open: boolean
- job: { id, jobId, name, description, department, machineId, employeeName, status, startSlot, durationSlots }
- onClose: () => void
- onEdit: (job) => void
- onUpdateStatus: (job, newStatus) => Promise<void>
- onDelete: (job) => Promise<void>
*/

const STATUS_OPTIONS = ['pending', 'in-progress', 'completed', 'cancelled'];

function JobCard({ open, job, onClose, onEdit, onUpdateStatus, onDelete }) {
  const [status, setStatus] = useState(job?.status || 'pending');
  const [saving, setSaving] = useState(false);

  // ✅ Parse role from td_user in localStorage
  const user = JSON.parse(localStorage.getItem("td_user") || "{}");
  const role = user.role;

  useEffect(() => {
    setStatus(job?.status || 'pending');
  }, [job]);

  const handleSaveStatus = async () => {
    if (!onUpdateStatus || !job) return;
    setSaving(true);
    try {
      await onUpdateStatus(job, status);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = () => {
    console.log("Delete clicked:", job.id, job.jobId, "role:", role);
    if (window.confirm(`Are you sure you want to delete job ${job.jobId}?`)) {
      onDelete(job); // ✅ passes job back up
    }
  };

  if (!job) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Job {job.jobId}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={1}>
          <Typography variant="h6" fontSize="1rem">{job.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {job.description || 'No description'}
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip label={`Department: ${job.department || '-'}`} size="small" />
            <Chip label={`Machine: ${job.machineId || '-'}`} size="small" />
            <Chip label={`Employee: ${job.assignedTo?.name || job.employeeName || '-'}`} size="small" />
            <Chip label={`Start: ${job.startSlot}`} size="small" />
            <Chip label={`Duration: ${job.durationSlots}`} size="small" />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} sx={{ mt: 1 }}>
            <TextField
              select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              size="small"
              sx={{ width: 220 }}
            >
              {STATUS_OPTIONS.map(s => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </TextField>
            <Button variant="contained" onClick={handleSaveStatus} disabled={saving}>
              Save Status
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        {onEdit && (
          <Button onClick={() => onEdit(job)} color="secondary" variant="outlined">
            Edit
          </Button>
        )}
        <Button onClick={onClose}>Close</Button>

        {/* ✅ Delete button only for admin/manager */}
        {(role === "admin" || role === "manager") && onDelete && (
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default JobCard;