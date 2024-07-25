import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';
import { Boxes, CircleDollarSign, Percent } from 'lucide-react';

const items = [
  {
    icon: <CircleDollarSign />,
    title: 'Save a lot of money',
    description:
    `Prospecting tools are constantly in the form of a monthly subscription, which makes no sense, because you are supposed to use these tools a few times a year (at most).
     Pay getleads.dev once, use it whenever you want. Prospecting tool to find leads (blue for example) + email researcher and verifier = $150/month * 12 = $1,800/year getleads.dev = 
    `,
    price: '$299',
    fakePrice: ' $199 once'
  },
  {
    icon: <Boxes />,
    title: 'All in one',
    description:
      'The research part of prospecting is often done with several tools, one to find leads and others to manage everything that involves finding and checking emails for deliverability. All this part is grouped in getleads.dev in order to have everything in one tool and improve your productivity.',
  },
  {
    icon: <Percent />,
    title: 'A very potentially winning investment',
    description:
      'The calculation is done very quickly because you just need to find a single client thanks to getleads.dev and this investment is reimbursed in 1 day for some and multiplied by tens or even hundreds for others.',
  }
];

export default function Highlights() {
  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: 'white',
        bgcolor: '#06090a',
      }}
    >
      <Container
        sx={{
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
          <Typography component="h2" variant="h4">
            Highlights
          </Typography>
          <Typography variant="body1" sx={{ color: 'grey.400' }}>
          Discover what sets getleads.dev apart: seamless integration of tech stack targeting, user-friendly design, and a single-payment model. Experience innovative tools and reliable support that enhance your prospecting efficiency.
          </Typography>
        </Box>
        <Grid container spacing={2.5}>
          {items.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Stack
                direction="column"
                color="inherit"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  p: 3,
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'grey.800',
                  background: 'transparent',
                  backgroundColor: 'grey.900',
                }}
              >
                <Box sx={{ opacity: '50%' }}>{item.icon}</Box>
                <div>
                  <Typography fontWeight="medium" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'grey.400' }}>
                    {item.description}
                    <span style={{textDecoration: "line-through"}}>{item.price}</span>
                    <span>{item.fakePrice}</span>
                  </Typography>
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}