import axios from 'axios';

const url:string = '';

export const getScripts = () => axios.get(url + '/api/script/mongo').then(response => response.data);

export const getScript = (id:string) => axios.get(url + '/api/script/mongo/' + id)
    .then(response => response.data);

export const sendStatistic = (id:string, statistic) => axios.post('/api/statistic/' + id, {statistic});

/*export const getChapters = () => axios.get(url + '/api/chapter/mongo').then(response => response.data);

export const getChapter = (id:string) => axios.get(url + '/api/chapter/mongo/' + id)
    .then(response => response.data);*/
