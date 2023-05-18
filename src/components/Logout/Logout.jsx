import React from 'react'
import styles from "./lougout.scss"
import "../../App.css"
export default function Logout() {
  console.log('styles',styles)
  return (
    <>
    <div className={styles}>
                <div className={styles.error}>text1</div>
    </div>
    <div className='btn'>
        text2
    </div>
    </>
  )
}
