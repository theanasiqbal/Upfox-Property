'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Mail, Send, Bold, Italic, Underline, List, Link as LinkIcon, Heading2, Eye, Code, CheckCircle, Search } from 'lucide-react';
import { toast } from 'sonner';

interface AdminSendEmailModalProps {
    open: boolean;
    onClose: () => void;
    initialMode?: 'individual' | 'selected' | 'all';
    initialUser?: { id: string, name: string, email: string };
    selectedUserIds?: string[];
}

export function AdminSendEmailModal({ open, onClose, initialMode = 'individual', initialUser, selectedUserIds = [] }: AdminSendEmailModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState<'individual' | 'selected' | 'all'>(initialMode);
    const [role, setRole] = useState<'all' | 'user' | 'subadmin' | 'admin'>('all');
    const [subject, setSubject] = useState('');
    const [showPreview, setShowPreview] = useState(false);

    const [htmlBody, setHtmlBody] = useState('');
    
    // Rich Text Editor State
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open) {
            setMode(initialMode);
            setSubject('');
            setHtmlBody('');
            // Focus editor after a short delay
            setTimeout(() => {
                if (editorRef.current) {
                    editorRef.current.innerHTML = '';
                    editorRef.current.focus();
                }
            }, 100);
        }
    }, [open, initialMode]);

    // Keep editor in sync with state when switching back from preview
    useEffect(() => {
        if (!showPreview && editorRef.current && editorRef.current.innerHTML !== htmlBody) {
            editorRef.current.innerHTML = htmlBody;
        }
    }, [showPreview, htmlBody]);

    if (!open) return null;

    const execCommand = (command: string, value: string = '') => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            setHtmlBody(editorRef.current.innerHTML);
            editorRef.current.focus();
        }
    };

    const handleSend = async () => {
        const body = showPreview ? htmlBody : (editorRef.current?.innerHTML || htmlBody);
        if (!subject.trim()) return toast.error('Subject is required');
        if (!body.trim() || body === '<br>') return toast.error('Email body is required');

        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mode,
                    role: mode === 'all' ? role : undefined,
                    userIds: mode === 'selected' ? selectedUserIds : undefined,
                    singleUserId: mode === 'individual' ? initialUser?.id : undefined,
                    subject,
                    htmlBody: body,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to send email');

            toast.success(`Email sent successfully to ${data.sent} recipients`);
            onClose();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const addLink = () => {
        const url = prompt('Enter the URL:');
        if (url) execCommand('createLink', url);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative z-10 w-full max-w-4xl bg-white dark:bg-navy-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/10 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-accent-purple/10 rounded-2xl flex items-center justify-center">
                            <Mail className="w-6 h-6 text-accent-purple" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Broadcast Email</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Compose and send formatted emails to users</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Targeting Mode Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Recipient Mode</label>
                            <div className="flex gap-2 p-1 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">
                                {(['individual', 'selected', 'all'] as const).map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => setMode(m)}
                                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all capitalize ${mode === m
                                            ? 'bg-white dark:bg-navy-700 text-accent-purple shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {mode === 'all' && (
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Target Role</label>
                                <div className="flex gap-2">
                                    {(['all', 'user', 'subadmin', 'admin'] as const).map((r) => (
                                        <button
                                            key={r}
                                            onClick={() => setRole(r)}
                                            className={`px-4 py-2 rounded-xl border text-xs font-medium transition-all capitalize ${role === r
                                                ? 'bg-accent-purple/10 border-accent-purple text-accent-purple'
                                                : 'bg-transparent border-gray-200 dark:border-white/10 text-gray-500'}`}
                                        >
                                            {r === 'all' ? 'Everyone' : r}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {mode === 'individual' && initialUser && (
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Recipient</label>
                                <div className="px-4 py-2.5 bg-accent-purple/5 border border-accent-purple/20 rounded-2xl flex items-center gap-3">
                                    <div className="w-8 h-8 bg-accent-purple text-white rounded-full flex items-center justify-center text-xs font-bold">
                                        {initialUser.name[0].toUpperCase()}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{initialUser.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{initialUser.email}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {mode === 'selected' && (
                            <div className="space-y-3">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Recipients</label>
                                <div className="px-4 py-2.5 bg-blue-500/5 border border-blue-500/20 rounded-2xl flex items-center gap-2">
                                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4" />
                                    </div>
                                    <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                                        {selectedUserIds.length} Selected Users
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Subject</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Enter email subject line..."
                            className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-base font-medium focus:outline-none focus:ring-4 focus:ring-accent-purple/10 transition-all dark:text-white"
                        />
                    </div>

                    <div className="space-y-3 flex flex-col flex-1 min-h-[400px]">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Body Content</label>
                            <button
                                onClick={() => {
                                    if (!showPreview && editorRef.current) {
                                        setHtmlBody(editorRef.current.innerHTML);
                                    }
                                    setShowPreview(!showPreview);
                                }}
                                className="flex items-center gap-1.5 text-xs font-bold text-accent-purple hover:underline"
                            >
                                {showPreview ? <Code className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                {showPreview ? 'Show Editor' : 'Show Preview'}
                            </button>
                        </div>

                        {showPreview ? (
                            <div className="flex-1 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 p-6 overflow-y-auto prose dark:prose-invert max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: htmlBody || '' }} />
                            </div>
                        ) : (
                            <div className="flex flex-col flex-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden focus-within:ring-4 focus-within:ring-accent-purple/10 transition-all">
                                {/* Toolbar */}
                                <div className="flex items-center gap-1 p-2 bg-gray-50 dark:bg-navy-900 border-b border-gray-200 dark:border-white/10 flex-wrap">
                                    <ToolbarButton onClick={() => execCommand('bold')} icon={<Bold className="w-4 h-4" />} title="Bold" />
                                    <ToolbarButton onClick={() => execCommand('italic')} icon={<Italic className="w-4 h-4" />} title="Italic" />
                                    <ToolbarButton onClick={() => execCommand('underline')} icon={<Underline className="w-4 h-4" />} title="Underline" />
                                    <div className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-1" />
                                    <ToolbarButton onClick={() => execCommand('insertHTML', '<h2>Heading</h2>')} icon={<Heading2 className="w-4 h-4" />} title="Heading" />
                                    <ToolbarButton onClick={() => execCommand('insertUnorderedList')} icon={<List className="w-4 h-4" />} title="Bullet List" />
                                    <ToolbarButton onClick={addLink} icon={<LinkIcon className="w-4 h-4" />} title="Add Link" />
                                    <ToolbarButton onClick={() => execCommand('unlink')} icon={<Mail className="w-4 h-4" />} title="Remove Link" className="rotate-180" />
                                </div>
                                <div
                                    ref={editorRef}
                                    contentEditable
                                    onInput={(e) => setHtmlBody(e.currentTarget.innerHTML)}
                                    className="flex-1 p-6 focus:outline-none min-h-[300px] text-gray-900 dark:text-gray-100 prose dark:prose-invert max-w-none select-text"
                                    onBlur={() => { }}
                                ></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 dark:border-white/10 flex items-center justify-end gap-4 bg-gray-50/50 dark:bg-navy-900/50 flex-shrink-0">

                    <button
                        onClick={handleSend}
                        disabled={isLoading}
                        className="px-8 py-3 bg-accent-purple hover:bg-accent-purple/90 disabled:opacity-50 text-white rounded-2xl font-bold flex items-center gap-3 shadow-lg shadow-accent-purple/20 transition-all active:scale-95"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                        {isLoading ? 'Sending Broadcast...' : 'Send Broadcast Now'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function ToolbarButton({ onClick, icon, title, className = "" }: { onClick: () => void, icon: React.ReactNode, title: string, className?: string }) {
    return (
        <button
            type="button"
            onClick={(e) => { e.preventDefault(); onClick(); }}
            className={`p-2 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 rounded-lg transition-all ${className}`}
            title={title}
        >
            {icon}
        </button>
    );
}
