import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { type MRT_ColumnDef } from 'material-react-table';
import Category from 'models/Category';
import CouponModel from 'models/CouponModel';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import adminService from 'Services/adminService';
import * as Yup from 'yup';

interface CreateModalProps {
  columns: MRT_ColumnDef<CouponModel>[];
  onClose: () => void;
  onSubmit: (values: CouponModel) => void;
  open: boolean;
}

const CreateNewCouponModal = ({ open, onClose }: CreateModalProps) => {
  const [Loading, setLoading] = useState(false);

  const schema = Yup.object().shape({
    companyId: Yup.number().min(1, 'Company id must be greater than 1').required('Company ID is required'),
    category: Yup.mixed<Category>().oneOf(Object.values(Category), 'Invalid category').required('Category is required'),
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    startDate: Yup.date().min(new Date(), 'Please choose future date').required('Start Date field is required'),
    endDate: Yup.date().min(Yup.ref('startDate'), 'End Date must be after Start Date'),
    amount: Yup.number().min(1, 'Amount must be at least 1').required('Amount field is required'),
    price: Yup.number().min(0.01, 'Price my be a positive number').required('Price field is required'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CouponModel>({
    resolver: yupResolver(schema),
  });

  async function send(coupon: CouponModel) {
    setLoading(true);
    await adminService.addNewCoupon(coupon);
    setLoading(false);
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle textAlign="center">Add New Coupon</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(send)}>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}
          >
            <br />
            <TextField
              autoFocus
              margin="dense"
              id="companyId"
              label="Company ID"
              type="number"
              fullWidth
              variant="standard"
              error={Boolean(errors.companyId)}
              helperText={errors.companyId?.message}
              {...register('companyId')}
            />
            <FormControl>
              <InputLabel id="category-label" sx={{ marginLeft: -2 }}>
                Coupon Category
              </InputLabel>

              <Select labelId="category-label" id="category" variant="standard" {...register('category')}>
                <MenuItem value="" disabled>
                  Select Category
                </MenuItem>
                {Object.values(Category).map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              autoFocus
              margin="dense"
              id="title"
              label="Coupon Title"
              type="text"
              fullWidth
              variant="standard"
              error={Boolean(errors.title)}
              helperText={errors.title?.message}
              {...register('title')}
            />
            <TextField
              autoFocus
              margin="dense"
              id="description"
              label="Description"
              type="text"
              fullWidth
              variant="standard"
              error={Boolean(errors.description)}
              helperText={errors.description?.message}
              {...register('description')}
            />
            <TextField
              autoFocus
              margin="dense"
              id="startDate"
              label="Start Date"
              type="date"
              focused
              fullWidth
              variant="standard"
              error={Boolean(errors.startDate)}
              helperText={errors.startDate?.message}
              {...register('startDate')}
            />
            <TextField
              autoFocus
              margin="dense"
              id="endDate"
              label="End Date"
              type="date"
              focused
              fullWidth
              variant="standard"
              error={Boolean(errors.endDate)}
              helperText={errors.endDate?.message}
              {...register('endDate')}
            />
            <TextField
              autoFocus
              margin="dense"
              id="amount"
              label="Amount"
              type="number"
              fullWidth
              variant="standard"
              error={Boolean(errors.amount)}
              helperText={errors.amount?.message}
              {...register('amount')}
            />
            <TextField
              autoFocus
              margin="dense"
              id="price"
              label="Price"
              type="number"
              fullWidth
              variant="standard"
              error={Boolean(errors.price)}
              helperText={errors.price?.message}
              {...register('price')}
            />
            <TextField
              autoFocus
              margin="dense"
              id="image"
              label="Coupon Image"
              type="file"
              fullWidth
              focused
              variant="standard"
              {...register('image')}
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
                Add New Coupon
              </Button>
            )}
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewCouponModal;
