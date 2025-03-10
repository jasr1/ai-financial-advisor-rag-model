class MessageParser {
    constructor(actionProvider) {
        this.actionProvider = actionProvider;
    }

    parse(message) {
        this.actionProvider.handleMessage(message);
}
}

export default MessageParser;
