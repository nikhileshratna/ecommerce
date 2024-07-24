import { useState } from "react"
import SummaryApi from "../common"
import { toast } from 'react-toastify'
import { useSelector } from "react-redux"

const AddToCart = async(e,id,quantity,token) =>{
    e?.stopPropagation()
    e?.preventDefault()
    console.log("id", id)
    console.log("quantity", quantity)
    const response = await fetch(SummaryApi.addToCartProduct.url,{
        method : SummaryApi.addToCartProduct.method,
        headers : {
            Authorization : `Bearer ${token}`,
            "Content-Type" : "application/json"
        },
        includeCredentials : true,
        body : JSON.stringify(
            { 
                productId : id,
                quantity: quantity,
            }
        ),
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