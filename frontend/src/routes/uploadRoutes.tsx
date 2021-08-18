import UploadPage from '../pages/uploads';
export const uploadRoutes = [
    {
        name: 'uploads' ,
        label: 'Uploads',
        path: '/uploads',
        component: UploadPage,
        exact: true
    }
];

export default uploadRoutes;