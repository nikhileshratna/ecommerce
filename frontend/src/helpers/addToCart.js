import { useState } from "react"
import SummaryApi from "../common"
import { toast } from 'react-toastify'

const AddToCart = async(e,id,quantity) =>{
    e?.stopPropagation()
    e?.preventDefault()
    console.log("id", id)
    const response = await fetch(SummaryApi.addToCartProduct.url,{
        method : SummaryApi.addToCartProduct.method,
        body : JSON.stringify(
            { 
                productId : id,
                token : localStorage.getItem("token"),
                quantity: quantity,
            }
        )
    })
    console.log("response", response);
    const responseData = await response.json()
    console.log("response data", responseData);
    if(responseData.success){
        toast.success(responseData.message)
    }

    if(responseData.error){
        toast.error(responseData.message)
    }


    return responseData

}


export default AddToCart