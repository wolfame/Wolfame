import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Stack, Grid, Typography, Paper, Avatar, Snackbar, Alert, MenuItem, Select, InputLabel, FormControl, useTheme, Button, IconButton } from '@mui/material'
import TextField from "@mui/material/TextField";
import { useFormik } from 'formik'
import axios from '../../../services/axiosinstance';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import RuleBook from '../../../components/RuleBook'
import PlayerSelect from 'react-select';

import residenceList from '../../../data/residence'
import eventsList from '../../../data/events'

import { teamSchema } from '../../../schemas/team'
import CloseIcon from '@mui/icons-material/Close';

function PlayerSelectInput({ index, selectedPlayers = [], playersList = [], setPlayers }) {
    const filteredPlayersList = playersList.filter(
        (player) => !selectedPlayers.find(
            (id, i) => index !== i && player?._id === id)
    )

    return (
        <FormControl fullWidth>
            <Stack direction='row' gap={1}>
                <InputLabel id={`player-label-${index}`}>{`Player ${index + 1}`}</InputLabel>
                <Select
                    labelId={`player-label-${index}`}
                    id={`player-${index}`}
                    fullWidth
                    defaultValue={'Select Player'}
                    value={selectedPlayers[index]}
                    onChange={(e) => {
                        const newPlayersList = [...selectedPlayers]
                        newPlayersList[index] = e.target.value
                        setPlayers(newPlayersList)
                    }}
                    label="Player"
                    name='player'
                >
                    {filteredPlayersList.map((player) => {
                        const { name, image, _id } = player
                        return (
                            <MenuItem key={name} value={_id} selected={_id == selectedPlayers[index]}>
                                <Stack direction='row' gap={2} sx={{ alignItems: 'center' }}>
                                    <Avatar src={image} variant="rounded">{name?.[0]}</Avatar>
                                    <Typography variant='h5' fontWeight={500} sx={{ opacity: 0.6, color: 'inherit' }} >
                                        {name}
                                    </Typography>
                                </Stack>
                            </MenuItem>
                        )
                    })}
                </Select>
                <Button variant='outlined' onClick={() => {
                    const newPlayersList = [...selectedPlayers]
                    newPlayersList.splice(index, 1)
                    setPlayers(newPlayersList)
                }}>
                    <CloseIcon />
                </Button>
            </Stack>
        </FormControl>
    )
}

export default function CreateTeamSection() {

    const initialValues = {
        name: '',
        residence: '',
        event: '',
        players: [''],
    }

    const navigate = useNavigate()

    const { values, handleBlur, handleChange, handleSubmit, errors, touched, setFieldValue } =
        useFormik({
            initialValues,
            validationSchema: teamSchema,
            validateOnChange: true,
            validateOnBlur: false,
            //// By disabling validation onChange and onBlur formik will validate on submit.
            onSubmit: async (values, action) => {
                const playersCount = values.players.filter((value) => value).length
                if (playersCount < eventData.players[0] || playersCount > eventData.players[1]) {
                    if (eventData.players[0] === eventData.players[1]) {
                        action.setErrors({ players: `There must exist exactly ${eventData.players[0]} players in a ${eventData.label} team` })
                    }
                    else {
                        action.setErrors({ players: `There must exist atleat ${eventData.players[0]} and atmost ${eventData.players[0]} players in a ${eventData.label} team` })
                    }
                    return
                }
                try {
                    values.players = values.players.filter((value) => value)
                    await axios.post('/team/create', values)
                    navigate('../')
                }
                catch (e) {
                    if (e.response?.status === 406) {
                        action.setErrors(e.response.data)
                    }
                }
            },
        });

    const [playersList, setPlayersList] = useState([])

    const fetchPlayer = async () => {
        try {
            const users = await axios.get('/user', { params: { residence: values.residence } })
            return users.data
        }
        catch (e) {
            console.log(e)
            return []
        }
    }

    useEffect(() => {
        if (!values.residence) return
        fetchPlayer().then((data) => setPlayersList(data))
    }, [values.residence])

    const addPlayer = () => {
        setFieldValue('players', [...values.players, ''])
    }

    const setPlayers = (newPlayersList) => {
        setFieldValue('players', newPlayersList)
    }

    const eventData = eventsList.find(({ label }) => label === values.event)

    return (
        <Grid container p={4} mt={8} mb={6}>
            <Grid item xs={12} md={6} >
                <RuleBook event={values.event} disableButton />
            </Grid>
            <Grid item xs={12} md={6} >
                <Stack component="form" onSubmit={handleSubmit} gap={2} px={2} sx={{ alignItems: 'center' }}>
                    <Typography variant='h2' fontWeight={700} sx={{ opacity: 0.6 }} >
                        Create Team
                    </Typography>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Team Name"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.name && touched.name}
                        autoFocus
                    />
                    {errors.name && touched.name && (
                        <Typography color='error'>
                            {errors.name}
                        </Typography>
                    )}
                    <FormControl fullWidth>
                        <InputLabel id="residence-label">Residence</InputLabel>
                        <Select
                            labelId='residence-label'
                            id="residence"
                            fullWidth
                            defaultValue={'Select Residence'}
                            value={values.residence}
                            label="Residence"
                            name='residence'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.residence && touched.residence}
                        >
                            {residenceList.map(({ name }) => {
                                return <MenuItem key={name} value={name}>{name}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                    {errors.residence && touched.residence && (
                        <Typography color='error'>
                            {errors.residence}
                        </Typography>
                    )}
                    <FormControl fullWidth>
                        <InputLabel id="event-label">Event</InputLabel>
                        <Select
                            labelId='event-label'
                            id="event"
                            fullWidth
                            defaultValue={'Select Event'}
                            value={values.event}
                            label="Event"
                            name='event'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.event && touched.event}
                        >
                            {eventsList.map(({ label }) => {
                                return <MenuItem key={label} value={label}>{label}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                    {errors.event && touched.event && (
                        <Typography color='error'>
                            {errors.event}
                        </Typography>
                    )}
                    <Typography variant='h5'>
                        Select Players
                    </Typography>
                    {values.players.map((value, index) => {
                        return <PlayerSelectInput key={`${index}${value._id}`} index={index} selectedPlayers={values.players} playersList={playersList} setPlayers={setPlayers} />
                    })}
                    {values.players.length < eventData?.players?.[1] && <Button variant='outlined' onClick={addPlayer} size='large' fullWidth>
                        Add Player
                    </Button>}
                    {errors.players && (
                        <Typography color='error'>
                            {errors.players}
                        </Typography>
                    )}

                    <Stack direction='row' gap={2}>
                        <Button type="submit" size='large' variant='contained'>
                            Create
                        </Button>
                        <Button size='large' variant='contained'>
                            Cancel
                        </Button>
                    </Stack>
                </Stack>
            </Grid>
        </Grid>
    )
}
