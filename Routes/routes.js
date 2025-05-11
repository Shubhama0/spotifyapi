import express from 'express';
import {
  login,
  callback,
  getTopTracks,
  getNowPlaying,
  getFollowedArtists,
  playTrack,
  pausePlayback,
  baseRoute
} from '../controller/controller.js';

const router = express.Router();

router.get('/login', login);
router.get('/callback', callback);
router.get('/top-tracks', getTopTracks);
router.get('/now-playing', getNowPlaying);
router.get('/followed-artists', getFollowedArtists);
router.put('/play/:trackId', playTrack);
router.put('/pause', pausePlayback);
router.get('/', baseRoute);

export default router;
