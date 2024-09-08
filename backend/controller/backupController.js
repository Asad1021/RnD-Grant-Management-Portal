const backupServices = require("../models/backupModel");
const fs = require('fs');
const XLSX = require('xlsx');

async function GetProjectBackup(req, res) {
    try {
        const result = await backupServices.GetAllProjects();
        
        // Convert JSON to worksheet
        const ws = XLSX.utils.json_to_sheet(result);

        // Create a workbook and add the worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        // Write workbook to a buffer
        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        // Set response headers
        res.setHeader('Content-Disposition', 'attachment; filename=projects.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Length', buffer.length);

        // Send the buffer as response
        res.status(200).end(buffer, 'binary');
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports = { GetProjectBackup };