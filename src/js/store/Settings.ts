export const defaultSettings: Settings = {
    token: "",
    debug: false,
    autoConnect: false,
    cdnProxyUrl: "discord.ruzik.xyz:80",
    proxyUrl: "discord.ruzik.xyz:8471",
    httpProxyUrl: "57.128.194.14:80",
    https: false,
};

export type Settings = {
    token: string
    debug: boolean
    autoConnect: boolean
    cdnProxyUrl: string
    proxyUrl: string
    httpProxyUrl: string
    https: boolean
};

export const Settings = {
    get<K extends keyof Settings>(key: K) {
        const defaultValue = defaultSettings[key];
        const type = typeof defaultValue;
        const value = window.store.get("settings")[key];

        if (!value && type === "string") return defaultValue;

        return value ?? defaultValue;
    },
    set<K extends keyof Settings>(key: K, value: Settings[K]) {
        window.store.fetch("settings", settings => {
            settings[key] = value;
            window.store.set("settings", settings);
        });
    },
};