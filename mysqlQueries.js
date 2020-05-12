// ici, on se connecte à la base de données. Ainsi, on pourra utiliser
// db (l'équivalent de PDO) pour réaliser les requêtes mySQL.
const config = require('./config');
const db = require('./mysqlConnect');

// chaque requête correspond à une fonction qui renverra ce que l'on appelle
// une Promise (promesse). Une promesse est un objet qui contient une
// fonction (dont on sait qu'elle sera exécutée dans le futur). La promesse
// est renvoyée avant que la fonction ne soit exécutée (fonctionnement donc
// asynchrone). Quand la fonction a été exécutée, la callback appelle la
// fonction resolve qui indique à la promesse qu'elle peut renvoyer la
// réponse en question. Dans le fichier getCours1.js, les lignes 40 et 41
// (celles avec les await) récupèrent ces Promises. L'opérateur await attend
// alors que la promesse soit résolue (resolve) et récupère alors la
// réponse. Ainsi, même si tout ce fonctionnement est asynchrone, la variable
// idsPetitsCours de la ligne 40 du fichier getCours1.js récupérera le
// résultat de la requête mysql quand celui-ci aura été renvoyé par le
// serveur MySQL.

/* ------------------------------------------------------------------- */
/* --------------------------PARTIE COURS----------------------------- */
/* ------------------------------------------------------------------- */
//Récupérer les cours
function getCours(userId) {
    let query = `
        SELECT * FROM ${config.mysqlCourses} WHERE coursID IN (SELECT coursID FROM inscription WHERE userID = ?)`;

    const data = [userId];

    return new Promise((resolve, reject) => {
        db.query(query, data, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}
module.exports.getCours = getCours;

/* ------------------------------------------------------------------- */
/* --------------------------PARTIE TOPIC----------------------------- */
/* ------------------------------------------------------------------- */
//Récupérer les topics d'un cours
function getTopic(coursId) {
    let query = `
        SELECT * FROM ${config.mysqlTopics} WHERE coursID = ${coursId}`;
    const data = [coursId];

    return new Promise((resolve, reject) => {
        db.query(query, data, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}
module.exports.getTopic = getTopic;

//Récupérer le nom d'un cours
function getCourseName(coursId) {
    let query = `
        SELECT nom FROM ${config.mysqlCourses} WHERE coursID = ${coursId}`;

    const data = [coursId];

    return new Promise((resolve, reject) => {
        db.query(query, data, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}
module.exports.getCourseName = getCourseName;

/* ------------------------------------------------------------------- */
/* --------------------------PARTIE POST------------------------------ */
/* ------------------------------------------------------------------- */
//Récupérer le nom du cours depuis la page post
function getCourseNamePost(topicId) {
    let query = `
        SELECT nom FROM ${config.mysqlCourses} WHERE coursID IN (SELECT coursID FROM ${config.mysqlTopics} WHERE sujetID = ?)`;

    const data = [topicId];

    return new Promise((resolve, reject) => {
        db.query(query, data, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}
module.exports.getCourseNamePost = getCourseNamePost;

//Récupérer le nom du topic
function getTopicName(topicId) {
    let query = `
        SELECT nom FROM ${config.mysqlTopics} WHERE sujetID = ?`;

    const data = [topicId];

    return new Promise((resolve, reject) => {
        db.query(query, data, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}
module.exports.getTopicName = getTopicName;

//Récupérer l'id du cours
function getCourseID(topicId) {
    let query = `
        SELECT coursID FROM ${config.mysqlTopics} WHERE sujetID = ?`;

    const data = [topicId];

    return new Promise((resolve, reject) => {
        db.query(query, data, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}
module.exports.getCourseID = getCourseID;

//Récupérer les posts
function getPost(topicId) {
    let query = `
        SELECT * FROM ${config.mysqlPosts} WHERE sujetID = ? ORDER BY date`;

    const data = [topicId];

    return new Promise((resolve, reject) => {
        db.query(query, data, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}
module.exports.getPost = getPost;

/* ------------------------------------------------------------------- */
/* ------------------------PARTIE NEW TOPIC--------------------------- */
/* ------------------------------------------------------------------- */
function saveNewTopic(courseId, newTopic, userId) {
    let query = `
        INSERT INTO ${config.mysqlTopics} (sujetID, nom, coursID, utilisateur, nbPosts, last)
        VALUES (NULL, '${newTopic}', '${courseId}', '${userId}', '', CURRENT_TIMESTAMP);
        UPDATE ${config.mysqlCourses} SET nbSujets = nbSujets + 1, last = current_timestamp()
        WHERE cours.coursID = '${courseId}'`;

    return new Promise((resolve, reject) => {
        db.query(query, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}
module.exports.saveNewTopic = saveNewTopic;

/* ------------------------------------------------------------------- */
/* ------------------------PARTIE NEW POST---------------------------- */
/* ------------------------------------------------------------------- */
function saveNewPost(topicId, newPost, userId) {
    let query = `
        INSERT INTO ${config.mysqlPosts} (postID, date, message, sujetID, utilisateur)
        VALUES (NULL, CURRENT_TIMESTAMP, '${newPost}', '${topicId}', '${userId}');
        UPDATE ${config.mysqlTopics} SET nbPosts = nbPosts + 1, last = current_timestamp()
        WHERE sujet.sujetID = '${topicId}';
        UPDATE ${config.mysqlCourses} SET nbPosts = nbPosts + 1, last = current_timestamp()
        WHERE coursID = (SELECT coursID FROM ${config.mysqlTopics} WHERE sujet.sujetID = '${topicId}')`;

    return new Promise((resolve, reject) => {
        db.query(query, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}
module.exports.saveNewPost = saveNewPost;

/* ------------------------------------------------------------------- */
/* ---------------------PARTIE AUTHENTIFICATION----------------------- */
/* ------------------------------------------------------------------- */
function getUser(username, password) {
    console.log("Tentative de connexion : login=" + username + " pwd=" + password);
    let query = `
        SELECT * FROM ${config.mysqlUsers} 
        WHERE login = '${username}' AND password = '${password}'`;

    return new Promise((resolve, reject) => {
        db.query(query, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}
module.exports.getUser = getUser;