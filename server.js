const fetch = require("node-fetch");
const botConfig = require("./config/bot-config.json")
const roleConfig = require("./config/role-config.json")

const GetDiscordIDFromUser = (source) => {
    const discordIdentifier = GetPlayerIdentifierByType(source, "discord")
    const cleanDiscordID = discordIdentifier.replace(/^discord:\s*/, "");
    return cleanDiscordID
}

const getData = async (source) => {
    try {
        const cleanDiscordID = GetDiscordIDFromUser(source);
        const apiURL = `https://discord.com/api/v10/guilds/${botConfig.data.guildId}/members/${cleanDiscordID}`;
        const response = await fetch(apiURL, {
            method: "GET",
            headers: {
                Authorization: botConfig.data.TOKEN,
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            const result = await response.json();
            return result;
        } else {
            console.error('Failed to fetch data');
            return null;
        }
    } catch (error) {
        console.error('Error while fetching data', error);
        return null;
    }
};

const getRoles = async (source) => {
    const data = await getData(source);
    if (data && data.roles) {
        return data.roles;
    }
    return [];
};

const hasTheRole = async (source) => {
    // Get all roles from the source
    const allRoles = await getRoles(source);

    // Convert the roles object values to an array
    const rolesToCheck = Object.values(roleConfig.roles);

    // Check if any of the roles in rolesToCheck are in allRoles
    return rolesToCheck.some(role => allRoles.includes(role));
};


exports("hasTheRole", hasTheRole)
