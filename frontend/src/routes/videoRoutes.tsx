import VideoList from '../pages/video/PageList';
import VideoPageForm from '../pages/video/PageForm';

export const videosRoutes = [
    {
        name: 'videos.list',
        label: 'Listar videos',
        path: '/videos',
        component: VideoList,
        exact: true
    },
    {
        name: 'videos.create',
        label: 'Criar video',
        path: '/videos/create',
        component: VideoPageForm,
        exact: true
    },
    {
        name: 'videos.edit' ,
        label: 'Editar videos',
        path: '/videos/:id/edit',
        component: VideoPageForm,
        exact: true
    }
];

export default videosRoutes;