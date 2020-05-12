const queries = require('./mysqlQueries');

const { sendError, sendMessage } = require("./message");

const auth = require('./auth');

async function saveNewTopic(req, res) {
    const session = auth.getSession(req);
    const userId = auth.getUserId(session);
    if (userId == -1)
        return sendError(res, 'not authenticated');

    auth.setSessionCookie(req, res, session);

    if (typeof req.body.courseId === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé la donnée courseId');
    if (typeof req.body.newTopic === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé la donnée newTopic');

    const courseId = req.body.courseId;
    const newTopic = req.body.newTopic;

    const result = await queries.saveNewTopic(courseId, newTopic, userId);

    sendMessage(res, result);
}

module.exports = saveNewTopic;