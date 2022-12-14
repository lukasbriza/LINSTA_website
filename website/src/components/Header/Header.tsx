import styles from '../../styles/modules/Header.module.scss'

import { useTranslation } from 'next-i18next'
import React, { FC } from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { useRedirect } from '@hooks'
import { HeaderProps } from './Header.model'
import { MenuItem, MenuList } from '@lukasbriza/lbui-lib'
import { useRouter } from 'next/router'
import { routes } from '../../config/routes'
import { logoutRequest } from '@fetchers'

export const Header: FC<HeaderProps> = (props) => {
    const { t } = useTranslation()
    const { leftItems, rightItems } = props
    const { administration, login } = routes
    const redirect = useRedirect()
    const router = useRouter()

    const handleClick = async (e: React.SyntheticEvent, route: string) => {
        e.preventDefault()
        if (router.pathname === administration) {
            const response = await logoutRequest()
            console.log(response)
            router.push(login)
            return
        }
        router.push(route)
    }
    return (
        <section className={styles.header}>
            <MenuList className={styles.leftSection}>
                {leftItems.map((item, index) => {
                    return (
                        <Link key={index} href={item.url}>
                            <MenuItem
                                onClick={() => { redirect({ path: item.url }) }}
                                className={styles.menuItem}
                                labelClass={styles.label}
                                label={t(`header.${item.name}`)}
                                icon={<Image src={item.src} width="10" height="10" alt="header icon" />}
                                iconPosition="left"
                                uppercase={false}
                                underliner={false}
                            />
                        </Link>
                    )
                })}
            </MenuList>
            <MenuList className={styles.rightSection}>
                {rightItems.map((item, index) => {
                    if (item.name === 'login') {
                        return (
                            <div key={index} onClick={(e: React.SyntheticEvent) => { handleClick(e, item.url) }} >
                                <p className={clsx([styles.label, styles.login])}>{router.pathname === administration ? t('header.logout') : t('header.login')}</p>
                            </div>
                        )
                    }
                })}
            </MenuList>
        </section>
    )
}