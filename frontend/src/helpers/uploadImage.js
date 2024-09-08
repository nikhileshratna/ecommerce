import SummaryApi from "../common"
const url = `${SummaryApi.uploadImage.url}`

const uploadImage  = async(image) => {
    console.log("url",url);
    console.log(process.env.REACT_APP_CLOUD_NAME_CLOUDINARY)
    const formData = new FormData()
    formData.append("file",image)
    formData.append("upload_preset","mern_product")
    

    const dataResponse = await fetch(url,{
        method : "post",
        body : formData
    })
    console.log("dataResponse",dataResponse)
    console.log("image",image)
    console.log("formData",formData);
    return dataResponse.json()

}

export default uploadImage 