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
  
const Referer = `/watch/${id}`;
  const idNum = id.split('-').at(-1);
  const ajaxUrl = `/ajax/v2/episode/list/${idNum}`;

  const { data } = await axios.get(config.baseurl + ajaxUrl, {
    headers: {
      Referer: Referer,
      ...config.headers,
    },
  });

  const episodes = extractEpisodes(data.html);
  
  const _response = extractDetailpage(result.data);
  const response = { 
    info: _response,
    episodes: episodes
  };
  return response;
};

export default detailpageController;
