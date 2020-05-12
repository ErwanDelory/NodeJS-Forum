const queries = require('./mysqlQueries');

const { sendError, sendMessage } = require("./message");

const auth = require('./auth');

async function getPosts(req, res) {
    const session = auth.getSession(req);
    const userId = auth.getUserId(session);
    if (userId == -1)
        return sendError(res, 'not authenticated');

    auth.setSessionCookie(req, res, session);

    if (typeof req.body.topicId === 'undefined')
        return sendError(res, 'Vous n\'avez envoyé la donnée topicId');
    const topicId = req.body.topicId;
    console.log(topicId);
    const Posts = await queries.getPost(topicId);
    console.log(Posts);
    const CourseName = await queries.getCourseNamePost(topicId);
    const TopicName = await queries.getTopicName(topicId);

    const result = CourseName;
    TopicName.forEach(element => {
        result.push(element)
    });
    result.push(topicId);
    Posts.forEach(element => {
        result.push(element)
    });

    sendMessage(res, result);
    console.log(result);
}

module.exports = getPosts;