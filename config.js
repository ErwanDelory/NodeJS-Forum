const config = {
    // paramètres de connexion à la base de données
    mysqlHost: '127.0.0.1',
    mysqlPort: '3308',
    mysqlDatabase: 'forum',
    charset: 'utf8',
    mysqlLogin: 'root',
    mysqlPassword: '',

    // les noms des tables
    mysqlCourses: 'cours',
    mysqlTopics: 'sujet',
    mysqlPosts: 'post',
    mysqlInscriptions: 'inscription',
    mysqlUsers: 'utilisateur'
};

// on exporte la config. En l'exportant comme ci-dessous, on pourra utiliser la
// syntaxe suivante pour la charger dans d'autres fichiers :
// const config = require ('./config');
module.exports = config;