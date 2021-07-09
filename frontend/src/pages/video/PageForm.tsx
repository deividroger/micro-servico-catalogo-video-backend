import * as React from 'react';

import {Page} from "../../components/Page";
import {useParams} from 'react-router';
import { Form } from './Form/Index';

const PageForm = () => {
    
    const { id }: any = useParams();

    return (
        <Page title={!id ? 'Criar vídeo' : 'Editar vídeo'}>
            <Form/>
        </Page>
    );
};

export default PageForm;