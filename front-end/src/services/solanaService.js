import * as solanaWeb3 from "@solana/web3.js";
import axios from "axios";

const getProvider = () => {
    if ('phantom' in window) {
        const provider = window.phantom?.solana;

        if (provider?.isPhantom) {
            return provider;
        }
    }
    return null;
};

export const getBalance = async () => {
    const provider = getProvider();
    if (!provider) {
        throw new Error('Phantom wallet not installed');
    }
    const res = await provider.connect();
    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'), 'confirmed');
    const publicKey = res.publicKey;
    if(!publicKey) {
        throw new Error('No address wallet');
    }
    const balance = await connection.getBalance(publicKey);
    return balance/1000000000;
}

export const createTransaction = async (data) => {
    const res = await axios.post("/api/transaction", data);
    return res.data;
}

export const verifyTransaction = async (payload) => {
    const res = await axios.post("/api/transaction/verify", payload);
    return res.data;
}