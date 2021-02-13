import {RouteProps} from 'react-router-dom'
import  Dashboard  from '../pages/Dashboard';
import  CategoryList  from '../pages/category/PageList';
import GenreList from '../pages/genre/PageList';
import CastMemberList from '../pages/cast-member/PageList';

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
        label: 'Listar categorias',
        path: '/categories',
        component: CategoryList,
        exact: true
    },
    {
        name: 'genres.list',
        label: 'Listar gêneros',
        path: '/genres',
        component: GenreList,
        exact: true
    },
    {
        name: 'cast_members.list',
        label: 'Listar membros de elencos',
        path: '/cast-members',
        component: CastMemberList
    }
    ,
    {
        name: 'categories.create',
        label: 'Criar categoria',
        path: '/categories/create',
        component: CategoryList,
        exact: true
    }
];

export default routes;