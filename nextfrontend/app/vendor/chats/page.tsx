import ChatWorkspace from '@/app/components/chat/chatWorkspace';


export default function VendorChatsPage() {
    return (
        <ChatWorkspace
            role="vendor"
            title="Customer Inbox"
            subtitle="Reply to buyers, answer pre-sale questions, and handle order follow-ups from one place."
            emptyTitle="No customer threads yet"
            emptyDescription="Customer messages will appear here. You can also open a chat from the vendor orders page."
        />
    );
}
