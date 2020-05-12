const queries = require('./mysqlQueries');

const { sendError, sendMessage } = require("./message");

const auth = require('./auth');

async function getCourses(req, res) {
    const session = auth.getSession(req);
    const userId = auth.getUserId(session);
    if (userId == -1)
        return sendError(res, 'not authenticated');

    auth.setSessionCookie(req, res, session);

    const cours = await queries.getCours(userId);

    sendMessage(res, cours);
}

module.exports = getCourses;