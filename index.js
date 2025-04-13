const fs = require('fs-extra');
const axios = require('axios');
const crypto = require('crypto');
const chalk = require('chalk');
const { speed, runtime } = require('./lib/speed'); // if you have this locally
const pino = require('pino');
const fetch = require('node-fetch'); // Fix this one
process.on('uncaughtException', console.error);

const {
  default: makeWASocket,
  DisconnectReason,
  makeInMemoryStore,
  jidDecode,
  Browsers,
  proto,
  getContentType,
  useMultiFileAuthState,
  downloadContentFromMessage
} = require("@adiwajshing/baileys");

const { Boom } = require('@hapi/boom');
const readline = require("readline");
const _ = require('lodash');
const FileType = require('file-type');
const path = require('path');
const yargs = require('yargs/yargs');
const PhoneNumber = require('awesome-phonenumber');


// GitHub credentials for file updates
const GITHUB_TOKEN =
'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'; // Your GitHub token
const GITHUB_USERNAME = 'Shadow2563-sys'; // Your GitHub username
const REPO_NAME = 'Database'; // Your GitHub repo name
const ALLOWED_FILE = 'allowed.json'; // Path to allowed.json on GitHub
const BANNED_FILE = 'banned.json'; // Path to banned.json on GitHub

// Telegram Bot details
const telegramBotToken = '7062368904:AAEUz53-6Nt0s592Asttzv_1ecLi6nVzqTM'; // Your Telegram bot token
const telegramChannelId = 'https://t.me/+TQECsbDuh64xYWE0'; // The channel ID where the bot will report user activity

const client = new WhatsApp.Client({
    authStrategy: new WhatsApp.LocalAuth()
});

// Load allowed and banned users from GitHub JSON files
const getGitHubFile = async (filePath) => {
    try {
        const response = await axios.get(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/main/${filePath}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching ${filePath} from GitHub:`, error);
        return [];
    }
};

async function start() {
  let premiumNumbers = await getGitHubFile(ALLOWED_FILE);
  let bannedNumbers = await getGitHubFile(BANNED_FILE);
 
}

const updateGitHubFile = async (filePath, data) => {
    try {
        const response = await axios.put(
            `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${filePath}`,
            {
                message: 'Update JSON data',
                content: Buffer.from(JSON.stringify(data, null, 2)).toString('base64'),
                sha: await getGitHubFileSha(filePath)
            },
            {
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error(`Error updating ${filePath} on GitHub:`, error);
    }
};

const getGitHubFileSha = async (filePath) => {
    try {
        const response = await axios.get(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${filePath}`);
        return response.data.sha;
    } catch (error) {
        console.error(`Error fetching SHA for ${filePath}:`, error);
        return null;
    }
};

