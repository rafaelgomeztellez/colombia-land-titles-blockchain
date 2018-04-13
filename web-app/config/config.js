module.exports = {
    server: {
        port: process.env.PORT || 8888
    },

    db: {
        connectString :  process.env.DBAAS_DEFAULT_CONNECT_DESCRIPTOR || "DATABASEVM/orcl12c",
        user : process.env.DBAAS_USER_NAME || "C##MOVIES_USER",
        password :process.env.DBAAS_USER_PASSWORD || "oracle"
    }
};