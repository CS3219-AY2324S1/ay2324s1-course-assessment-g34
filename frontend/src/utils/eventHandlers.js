import { setIsOnGoing, setIsQuestionLoading, setQuestionId } from '@/features/session/sessionSlice';
import { SessionEvent, VideoEvent } from './constants';
import { setIsRequestingCall, setHasCallRequest } from '@/features/video/videoSlice';

export const handleMatchEvents = (socket, dispatch) => {

};

export const handleSessionEvents = (socket, dispatch) => {
  socket.on(SessionEvent.ENDED, () => {
    dispatch(setIsOnGoing(false));
  });

  socket.on(SessionEvent.FETCH_QUESTION, () => {
    dispatch(setIsQuestionLoading(true));
  });

  socket.on(SessionEvent.QUESTION_FETCHED, (data) => {
    dispatch(setQuestionId(data.questionId));
    dispatch(setIsQuestionLoading(false));
  });

  socket.on(SessionEvent.ERROR, (data) => {
    console.error(data.error);
  });
};

export const handleVideoEvents = (socket, dispatch) => {
  socket.on(VideoEvent.REQUEST, (data) => {
    console.log(`${socket.id}: Received call request from ${data.userId}`)
    dispatch(setHasCallRequest(true));
  });

  socket.on(VideoEvent.DECLINE, () => {
    dispatch(setIsRequestingCall(false));
  });

  socket.on(VideoEvent.CANCEL, () => {
    dispatch(setHasCallRequest(false));
  });
};
