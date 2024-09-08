// professor.js
const { queryDatabase } = require('../../database');

async function addProfessor(professorData) {
    console.log("professorData : ");
    console.log(professorData);
    const sqlQuery = 'INSERT INTO prof (email_id, name, department) VALUES ($1, $2, $3)';
    const params = [professorData.email_id, professorData.name, professorData.department];
    await queryDatabase(sqlQuery, params);
}

async function deleteProfessor(email_id) {
    const sqlQuery = 'DELETE FROM prof WHERE email_id = $1';
    const params = [email_id];
    await queryDatabase(sqlQuery, params);
}

async function searchProfessor(email_id) {
    const sqlQuery = 'SELECT * FROM prof WHERE email_id = $1';
    const params = [email_id];
    const result = await queryDatabase(sqlQuery, params);

    // // Construct the complete query string with parameter values
    // const completeQuery = sqlQuery.replace(/\$[0-9]+/g, (match) => {
    //     const paramIndex = parseInt(match.slice(1)) - 1;
    //     return `'${params[paramIndex]}'`;
    // });
    return result;
}


// Similarly implement editProfessor and searchProfessors

module.exports = {
    addProfessor,
    deleteProfessor,
    // editProfessor,
    searchProfessor
};
