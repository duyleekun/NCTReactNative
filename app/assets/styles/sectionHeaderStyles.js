import {
    StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        paddingBottom:0,
        alignItems: "center"
    },
    holder: {
        flexDirection: "row",
        alignItems: 'center'
    },
    imgMore: {
        height: 10,
        width: 10,
        paddingBottom:0,
        marginLeft: 1
    },
    text:{
        textAlign: 'center',
        marginTop: 10,
        color: "#32AAEA"
    },
    icon:{
        height: 11,
        width: 11,
        marginRight:3
    },
    title:{
        fontWeight: 'bold',
        flex: 1,
        fontSize: 15
    }
});
export default styles