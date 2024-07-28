import * as React from 'react';
import { alpha } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Badge } from '@/components/ui/badge';

export default function Hero() {
  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: '100%',
        backgroundImage:
          theme.palette.mode === 'light'
            ? 'linear-gradient(180deg, #CEE5FD, #FFF)'
            : `linear-gradient(#02294F, ${alpha('#090E10', 0.0)})`,
        backgroundSize: '100% 20%',
        backgroundRepeat: 'no-repeat',
      })}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      > 
          <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignSelf="center"
              spacing={1}
              useFlexGap
              sx={{ pt: 2, width: { xs: '100%', sm: 'auto' }, marginBottom: "10px" }}
            >
            <a href="https://twitter.com/sow4code" target='_blank' className='self-center'>
              <Badge variant={"outline"}>{`By an entrepreneur for entrepreneurs ;)`}</Badge>
            </a>
          </Stack>
        <Stack spacing={2} useFlexGap sx={{ width: { xs: '100%', sm: '75%' } }}>
          <Typography
            variant="h1"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignSelf: 'center',
              textAlign: 'center',
              fontSize: 'clamp(3.5rem, 10vw, 4rem)',
            }}
          >
            The (only) productivity tool an entrepreneur needs
          </Typography>
          <Typography
            textAlign="center"
            color="text.secondary"
            sx={{ alignSelf: 'center', width: { sm: '100%', md: '80%' } }}
          >
            Maximize your productivity, destroy your procrastination and increase your focus by blocking all harmful distractions.
          </Typography>
        </Stack>
          
        <div
            className='flex flex-col items-center my-4'
          >
          <Button
            color="primary"
            variant="contained"
            size="small"
            component="a"
            href="https://github.com/sow-coding/therablock/releases/download/v1.0.0/Therablock.Setup.0.1.0.exe"
            style={{width: "256px", height: "56px"}}
          >
            Download Therablock
          </Button>
          <a className='mt-2 underline' style={{fontSize: "11px"}}>The landing page is under construction*</a>
        </div>
        {/*
        <Box
          id="image"
          sx={(theme) => ({
            mt: { xs: 8, sm: 10 },
            alignSelf: 'center',
            height: { xs: 200, sm: 500 }, // These might be adjusted or removed
            width: '100%',
            borderRadius: '10px',
            outline: '1px solid',
            outlineColor:
              theme.palette.mode === 'light'
                ? alpha('#BFCCD9', 0.5)
                : alpha('#9CCCFC', 0.1),
            boxShadow:
              theme.palette.mode === 'light'
                ? `0 0 12px 8px ${alpha('#9CCCFC', 0.2)}`
                : `0 0 24px 12px ${alpha('#033363', 0.2)}`,
          })}
        >
          
            <img
            src={ "/preview.png"    }
            alt="Preview Image"
            style={{
              width: '100%', 
              height: 'auto',  // Makes the image height adjust to maintain the aspect ratio
              display: 'block'
            }}
          />
          
        </Box>
        */}
      </Container>
    </Box>
  );
}