const { response } = require('express');
const Event = require('../models/EventModel');

const getEvents = async (req, res = response) => {
    try {
        const events = await Event.find().populate('user', 'name');

        res.json({
            ok: true,
            events,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Internal database error. Please contact an administrator',
        });
    }
};

const createEvent = async (req, res = response) => {
    try {
        const event = new Event(req.body);
        event.user = req.uid;
        const savedEvent = await event.save();
        res.status(201).json({
            ok: true,
            event: savedEvent,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Internal database error. Please contact an administrator',
        });
    }
};

const updateEvent = async (req, res = response) => {
    try {
        const eventId = req.params.id;
        const uid = req.uid;
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'Event not found',
            });
        }
        if (event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'Unauthorized user',
            });
        }

        const newEvent = {
            ...req.body,
            user: uid,
        };
        const updatedEvent = await Event.findByIdAndUpdate(eventId, newEvent, {
            new: true,
        });
        res.json({
            ok: true,
            event: updatedEvent,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Internal database error. Please contact an administrator',
        });
    }
};

const deleteEvent = async (req, res = response) => {
    try {
        const eventId = req.params.id;
        const uid = req.uid;
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'Event not found',
            });
        }
        if (event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'Unauthorized user',
            });
        }
    
        await Event.findByIdAndDelete(eventId);
        res.json({
            ok: true,
            msg: 'Event deleted',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Internal database error. Please contact an administrator',
        });
    }
};

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
};
