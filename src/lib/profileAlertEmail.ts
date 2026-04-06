import nodemailer from 'nodemailer';

const DEFAULT_OWNER_ALERT_EMAIL = 'sindoorsaubhagya@gmail.com';

type NewProfileOwnerAlertPayload = {
    userId: string;
    email: string;
    firstName: string;
    lastName?: string;
    phone?: string;
    profileFor?: string;
    gender?: string;
    religion?: string;
    caste?: string;
    city?: string;
    state?: string;
};

const getEnv = (value: string | undefined) => value?.trim() || '';

const asSafeText = (value?: string) => {
    const trimmed = value?.trim();
    return trimmed && trimmed.length > 0 ? trimmed : 'Not provided';
};

const buildTransporter = () => {
    const host = getEnv(process.env.SMTP_HOST);
    const portRaw = getEnv(process.env.SMTP_PORT);
    const user = getEnv(process.env.SMTP_USER);
    const pass = getEnv(process.env.SMTP_PASS);

    if (!host || !portRaw || !user || !pass) {
        return null;
    }

    const port = Number(portRaw);
    if (Number.isNaN(port)) {
        return null;
    }

    const secure = getEnv(process.env.SMTP_SECURE)
        ? getEnv(process.env.SMTP_SECURE).toLowerCase() === 'true'
        : port === 465;

    return nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
            user,
            pass,
        },
    });
};

export const sendNewProfileOwnerAlert = async (payload: NewProfileOwnerAlertPayload) => {
    const transporter = buildTransporter();

    if (!transporter) {
        console.warn('Owner alert email skipped: SMTP env vars are not fully configured.');
        return;
    }

    const ownerEmail = getEnv(process.env.OWNER_ALERT_EMAIL) || DEFAULT_OWNER_ALERT_EMAIL;
    const fromEmail =
        getEnv(process.env.OWNER_ALERT_FROM_EMAIL) ||
        getEnv(process.env.SMTP_FROM_EMAIL) ||
        getEnv(process.env.SMTP_USER);

    if (!fromEmail) {
        console.warn('Owner alert email skipped: sender email is missing.');
        return;
    }

    const fullName = `${payload.firstName || ''} ${payload.lastName || ''}`.trim() || 'New User';

    const subject = `New Profile Created: ${fullName}`;
    const text = [
        'A new profile has been created and may need your action.',
        '',
        `Name: ${fullName}`,
        `Email: ${asSafeText(payload.email)}`,
        `Phone: ${asSafeText(payload.phone)}`,
        `Profile For: ${asSafeText(payload.profileFor)}`,
        `Gender: ${asSafeText(payload.gender)}`,
        `Religion: ${asSafeText(payload.religion)}`,
        `Caste: ${asSafeText(payload.caste)}`,
        `Location: ${asSafeText([payload.city, payload.state].filter(Boolean).join(', '))}`,
        `User ID: ${payload.userId}`,
        `Created At: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
    ].join('\n');

    await transporter.sendMail({
        from: fromEmail,
        to: ownerEmail,
        subject,
        text,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                <h2 style="margin-bottom: 8px;">New Profile Created</h2>
                <p style="margin-top: 0;">A new profile has been created and may need your action.</p>
                <table cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
                    <tr><td><strong>Name</strong></td><td>${fullName}</td></tr>
                    <tr><td><strong>Email</strong></td><td>${asSafeText(payload.email)}</td></tr>
                    <tr><td><strong>Phone</strong></td><td>${asSafeText(payload.phone)}</td></tr>
                    <tr><td><strong>Profile For</strong></td><td>${asSafeText(payload.profileFor)}</td></tr>
                    <tr><td><strong>Gender</strong></td><td>${asSafeText(payload.gender)}</td></tr>
                    <tr><td><strong>Religion</strong></td><td>${asSafeText(payload.religion)}</td></tr>
                    <tr><td><strong>Caste</strong></td><td>${asSafeText(payload.caste)}</td></tr>
                    <tr><td><strong>Location</strong></td><td>${asSafeText([payload.city, payload.state].filter(Boolean).join(', '))}</td></tr>
                    <tr><td><strong>User ID</strong></td><td>${payload.userId}</td></tr>
                    <tr><td><strong>Created At</strong></td><td>${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td></tr>
                </table>
            </div>
        `,
    });
};
