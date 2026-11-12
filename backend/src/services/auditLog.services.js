import AuditLog, { AUDIT_ACTIONS } from '../models/auditLog.model.js';

export const getRequestContext = (req) => ({
    ip: req.ip || '',
    userAgent: req.get('user-agent') || ''
});

export const logEvent = async({
    userId,
    actorId,
    dcoumentId = null,
    action,
    success = true,
    resourceName = '',
    ctx = {}
}) => {
    try {
        await AuditLog.create({
            user: userId,
            actor: actorId,
            document: dcoumentId,
            action,
            success,
            resourceName,
            ip: ctx.ip || '',
            userAgent: (ctx.userAgent || '').slice(0, 300)
        });
    } catch (error) {
        console.log('Audit log failed', error.message);
    }
};

export const getAuditLogs = async(userId, {page = 1, limit = 20, action} = {}) => {
    const safeLimit = Math.min(Math.max(parseInt(limit) || 20, 1), 100);
    const safePage = Math.max(parseInt(page) || 1, 1);

    const filter = {user: userId};
    if(action && AUDIT_ACTIONS.includes(action)) {
        filter.action = action;
    }

    const [logs, total] = await Promise.all([
        AuditLog.find(filter)
            .sort({createdAt: -1})
            .skip((safePage - 1) * safeLimit)
            .limit(safeLimit)
            .lean(),
        AuditLog.countDocuments(filter)
    ]);

    return {
        logs,
        total,
        page: safePage,
        pages: Math.ceil(total / safeLimit)
    };
};