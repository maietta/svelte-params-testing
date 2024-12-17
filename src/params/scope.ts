import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param: string): param is ('search' | 'browse' | 'my-listings' | 'our-listings' | 'listings') => {
    return param === 'search' || param === 'browse' || param === 'my-listings' || param === 'our-listings' || param === 'listings';
}) satisfies ParamMatcher;