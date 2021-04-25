import axios from 'axios';

const url:string = '';

export const getScripts = () => axios.get(url + '/api/player/script/').then(response => response.data);

export const getScript = (id:string) => axios.get(url + '/api/player/script/' + id)
    .then(response => response.data);

export const sendStatistic = (id:string, statistic) => axios.post('/api/player/statistic/' + id, {statistic})
    .then(response => response.data);
