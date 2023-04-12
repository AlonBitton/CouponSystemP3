import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import customerService from 'Services/customerService';
import CouponModel from 'models/CouponModel';
import { FC, useState } from 'react';

interface PurchaseButtonProps {
  coupon: CouponModel;
  color?: string;
}

const PurchaseButton: FC<PurchaseButtonProps> = ({ coupon, color }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [Loading, setLoading] = useState(false);

  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = async (id: number) => {
    setLoading(true);
    await customerService.purchaseCoupon(id);
    setLoading(false);
    handleClose();
  };

  return (
    <>
      <Box>
        <IconButton onClick={handleOpen}>
          <AddShoppingCartIcon sx={{ color: color === 'primary' ? 'white' : 'gray' }} />
        </IconButton>
      </Box>

      <PurchaseModal open={isModalOpen} onClose={handleClose} handleConfirm={() => handleConfirm(coupon.id)}>
        <Typography variant="h6">Are you sure you want to purchase this coupon?</Typography>
        <p>
          {coupon.title} | ${coupon.price.toFixed(2)}
        </p>
      </PurchaseModal>
    </>
  );
};

interface PurchaseModalProps {
  open: boolean;
  onClose: () => void;
  handleConfirm: () => void;
  children: React.ReactNode;
}

export const PurchaseModal = ({ open, onClose, handleConfirm, children }: PurchaseModalProps) => {
  const [Loading, setLoading] = useState(false);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle textAlign="center">Purchase Coupon</DialogTitle>
      <DialogContent>
        <Stack
          sx={{
            width: '100%',
            minWidth: { xs: '300px', sm: '360px', md: '400px' },
            gap: '1.5rem',
          }}
        >
          {children}
        </Stack>
        <DialogActions sx={{ p: '1.25rem', justifyContent: 'space-between' }}>
          <Button onClick={onClose} color="error">
            Cancel
          </Button>
          {Loading ? (
            <LoadingButton loading fullWidth variant="contained">
              Loading
            </LoadingButton>
          ) : (
            <Button color="success" type="submit" variant="contained" onClick={handleConfirm}>
              Purchase
            </Button>
          )}
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseButton;
