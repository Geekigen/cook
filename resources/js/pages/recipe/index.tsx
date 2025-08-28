import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Link } from '@inertiajs/react'
import { Head } from '@inertiajs/react';

// Define the Recipe type based on your Laravel model
interface Category {
    id: number;
    name: string;
}

interface Recipe {
    id: number;
    title: string;
    image?: string;
    description: string;
    ingredients: string;
    instructions: string;
    user_id: number;
    category_id: number;
    price: number;
    categories?: Category; // From your with('categories') relationship
}

interface DashboardProps {
    recipes: Recipe[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Recipes',
        href: '/recipes',
    },
];

export default function Dashboard({ recipes }: DashboardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const truncateText = (text: string, maxLength: number = 100) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Recipe Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                            Recipe Dashboard
                        </h1>
                        <p className="text-neutral-600 dark:text-neutral-400">
                            {recipes.length} recipes available
                        </p>
                    </div>
                </div>

                {/* Recipes Grid */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {recipes.map((recipe) => (
                        <div
                            key={recipe.id}
                            className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-neutral-800 shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                            {/* Recipe Image */}
                            <div className="aspect-video overflow-hidden bg-neutral-100 dark:bg-neutral-700">
                                {recipe.image ? (
                                    <img
                                        src={recipe.image}
                                        alt={recipe.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-neutral-400 dark:text-neutral-500">
                                        <svg
                                            className="w-12 h-12"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Recipe Content */}
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                                        {recipe.title}
                                    </h3>
                                    <span className="text-sm font-medium text-green-600 dark:text-green-400 ml-2 flex-shrink-0">
                                        {formatPrice(recipe.price)}
                                    </span>
                                </div>

                                {/* Category */}
                                {recipe.categories && (
                                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full mb-2">
                                        {recipe.categories.name}
                                    </span>
                                )}

                                {/* Description */}
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
                                    {truncateText(recipe.description)}
                                </p>

                                {/* Ingredients Preview */}
                                <div className="mb-3">
                                    <h4 className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1 uppercase tracking-wide">
                                        Ingredients
                                    </h4>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-1">
                                        {truncateText(recipe.ingredients, 50)}
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200">
                                        View Recipe
                                    </button>
                                    <button className="px-3 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 border border-neutral-200 dark:border-neutral-600 hover:border-neutral-300 dark:hover:border-neutral-500 rounded-lg transition-colors duration-200">
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {recipes.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 mb-4 text-neutral-400 dark:text-neutral-500">
                            <svg
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                className="w-full h-full"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                            No recipes found
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                            Get started by creating your first recipe.
                        </p>
                        <Link  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200" href="/recipes/create" as="button">Add Recipe</Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
