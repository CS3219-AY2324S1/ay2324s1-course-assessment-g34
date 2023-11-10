import { setIsOnGoing, setIsQuestionLoading, setQuestionId } from '@/features/session/sessionSlice';
import { SessionEvent, VideoEvent } from './constants';

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

export const handleVideoEvents = (socket, dispatchers) => {
  const { setIsPeerMicOn, setIsPeerVideoOn } = dispatchers;

  socket.on(VideoEvent.TOGGLE_MIC, (data) => {
    const { isMicOn } = data;
    setIsPeerMicOn(isMicOn);
  });

  socket.on(VideoEvent.TOGGLE_CAM, (data) => {
    const { isVideoOn } = data;
    setIsPeerVideoOn(isVideoOn);
  });
};
