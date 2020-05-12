const queries = require('./mysqlQueries');

const { sendError, sendMessage } = require("./message");

const auth = require('./auth');

async function getTopics(req, res) {
    const session = auth.getSession(req);
    const userId = auth.getUserId(session);
    if (userId == -1)
        return sendError(res, 'not authenticated');

    auth.setSessionCookie(req, res, session);

    if (typeof req.body.coursId === 'undefined')
        return sendError(res, 'Vous n\'avez envoyé la donnée coursId');
    const coursId = req.body.coursId;

    const Topics = await queries.getTopic(coursId);
    const CourseName = await queries.getCourseName(coursId);
    const result = CourseName;
    Topics.forEach(element => {
        result.push(element)
    });

    sendMessage(res, result);
}

module.exports = getTopics;