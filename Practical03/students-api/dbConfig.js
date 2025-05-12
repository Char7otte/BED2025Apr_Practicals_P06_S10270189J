module.exports = {
    user: "studentsapi_user", // Replace with your SQL Server login username
    password: "12345", // Replace with your SQL Server login password
    server: "DESKTOP-4RFAEEN/SQLEXPRESS",
    database: "students_db",
    trustServerCertificate: true,
    options: {
        port: 1433, // Default SQL Server port
        connectionTimeout: 60000, // Connection timeout in milliseconds
    },
};
