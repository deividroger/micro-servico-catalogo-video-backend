import GenreList from '../pages/genre/PageList';
import GenrePageForm from '../pages/genre/PageForm';

export const genresRoutes = [
    {
        name: 'genres.list',
        label: 'Listar gêneros',
        path: '/genres',
        component: GenreList,
        exact: true
    },
    {
        name: 'genres.create',
        label: 'Criar gênero',
        path: '/genres/create',
        component: GenrePageForm,
        exact: true
    }
];

export default genresRoutes;