import {
    StyleSheet
} from 'react-native';
import Dimensions from 'Dimensions';

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
        paddingRight: 0,
        marginLeft: 15
    },
    detail: {
        flex: 1,
        alignItems: 'flex-start',
        padding: 5,
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
    },
    cover: {
        width: Dimensions.get('window').width / 7,
        aspectRatio: 1
    },
    listenTime: {
        alignSelf: 'flex-end',
        width: 14,
        aspectRatio: 1,
        marginBottom:3
    },
    listenNumber: {
        color: '#8E8E8E',
        alignSelf: 'flex-end',
        fontSize: 13,
        paddingLeft: 5
    },
    relateditem: {
        width: Dimensions.get('window').width / 16,
        height: Dimensions.get('window').width / 10,
        aspectRatio: 1
    }
});

export default styles