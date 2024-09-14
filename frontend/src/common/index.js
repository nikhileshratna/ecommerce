const backendDomin = "https://ecommerce-8cr3.onrender.com"
// const backendDomin = "http://localhost:8000"

const SummaryApi = {
    signUP: {
        url: `${backendDomin}/api/signup`,
        method: "post"
    },
    signIn: {
        url: `${backendDomin}/api/signin`,
        method: "post"
    },
    current_user: {
        url: `${backendDomin}/api/user-details`,
        method: "get"
    },
    editAdditionalDetails: {
        url: `${backendDomin}/api/edit-additional-details`,
        method: "post"
    },
    update_userOrders: {
        url: `${backendDomin}/api/update-userOrders`,
        method: "post"
    },
    showAdditionalDetails: {
        url: `${backendDomin}/api/show-additional-details`,
        method: "get"
    },
    logout_user: {
        url: `${backendDomin}/api/userLogout`,
        method: 'get'
    },
    allUser: {
        url: `${backendDomin}/api/all-user`,
        method: 'get'
    },
    updateUser: {
        url: `${backendDomin}/api/update-user`,
        method: "post"
    },
    uploadProduct: {
        url: `${backendDomin}/api/upload-product`,
        method: 'post'
    },
    uploadBlog: {
        url: `${backendDomin}/api/upload-blog`,
        method: 'post'
    },
    allProduct: {
        url: `${backendDomin}/api/get-product`,
        method: 'get'
    },
    allBlog: {
        url: `${backendDomin}/api/get-blog`,
        method: 'get'
    },
    updateProduct: {
        url: `${backendDomin}/api/update-product`,
        method: 'post'
    },
    updateBlog: {
        url: `${backendDomin}/api/update-blog`,
        method: 'post'
    },
    uploadCategory: {
        url: `${backendDomin}/api/upload-category`,
        method: 'post'

    },
    uploadMyOrder: {
        url: `${backendDomin}/api/upload-category`,
        method: 'post'
    },
    getCategory : {
        url: `${backendDomin}/api/get-category`,
        method: 'get'
    },
    deleteCategory: {
        url: `${backendDomin}/api/delete-category`,
        method: 'post'
    },
    deleteProduct: {
        url: `${backendDomin}/api/delete-product`,
        method: 'post'
    },

    deleteBlog: {
        url: `${backendDomin}/api/delete-blog`,
        method: 'post'
    },
    categoryProduct: {
        url: `${backendDomin}/api/get-categoryProduct`,
        method: 'get'
    },
    categoryWiseProduct: {
        url: `${backendDomin}/api/`,
        method: 'post'
    },
    productDetails: {
        url: `${backendDomin}/api/product-details`,
        method: 'post'
    },
    addToCartProduct: {
        url: `${backendDomin}/api/addtocart`,
        method: 'post'
    },
    addToCartProductCount: {
        url: `${backendDomin}/api/countAddToCartProduct`,
        method: 'get'
    },
    cartProductView: {
        url: `${backendDomin}/api/view-card-product`,
        method: 'get'
    },
    updateCartProduct: {
        url: `${backendDomin}/api/update-cart-product`,
        method: 'post'
    },
    deleteCartProduct: {
        url: `${backendDomin}/api/delete-cart-product`,
        method: 'post'
    },
    searchProduct: {
        url: `${backendDomin}/api/search`,
        method: 'get'
    },
    filterProduct: {
        url: `${backendDomin}/api/filter-product`,
        method: 'post'
    },
    emptyCart: {
        url: `${backendDomin}/api/empty-cart`,
        method: 'post'
    },
    trackOrder:{
        url : `${backendDomin}/api/track-order/`,
        method : 'get'
    },
    uploadImage : {
        url : `${backendDomin}/api/upload-file`,
        method : 'post',
    }

}


export default SummaryApi