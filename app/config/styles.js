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
        textAlign: 'center',
        color: '#333333',
        fontSize: 12,
        margin: 10,
        maxWidth: '100%'
    }
});

export default styles;