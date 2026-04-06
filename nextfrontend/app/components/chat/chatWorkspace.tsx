'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import apiService from '@/app/services/apiService';
import { ChatMessage, ChatThreadDetail, ChatThreadSummary } from '@/app/utils/types';


type ChatWorkspaceProps = {
    role: 'customer' | 'vendor';
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyDescription: string;
};

type ThreadCreateResponse = {
    created: boolean;
    thread: ChatThreadDetail;
    detail?: string;
    code?: string;
};

type SocketAuthResponse = {
    thread_id: number;
    token: string;
    expires_in: number;
    ws_url: string;
    detail?: string;
    code?: string;
};

type SocketStatus = 'idle' | 'connecting' | 'connected' | 'disconnected';

function sortThreads(threads: ChatThreadSummary[]) {
    return [...threads].sort(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );
}

export default function ChatWorkspace({
    role,
    title,
    subtitle,
    emptyTitle,
    emptyDescription,
}: ChatWorkspaceProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [threads, setThreads] = useState<ChatThreadSummary[]>([]);
    const [activeThreadId, setActiveThreadId] = useState<number | null>(null);
    const [activeThread, setActiveThread] = useState<ChatThreadDetail | null>(null);
    const [draft, setDraft] = useState('');
    const [loadingThreads, setLoadingThreads] = useState(true);
    const [loadingThread, setLoadingThread] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const [socketStatus, setSocketStatus] = useState<SocketStatus>('idle');
    const bootstrapRef = useRef<string | null>(null);
    const messageBottomRef = useRef<HTMLDivElement | null>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimerRef = useRef<number | null>(null);

    const searchKey = searchParams.toString();
    const threadParam = searchParams.get('thread');
    const vendorParam = searchParams.get('vendor');
    const productParam = searchParams.get('product');
    const customerParam = searchParams.get('customer');

    const selectedThread = threads.find((thread) => thread.id === activeThreadId) || null;

    const isAuthIssue = (response: any) => {
        const detail = typeof response?.detail === 'string' ? response.detail.toLowerCase() : '';
        return detail.includes('authentication') || response?.code === 'token_not_valid';
    };

    const closeSocket = () => {
        if (reconnectTimerRef.current) {
            window.clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }

        if (socketRef.current) {
            socketRef.current.onclose = null;
            socketRef.current.onerror = null;
            socketRef.current.close();
            socketRef.current = null;
        }
    };

    const loadThreads = async (preferredThreadId?: number | null) => {
        let response: any;

        try {
            response = await apiService.get(`/api/chat/threads/?role=${role}`);
        } catch (requestError) {
            setError('Unable to load conversations.');
            setLoadingThreads(false);
            return;
        }

        if (!Array.isArray(response)) {
            if (isAuthIssue(response)) {
                setLoadingThreads(false);
                router.push('/signin');
                return;
            }

            setError(response.detail || 'Unable to load conversations.');
            setLoadingThreads(false);
            return;
        }

        setThreads(sortThreads(response));
        setLoadingThreads(false);

        const queryThreadId = threadParam ? Number(threadParam) : null;
        const nextThreadId = preferredThreadId || queryThreadId || activeThreadId || response[0]?.id || null;
        setActiveThreadId(nextThreadId);
    };

    const loadThread = async (threadId: number) => {
        setLoadingThread(true);
        let response: any;

        try {
            response = await apiService.get(`/api/chat/threads/${threadId}/`);
        } catch (requestError) {
            setError('Unable to load this conversation.');
            setLoadingThread(false);
            return;
        }

        if (response?.detail) {
            if (isAuthIssue(response)) {
                setLoadingThread(false);
                router.push('/signin');
                return;
            }

            setError(response.detail);
            setLoadingThread(false);
            return;
        }

        setActiveThread(response);
        setLoadingThread(false);
    };

    const mergeThreadPreview = (message: ChatMessage, threadId: number) => {
        setThreads((current) => {
            const existing = current.find((thread) => thread.id === threadId);
            if (!existing) {
                return current;
            }

            const updatedThread: ChatThreadSummary = {
                ...existing,
                last_message: message,
                unread_count: 0,
                updated_at: message.created_at,
            };

            return sortThreads([
                updatedThread,
                ...current.filter((thread) => thread.id !== threadId),
            ]);
        });
    };

    const connectSocket = async (threadId: number) => {
        closeSocket();
        setSocketStatus('connecting');

        let authResponse: SocketAuthResponse;

        try {
            authResponse = await apiService.get(`/api/chat/threads/${threadId}/socket-auth/`);
        } catch (requestError) {
            setSocketStatus('disconnected');
            setError('Unable to establish a live chat connection.');
            return;
        }

        if (!authResponse?.ws_url) {
            if (isAuthIssue(authResponse)) {
                router.push('/signin');
                return;
            }

            setSocketStatus('disconnected');
            setError(authResponse.detail || 'Unable to establish a live chat connection.');
            return;
        }

        const socket = new WebSocket(authResponse.ws_url);
        socketRef.current = socket;

        socket.onopen = () => {
            setSocketStatus('connected');
        };

        socket.onmessage = (event) => {
            const payload = JSON.parse(event.data);

            if (payload.type === 'chat.message' && payload.thread_id === threadId) {
                const incomingMessage = payload.message as ChatMessage;

                setActiveThread((current) => {
                    if (!current || current.id !== threadId) {
                        return current;
                    }

                    const alreadyExists = current.messages.some((message) => message.id === incomingMessage.id);
                    if (alreadyExists) {
                        return current;
                    }

                    return {
                        ...current,
                        messages: [...current.messages, incomingMessage],
                        last_message: incomingMessage,
                        unread_count: 0,
                        updated_at: incomingMessage.created_at,
                    };
                });

                mergeThreadPreview(incomingMessage, threadId);
                setSending(false);
                return;
            }

            if (payload.type === 'chat.error') {
                setError(payload.detail || 'Chat connection error.');
                setSending(false);
            }
        };

        socket.onclose = () => {
            if (socketRef.current === socket) {
                socketRef.current = null;
            }

            setSocketStatus('disconnected');
            setSending(false);

            if (activeThreadId === threadId) {
                reconnectTimerRef.current = window.setTimeout(() => {
                    connectSocket(threadId);
                }, 2000);
            }
        };

        socket.onerror = () => {
            setSocketStatus('disconnected');
            setSending(false);
            setError('Live chat connection failed.');
        };
    };

    useEffect(() => {
        const bootstrapThread = async () => {
            setLoadingThreads(true);
            setError('');

            const bootstrapKey = `${role}:${vendorParam || ''}:${productParam || ''}:${customerParam || ''}:${threadParam || ''}`;

            if (
                bootstrapRef.current !== bootstrapKey &&
                ((role === 'customer' && vendorParam) || (role === 'vendor' && customerParam))
            ) {
                bootstrapRef.current = bootstrapKey;

                const payload: Record<string, string> = {};
                if (role === 'customer' && vendorParam) {
                    payload.vendor_id = vendorParam;
                    if (productParam) {
                        payload.product_id = productParam;
                    }
                }

                if (role === 'vendor' && customerParam) {
                    payload.customer_id = customerParam;
                }

                let createResponse: ThreadCreateResponse;

                try {
                    createResponse = await apiService.post(
                        '/api/chat/threads/',
                        JSON.stringify(payload),
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        },
                    );
                } catch (requestError) {
                    setError('Unable to open this conversation.');
                    setLoadingThreads(false);
                    return;
                }

                if (createResponse.thread?.id) {
                    setActiveThreadId(createResponse.thread.id);
                    setActiveThread(createResponse.thread);
                    await loadThreads(createResponse.thread.id);
                    return;
                }

                if (isAuthIssue(createResponse)) {
                    setLoadingThreads(false);
                    router.push('/signin');
                    return;
                }

                setError(createResponse.detail || 'Unable to open this conversation.');
            }

            await loadThreads();
        };

        bootstrapThread();

        return () => {
            closeSocket();
        };
    }, [role, searchKey]);

    useEffect(() => {
        if (!activeThreadId) {
            setActiveThread(null);
            setSocketStatus('idle');
            closeSocket();
            return;
        }

        loadThread(activeThreadId);
        connectSocket(activeThreadId);

        return () => {
            closeSocket();
        };
    }, [activeThreadId]);

    useEffect(() => {
        if (messageBottomRef.current) {
            messageBottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [activeThread?.messages.length]);

    const sendMessage = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!activeThreadId || !draft.trim() || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            setError('Live chat is not connected yet.');
            return;
        }

        setSending(true);
        setError('');

        socketRef.current.send(
            JSON.stringify({
                action: 'send_message',
                content: draft.trim(),
            }),
        );
        setDraft('');
    };

    return (
        <div className="min-h-screen bg-slate-100 px-4 py-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                            {role === 'vendor' ? 'Vendor Inbox' : 'Customer Inbox'}
                        </p>
                        <h1 className="mt-2 text-3xl font-bold text-slate-900">{title}</h1>
                        <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href={role === 'vendor' ? '/vendor/dashboard' : '/profile'}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
                        >
                            {role === 'vendor' ? 'Back to dashboard' : 'Back to profile'}
                        </Link>
                        <Link
                            href={role === 'vendor' ? '/vendor/orders' : '/categories/?name=All'}
                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            {role === 'vendor' ? 'View orders' : 'Browse products'}
                        </Link>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {error}
                    </div>
                )}

                <div className="grid min-h-[72vh] overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl lg:grid-cols-[360px_1fr]">
                    <aside className="border-b border-slate-200 bg-slate-50 lg:border-b-0 lg:border-r">
                        <div className="border-b border-slate-200 px-5 py-4">
                            <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Conversations</h2>
                        </div>

                        <div className="max-h-[72vh] overflow-y-auto">
                            {loadingThreads ? (
                                <div className="space-y-3 p-4">
                                    {[1, 2, 3, 4].map((item) => (
                                        <div key={item} className="h-24 rounded-2xl bg-white animate-pulse" />
                                    ))}
                                </div>
                            ) : threads.length > 0 ? (
                                <div className="p-3">
                                    {threads.map((thread) => (
                                        <button
                                            key={thread.id}
                                            onClick={() => setActiveThreadId(thread.id)}
                                            className={`mb-3 w-full rounded-2xl border px-4 py-4 text-left transition ${
                                                thread.id === activeThreadId
                                                    ? 'border-slate-900 bg-slate-900 text-white shadow-lg'
                                                    : 'border-slate-200 bg-white hover:border-slate-300'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="text-sm font-bold">{thread.counterpart.name}</p>
                                                    <p className={`mt-1 text-xs ${thread.id === activeThreadId ? 'text-slate-200' : 'text-slate-500'}`}>
                                                        {thread.subject}
                                                    </p>
                                                </div>
                                                {thread.unread_count > 0 && (
                                                    <span className={`rounded-full px-2 py-1 text-xs font-bold ${
                                                        thread.id === activeThreadId ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
                                                    }`}>
                                                        {thread.unread_count}
                                                    </span>
                                                )}
                                            </div>
                                            <p className={`mt-3 line-clamp-2 text-sm ${thread.id === activeThreadId ? 'text-slate-100' : 'text-slate-600'}`}>
                                                {thread.last_message?.content || 'No messages yet. Start the conversation.'}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6">
                                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center">
                                        <h3 className="text-lg font-bold text-slate-900">{emptyTitle}</h3>
                                        <p className="mt-2 text-sm text-slate-600">{emptyDescription}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>

                    <section className="flex min-h-[72vh] flex-col">
                        {activeThreadId && (activeThread || loadingThread) ? (
                            <>
                                <div className="border-b border-slate-200 px-6 py-5">
                                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <p className="text-xl font-bold text-slate-900">
                                                {activeThread?.counterpart.name || selectedThread?.counterpart.name}
                                            </p>
                                            <p className="mt-1 text-sm text-slate-600">
                                                {activeThread?.subject || selectedThread?.subject}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] ${
                                                socketStatus === 'connected'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : socketStatus === 'connecting'
                                                        ? 'bg-amber-100 text-amber-700'
                                                        : 'bg-slate-200 text-slate-700'
                                            }`}>
                                                {socketStatus}
                                            </span>
                                            {activeThread?.product && (
                                                <Link
                                                    href={`/product/${activeThread.product.id}`}
                                                    className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                                                >
                                                    Product: {activeThread.product.title}
                                                </Link>
                                            )}
                                            {activeThread?.counterpart.slug && (
                                                <Link
                                                    href={`/store/${activeThread.counterpart.slug}`}
                                                    className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300"
                                                >
                                                    Visit store
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-4 overflow-y-auto bg-[radial-gradient(circle_at_top_left,_rgba(148,163,184,0.12),_transparent_35%),linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] px-6 py-6">
                                    {loadingThread ? (
                                        <div className="space-y-4">
                                            {[1, 2, 3].map((item) => (
                                                <div key={item} className="h-16 rounded-2xl bg-slate-100 animate-pulse" />
                                            ))}
                                        </div>
                                    ) : activeThread?.messages.length ? (
                                        activeThread.messages.map((message) => (
                                            <div
                                                key={message.id}
                                                className={`flex ${message.is_own_message ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-xl rounded-[1.75rem] px-4 py-3 shadow-sm ${
                                                        message.is_own_message
                                                            ? 'bg-slate-900 text-white'
                                                            : 'bg-white text-slate-900'
                                                    }`}
                                                >
                                                    <p className="text-sm leading-6">{message.content}</p>
                                                    <p className={`mt-2 text-xs ${
                                                        message.is_own_message ? 'text-slate-300' : 'text-slate-500'
                                                    }`}>
                                                        {new Date(message.created_at).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <div className="max-w-md rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
                                                <h3 className="text-lg font-bold text-slate-900">No messages yet</h3>
                                                <p className="mt-2 text-sm text-slate-600">
                                                    Send the first message to open the conversation.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messageBottomRef} />
                                </div>

                                <form onSubmit={sendMessage} className="border-t border-slate-200 bg-white px-6 py-5">
                                    <div className="flex flex-col gap-3 md:flex-row">
                                        <textarea
                                            value={draft}
                                            onChange={(event) => setDraft(event.target.value)}
                                            rows={3}
                                            placeholder={role === 'vendor' ? 'Reply to the customer...' : 'Write to the vendor...'}
                                            className="min-h-[88px] flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                                        />
                                        <button
                                            type="submit"
                                            disabled={sending || !draft.trim() || socketStatus !== 'connected'}
                                            className="rounded-2xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {sending ? 'Sending...' : socketStatus === 'connected' ? 'Send message' : 'Connecting...'}
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#f8fafc_0%,#ffffff_45%,#e2e8f0_100%)] p-8">
                                <div className="max-w-lg rounded-[2rem] border border-slate-200 bg-white/90 px-8 py-10 text-center shadow-xl backdrop-blur">
                                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                                        Ready to chat
                                    </p>
                                    <h2 className="mt-4 text-3xl font-bold text-slate-900">{emptyTitle}</h2>
                                    <p className="mt-3 text-sm leading-6 text-slate-600">{emptyDescription}</p>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
