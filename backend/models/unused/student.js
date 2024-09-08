// student.js
const { queryDatabase } = require('../../database');

async function addStudent(studentData) {
    const sqlQuery = 'INSERT INTO student (email_id, name, department) VALUES ($1, $2, $3)';
    const params = [studentData.email_id, studentData.name, studentData.department];
    await queryDatabase(sqlQuery, params);
}

async function deleteStudent(email_id) {
    const sqlQuery = 'DELETE FROM student WHERE email_id = $1';
    const params = [email_id];
    await queryDatabase(sqlQuery, params);
}

async function searchStudent(email_id) {
    const sqlQuery = 'SELECT * FROM student WHERE email_id = $1';
    const params = [email_id];
    const result = await queryDatabase(sqlQuery, params);

    // Construct the complete query string with parameter values
    const completeQuery = sqlQuery.replace(/\$[0-9]+/g, (match) => {
        const paramIndex = parseInt(match.slice(1)) - 1;
        return `'${params[paramIndex]}'`;
    });
    // console.log(result)
    return result;
}

// Similarly implement editStudent and searchStudents

module.exports = {
    addStudent,
    deleteStudent,
    searchStudent
    // editStudent,
};