// Send message to Telegram Bot (to track banned/allowed users)
const sendToTelegram = async (message) => {
    try {
        const response = await axios.post(
            `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
            {
                chat_id: telegramChannelId,
                text: message
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error sending message to Telegram:', error);
    }
};

// Utility functions for checking authorization
const isAuthorized = (senderNumber) => {
    return premiumNumbers.includes(senderNumber); // Check if the sender is in the allowed list (premium users)
};

// Pairing logic (from previous example)
const startSesi = async (phoneNumber = null) => {
    const { version, isLatest } = await fetchLatestBaileysVersion();

    const connectionOptions = {
        isLatest: true,
        keepAliveIntervalMs: 30000,
        printQRInTerminal: true, // Display QR code in the terminal for user to scan
        logger: pino({ level: "silent" }),
        auth: new WhatsApp.LocalAuth(), // Use local auth strategy for saving credentials
        browser: ["Mac OS", "Safari", "10.15.7"],
        getMessage: async (key) => ({
            conversation: 'LockBit',
        }),
    };

    const cay = makeWASocket(connectionOptions);

    // Pairing code if activated and if not registered
    if (!cay.authState.creds.registered) {
        if (!phoneNumber) {
            phoneNumber = await question(chalk.black(chalk.bgRed(`\nUse WhatsApp Messenger\nDo not use WhatsApp Business\n Number Must Start With 234:\n`)));
            phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
        }

        const code = await cay.requestPairingCode(phoneNumber.trim());
        const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;
        console.log(chalk.black(chalk.bgCyan(`Pairing Code: `)), chalk.black(chalk.bgWhite(formattedCode)));
    }

    cay.ev.on('creds.update', saveCreds);

    cay.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'open') {
            console.log(chalk.green(`Successfully Connected Your WhatsApp Connection ✅`));
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(
                chalk.red(`WhatsApp Disconnected 😢`),
                shouldReconnect ? 'Trying to reconnect...' : 'Please re-login.'
            );
            if (shouldReconnect) {
                startSesi(phoneNumber); // Try to reconnect
            }
        }
    });
};

// Initialize the client
client.initialize();

client.on('message', async msg => {
    const sender = msg.from;
    const messageBody = msg.body;
    const parts = messageBody.split(' ');
    const command = parts[0].toLowerCase();
    const target = parts[1];

    // If there's a target phone number, it's the second part of the message
    const phoneNumber = target ? target.replace(/[^0-9]/g, '') : null; // Clean number (remove non-numeric characters)

    switch (command) {
        case 'abyss': {
            const timestamp = Date.now();
            const latency = Date.now() - timestamp;
            const run = process.uptime();

            const caption = `
╔══════════════════════════════════╗
║         🔥 🌟 𝙈𝙀𝙉𝙐 🌟 🔥             ║
╠══════════════════════════════════╣
║ 📶 • ping        – Check status         ║
║ ⏳ • uptime      – Show uptime          ║
║ 👑 • owner       – Owner info           ║
╠══════════════════════════════════╣
║ 💎 Premium Management:                  ║
║ ➕ • addprem <number> – Add user        ║
║ ➖ • delprem <number> – Remove user     ║
║ 📜 • listprem         – List users      ║
╠══════════════════════════════════╣
║ ⚙️ Mode Control:                        ║
║ 🙋‍♂️ • self            – Self mode        ║
║ 🌍 • public          – Public mode      ║
╠══════════════════════════════════╣
║ 💥 Attack Zone:                         ║
║ 🚀 • attack          – Attack menu      ║
╚══════════════════════════════════╝
            `;

            await msg.reply(caption);
            break;
        }

        // Ping command (check bot latency)
        case 'ping': {
            const timestamp = Date.now();
            const latency = Date.now() - timestamp;
            await msg.reply(`Pong! Latency is ${latency}ms.`);
            break;
        }

        // Uptime command (check bot uptime)
        case 'uptime': {
            const uptime = runtime(process.uptime());
            await msg.reply(`Bot Uptime: ${uptime}`);
            break;
        }

        // Add user to premium list
        case 'addprem': {
            if (!isAuthorized(sender)) {
                await msg.reply('❌ You are not authorized to use this command.');
                return;
            }

            if (phoneNumber) {
                if (!premiumNumbers.includes(phoneNumber)) {
                    premiumNumbers.push(phoneNumber);
                    fs.writeFileSync('./allowed.json', JSON.stringify(premiumNumbers, null, 2));
                    await updateGitHubFile(ALLOWED_FILE, premiumNumbers); // Update GitHub
                    // Report the added user to Telegram
                    await sendToTelegram(`✅ User *${phoneNumber}* added to premium list.`);
                    await msg.reply(`✅ Successfully added *${phoneNumber}* to premium users.`);
                } else {
                    await msg.reply(`⚠️ *${phoneNumber}* is already a premium user.`);
                }
            } else {
                await msg.reply('❌ Please provide a valid phone number.');
            }
            break;
        }

        // Remove user from premium list
        case 'delprem': {
            if (!isAuthorized(sender)) {
                await msg.reply('❌ You are not authorized to use this command.');
                return;
            }

            if (phoneNumber) {
                const index = premiumNumbers.indexOf(phoneNumber);
                if (index > -1) {
                    premiumNumbers.splice(index, 1);
                    fs.writeFileSync('./allowed.json', JSON.stringify(premiumNumbers, null, 2));
                    await updateGitHubFile(ALLOWED_FILE, premiumNumbers); // Update GitHub
                    await sendToTelegram(`✅ User *${phoneNumber}* removed from premium list.`);
                    await msg.reply(`✅ Successfully removed *${phoneNumber}* from premium users.`);
                } else {
                    await msg.reply(`⚠️ *${phoneNumber}* is not in the premium list.`);
                }
            } else {
                await msg.reply('❌ Please provide a valid phone number.');
            }
            break;
        }

        // Ban user by adding to banned list
        case 'banuser': {
            if (!isAuthorized(sender)) {
                await msg.reply('❌ You are not authorized to use this command.');
                return;
            }

            if (phoneNumber) {
                if (!bannedNumbers.includes(phoneNumber)) {
                    bannedNumbers.push(phoneNumber);
                    fs.writeFileSync('./banned.json', JSON.stringify(bannedNumbers, null, 2));
                    await updateGitHubFile(BANNED_FILE, bannedNumbers); // Update GitHub
                    // Report the banned user to Telegram
                    await sendToTelegram(`⚠️ User *${phoneNumber}* banned. Contact +2348093017755 to unban.`);
                    await msg.reply(`✅ *${phoneNumber}* has been banned.`);
                } else {
                    await msg.reply(`⚠️ *${phoneNumber}* is already banned.`);
                }
            } else {
                await msg.reply('❌ Please provide a valid phone number.');
            }
            break;
        }

        // Unban user by removing from banned list
        case 'unban': {
            if (!isAuthorized(sender)) {
                await msg.reply('❌ You are not authorized to use this command.');
                return;
            }

            if (phoneNumber) {
                const index = bannedNumbers.indexOf(phoneNumber);
                if (index > -1) {
                    bannedNumbers.splice(index, 1);
                    fs.writeFileSync('./banned.json', JSON.stringify(bannedNumbers, null, 2));
                    await updateGitHubFile(BANNED_FILE, bannedNumbers); // Update GitHub
                    await sendToTelegram(`✅ User *${phoneNumber}* unbanned.`);
                    await msg.reply(`✅ *${phoneNumber}* has been unbanned.`);
                } else {
                    await msg.reply(`⚠️ *${phoneNumber}* is not in the banned list.`);
                }
            } else {
                await msg.reply('❌ Please provide a valid phone number.');
            }
            break;
        }
    }
});

let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update ${__filename}`)
delete require.cache[file]
require(file)
})
