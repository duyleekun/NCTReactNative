import {
    StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
    row: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'white'
    },
    detailHolder: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        // borderTopWidth: 1,
        borderTopColor: '#ededed',
        padding: 15,
        paddingLeft:0,
        marginLeft: 15
    },
    detail: {
        flex: 1,
        alignItems: 'flex-start',
        padding: 5
    },
    title: {
        textAlign: 'center',
        color: '#3F3F3F',
        fontSize: 13,
    },
    artist: {
        textAlign: 'center',
        color: '#8E8E8E',
        fontSize: 13
    }
});

export default styles