import mongoose from 'mongoose';

export const AUDIT_ACTIONS = [
    'login',
    'login_failed',
    'login_2fa_failed',
    'vault_setup',
    'vault_unlock',
    'vault_unlock_failed',
    'vault_lock',
    'document_upload',
    'document_download',
    'document_delete',
    'twofactor_enabled',
    'twofactor_disabled'
];

const auditLogSchema = new mongoose.schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    actor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    document: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        default: null
    },
    action: {
        type: String,
        enum: AUDIT_ACTIONS,
        required: true
    },
    success: {
        type: Boolean,
        default: true
    },
    resourceName: {
        type: String,
        default: ''
    },
    ip: {
        type: String,
        default: ''
    },
    userAgent: {
        type: String,
        default: '',
        maxlength: 300
    },
}, {
    timestamps: {createdAt: true, updatedAt: false}
});

auditLogSchema.index({user: 1, createdAt: -1});

export default mongoose.model('AuditLog', auditLogSchema);