import { RouteProps } from 'react-router-dom'
import { categoryRoutes } from './categoryRoutes';
import { videosRoutes } from './videoRoutes';
import { genresRoutes } from './genresRoutes';
import { castMembersRoutes } from './castMembersRoutes';
import { uploadRoutes} from './uploadRoutes';
import { dashboardRoutes } from './dashboardRoutes';

export interface MyRouteProps extends RouteProps {
    label: string;
    name: string;
}

const routes: MyRouteProps[] = [
    
    ...dashboardRoutes
    ,
    ...categoryRoutes
    ,
    ...genresRoutes
    ,
    ...castMembersRoutes
    ,
    ...videosRoutes
    ,
    ...uploadRoutes
    
];

export default routes;