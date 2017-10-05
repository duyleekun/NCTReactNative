import {
    StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
    albumImageContainer:{
        width: '100%',
        aspectRatio: 1,
        position: 'relative'
    },
    albumTitle:{
        textAlign: 'left',
        color: '#333333',
        fontSize: 12,
        margin: 2,
        maxWidth: '100%',
    },
    artist: {
        textAlign: 'left',
        color: '#5b5b5b',
        fontSize: 10,
        maxWidth: '100%',
        margin: 2
    }
});
export default styles