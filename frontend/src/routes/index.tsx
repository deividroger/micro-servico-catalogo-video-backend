import { RouteProps } from 'react-router-dom'
import { categoryRoutes } from './categoryRoutes';
import { genresRoutes } from './genresRoutes';
import { castMembersRoutes } from './castMembersRoutes';
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

];

export default routes;