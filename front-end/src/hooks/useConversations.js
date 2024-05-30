import conversationModels from "../models/conversation.model.js";

export default function useConversations(setConversations) {
    const get = async () => {
        try {
            const res = await conversationModels.getConversations();
            setConversations(res.data);
        }
        catch (error) {
            console.log(error);
        }
    }
    return get;
}