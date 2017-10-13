import {
    StyleSheet
} from 'react-native';
import Dimensions from 'Dimensions';

const styles = StyleSheet.create({
    btn: {
        paddingLeft: 10,
        paddingRight: 10
    },
    btnContent: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    btnImg: {
        width: Dimensions.get('window').width/17,
        aspectRatio: 1
    }
});
export default styles