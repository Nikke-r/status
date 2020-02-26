const fs = require('fs');
const path = require('path');
const projectFolder = path.normalize(__dirname+'/..');

const sendPackages = (req, res) => {
    const packageList = fs.readFileSync(projectFolder + '/status.txt', 'utf-8');
    res.json({packages: packageList});
};

module.exports = {
    sendPackages
};