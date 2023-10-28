import { setIsOnGoing, setIsQuestionLoading, setQuestionId } from '@/features/session/sessionSlice';
import { SessionEvent } from './constants';

export const handleMatchEvents = (socket, dispatch) => {

};

export const handleSessionEvents = (socket, dispatch) => {
  socket.on(SessionEvent.ENDED, () => {
    console.log('Other user ended session');
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
