import { atom } from 'recoil';
import Cookies from 'js-cookie';

const userDataFromCookies = Cookies.get('user');
const user = userDataFromCookies ? JSON.parse(userDataFromCookies) : null;

const userState = atom({   
    key: 'userState',
    default: user || {
        id: null,
        email: null,
        isSubscribed: false,
    },
});

export default userState;