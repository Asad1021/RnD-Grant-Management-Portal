const { queryDatabase } = require("../database");
function convertDateToSerialNumber(dateString) {
    const millisecondsInADay = 24 * 60 * 60 * 1000;
    const date = new Date(dateString);
    const jan1st1900 = new Date('1900-01-01');
    const daysSinceJan1st1900 = Math.floor((date - jan1st1900) / millisecondsInADay);
    const serialNumber = daysSinceJan1st1900 + 25569;
    return serialNumber;
}

async function GetAllProjects(){
    const query = `SELECT * FROM projects`;
    const projects =  await queryDatabase(query);

    for (let i = 0; i < projects.length; i++) {
        let id = projects[i].project_id;

        const mapping = {
            "Field Testing/Demo/Tranings(Recurring)": "testing_sanc",
            "Overheads(Recurring)": "overhead_sanc",
            "Unforseen Expenses(Recurring)": "unforseen_sanc",
            "Equipments(Non-Recurring)": "equip_sanc",
            "Construction(Non-Recurring)": "const_sanc",
            "Fabrication(Recurring)": "fab_sanc",
            "Non-Rec.": "nonrec_sanctioned_amount",
            "Rec.": "rec_sanctioned_amount",
            "Manpower(Recurring)": "man_sanc",
            "Travel(Recurring)": "travel_sanc",
            "Consumables(Recurring)": "cons_sanc"
        };

        const query = `SELECT * FROM summary_table WHERE project_id = $1`;
        const params = [id];
        const summary = await queryDatabase(query, params);

        for(let j=0; j<summary.length; j++){
            if(summary[j].heads in mapping)
            projects[i][mapping[summary[j].heads]] = summary[j].sanctioned_amount;
        }

        //select the professor name from the user_project table
        const query1 = `SELECT * FROM user_project WHERE project_id = $1`;
        const params1 = [id];
        const user_project = await queryDatabase(query1, params1);
        projects[i]["professors"] = user_project[0].email_id;

        projects[i].dos = convertDateToSerialNumber(projects[i].dos);
        projects[i].doc = convertDateToSerialNumber(projects[i].doc);
        projects[i].sanctioned_date = convertDateToSerialNumber(projects[i].sanctioned_date);
        

        projects[i]["grant"] = projects[i].project_grant;
        delete projects[i].project_grant;
        delete projects[i].is_appr;
        delete projects[i].is_running;
        delete projects[i].comment_time;
        delete projects[i].comm_flag;
    }

    console.log(projects);
    return projects;
}

module.exports = {
    GetAllProjects
}