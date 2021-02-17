import CastMemberList from '../pages/cast-member/PageList';
import CastMemberPageForm from '../pages/cast-member/PageForm';

 export const castMembersRoutes = [
    {
        name: 'cast_members.create',
        label: 'Criar membro de elenco',
        path: '/cast-members/create',
        component: CastMemberPageForm
    },
    {
        name: 'cast_members.list',
        label: 'Listar membros de elencos',
        path: '/cast-members',
        component: CastMemberList
    }
];

export default  castMembersRoutes;
