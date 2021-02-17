import GenreList from '../pages/genre/PageList';

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
        component: GenreList,
        exact: true
    }
];

export default genresRoutes;