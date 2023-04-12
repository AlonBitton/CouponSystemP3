import { Box, Divider, Grid, Typography } from '@mui/material';
import couponService from 'Services/couponService';
import useTitle from 'hooks/useTitle';
import CouponModel from 'models/CouponModel';
import { FC, useEffect, useState } from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import ReactCardFlip from 'react-card-flip';
import CouponCard, { CouponCardBack } from './couponsCard/couponCard';
import CouponList from './tables/couponTable';
import CustomerCoupons from './tables/customerCoupons';

const CustomerDashboard: FC = () => {
  useTitle('Customer Dashboard');

  const [Loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState<CouponModel[]>([]);

  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      const coupons = await couponService.getAllCoupons();
      setCoupons(coupons);
      setLoading(false);
    };

    fetchCoupons();
  }, []);

  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);

  const [modalOpen, setModalOpen] = useState(false);

  const handleCardClick = (index: number) => {
    setModalOpen(true);
    setSelectedCardIndex(index === selectedCardIndex ? null : index);
  };

  const responsive = {
    2000: {
      items: 5,
    },
    1200: {
      items: 3,
    },
    800: {
      items: 2,
    },
    0: {
      items: 1,
    },
  };

  return (
    <Box px={10} py={5}>
      <Box sx={{ maxWidth: '90%', margin: '0 auto' }}>
        <Typography variant="h5" sx={{ margin: '0 auto' }}>
          Customer Dashboard
        </Typography>

        <Box sx={{ maxWidth: '100%', margin: '0 auto', pt: 5 }}>
          <AliceCarousel responsive={responsive} mouseTracking disableButtonsControls>
            {coupons.map((coupon, index) => (
              <Grid sx={{ p: 1 }} item key={index}>
                <ReactCardFlip isFlipped={selectedCardIndex === index} flipDirection="horizontal">
                  <CouponCard
                    coupon={coupon}
                    onClick={() => {
                      handleCardClick(index);
                    }}
                  />

                  <CouponCardBack
                    coupon={coupon}
                    onClick={() => {
                      handleCardClick(index);
                    }}
                  />
                </ReactCardFlip>
              </Grid>
            ))}
          </AliceCarousel>
        </Box>

        <Divider sx={{ my: 5 }} />

        <CouponList />

        <Divider sx={{ my: 5 }} />

        <CustomerCoupons />
      </Box>
    </Box>
  );
};

export default CustomerDashboard;
