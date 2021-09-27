export const defaultSettings: Settings = {
    token: "",
    debug: false,
    autoConnect: false,
    cdnProxyUrl: "discord.ruzik.xyz:80",
    proxyUrl: "discord.ruzik.xyz:8471",
};

export type Settings = {
    token: string
    debug: boolean
    autoConnect: boolean
    cdnProxyUrl: string
    proxyUrl: string
};

export const Settings = {
    get<K extends keyof Settings>(key: K) {
        return window.store.get("settings")[key] ?? defaultSettings[key];
    },
    set<K extends keyof Settings>(key: K, value: Settings[K]) {
        window.store.fetch("settings", settings => {
            settings[key] = value;
            window.store.set("settings", settings);
        });
    },
};