import { promises as fs } from 'fs';
import path from 'path';

type AppSettings = {
    ownerProfileAlertEnabled: boolean;
    updatedAt: string;
    updatedBy?: string;
};

const SETTINGS_DIRECTORY = path.join(process.cwd(), '.runtime');
const SETTINGS_FILE = path.join(SETTINGS_DIRECTORY, 'app-settings.json');
let runtimeSettings: AppSettings | null = null;

const parseBool = (value: string | undefined, fallback: boolean) => {
    if (typeof value !== 'string') return fallback;
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'on') {
        return true;
    }
    if (normalized === 'false' || normalized === '0' || normalized === 'no' || normalized === 'off') {
        return false;
    }
    return fallback;
};

const getDefaultSettings = (): AppSettings => ({
    ownerProfileAlertEnabled: parseBool(process.env.OWNER_ALERTS_ENABLED, true),
    updatedAt: new Date(0).toISOString(),
});

const normalizeSettings = (raw: unknown): AppSettings => {
    const defaults = getDefaultSettings();
    if (!raw || typeof raw !== 'object') return defaults;

    const candidate = raw as Partial<AppSettings>;
    return {
        ownerProfileAlertEnabled: typeof candidate.ownerProfileAlertEnabled === 'boolean'
            ? candidate.ownerProfileAlertEnabled
            : defaults.ownerProfileAlertEnabled,
        updatedAt: typeof candidate.updatedAt === 'string' && candidate.updatedAt
            ? candidate.updatedAt
            : defaults.updatedAt,
        updatedBy: typeof candidate.updatedBy === 'string' && candidate.updatedBy
            ? candidate.updatedBy
            : undefined,
    };
};

export const getOwnerAlertSettings = async (): Promise<AppSettings> => {
    if (runtimeSettings) {
        return runtimeSettings;
    }

    try {
        const raw = await fs.readFile(SETTINGS_FILE, 'utf8');
        const parsed = normalizeSettings(JSON.parse(raw));
        runtimeSettings = parsed;
        return parsed;
    } catch {
        const defaults = getDefaultSettings();
        runtimeSettings = defaults;
        return defaults;
    }
};

export const isOwnerAlertEnabled = async (): Promise<boolean> => {
    const settings = await getOwnerAlertSettings();
    return settings.ownerProfileAlertEnabled;
};

export const setOwnerAlertEnabled = async (enabled: boolean, updatedBy?: string): Promise<AppSettings> => {
    const current = await getOwnerAlertSettings();
    const next: AppSettings = {
        ...current,
        ownerProfileAlertEnabled: enabled,
        updatedAt: new Date().toISOString(),
        updatedBy: updatedBy || current.updatedBy,
    };

    runtimeSettings = next;
    try {
        await fs.mkdir(SETTINGS_DIRECTORY, { recursive: true });
        await fs.writeFile(SETTINGS_FILE, JSON.stringify(next, null, 2), 'utf8');
    } catch (error) {
        console.warn('Owner alert setting could not be persisted to disk. Using in-memory setting only.', error);
    }

    return next;
};
