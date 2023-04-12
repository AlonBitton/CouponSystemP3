import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import { type MRT_ColumnDef } from 'material-react-table';
import UserModel from 'models/UserModel';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import adminService from 'Services/adminService';
import * as Yup from 'yup';

interface CreateModalProps {
  columns: MRT_ColumnDef<UserModel>[];
  onClose: () => void;
  onSubmit: (values: UserModel) => void;
  open: boolean;
}

const CreateNewCompanyModal = ({ open, onClose }: CreateModalProps) => {
  const [Loading, setLoading] = useState(false);

  const schema = Yup.object().shape({
    email: Yup.string().required('Email is required'),
    name: Yup.string().required('Company Name is required'),
    password: Yup.string().required('Password is required'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserModel>({
    resolver: yupResolver(schema),
  });

  async function send(company: UserModel) {
    setLoading(true);
    await adminService.addNewCompany(company);
    setLoading(false);
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle textAlign="center">Add New Company</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(send)}>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}
          >
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Company Name"
              type="text"
              fullWidth
              variant="standard"
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              {...register('name')}
            />
            <TextField
              autoFocus
              margin="dense"
              id="email"
              label="Email"
              type="email"
              fullWidth
              variant="standard"
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              {...register('email')}
            />
            <TextField
              autoFocus
              margin="dense"
              id="password"
              label="Password"
              type="password"
              fullWidth
              variant="standard"
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
              {...register('password')}
            />
          </Stack>
          <DialogActions sx={{ p: '1.25rem', justifyContent: 'space-between' }}>
            <Button onClick={onClose}>Cancel</Button>
            {Loading ? (
              <LoadingButton loading fullWidth variant="contained">
                Loading
              </LoadingButton>
            ) : (
              <Button color="secondary" type="submit" variant="contained">
                Create New Company
              </Button>
            )}
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewCompanyModal;
