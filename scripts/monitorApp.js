const ps = require('ps-node');
const fs = require('fs');
const path = require('path');

// Fonction pour écrire dans le fichier de log
function writeLog(message) {
    const scriptDirectory = path.dirname(__filename);
    const logDirectory = path.join(scriptDirectory, 'logs');
    const logPath = path.join(logDirectory, 'monitorApp_log.txt');

    // Créer le répertoire de logs s'il n'existe pas
    if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory);
    }

    const timestamp = new Date().toISOString();
    fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`);
}

// Arguments de la ligne de commande
const args = process.argv.slice(2);
const appName = args[0];
const startTime = new Date(args[1]);
const endTime = new Date(args[2]);

writeLog(`Starting monitoring for ${appName} from ${startTime} to ${endTime}`);

const interval = 500; // 500 ms pour une vérification plus fréquente

const monitorApp = () => {
    const currentTime = new Date();
    writeLog(`Current Time: ${currentTime}, Start Time: ${startTime}, End Time: ${endTime}`);

    if (currentTime >= startTime && currentTime < endTime) {
        writeLog(`Within monitoring window. Checking for processes...`);
        ps.lookup({ command: appName }, (err, resultList) => {
            if (err) {
                writeLog(`Error: ${err.message}`);
                return;
            }

            if (resultList.length === 0) {
                writeLog(`No processes found for ${appName}`);
            } else {
                resultList.forEach((process) => {
                    if (process) {
                        writeLog(`Attempting to kill process: PID=${process.pid}, COMMAND=${process.command}, ARGUMENTS=${process.arguments}`);
                        ps.kill(process.pid, (err) => {
                            if (err) {
                                writeLog(`Error killing process: ${err.message}`);
                            } else {
                                writeLog(`Process ${process.pid} has been killed!`);
                            }
                        });
                    }
                });
            }
        });
    } else {
        writeLog('Outside monitoring window. Exiting script.');
        clearInterval(monitorInterval);
        process.exit(0); // Terminer le script après la fenêtre de surveillance
    }
};

// Ajouter un délai initial pour s'assurer que le premier appel se produit après l'heure de début
const initialDelay = startTime - new Date();
if (initialDelay > 0) {
    setTimeout(() => {
        writeLog('Initial delay elapsed, starting monitoring.');
        monitorApp(); // Exécuter une première fois immédiatement
        const monitorInterval = setInterval(monitorApp, interval); // Boucle de vérification continue
    }, initialDelay);
} else {
    writeLog('Initial delay not needed, starting monitoring immediately.');
    monitorApp(); // Exécuter une première fois immédiatement
    const monitorInterval = setInterval(monitorApp, interval); // Boucle de vérification continue
}
