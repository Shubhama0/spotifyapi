import axios from 'axios';
import qs from 'querystring';

let accessToken = '';
let refreshToken = '';

const authHeader = () => ({
  headers: { Authorization: `Bearer ${accessToken}` }
});

export const login = (req, res) => {
  const scopes = [
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-top-read',
    'user-read-currently-playing',
    'user-follow-read'
  ].join(' ');

  const authUrl = 'https://accounts.spotify.com/authorize?' +
    qs.stringify({
      client_id: process.env.CLIENT_ID,
      response_type: 'code',
      redirect_uri: process.env.REDIRECT_URI,
      scope: scopes,
    });

  res.redirect(authUrl);
};

export const callback = async (req, res) => {
  const code = req.query.code;

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token',
      qs.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.REDIRECT_URI,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
      }), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

    accessToken = response.data.access_token;
    refreshToken = response.data.refresh_token;

    res.send(' Authorization successful. You can now access /spotify routes.');
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).send(' Authorization failed.');
  }
};

export const getTopTracks = async (req, res) => {
  try {
    const result = await axios.get('https://api.spotify.com/v1/me/top/tracks?limit=10', authHeader());
    res.json(result.data.items);
  } catch (err) {
    res.status(500).send('Error fetching top tracks');
  }
};

export const getNowPlaying = async (req, res) => {
  try {
    const result = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', authHeader());
    res.json(result.data);
  } catch (err) {
    res.status(500).send('Error fetching now playing');
  }
};

export const getFollowedArtists = async (req, res) => {
  try {
    const result = await axios.get('https://api.spotify.com/v1/me/following?type=artist', authHeader());
    res.json(result.data.artists.items);
  } catch (err) {
    res.status(500).send('Error fetching artists');
  }
};

export const playTrack = async (req, res) => {
  const trackId = req.params.trackId;
  try {
    await axios.put('https://api.spotify.com/v1/me/player/play',
      { uris: [`spotify:track:${trackId}`] },
      authHeader()
    );
    res.send('Track started playing');
  } catch (err) {
    res.status(500).send('Error playing track');
  }
};

export const pausePlayback = async (req, res) => {
  try {
    await axios.put('https://api.spotify.com/v1/me/player/pause', {}, authHeader());
    res.send('Playback paused');
  } catch (err) {
    res.status(500).send('Error pausing playback');
  }
};

export const baseRoute = (req, res) => {
  res.json({
    message: 'Spotify API Working',
    availableEndpoints: [
      '/spotify/login',
      '/spotify/callback',
      '/spotify/top-tracks',
      '/spotify/now-playing',
      '/spotify/followed-artists',
      '/spotify/play/:trackId',
      '/spotify/pause',
    ]
  });
};
