import styles from '../../styles/modules/UserUpdateSection.module.scss'

import { FC, useState } from "react"
import { useTranslation } from 'next-i18next'
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form'
import { FilledTextFieldHF, HelperText } from '@lukasbriza/lbui-lib'
import clsx from 'clsx'
import { formValidationSchema } from './UserUpdateSection.validation'
import { EditSectionInputs, EditSectionProps, ReadOnlySectionProps, StandardInputProps, UserUpdateUnitProps } from './UserUpdateSection.model'
import { removeUser, updateUser } from '@fetchers'

export const UserUpdateUnit: FC<UserUpdateUnitProps> = (props) => {
    const { data, setUsers, getActualList, ...rest } = props
    const [editing, setEditing] = useState<boolean>(false)

    return (
        <div {...rest}>
            {
                editing ?
                    <EditSection
                        getActualList={getActualList}
                        setEditing={setEditing}
                        data={data}
                    /> :
                    <ReadOnlySection
                        setUsers={setUsers}
                        setEditing={setEditing}
                        data={data}
                    />
            }
        </div>
    )
}

const ReadOnlySection: FC<ReadOnlySectionProps> = (props) => {
    const { setEditing, setUsers, data, ...rest } = props

    const handleRemove = async () => {
        const response = await removeUser(data._id)
        if (response.sucess) {
            setUsers((value) => {
                const newArray = value.filter((unit) => {
                    if (unit._id !== data._id) {
                        return unit
                    }
                })
                return (
                    newArray
                )
            })
        }
    }

    return (
        <div className={styles.readOnly} {...rest}>
            <div className={styles.infoWrapper}>
                <div>Uživatel</div>
                <div>{data.name}</div>
            </div>
            <div className={styles.infoWrapper}>
                <div>Role</div>
                <div>{data.permission}</div>
            </div>
            <div className={styles.buttonWrapper}>
                <button className={styles.button} onClick={() => setEditing(true)}>Edit</button>
                <button className={styles.button} onClick={handleRemove}>X</button>
            </div>
        </div>
    )
}

const EditSection: FC<EditSectionProps> = (props) => {
    const { t } = useTranslation()

    const { name, permission, _id } = props.data
    const { setEditing, getActualList } = props
    const { control, register, handleSubmit, formState: { errors } } = useForm<EditSectionInputs>({
        defaultValues: {
            name: name,
            permission: permission,
            password: undefined,
        },
        mode: "onBlur",
        reValidateMode: "onBlur",
        resolver: formValidationSchema(t)
    })

    const StandardInput = (props: StandardInputProps) => {
        const { property, label } = props
        return (
            <HelperText
                className={clsx([styles[property]], styles.helperText)}
                text={""}
                errorText={errors[property]?.message}
                errorClass={styles.helperError}
                error={errors[property] && true}
            >
                <FilledTextFieldHF
                    rootClass={styles.root}
                    className={styles.input}
                    labelClass={styles.label}
                    labelFocusClass={styles.focusLabel}
                    labelFilledClass={styles.focusLabel}
                    lineFilledClass={styles.filledLine}
                    errorLineClass={styles.errorLine}
                    errorLabelClass={styles.errorLabel}
                    control={control}
                    name={String(property)}
                    label={label}
                />
            </HelperText>
        )
    }
    const update: SubmitHandler<EditSectionInputs> = async (data) => {
        const { password, _id, ...restData } = data
        const userObject = data.password ?
            {
                id: _id,
                password: password,
                ...restData
            } :
            {
                id: _id,
                ...restData
            }

        const response = await updateUser(userObject)


        //HAPPY DAY SCENARIO
        if (response.sucess === true && response.data !== null) {
            //SUCESS MODAL
            console.log(response)

            //TOGLE NON EDIT MODE
            setEditing(false)
            getActualList()
            return
        }
        //ERROR MODAL
        console.log(response)

    }
    const onInvalid: SubmitErrorHandler<EditSectionInputs> = (data) => {
        //MODAL
        console.log(data)
    }

    return (
        <form onSubmit={handleSubmit(update, onInvalid)} className={styles.form}>
            <StandardInput property={"name"} label={"Uživatelské jméno"} />
            <StandardInput property={'password'} label={"Nové heslo"} />
            <div className={styles.select} >
                <select {...register("permission")} className={styles.customSelect}>
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                </select>
            </div>
            <div className={styles.submit}>
                <input type="submit" value={"Upravit"} />
                <input type="button" value={"Zrušit"} onClick={() => { setEditing(false) }} />
            </div>
        </form>
    )
}
