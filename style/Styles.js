import { StyleSheet } from "react-native"

export default StyleSheet.create({
    horizontalContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        flex: 1,
        padding: 5,
        height: "100%"
    },
    centralButton: {
        flex: 1,
        padding: 5,
        alignContent: 'center',
        justifyContent: 'center',
        marginLeft: "25%",
        marginRight: "25%",
    },
    textContainer: {
        flex: 1,
        padding: 5,
    },
    textContainer2: {
        flex: 3,
        padding: 5,
    },
    safeAreaView: {
        flex: 1,
        padding: 5,
    },
    scrollView: {
        flexGrow: 1,
        padding: 5
    },
    cardDivider: {
        marginTop: 2,
        marginBottom: 2
    },
    cardContainer: {
        flex: 1,
        padding: 5,
    },
    cardTitle: {
        fontSize: 30, 
        textAlign: 'center', 
        marginTop: 10, 
        fontWeight: 'bold',
    },
    wallPost: {
        fontSize: 16,
        padding: 5,
        fontWeight: 'bold',
    },
    textInput: {
        flex: 1, 
        width: '100%', 
        backgroundColor: 'white',
        padding: 5,
    },
    itemSeperator: {
        height: 1, 
        backgroundColor: '#1d1135', 
        marginHorizontal: 10, 
        marginTop: 5
    }
});