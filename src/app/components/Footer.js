// Footer.js
'use client';
import React, { useState } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import GoogleMapOverlay from "./Maps";
import Link from 'next/link';
import hours from '../Data/hours.json';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setMessage('Please enter a valid email.');
            return;
        }

        setIsSubmitting(true);
        setMessage('');

        try {
            const res = await fetch('/api/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const result = await res.json();
            if (res.ok) {
                setMessage('Successfully subscribed!');
                setEmail(''); // Clear the email input field
                // Add success animation here
            } else {
                setMessage(result.message || 'Failed to subscribe.');
            }
        } catch (error) {
            setMessage('Error subscribing. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <footer className="bg-gray-100 font-sans text-gray-800 dark:bg-gray-900 dark:text-white">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="mb-8 md:mb-0">
                        <h2 className="text-3xl font-bold mb-6">DineDesign</h2>
                        <p className="text-sm">Crafting culinary experiences since 2024.</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {['Offers', 'Menu', 'Contact', 'Reviews'].map((item) => (
                                <li key={item}>
                                    <ScrollLink to={item.toLowerCase()} smooth={true} duration={500} className="hover:text-blue-500 transition-colors duration-300 cursor-pointer">
                                        {item}
                                    </ScrollLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h3 className="text-lg font-semibold mb-4">Subscribe to Our Newsletter</h3>
                        <p className="mb-4 text-sm">Stay updated with our latest offers and events.</p>
                        <form className="flex flex-col sm:flex-row gap-4" onSubmit={handleSubmit}>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email address"
                                className={`flex-grow px-4 py-2 rounded-md border ${isSubmitting ? 'cursor-wait' : ''} border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700`}
                                required
                                disabled={isSubmitting}
                            />
                            <button
                                type="submit"
                                className={`px-6 py-2 bg-blue-500 text-white rounded-md ${isSubmitting ? 'cursor-wait' : 'hover:bg-blue-600'} transition-colors duration-300`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Subscribe'}
                            </button>
                        </form>
                        {message && <p className="mt-4 text-sm">{message}</p>}
                    </div>
                </div>

                <hr className="my-8 border-gray-200 dark:border-gray-700" />

                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex space-x-4 mb-4 md:mb-0">
                        {['facebook', 'twitter', 'instagram'].map((social) => (
                            <a key={social} href="#" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                                <img
                                    src={`https://www.svgrepo.com/show/303${social === 'facebook' ? '114/facebook-3-logo' : social === 'twitter' ? '115/twitter-3-logo' : '145/instagram-2-1-logo'}.svg`}
                                    alt={social}
                                    className="w-6 h-6"
                                />
                            </a>
                        ))}
                    </div>
                    <p className="text-sm text-center">© 2024 DineDesign. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
