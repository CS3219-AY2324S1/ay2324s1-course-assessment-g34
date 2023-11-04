const axios = require('axios'); 

const submission_service_port = 5433;
const addSubmission = (question_id, runtime, username, outcome, lang, code) => {
    const queryJson = {
        question_id: question_id,
        runtime: runtime,
        username: username,
        outcome: outcome,
        lang: lang,
        code: code
    };
    axios.post(`http://localhost:${submission_service_port}/submission`, queryJson)
    .catch((error)=>{
        console.log(error);
    });
}

console.log("Add submissions");
addSubmission(3,5,"Meggy_Spletzer","WA","R","I am Groot");
addSubmission(7,10,"Meggy_Spletzer","Correct","C","Woomy");