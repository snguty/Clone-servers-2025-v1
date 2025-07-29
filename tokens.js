// status can be "online", "idle", "dnd", or "invisible" or "offline"
export default [
    {
        channelId: "1390757847779774536",
        serverId: "1128521655010988212",
        token: MTIyMTE0MDIyNzAwODEwMjUxMg.G8k1Ha.3XtyVPVdScrYTM38OgJRgttsgLx1Per68BGRTk.env.token1,
        selfDeaf: false,
        autoReconnect: {
            enabled: true,
            delay: 5, // ثواني
            maxRetries: 5,
        },
        presence: {
            status: "idle",
        },
        selfMute: true,
    },
];
