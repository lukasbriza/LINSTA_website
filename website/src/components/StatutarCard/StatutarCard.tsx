import styles from '../../styles/modules/StatutarCard.module.scss'

import React, { FC } from 'react'
import { Typography } from '@lukasbriza/lbui-lib'
import { User } from './User'
import Image from 'next/image'
import { StatutarCardProps } from './StatutarCard.model'

export const StatutarCard: FC<StatutarCardProps> = (props) => {
    const { src, alt, header, phone, mail } = props

    return (
        <div className={styles.card}>
            <div className={styles.image}>
                {
                    src ?
                        <Image src={src} width="100px" height="100px" alt={alt} /> :
                        <div className={styles.emptyImage}>
                            <User className={styles.user} />
                        </div>
                }
            </div>
            <div className={styles.infoSection}>
                <Typography type="h5" variant={["bold"]} size="medium" className={styles.cardHeader}>
                    {header}
                </Typography>
                <div className={styles.contacts}>
                    <div className={styles.phone}>
                        <Image src={"/assets/phone2.svg"} width="15px" height="15px" alt={"telephone"} />
                        <Typography type="body1" size="small">{phone}</Typography>
                    </div>
                    <div className={styles.mail}>
                        <Image src={"/assets/email2.svg"} width="15px" height="15px" alt={"telephone"} />
                        <Typography type="body1" size="small">{mail}</Typography>
                    </div>
                </div>
            </div>
        </div>
    )
}