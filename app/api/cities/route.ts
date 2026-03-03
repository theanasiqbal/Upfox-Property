import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Load the file once when the module is imported (server start or first API route hit)
// We resolve relative to the project root's 'public' folder
const citiesFilePath = path.join(process.cwd(), 'public', 'cities.json');
let allCities: any[] = [];

try {
    const fileContents = fs.readFileSync(citiesFilePath, 'utf8');
    const data = JSON.parse(fileContents);
    allCities = data.cities || [];
} catch (error) {
    console.error("Failed to load cities.json for autocomplete:", error);
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q')?.toLowerCase() || '';

        if (!query) {
            return NextResponse.json([]); // Return empty if no search term
        }

        // Filter cities that start with or contain the query
        // We prioritize cities that START with the query, then those that contain it.
        let suggestions = allCities
            .filter((loc: any) => loc.City.toLowerCase().includes(query))
            .sort((a: any, b: any) => {
                const aStarts = a.City.toLowerCase().startsWith(query) ? -1 : 1;
                const bStarts = b.City.toLowerCase().startsWith(query) ? -1 : 1;
                return aStarts - bStarts;
            })
            .slice(0, 5); // Only return top 5 results per instruction

        // Format the UI return to strictly include 'City, State' text along with the payload data
        const formattedSuggestions = suggestions.map((loc: any) => ({
            ...loc,
            formattedText: `${loc.City}, ${loc.State}`
        }));

        return NextResponse.json(formattedSuggestions);
    } catch (error) {
        console.error("Error in cities autocomplete API:", error);
        return NextResponse.json({ error: "Failed to fetch cities" }, { status: 500 });
    }
}
