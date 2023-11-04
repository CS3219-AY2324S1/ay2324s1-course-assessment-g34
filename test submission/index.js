const axios = require('axios');

const submission_service_port = 5433;
const addSubmission = (question_id, username1, username2, lang, code) => {
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

console.log("Add submissions");
addSubmission(3, "Ben_Leong", "Meggy_Spletzer", "R", "print(\"I am Groot\")");
addSubmission(7, "Meggy_Spletzer", "Technoblade", "C", "printf(\"Woomy\");");