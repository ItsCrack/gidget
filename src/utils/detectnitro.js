import fetch from "node-fetch";
import OAuth2 from "../database/models/OAuth2Credentials.js";
import DiscordUser from "../database/models/DiscordUser.js";
import CryptoJS from "crypto-js";

const cache = new Map();

export default async function (user) {
    const saved = cache.get(user.id);
    if (saved) return saved;
    const data = await OAuth2.findOne({ discordId: user.id });
    if (!data) {
        const thing = { type: null, value: -1 };
        cache.set(user.id, thing);
        setTimeout((id) => {
            cache.delete(id)
        }, 60000, user.id);
        return thing;
    } else {
        const token = CryptoJS.AES.decrypt(data.accessToken, process.env.VERYS);
        const dectoken = token.toString(CryptoJS.enc.Utf8);
        const res = await fetch(`https://discord.com/api/v6/users/@me`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${dectoken}`
            }
        });
        if (res.ok) {
            const json = await res.json();
            const thing = { type: "oauth2", value: json.premium_type || 0 };
            cache.set(user.id, thing);
            setTimeout((id) => {
                cache.delete(id)
            }, 60000, user.id);
            return thing;
        } else {
            const otherthing = await DiscordUser.findOne({ discordId: user.id });
            if (otherthing && otherthing.premium_type) {
                const thing = { type: "db", value: otherthing.premium_type || 0 };
                cache.set(user.id, thing);
                setTimeout((id) => {
                    cache.delete(id)
                }, 60000, user.id);
                return thing;
            } else {
                const thing = { type: null, value: -1 };
                cache.set(user.id, thing)
                setTimeout((id) => {
                    cache.delete(id)
                }, 60000, user.id);
                return thing;
            }
        }
    }
}