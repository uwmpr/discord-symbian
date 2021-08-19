import { PrivateChannel } from "../structures/PrivateChannel";
import { User } from "../structures/User";
import { ClientEventCallbackArgs, ClientEvents } from "./ClientEvents";
import { SocketManager, SocketManagerImpl } from "./socket/SocketManager";

declare const SocketManager: SocketManagerImpl;
Qt.include("./socket/SocketManager.js");

const Client = class Client {
    private listeners: Partial<Record<ClientEvents, (() => void)[]>> = {};

    privateChannels: Record<string, PrivateChannel> = {}
    token?: string
    user?: User
    users: Record<string, User> = {};
    ws: SocketManager

    constructor() {
        this.ws = new SocketManager(this);
    }

    emit<E extends ClientEvents>(event: E, ...args: ClientEventCallbackArgs[E]) {
        if (!this.listeners[event]) {
            return;
        }
        let stack = this.listeners[event]!.slice();
        for (var i = 0, l = stack.length; i < l; i++) {
            // @ts-ignore
            stack[i].apply(stack, args);
        }
    }

    on<E extends ClientEvents>(event: E, callback: (...args: ClientEventCallbackArgs[E]) => void) {
        let stack = this.listeners[event];
        if (!stack) {
            stack = this.listeners[event] = [];
        }
        stack.push(callback);
    }

    off<E extends ClientEvents>(event: E, callback: (...args: ClientEventCallbackArgs[E]) => void) {
        const stack = this.listeners[event];
        if (!stack) {
            return;
        }
        for (var i = 0, l = stack.length; i < l; i++) {
            if (stack[i] === callback) {
                stack.splice(i, 1);
                return;
            }
        }
    }

    login(token: string) {
        this.token = token;
        this.ws.connect();
    }

    setBackground(background: boolean) {
        this.ws.setBackground(background);
    }

    ready() {
        this.ws.ready();
    }
};

export type Client = typeof Client["prototype"];
export type ClientImpl = typeof Client;