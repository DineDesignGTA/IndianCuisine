import { NextResponse } from 'next/server';

const API_KEY = process.env.GOOGLE_PLACE_API_KEY;

export async function GET() {
    const PLACE_ID = process.env.PLACE_ID;
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews&key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Google API responded with status ${response.status}: ${data.error_message || 'Unknown error'}`);
        }

        if (!data.result || !data.result.reviews) {
            return NextResponse.json({ error: 'No reviews found' }, { status: 404 });
        }

        return NextResponse.json(data.result.reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error.message);
        return NextResponse.json({ error: 'Failed to fetch reviews', details: error.message }, { status: 500 });
    }
}
