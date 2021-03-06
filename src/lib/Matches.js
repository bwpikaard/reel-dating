/* eslint-disable prettier/prettier */
import database from "@react-native-firebase/database";
import Users from "./Users";

const fb = database();

function generateHash(string) {
    var hash = 0;
    if (string.length == 0) return hash;
    for (let i = 0; i < string.length; i++) {
        var charCode = string.charCodeAt(i);
        // eslint-disable-next-line no-bitwise
        hash = (hash << 7) - hash + charCode;
        // eslint-disable-next-line no-bitwise
        hash = hash & hash;
    }
    return hash;
}

class Matches {
    static async get(id) {
        return fb
            .ref(`/matches/${id}`)
            .once("value")
            .then(async snapshot => {
                const match = snapshot.val();

                return match
                    ? {
                        id,
                        ...snapshot.val(),
                        initialUser: await Users.get(match.initial_user),
                        matchedUser: await Users.get(match.matched_user),
                    }
                    : null;
            });
    }

    static getOn(id) {
        return fb
            .ref(id ? `/matches/${id}` : "/matches");
    }

    static async create(initialUser, matchedUser) {
        const id = generateHash(`${initialUser}-${matchedUser}-${Date.now()}`);

        return fb
            .ref(`/matches/${id}`)
            .set({
                initial_user: initialUser,
                matched_user: matchedUser,
                date: Date.now(),
                messages: [],
            })
            .then(() => {
                return this.get(id);
            });
    }

    static async update(id, data) {
        return fb
            .ref(`/matches/${id}`)
            .update(data)
            .then(() => {
                return this.get(id);
            });
    }

    static async appendMessages(id, oldMessages, newMessages) {
        return fb
            .ref(`/matches/${id}`)
            .update({ messages: [...oldMessages, ...newMessages] })
            .then(() => {
                return this.get(id);
            });
    }

    static async getGiftedMessages(match, messages = []) {
        return messages.map(m => {
            return {
                ...m,
                user: m.user === match.initial_user ?
                    { ...match.initialUser, _id: match.initial_user, name: `${match.initialUser.name.first} ${match.initialUser.name.last}` } :
                    { ...match.matchedUser, _id: match.matched_user, name: `${match.matchedUser.name.first} ${match.matchedUser.name.last}` },
            };
        });
    }

    static async formatSnapshot(id, snapshot) {
        const match = snapshot.val();

        return match
            ? {
                id,
                ...snapshot.val(),
                initialUser: await Users.get(match.initial_user),
                matchedUser: await Users.get(match.matched_user),
            }
            : null;
    }
}

export default Matches;
