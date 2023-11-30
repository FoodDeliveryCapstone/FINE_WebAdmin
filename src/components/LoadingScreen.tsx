import { m } from 'framer-motion';
// @mui
import { styled } from '@mui/material/styles';
import { Box, CircularProgress, Stack } from '@mui/material';
//
// import Logo from './Logo';
import { Typography } from '@mui/material';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  right: 0,
  bottom: 0,
  zIndex: 99999,
  width: '100%',
  height: '100%',
  position: 'fixed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------

export default function LoadingScreen() {
  const defaultTitle = 'Đang tải';
  return (
    <RootStyle>
      <Stack alignItems={'center'} justifyContent="center" height="100vh">
        <img
          alt="logo"
          src={'/assets/gifs/animate_mascot.gif'}
          style={{ width: '20rem', height: ' 20rem' }}
        />

        <Stack alignItems={'center'} gap={2} direction={'row'}>
          <CircularProgress
            variant="indeterminate"
            disableShrink
            sx={{
              animationDuration: '550ms',
            }}
            size={40}
            thickness={4}
          />
          {defaultTitle.split(' ').map((word, index) => (
            <Box
              key={index}
              component={m.ul}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {},
              }}
              transition={{
                delayChildren: index * 0.4,
                staggerChildren: 0.05,
              }}
              fontSize="2rem"
              sx={{
                listStyleType: 'none',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
              }}
            >
              {word.split('').map((char, index) => (
                <m.li
                  key={char + index.toString()}
                  variants={{
                    hidden: {
                      transition: {
                        damping: 12,
                        stiffness: 200,
                      },
                      y: `-0.4rem`,
                      opacity: 0,
                    },
                    visible: {
                      transition: {
                        type: 'spring',
                        damping: 12,
                        stiffness: 200,
                        duration: 2,
                        repeat: Infinity,
                      },
                      y: `0rem`,
                      opacity: 1,
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '2rem',
                      display: 'inline-block',
                    }}
                  >
                    {char}
                  </Typography>
                </m.li>
              ))}
            </Box>
          ))}
        </Stack>
      </Stack>
      {/* <m.div
        animate={{
          scale: [1, 0.9, 0.9, 1, 1],
          opacity: [1, 0.48, 0.48, 1, 1],
        }}
        transition={{
          duration: 2,
          ease: 'easeInOut',
          repeatDelay: 1,
          repeat: Infinity,
        }}
      >
        <Logo disabledLink sx={{ width: 64, height: 64 }} />
      </m.div>
      <Box
        component={m.div}
        animate={{
          scale: [1.2, 1, 1, 1.2, 1.2],
          rotate: [270, 0, 0, 270, 270],
          opacity: [0.25, 1, 1, 1, 0.25],
          borderRadius: ['25%', '25%', '50%', '50%', '25%'],
        }}
        transition={{ ease: 'linear', duration: 3.2, repeat: Infinity }}
        sx={{
          width: 100,
          height: 100,
          borderRadius: '25%',
          position: 'absolute',
          border: (theme) => `solid 3px ${alpha(theme.palette.primary.dark, 0.24)}`,
        }}
      />
      <Box
        component={m.div}
        animate={{
          scale: [1, 1.2, 1.2, 1, 1],
          rotate: [0, 270, 270, 0, 0],
          opacity: [1, 0.25, 0.25, 0.25, 1],
          borderRadius: ['25%', '25%', '50%', '50%', '25%'],
        }}
        transition={{
          ease: 'linear',
          duration: 3.2,
          repeat: Infinity,
        }}
        sx={{
          width: 120,
          height: 120,
          borderRadius: '25%',
          position: 'absolute',
          border: (theme) => `solid 8px ${alpha(theme.palette.primary.dark, 0.24)}`,
        }}
      /> */}
    </RootStyle>
  );
}
