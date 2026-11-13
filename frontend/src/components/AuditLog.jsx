import { useState, useEffect } from 'react';
import api from '../api/axios.js';

const LABELS = {
    login: 'Logged in',
    login_failed: 'Failed login (wrong password)',
    login_2fa_failed: 'Failed 2FA code',
    vault_setup: 'Vault created',
    vault_unlock: 'Vault unlocked',
    vault_unlock_failed: 'Failed vault unlock (wrong password)',
    vault_lock: 'Vault locked',
    document_upload: 'Document uploaded',
    document_download: 'Document opened',
    document_delete: 'Document deleted',
    twofactor_enabled: '2FA turned on',
    twofactor_disabled: '2FA turned off'
};

const describeDevice = (ua = '') => {
    if (/Postman/i.test(ua)) return 'Postman';

    const browser =
        /Edg\//.test(ua) ? 'Edge' :
        /OPR\/|Opera/.test(ua) ? 'Opera' :
        /Chrome\//.test(ua) ? 'Chrome' :
        /Firefox\//.test(ua) ? 'Firefox' :
        /Safari\//.test(ua) ? 'Safari' : 'Unknown browser';

    const os =
        /Windows/.test(ua) ? 'Windows' :
        /Android/.test(ua) ? 'Android' :
        /iPhone|iPad/.test(ua) ? 'iOS' :
        /Mac OS/.test(ua) ? 'macOS' :
        /Linux/.test(ua) ? 'Linux' : 'Unknown OS';

    return `${browser} on ${os}`;
};

function AuditLog() {
    const [logs, setLogs] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchLogs = async (pageToLoad, replace = false) => {
        try {
            setLoading(true);
            setError('');
            const res = await api.get('/audit', { params: { page: pageToLoad, limit: 10 } });
            const data = res.data.data;

            setLogs((prev) => (replace ? data.logs : [...prev, ...data.logs]));
            setPage(data.page);
            setPages(data.pages);
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to load activity log');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs(1, true);
    }, []);

    return (
        <>
            <h3>Activity Log</h3>
            <button onClick = {() => fetchLogs(1, true)} disabled = {loading}>Refresh</button>

            {error && <p>{error}</p>}

            {logs.length === 0 && !loading ? (
                <p>No activity yet</p>
            ) : (
                <ul>
                    {logs.map((log) => (
                        <li key = {log._id}>
                            {new Date(log.createdAt).toLocaleString()} | {LABELS[log.action] || log.action}
                            {!log.success && ' (failed)'}
                            {log.resourceName && ` | ${log.resourceName}`}
                            {' '}| {log.ip || 'unknown IP'} | {describeDevice(log.userAgent)}
                        </li>
                    ))}
                </ul>
            )}

            {page < pages && (
                <button onClick = {() => fetchLogs(page + 1)} disabled = {loading}>
                    {loading ? 'Loading...' : 'Load more'}
                </button>
            )}
        </>
    );
}

export default AuditLog;