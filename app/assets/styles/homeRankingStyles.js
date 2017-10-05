import {
    StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flex: 1,
        flexDirection: 'row',
        marginTop: 10,
        paddingTop: 20
    },
    holder: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 3
    },
    holderFirst: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 4.1
    },
    thumb: {
        width: '100%',
        aspectRatio: 1
    },
    detail: {
        backgroundColor: "#F9F9F9",
        width: '100%',
        paddingTop: 5,
        paddingBottom: 5
    },
    title: {
        textAlign: 'center',
        color: '#3F3F3F',
        fontSize: 12,
        fontWeight: '500'
    },
    artists: {
        textAlign: 'center',
        color: '#5E5E5E',
        fontSize: 10
    },

});
export default styles