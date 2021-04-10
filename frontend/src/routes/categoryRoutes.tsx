import CategoryList from '../pages/category/PageList';
import CategoryPageForm from '../pages/category/PageForm';

export const categoryRoutes = [
    {
        name: 'categories.create',
        label: 'Criar categoria',
        path: '/categories/create',
        component: CategoryPageForm,
        exact: true
    },
    {
        name: 'categories.edit',
        label: 'Editar categoria',
        path: '/categories/:id/edit',
        component: CategoryPageForm,
        exact: true
    }
    
    ,
    {
        name: 'categories.list',
        label: 'Listar categorias',
        path: '/categories',
        component: CategoryList,
        exact: true
    }
];


export default categoryRoutes;