import type { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
    AddMechanizationForm,
    DynamicHead,
    AddReferencesForm,
    AddUserForm,
    UpdateMechanizationSection,
    UpdateReferencesSection,
    UserUpdateSection
} from '@components';
import { siteMetaData } from '../../src/config/siteMetadata';
import { useContext } from 'react';
import { StylesContext } from '../_app';

export async function getStaticProps({ locale }: { locale: string }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    };
}

const Dashboard: NextPage = () => {
    const { t } = useTranslation()
    const styles = useContext(StylesContext).administration

    return (
        <>
            <DynamicHead
                title={t('head.protected.title')}
                description={t('head.protected.description')}
                canonicalUrl={siteMetaData.siteUrl + '/dashboard'}
                ogType="website"
            />
            <AddMechanizationForm />
            <UpdateMechanizationSection />
            <AddReferencesForm />
            <UpdateReferencesSection />
            <AddUserForm />
            <UserUpdateSection />
        </>
    )
}

export default Dashboard