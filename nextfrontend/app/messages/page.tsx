import ChatWorkspace from '@/app/components/chat/chatWorkspace';


export default function MessagesPage() {
    return (
        <ChatWorkspace
            role="customer"
            title="Vendor Conversations"
            subtitle="Ask questions about products, delivery, and support directly from each vendor."
            emptyTitle="No conversations yet"
            emptyDescription="Open a product page or your orders to start chatting with a vendor."
        />
    );
}
