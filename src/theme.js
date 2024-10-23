import { createTheme } from "@mui/material/styles";


const lightTheme = createTheme({
    palette: {
        mode: "light",
        background: {
            default: "#ffffff",
            paper: "#ffffff",
        },
        text: {
            primary: "#0d80d8", // Light mode text color
            secondary: "#000000", // Optional: Secondary text color
        },
        divider: "#e0e0e0",
    },
});

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        background: {
            default: "#000000",
            paper: "#121212",
        },
        text: {
            primary: "#0d80d8",
            secondary: "#ffffff"
        },
        divider: "#424242",
    },

});

export { lightTheme, darkTheme };
