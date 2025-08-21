import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

interface Platform {
    type: 'ios' | 'android' | 'web';
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
}

export default function RecipeWelcome() {
    const { auth } = usePage<SharedData>().props;
    const [platform, setPlatform] = useState<Platform>({
        type: 'web',
        isMobile: false,
        isTablet: false,
        isDesktop: true
    });

    useEffect(() => {
        const detectPlatform = (): Platform => {
            const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
            const width = window.innerWidth;

            let type: 'ios' | 'android' | 'web' = 'web';

            if (/android/i.test(userAgent)) {
                type = 'android';
            } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
                type = 'ios';
            }

            return {
                type,
                isMobile: width <= 768,
                isTablet: width > 768 && width <= 1024,
                isDesktop: width > 1024
            };
        };

        setPlatform(detectPlatform());

        const handleResize = () => {
            setPlatform(detectPlatform());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleCloseApp = () => {
        if (platform.type === 'ios' || platform.type === 'android') {
            // For mobile apps, this would call the appropriate native method
            if (confirm('Are you sure you want to close the app?')) {
                // In a real app, this would call the mobile app close method
                console.log('Closing mobile app...');
            }
        } else {
            // Web behavior
            if (confirm('Are you sure you want to close the app?')) {
                try {
                    window.close();
                } catch(e) {
                    window.location.href = '/';
                }
            }
        }
    };

    const handleContinue = () => {
        // Navigate to the main app interface
        window.location.href = route('dashboard');
    };

    return (
        <>
            <Head title="Recipe App - Your Culinary Companion">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover" />
                <meta name="theme-color" content="#667eea" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="light-content" />
                <meta name="apple-mobile-web-app-title" content="Recipe App" />
            </Head>

            <div className={`
                min-h-screen flex flex-col overflow-x-hidden
                bg-gradient-to-br from-[#667eea] to-[#764ba2]
                text-[#2d3748]
                ${platform.type === 'ios' ? 'pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]' : ''}
            `}>

                {/* Optional Header for authenticated users */}
                {auth.user && (
                    <header className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                        <nav className="flex items-center justify-end">
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-all duration-200"
                            >
                                Dashboard
                            </Link>
                        </nav>
                    </header>
                )}

                {/* Main Container */}
                <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-8 text-center">

                    {/* Hero Section */}
                    <div className={`
                        bg-white/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl
                        p-6 sm:p-8 lg:p-12
                        shadow-xl shadow-black/10
                        border border-white/20
                        w-full max-w-md sm:max-w-lg lg:max-w-2xl
                        mb-6 sm:mb-8
                        relative overflow-hidden
                        ${platform.isMobile ? 'mx-2' : ''}
                    `}>
                        {/* Decorative gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent pointer-events-none" />

                        <div className="relative z-10">
                            {/* Chef Icon */}
                            <div className="text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6 animate-bounce">
                                👨‍🍳
                            </div>

                            {/* Main Text */}
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2d3748] mb-3 sm:mb-4 leading-tight">
                                Thinking about your next recipe?
                            </h1>

                            <p className="text-lg sm:text-xl lg:text-2xl font-medium text-[#4a5568] mb-2 sm:mb-3">
                                Don't worry,
                            </p>

                            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#667eea] mb-6 sm:mb-8">
                                We got you!
                            </p>

                            {/* Terms Text */}
                            <div className="text-sm sm:text-base text-[#718096] leading-relaxed">
                                By continuing you agree with our{' '}
                                <Link
                                    href="/terms"
                                    className="text-[#667eea] font-medium hover:text-[#5a67d8] underline underline-offset-2 transition-colors duration-200"
                                >
                                    Terms and Conditions
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className={`
                        bg-white/10 backdrop-blur-lg rounded-2xl
                        p-4 sm:p-6
                        w-full max-w-md sm:max-w-lg lg:max-w-2xl
                        border border-white/20
                        shadow-lg
                        ${platform.isMobile ? 'mx-2' : ''}
                        ${platform.isMobile ? 'flex-col space-y-3' : 'flex justify-between items-center space-x-4'}
                        flex
                    `}>

                        {/* Close App Button */}
                        <button
                            onClick={handleCloseApp}
                            className={`
                                bg-gradient-to-r from-red-500 to-red-600
                                hover:from-red-600 hover:to-red-700
                                text-white font-semibold
                                px-6 sm:px-8 py-3 sm:py-4
                                rounded-xl
                                transition-all duration-200
                                transform hover:scale-105 active:scale-95
                                shadow-lg hover:shadow-xl
                                min-h-[44px] touch-manipulation
                                ${platform.isMobile ? 'w-full' : 'flex-1 max-w-[200px]'}
                                relative overflow-hidden
                                group
                            `}
                        >
                            <span className="relative z-10">Close App</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </button>

                        {/* Continue Button */}
                        <button
                            onClick={handleContinue}
                            className={`
                                bg-gradient-to-r from-[#667eea] to-[#764ba2]
                                hover:from-[#5a67d8] hover:to-[#6b46c1]
                                text-white font-semibold
                                px-6 sm:px-8 py-3 sm:py-4
                                rounded-xl
                                transition-all duration-200
                                transform hover:scale-105 active:scale-95
                                shadow-lg hover:shadow-xl
                                min-h-[44px] touch-manipulation
                                ${platform.isMobile ? 'w-full' : 'flex-1 max-w-[200px]'}
                                relative overflow-hidden
                                group
                            `}
                        >
                            <span className="relative z-10">Continue</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#5a67d8] to-[#6b46c1] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </button>
                    </div>

                    {/* Platform Indicator (for development) */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className="mt-4 text-white/60 text-xs">
                            Platform: {platform.type} |
                            {platform.isMobile && ' Mobile'}
                            {platform.isTablet && ' Tablet'}
                            {platform.isDesktop && ' Desktop'}
                        </div>
                    )}
                </div>

                {/* Background Decorations */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-4 -right-4 w-24 h-24 sm:w-32 sm:h-32 bg-white/5 rounded-full blur-xl" />
                    <div className="absolute top-1/3 -left-8 w-32 h-32 sm:w-48 sm:h-48 bg-white/5 rounded-full blur-2xl" />
                    <div className="absolute -bottom-8 right-1/4 w-28 h-28 sm:w-40 sm:h-40 bg-white/5 rounded-full blur-xl" />
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }

                .animate-bounce {
                    animation: float 3s ease-in-out infinite;
                }

                /* iOS specific styles */
                ${platform.type === 'ios' ? `
                    .rounded-xl {
                        border-radius: 12px;
                    }

                    button {
                        -webkit-appearance: none;
                        border: none;
                        outline: none;
                    }
                ` : ''}

                /* Android specific styles */
                ${platform.type === 'android' ? `
                    button {
                        outline: none;
                        -webkit-tap-highlight-color: transparent;
                    }
                ` : ''}

                /* Responsive adjustments */
                @media (max-width: 480px) {
                    .min-h-[100dvh] {
                        min-height: calc(100vh - env(keyboard-inset-height, 0px));
                    }
                }

                /* Landscape orientation adjustments */
                @media (max-height: 500px) and (orientation: landscape) {
                    .flex-col {
                        flex-direction: row;
                        align-items: center;
                        justify-content: center;
                        gap: 2rem;
                    }

                    .mb-6, .mb-8 {
                        margin-bottom: 0;
                    }
                }

                /* Dark mode support */
                @media (prefers-color-scheme: dark) {
                    .bg-white\\/90 {
                        background: rgba(26, 32, 44, 0.9);
                    }

                    .text-\\[\\#2d3748\\] {
                        color: #f7fafc;
                    }

                    .text-\\[\\#4a5568\\] {
                        color: #e2e8f0;
                    }

                    .text-\\[\\#718096\\] {
                        color: #a0aec0;
                    }
                }

                /* Reduced motion support */
                @media (prefers-reduced-motion: reduce) {
                    * {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }

                    .animate-bounce {
                        animation: none;
                    }
                }

                /* High contrast mode */
                @media (prefers-contrast: high) {
                    .bg-white\\/10 {
                        background: rgba(255, 255, 255, 0.2);
                        border: 2px solid white;
                    }

                    .border-white\\/20 {
                        border-color: white;
                        border-width: 2px;
                    }
                }
            `}</style>
        </>
    );
}
