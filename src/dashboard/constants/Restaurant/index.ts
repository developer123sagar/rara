// add restaurant 
import { BooleanButton, IRestaurantForm, RestaurantInputField } from "@/types";

export const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

export const inputField: RestaurantInputField[] = [
    {
        name: "Restaurant Name",
        type: "text",
        placeH: "RARA",
        formName: "name",
    },
    {
        name: "Email",
        type: "email",
        placeH: "info@rarafoods.com.au",
        formName: "email",
    },
    {
        name: "Website",
        type: "text",
        placeH: "example.com",
        formName: "website",
    },
    {
        name: "Phone number",
        type: "number",
        placeH: "+6112121212",
        formName: "phoneNumber",
    },
    {
        name: "Minimum Spent for Free Delivery",
        type: "number",
        placeH: "AUD 100",
        formName: "minimumSpentForFreeDelivery",
    },
    {
        name: "Average Delivery Time",
        type: "number",
        placeH: "5-10",
        formName: "averageDeliveryTime",
    },
    {
        name: "Minimum Spent to Checkout",
        type: "number",
        placeH: "AUD 100",
        formName: "minimumSpentToCheckout",
    },
    {
        name: "Address",
        type: "text",
        placeH: "Town planning",
        formName: "address",
    },
    {
        name: "ABN Number",
        type: "number",
        placeH: "123456",
        formName: "ABN_Number",
    },
];



export const booleanBtn: BooleanButton[] = [
    // { label: "User Pickup", toggleName: "userPickup" },
    // { label: "Dining", toggleName: "dining" },
    { label: "Home Delivery", toggleName: "hasDeliveryCondition" },
    { label: "Vegetarian", toggleName: "vegetarian" },
];


export const options = [
    { label: "Free Wifi", value: "Free Wifi" },
    { label: "Family", value: "Family" },
    { label: "Parking Area", value: "Parking Area" },
    { label: "Live Music", value: "Live Music" },
    { label: "Meetings", value: "Meetings" },
    { label: "Bar", value: "Bar" },
    { label: "Pet Friendly", value: "Pet Friendly" },
    { label: "Kid Friendly", value: "Kid Friendly" },
    { label: "Outdoor", value: "Outdoor" },
    { label: "Desserts", value: "Desserts" },
    { label: "Family Style", value: "Family Style" },
    { label: "Fast Food", value: "Fast Food" },
    { label: "Buffet", value: "Buffet" },
    { label: "Romantic", value: "Romantic" },
    { label: "Snacks", value: "Snacks" },
    { label: "Barbeque", value: "Barbeque" },
];

export const initialFormState: IRestaurantForm = {
    name: "",
    email: "",
    website: "",
    minimumSpentForFreeDelivery: null,
    minimumSpentToCheckout: null,
    phoneNumber: null,
    tags: [],
    address: "",
    averageDeliveryTime: "",
    userPickup: false,
    dining: false,
    hasDeliveryCondition: false,
    features: [],
    vegetarian: false,
    description: "",
    logo: "",
    image: [""],
    mainImage: "",
    ABN_Number: null,
    bussinessType: "restaurant",
    geo: {
        type: "Point",
        coordinates: [0, 0],
    },
    openTime: {
        everyday: {
            startTime: new Date(),
            endTime: new Date(),
            isClosed: false,
            isSameTimeEveryDay: true,
        },
        sunday: {
            startTime: new Date(),
            endTime: new Date(),
            isClosed: false,
        },
        monday: {
            startTime: new Date(),
            endTime: new Date(),
            isClosed: false,
        },
        tuesday: {
            startTime: new Date(),
            endTime: new Date(),
            isClosed: false,
        },
        wednesday: {
            startTime: new Date(),
            endTime: new Date(),
            isClosed: false,
        },
        thursday: {
            startTime: new Date(),
            endTime: new Date(),
            isClosed: false,
        },
        friday: {
            startTime: new Date(),
            endTime: new Date(),
            isClosed: false,
        },
        saturday: {
            startTime: new Date(),
            endTime: new Date(),
            isClosed: false,
        },
    },

};
