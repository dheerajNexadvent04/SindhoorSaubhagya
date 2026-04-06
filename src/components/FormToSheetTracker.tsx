"use client";

import { useEffect } from 'react';
import { sendToGoogleSheet } from '@/lib/googleSheet';

const SENSITIVE_FIELD_PATTERN = /(password|pass|otp|token|secret|authorization|auth)/i;

const normalizeKey = (value: string, index: number) => {
    const trimmed = value.trim();
    if (!trimmed) {
        return `field_${index + 1}`;
    }

    return trimmed
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '') || `field_${index + 1}`;
};

const appendField = (
    target: Record<string, string | string[]>,
    key: string,
    value: string
) => {
    if (!value.trim()) return;

    const existing = target[key];
    if (typeof existing === 'undefined') {
        target[key] = value;
        return;
    }

    if (Array.isArray(existing)) {
        existing.push(value);
        return;
    }

    target[key] = [existing, value];
};

const pickFirstValue = (
    fields: Record<string, string | string[]>,
    keys: string[]
) => {
    for (const key of keys) {
        const value = fields[key];
        if (!value) continue;
        if (Array.isArray(value)) {
            if (value[0]) return value[0];
            continue;
        }
        return value;
    }
    return '';
};

const extractFieldPayload = (form: HTMLFormElement) => {
    const payload: Record<string, string | string[]> = {};
    const controls = Array.from(form.elements);

    controls.forEach((control, index) => {
        if (
            !(control instanceof HTMLInputElement) &&
            !(control instanceof HTMLSelectElement) &&
            !(control instanceof HTMLTextAreaElement)
        ) {
            return;
        }

        if (control.disabled) return;

        const rawKey =
            control.name ||
            control.id ||
            control.getAttribute('aria-label') ||
            control.getAttribute('placeholder') ||
            '';

        const key = normalizeKey(rawKey, index);

        if (SENSITIVE_FIELD_PATTERN.test(key)) return;
        if (control instanceof HTMLInputElement && control.type === 'password') return;

        if (control instanceof HTMLInputElement && control.type === 'radio') {
            if (!control.checked) return;
            appendField(payload, key, control.value);
            return;
        }

        if (control instanceof HTMLInputElement && control.type === 'checkbox') {
            if (!control.checked) return;
            appendField(payload, key, control.value || 'true');
            return;
        }

        if (control instanceof HTMLInputElement && control.type === 'file') {
            const fileNames = Array.from(control.files ?? [])
                .map((file) => file.name)
                .join(', ');
            appendField(payload, key, fileNames);
            return;
        }

        appendField(payload, key, control.value ?? '');
    });

    return payload;
};

export default function FormToSheetTracker() {
    useEffect(() => {
        const onSubmit = (event: Event) => {
            const form = event.target;
            if (!(form instanceof HTMLFormElement)) return;

            if (form.dataset.sheetIgnore === 'true') return;

            const fields = extractFieldPayload(form);
            if (!Object.keys(fields).length) return;

            const primaryName = pickFirstValue(fields, [
                'name',
                'full_name',
                'fullname',
                'first_name',
                'firstname',
            ]);
            const primaryPhone = pickFirstValue(fields, ['phone', 'phone_number', 'mobile', 'contact']);
            const primaryEmail = pickFirstValue(fields, ['email', 'email_address', 'gmail']);
            const fieldsJson = JSON.stringify(fields);

            const payload = {
                formType:
                    form.dataset.formType ||
                    form.id ||
                    form.name ||
                    window.location.pathname,
                pagePath: window.location.pathname,
                pageUrl: window.location.href,
                submittedAt: new Date().toISOString(),
                name: primaryName,
                phone: primaryPhone,
                email: primaryEmail,
                message: fieldsJson,
                fields,
            };

            void sendToGoogleSheet(payload).catch((error) => {
                console.error('FormToSheetTracker: failed to send form submission', error);
            });
        };

        document.addEventListener('submit', onSubmit, true);
        return () => {
            document.removeEventListener('submit', onSubmit, true);
        };
    }, []);

    return null;
}
