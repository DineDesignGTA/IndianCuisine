// src/app/api/emails/route.js

import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        // Parse the email from the request body
        const { email } = await request.json();

        // Validate email format
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
        }

        // Google Apps Script URL
        const googleScriptURL = 'https://script.google.com/macros/s/AKfycbz-sGue9vFe761YIALYrtLeIR4laQVqHtQpLE33bxoRjdlPEQEb-vlEOAEIAa2ZRPEhCw/exec';

        // Send the email to Google Sheets via Apps Script
        const response = await fetch(googleScriptURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ email }),
        });

        if (!response.ok) {
            throw new Error('Failed to submit email to Google Sheets');
        }

        return NextResponse.json({ message: 'Email submitted successfully' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error submitting email' }, { status: 500 });
    }
}
