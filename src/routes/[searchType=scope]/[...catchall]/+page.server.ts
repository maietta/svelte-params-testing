import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    


    return {
        pathname: url.pathname
    }

};
