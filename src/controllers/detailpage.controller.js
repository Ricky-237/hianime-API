import axios from 'axios';
import config from '../config/config';
import { extractEpisodes } from '../extractor/extractEpisodes';
import { extractDetailpage } from '../extractor/extractDetailpage';
import { axiosInstance } from '../services/axiosInstance';
import { validationError } from '../utils/errors';

const detailpageController = async (c) => {
  const id = c.req.param('id');
  const result = await axiosInstance(`/${id}`);
  if (!result.success) {
    throw new validationError(result.message, 'maybe id is incorrect : ' + id);
  }
  
const episodesController = async () => {
  if (!id) throw new validationError('id is required');

  const Referer = `/watch/${id}`;
  const idNum = id.split('-').at(-1);
  const ajaxUrl = `/ajax/v2/episode/list/${idNum}`;

  try {
    const { data } = await axios.get(config.baseurl + ajaxUrl, {
      headers: {
        Referer: Referer,
        ...config.headers,
      },
    });

    const response = extractEpisodes(data.html);
    return response;
  } catch (err) {
    console.log(err.message);

    throw new validationError('make sure the id is correct', { validIdEX: 'one-piece-100' });
  }
};

  const _response = extractDetailpage(result.data);
  const response = { 
    info: _response,
    episodes: episodesController
  };
  return response;
};

export default detailpageController;
