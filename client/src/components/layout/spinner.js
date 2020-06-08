import React from 'react'
import spinner from '../../img/loader.gif'

 const Spinner = () => {
    return (
        <>
        <div style={{alignItems:'center', display:'flex', justifyContent: 'center', margin:'auto'}}>
            <div>
           <img src={spinner} alt="loading...." style={{width: '70px', margin: 'auto'}}/> 
            </div>
        </div>
        </>
    )
}
export default Spinner