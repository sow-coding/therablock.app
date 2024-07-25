import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

const tiers = [
  {
    title: 'Basic',
    price: '169',
    description: [
      'Unlimited search',
      'All search filters',
      'Tech stack filter',
      'Email finder',
      'Free trial',
      'Email support'
    ],
    buttonText: 'Start free trial',
    buttonVariant: 'outlined',
  },
  {
    title: 'Premium',
    subheader: 'Recommended',
    price: '199',
    description: [
      'Unlimited search',
      'All search filters',
      'Tech stack filter',
      'Email finder',
      'Email verification',
      'Free trial',
      'Email support',
    ],
    buttonText: 'Start free trial',
    buttonVariant: 'contained',
  }
];

export default function Pricing() {
  return (
    <Container
      id="pricing"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Box
        sx={{
          width: { sm: '100%', md: '60%' },
          textAlign: { sm: 'left', md: 'center' },
        }}
      >
        <Typography sx={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '16px'
        }} component="h2" variant="h4" color="primary">
          Pricing
        </Typography>
        <Typography
            variant="h3"
            color="text.primary"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignSelf: 'center',
              textAlign: 'center',
              fontSize: 'clamp(1.5rem, 6vw, 2rem)',
              fontWeight: 'bold',
            }}
          >
            Save hours of research and (finally) reach the right people
          </Typography>
      </Box>
      <Grid container spacing={3} alignItems="center" justifyContent="center">
        {tiers.map((tier) => (
          <Grid
            item
            key={tier.title}
            xs={12}
            sm={tier.title === 'Enterprise' ? 12 : 6}
            md={4}
          >
            <Card
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                border: tier.title === 'Premium' ? '1px solid' : undefined,
                borderColor:
                  tier.title === 'Premium' ? 'primary.main' : undefined,
                background:
                  tier.title === 'Premium'
                    ? 'linear-gradient(#033363, #021F3B)'
                    : undefined,
              }}
            >
                    <Chip
                      label={"Launch discount ends 6/05"}
                      size="small"
                    />
              <CardContent>
                <Box
                  sx={{
                    mb: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: tier.title === 'Premium' ? 'grey.100' : '',
                  }}
                >
                  <Typography component="h3" variant="h6">
                    {tier.title}
                  </Typography>
                  {tier.title === 'Premium' && (
                    <Chip
                      icon={<AutoAwesomeIcon />}
                      label={tier.subheader}
                      size="small"
                      sx={{
                        background: (theme) =>
                          theme.palette.mode === 'light' ? '' : 'none',
                        backgroundColor: 'primary.contrastText',
                        '& .MuiChip-label': {
                          color: 'primary.dark',
                        },
                        '& .MuiChip-icon': {
                          color: 'primary.dark',
                        },
                      }}
                    />
                  )}
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'baseline',
                    color: tier.title === 'Premium' ? 'grey.50' : undefined,
                  }}
                >
                  <Typography component="h3" variant="h2">
                    ${tier.price}
                  </Typography>
                  <Typography className='ml-2' style={{textDecoration: "line-through"}} component="h3" variant="h6">
                    ${tier.title === 'Basic' ? '269' : '299'}
                  </Typography>
                </Box>
                <Divider
                  sx={{
                    my: 2,
                    opacity: 0.2,
                    borderColor: 'grey.500',
                  }}
                />
                {tier.description.map((line) => (
                  <Box
                    key={line}
                    sx={{
                      py: 1,
                      display: 'flex',
                      gap: 1.5,
                      alignItems: 'center',
                    }}
                  >
                    <CheckCircleRoundedIcon
                      sx={{
                        width: 20,
                        color:
                          tier.title === 'Premium'
                            ? 'primary.light'
                            : 'primary.main',
                      }}
                    />
                    <Typography
                      component="text"
                      variant="subtitle2"
                      sx={{
                        color:
                          tier.title === 'Premium' ? 'grey.200' : undefined,
                      }}
                    >
                      {line}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
              <CardActions className='flex flex-col'>
                <Button
                  fullWidth
                  variant={tier.buttonVariant as 'outlined' | 'contained'}
                  component="a"
                  href="/signup"
                  target="_blank"
                >
                  {tier.buttonText}
                </Button>
                <p className={`mt-4 font-bold ${tier.title === "Premium" && "text-white"}`}>Pay once. Find leads</p>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}