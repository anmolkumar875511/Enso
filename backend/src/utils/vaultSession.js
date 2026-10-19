const TTL_MS = 15 * 60 * 1000;
const sessions = new Map();

export const setDEK = (userId, DEK) => {
    sessions.set(
        String(userId), {DEK, expiresAt: Date.now() + TTL_MS}
    );
};

export const getDEK = (userId) => {
    const s = sessions.get(String(userId));
    if(!s) {
        return null;
    }
    if(Date.now() > s.expiresAt) {
        s.DEK.fill(0);
        sessions.delete(String(userId));
        return null;
    }
    return s.DEK;
};

export const clearDEK = (userId) => {
    const s = sessions.get(String(userId));
    if(s) {
        s.DEK.fill(0);
    }
    sessions.delete(String(userId));
};

setInterval(() => {
    for(const [id, s] of sessions) {
        if(Date.now() > s.expriesAt) {
            s.DEK.fill(0);
            sessions.delete(id);
        }
    }
}, 60 * 1000).unref();