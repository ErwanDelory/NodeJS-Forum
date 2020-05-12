const queries = require('./mysqlQueries');

const { sendError, sendMessage } = require("./message");

const auth = require('./auth');

async function saveNewPost(req, res) {
    const session = auth.getSession(req);
    const userId = auth.getUserId(session);
    if (userId == -1)
        return sendError(res, 'not authenticated');

    auth.setSessionCookie(req, res, session);

    if (typeof req.body.topicId === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé la donnée topicId');
    if (typeof req.body.newPost === 'undefined')
        return sendError(res, 'Vous n\'avez pas envoyé la donnée newPost');

    const topicId = req.body.topicId;
    const newPost = req.body.newPost;

    const result = await queries.saveNewPost(topicId, newPost, userId);

    sendMessage(res, result);
}

module.exports = saveNewPost;