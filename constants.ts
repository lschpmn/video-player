
export const DEFAULT_MEDIA_RECEIVER_ID = 'CC1AD845';
export const MEDIA_NAMESPACE = 'urn:x-cast:com.google.cast.media';
export const PORT = 3001;

//server actions

//files
export const GET_DRIVES = 'GET_DRIVES';
export const GET_DRIVES_SERVER = 'GET_DRIVES@server';
export const GET_FILES = 'GET_FILES';
export const GET_FILES_SERVER = 'GET_FILES@server';
export const INSPECT_FILE = 'INSPECT_FILE';
export const INSPECT_FILE_SERVER = 'INSPECT_FILE@server';

//player
export const CHANGE_VOLUME = 'CHANGE_VOLUME@server';
export const CONNECTION = 'CONNECTION';
export const CONNECT = 'CONNECT@server';
export const GET_CHROMECASTS = 'GET_CHROMECASTS@server';
export const GET_STATUS = 'GET_STATUS@server';
export const SET_MEDIA_STATUS = 'SET_MEDIA_STATUS';
export const SET_MEDIA_DISCONNECT = 'SET_MEDIA_DISCONNECT';
export const SET_STATUS = 'SET_STAUTS';
export const LAUNCH  = 'LAUNCH@server';
export const PAUSE = 'PAUSED@server';
export const PLAY = 'PLAYING@server';
export const SEEK = 'SEEK@server';
export const SET_CHROMECASTS = 'SET_CHROMECASTS';
