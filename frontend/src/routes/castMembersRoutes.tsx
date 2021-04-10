import CastMemberList from '../pages/cast-member/PageList';
import CastMemberPageForm from '../pages/cast-member/PageForm';

 export const castMembersRoutes = [
    {
        name: 'cast_members.create',
        label: 'Criar membro de elenco',
        path: '/cast-members/create',
        component: CastMemberPageForm,
        exact: true
    },
    {
        name: 'cast_members.list',
        label: 'Listar membros de elencos',
        path: '/cast-members',
        component: CastMemberList,
        exact: true
    },
    {
        name: 'cast_members.edit' ,
        label: 'Editar membro de elenco',
        path: '/cast-members/:id/edit',
        component: CastMemberPageForm,
        exact: true
    }
];

export default  castMembersRoutes;
