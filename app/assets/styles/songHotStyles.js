import {
    StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
    row: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row'
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
        fontSize: 15,
    },
    artist: {
        textAlign: 'center',
        color: '#5E5E5E',
        fontSize: 13
    },
    itemStatus: {
        width: 16,
        aspectRatio: 33/22,
        marginRight: 3
    }
});

export default styles