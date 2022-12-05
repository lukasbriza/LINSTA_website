import type { NextPage } from 'next'
import { useEffect, useRef } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next'
import { useForm, SubmitHandler } from 'react-hook-form'
import { FilledTextFieldHF, HelperText } from '@lukasbriza/lbui-lib'
import { joiResolver } from '@hookform/resolvers/joi';
import { TFunction } from 'next-i18next';
import jwt from 'jsonwebtoken'
import Joi from 'joi';
import { authenticate, loginRequest } from '@fetchers'
import styles from "../src/styles/pages/Login.module.scss"
import { siteMetaData } from '../src/config/siteMetadata';
import { useState, } from 'react'
import { DynamicHead, Eye } from '@components';
import { useRedirect } from '@hooks'

export async function getStaticProps({ locale }: { locale: string }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    };
}

type FormInputs = {
    username: string
    password: string
}

const requiredUsernameValidtion = (t: TFunction) => {
    return Joi.string()
        .ruleset.max(50)
        .min(1)
        .rule({ message: t("pages.login.validations.max50") })
        .ruleset.alphanum()
        .rule({ message: t("pages.login.validations.specialCharacters") })
        .required()
        .messages({ "string.empty": t("pages.login.validations.required") });
};

const requredPasswordValidation = (t: TFunction) => {
    return Joi.string()
        .ruleset.max(50)
        .rule({ message: t("pages.login.validations.max50") })
        .ruleset
        .min(4)
        .rule({ message: t("pages.login.validations.min8") })
        .ruleset.alphanum()
        .rule({ message: t("pages.login.validations.specialCharacters") })
        .required()
        .messages({ "string.empty": t("pages.login.validations.required") });
};

const schema = (t: TFunction) => {
    return Joi.object({
        username: requiredUsernameValidtion(t),
        password: requredPasswordValidation(t),
    });
};


const formValidationSchema = (t: TFunction) => {
    return joiResolver(schema(t));
};


const Login: NextPage = () => {
    const [hidePassword, setHidePassword] = useState<boolean>(true)
    const { t } = useTranslation()
    const { control, handleSubmit, formState: { errors } } = useForm<FormInputs>({
        defaultValues: {
            username: "",
            password: ""
        },
        mode: "onBlur",
        reValidateMode: "onBlur",
        resolver: formValidationSchema(t)
    })
    const render = useRef(false)
    const redirect = useRedirect()

    useEffect(() => {
        if (render.current === false) {
            authenticate().then(value => {
                const { sucess, data } = value
                sucess && data !== null && redirect({ path: '/protected' })
            })
        }
        render.current = true
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onSubmit: SubmitHandler<FormInputs> = (data) => {
        const token = jwt.sign({ name: data.username, password: data.password }, process.env.NEXT_PUBLIC_JWT_REGISTRATION_KEY!)

        loginRequest({ token: token }).then((response) => {
            if (response.sucess === true && response.token !== null) {
                redirect({ path: '/protected' })
            }
            if (response.sucess === false) {
                console.error(response)
            }
        })
    }

    return (
        <>
            <DynamicHead
                title={t('head.login.title')}
                description={t('head.login.description')}
                canonicalUrl={siteMetaData.siteUrl + '/login'}
                ogType="website"
            />
            <section className={styles.login}>
                <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                    <HelperText
                        className={styles.username}
                        text={""}
                        errorText={errors.username?.message}
                        errorClass={styles.helperError}
                        error={errors.username && true}
                    >
                        <FilledTextFieldHF
                            className={styles.input}
                            labelClass={styles.label}
                            labelFocusClass={styles.focusLabel}
                            labelFilledClass={styles.focusLabel}
                            lineFilledClass={styles.filledLine}
                            errorLineClass={styles.errorLine}
                            errorLabelClass={styles.errorLabel}
                            control={control}
                            name={"username"}
                            label={t('pages.login.username')}
                        />
                    </HelperText>
                    <HelperText
                        className={styles.password}
                        text={""}
                        errorText={errors.password?.message}
                        errorClass={styles.helperError}
                        error={errors.password && true}
                    >
                        <>
                            <FilledTextFieldHF
                                password={hidePassword}
                                className={styles.input}
                                labelClass={styles.label}
                                labelFocusClass={styles.focusLabel}
                                labelFilledClass={styles.focusLabel}
                                lineFilledClass={styles.filledLine}
                                errorLineClass={styles.errorLine}
                                errorLabelClass={styles.errorLabel}
                                control={control}
                                name={"password"}
                                label={t('pages.login.password')}
                            />
                            <Eye showPassword={hidePassword} onClick={() => setHidePassword(value => !value)} />
                        </>
                    </HelperText>
                    <input type="submit" value={t('pages.contact.form.submit')} className={styles.submit} />
                </form>
            </section>
        </>
    )
}

export default Login