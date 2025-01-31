import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, Button, Stack, useTheme } from '@mui/material';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import logo from '../assets/logo.png';
import Navbar, { NavDrawer } from './Navbar';
import { Link, useNavigate } from 'react-router-dom';
import chroma from "chroma-js";
import { AuthContext } from '../context/AuthProvider';

const drawerWidth = 280;

export default function MainAppBar() {
    const theme = useTheme();
    const navigate = useNavigate()

    const [mobileOpen, setMobileOpen] = React.useState(false);
    const { user } = React.useContext(AuthContext)

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const signUpClickHandler = () => {
        navigate('/signup')
    }

    const container = window !== undefined ? () => window.document.body : undefined;

    const drawer = (
        <Stack onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Stack justifyContent='space-between' alignItems='center' >
                <Stack gap={2} p={2} alignItems='center' maxWidth='auto' >
                    <img src={logo} style={{ width: '50%' }} />
                    <Typography variant='h3' fontFamily={"'Nosifer', sans-serif"}>
                        <span className="text-gradient">Wolfame</span>
                    </Typography>
                </Stack>
            </Stack>
            <Divider />
            <NavDrawer />
        </Stack>
    );

    return (
        <Box px={2} sx={{ flexGrow: 0 }}>
            <nav>
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>
            <AppBar position="fixed" sx={{ backgroundColor: chroma(theme.palette.background.paper).alpha(0.8).hex(), borderRadius: '20px', boxSizing: 'border-box', top: '10px', width: '95%', left: '2.5%', backdropFilter: 'blur(4px)' }}>
                <Stack direction='row' justifyContent='space-between' alignItems='center' height='4rem' px={2} >
                    <IconButton
                        size="medium"
                        edge="start"
                        aria-label="open drawer"
                        onClick={handleDrawerToggle}
                        sx={{
                            display: { xs: 'block', sm: 'none' },
                        }}
                    >
                        <MenuIcon fontSize='large' />
                    </IconButton>
                    <Stack
                        direction='row'
                        justifyContent='space-between'
                        alignItems='center'
                        gap={2}
                        sx={{
                            height: '3.2rem',
                            position: { xs: 'absolute', sm: 'static' },
                            left: { xs: '50%' },
                            transform: { xs: 'translate(-50%,0%)', sm: 'translate(0%,0%)' },
                        }}>
                        <Link to='/'>
                            <Box justifyContent='space-between' alignItems='center' gap={2} sx={{ height: '3.2rem' }}>
                                <img src={logo} style={{ height: '95%' }} />
                            </Box>
                        </Link>
                    </Stack>
                    <Navbar />
                    <Stack direction='row' gap='2'>
                        {user ?
                            <Link to={`/users/${encodeURIComponent(user.name)}`}>
                                <Avatar sx={{ bgcolor: 'red' }} alt={user.name} src={user.image} />
                            </Link> :
                            <Button variant='outlined' size='large' onClick={signUpClickHandler}>
                                Sign Up
                            </Button>
                        }
                    </Stack>
                </Stack>
            </AppBar>
        </Box>
    );
}