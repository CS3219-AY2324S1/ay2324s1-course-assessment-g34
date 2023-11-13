import axios from 'axios';

const submission_service_port = 5433;
export default function addSubmission(question_id, username1, username2, lang, code) {
    const queryJson = {
        question_id: question_id,
        username1: username1,
        username2: username2,
        lang: lang,
        code: code
    };
    axios.post(`http://localhost:${submission_service_port}/submission`, queryJson)
        .catch((error) => {
            console.log(error);
        });
}