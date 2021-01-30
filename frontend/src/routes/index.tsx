import {RouteProps} from 'react-router-dom'
import  Dashboard  from '../pages/Dashboard';
import  CategoryList  from '../pages/category/List';

export interface MyRouteProps extends RouteProps {
    label: string;
    name: string;
}

const routes: MyRouteProps[] = [
    {
        name: 'dashboard',
        label: 'Dashboard',
        path: '/',
        component: Dashboard,
        exact: true
    },
    {
        name: 'categories.list',
        label: 'Listar Categorias',
        path: '/categories',
        component: CategoryList,
        exact: true
    }
];

export default routes;