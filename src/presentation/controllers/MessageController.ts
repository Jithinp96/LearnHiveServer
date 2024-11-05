interface AuthenticatedRequest extends Request {
    userId?: string;
}

export const sendMessage = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { message } = req.body;
        const { id } = req.params;
        const senderId = req.userId
    } catch (error) {
        console.log("Error in send message controller: ", error);
        res.status(500).json({ error: "Internal server error" })
    }
}