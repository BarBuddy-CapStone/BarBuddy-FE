import axios from '../axiosCustomize';

const getEventAllBar = async ({ pageIndex = 1, pageSize = 6, isStill }) => {
    const params = {
        pageIndex,
        pageSize,
        ...(isStill !== undefined && { isStill })
    };
    
    return await axios.get(`/api/Event`, { params });
}

const getEventByEventID = async (eventId) => {
    return await axios.get(`/api/Event/getOne/${eventId}`);
}

const getEventByBarId = async (barId) => {
    return await axios.get(`/api/Event/${barId}`);
}

const createEvent = async (eventRequest) => {
    return await axios.post('/api/Event/createEvent', eventRequest, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

const updateEvent = async (eventId, eventRequest) => {
    return await axios.patch(`/api/Event/updateEvent?eventId=${eventId}`, eventRequest, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

const getEventByEventId = async (eventId) => {
    return await axios.get(`/api/Event/getOne/${eventId}`);
}

export {
    getEventAllBar,
    getEventByEventID,
    getEventByBarId,
    createEvent,
    getEventByEventId,
    updateEvent
}
