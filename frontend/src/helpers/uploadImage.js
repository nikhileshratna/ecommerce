import SummaryApi from "../common"
const url = `${SummaryApi.uploadImage.url}`

const uploadImage = async (image) => {
    console.log("url", url);
    console.log(process.env.REACT_APP_CLOUD_NAME_CLOUDINARY);

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "mern_product");

    const dataResponse = await fetch(url, {
        method: "post",
        body: formData
    });

    // console.log("dataResponse", dataResponse);

    // Log response body as JSON
    const responseData = await dataResponse.json();
    console.log("responseData", responseData);

    if (!responseData.success) {
        throw new Error(responseData.message || 'Image upload failed');
    }

    return responseData;
};

export default uploadImage;