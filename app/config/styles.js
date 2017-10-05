import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
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
    artist:{
        textAlign: 'left',
        color: '#5b5b5b',
        fontSize: 10,
        maxWidth: '100%',
        margin: 2
    },
    listened:{
        textAlign: 'left',
        color: '#ffffff',
        fontSize: 8,
        marginLeft: 2
    },
    playImage: {
        width: '18%',
        height: '18%',
        position: 'absolute',
        bottom: 2,
        right: 2
    }
});

export default styles;