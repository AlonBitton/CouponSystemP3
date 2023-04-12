import { Badge, Box, Button, Card, Divider, styled, Typography } from '@mui/material';
import PurchaseButton from 'components/customer-layout/buttons/purchase-button';
import CouponModel from 'models/CouponModel';
import moment from 'moment';
import { FC } from 'react';

interface CouponCardProps {
  coupon: CouponModel;
  onClick?: () => void;
}

const ImageWrapper = styled(Box)(({ theme }) => ({
  height: 125,
  position: 'relative',
  '&::before': {
    content: '""',
    top: 0,
    position: 'absolute',
    opacity: 0.6,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  width: 10,
  height: 50,
  bottom: 10,
  right: 10,
  marginTop: 10,
  padding: 20,
  float: 'right',
  borderRadius: '100%',
  color: 'whitesmoke',
  boxShadow: 'none',
  backgroundColor: theme.palette.primary.main,
  borderColor: 'whitesmoke',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    opacity: 0.95,
  },
  [theme.breakpoints.down('sm')]: {
    width: 30,
    height: 30,
    bottom: 10,
    right: 10,
  },
}));

const CouponCard: FC<CouponCardProps> = ({ coupon, onClick }) => {
  return (
    <>
      <Box>
        <Card
          onClick={onClick}
          sx={{ margin: '0 auto', minHeight: '225px', maxWidth: '250px', position: 'relative', overflow: 'hidden' }}
        >
          <ImageWrapper>
          <img src={'https://source.unsplash.com/random/?' + coupon.category} width="100%" height="100%" />
          </ImageWrapper>

          <Divider sx={{ pb: 2, width: '100%' }}>
            <Badge sx={{ position: 'absolute' }} badgeContent={coupon.category} color="secondary" />
          </Divider>

          <Box ml={1}>
            <Typography fontWeight={600}>{coupon.title}</Typography>
          </Box>
          <Typography sx={{ margin: '0px 5px', my: 1 }}>{coupon.description}</Typography>
          <Box
            display="flex"
            justifyContent={'space-between'}
            alignContent="center"
            sx={{ margin: '0 auto', position: 'relative', alignItems: 'center', m: 1 }}
          >
            <Typography fontSize={20} fontWeight={600} ml={1}>
              <p>${coupon.price.toFixed(2)}</p>
            </Typography>

            <StyledButton>
              <PurchaseButton coupon={coupon} color={'primary'} />
            </StyledButton>
          </Box>
        </Card>
      </Box>
    </>
  );
};

export const CouponCardBack: FC<CouponCardProps> = ({ coupon, onClick }) => {
  return (
    <>
      <Card
        onClick={onClick}
        sx={{ margin: '0 auto', minHeight: '225px', maxWidth: '250px', position: 'relative', overflow: 'hidden' }}
      >
        <ImageWrapper>
          <img src={'https://source.unsplash.com/random/?' + coupon.category + /250x250/} width="100%" height="100%" />
        </ImageWrapper>

        <Divider sx={{ pb: 2, width: '100%' }}>
          <Badge sx={{ position: 'absolute' }} badgeContent={'Only ' + coupon.amount + ' left'} color="warning" />
        </Divider>

        <Box ml={1}>
          <Typography fontWeight={600}>{coupon.title}</Typography>
          <Typography fontSize={11} fontWeight={600} color="GrayText">
            <p>Will be expired at: {moment(coupon.endDate).format('DD/MM/YYYY')}</p>
          </Typography>

          <Typography sx={{ margin: '0px 5px', my: 1 }}>{coupon.description}</Typography>
        </Box>

        <Box
          display="flex"
          justifyContent={'space-between'}
          alignContent="center"
          sx={{ margin: '0 auto', position: 'relative', alignItems: 'center', m: 1 }}
        >
          <Typography fontSize={20} fontWeight={600} ml={1}>
            <p>${coupon.price.toFixed(2)}</p>
          </Typography>

          <StyledButton>
            <PurchaseButton coupon={coupon} color={'primary'} />
          </StyledButton>
        </Box>
      </Card>
    </>
  );
};

export default CouponCard;
