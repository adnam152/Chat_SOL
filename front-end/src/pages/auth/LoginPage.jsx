import { useLoaderStore } from "../../store/useLoaderStore";
import { loginWithPhantomWallet } from "../../services/authService";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "react-toastify";

const getProvider = () => {
    if ('phantom' in window) {
        const provider = window.phantom?.solana;

        if (provider?.isPhantom) {
            return provider;
        }
    }
    window.open('https://phantom.app/', '_blank');
};

export default function LoginPage() {
    const setLoading = useLoaderStore(state => state.setLoading);
    const setAuthUser = useAuthStore(state => state.setAuthUser);

    const phantomWalletLogin = async () => {
        const provider = getProvider(); // see "Detecting the Provider"
        setLoading(true);
        try {
            // connect to phantom wallet
            const resp = await provider.connect();
            console.log(resp);
            const publicKey = resp.publicKey.toString();
            if (!publicKey) throw new Error('No address wallet');

            const res = await loginWithPhantomWallet(publicKey);
            if (!res.data) throw new Error(res.message);
            setAuthUser(res.data);
            toast.success('Login successful');

        } catch (err) {
            // { code: 4001, message: 'User rejected the request.' }
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-96 bg-gray-300 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-10 p-5 flex flex-col items-center gap-4">
            <h1 className='font-semibold p-4 text-3xl text-center'>
                Login <span className='text-blue-500'>Chat App</span>
            </h1>

            <button className="btn" onClick={phantomWalletLogin}>LOGIN WITH PHANTOM WALLET</button>
        </div>
    )
}