'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { UserCheck, ChevronDown, X } from 'lucide-react';

interface Subadmin {
    _id: string;
    name: string;
    email: string;
}

interface Props {
    currentAssignedId?: string;
    currentAssignedName?: string;
    onAssign: (subadminId: string | null, subadminName: string | null) => void;
    disabled?: boolean;
}

export function AssignSubadminSelect({ currentAssignedId, currentAssignedName, onAssign, disabled }: Props) {
    const [subadmins, setSubadmins] = useState<Subadmin[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 200 });
    const buttonRef = useRef<HTMLButtonElement>(null);

    const recalcPos = useCallback(() => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const dropH = 280;
        const top = spaceBelow >= dropH ? rect.bottom + 4 : rect.top - dropH - 4;
        setDropdownPos({
            top: top + window.scrollY,
            left: Math.min(rect.left + window.scrollX, window.innerWidth + window.scrollX - 220),
            width: Math.max(rect.width, 220),
        });
    }, []);

    const handleOpen = () => {
        if (disabled) return;
        setOpen(o => {
            if (!o) {
                recalcPos();
                // Fetch lazily
                if (subadmins.length === 0) {
                    setLoading(true);
                    fetch('/api/admin/users?role=subadmin&limit=100')
                        .then(r => r.json())
                        .then(d => setSubadmins(d.users || []))
                        .catch(console.error)
                        .finally(() => setLoading(false));
                }
            }
            return !o;
        });
    };

    useEffect(() => {
        if (!open) return;
        const close = () => setOpen(false);
        window.addEventListener('scroll', close, true);
        window.addEventListener('resize', close);
        return () => {
            window.removeEventListener('scroll', close, true);
            window.removeEventListener('resize', close);
        };
    }, [open]);

    const handleSelect = (id: string | null, name: string | null) => {
        onAssign(id, name);
        setOpen(false);
    };

    const isAssigned = Boolean(currentAssignedId);

    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                disabled={disabled}
                onClick={handleOpen}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${isAssigned
                    ? 'bg-blue-500 border-blue-500 text-white hover:bg-blue-600 shadow-sm'
                    : 'bg-white dark:bg-white/5 border-gray-300 dark:border-white/15 text-gray-600 dark:text-gray-300 hover:border-accent-purple hover:text-accent-purple dark:hover:border-accent-purple dark:hover:text-accent-purple'
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                title={isAssigned ? `Reassign (currently: ${currentAssignedName})` : 'Assign to subadmin'}
            >
                <UserCheck className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="max-w-[80px] truncate leading-none">
                    {currentAssignedName || 'Unassigned'}
                </span>
                <ChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && typeof document !== 'undefined' && createPortal(
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-[9998]" onClick={() => setOpen(false)} />

                    {/* Dropdown panel */}
                    <div
                        className="fixed z-[9999] bg-white dark:bg-[#1a1f36] rounded-xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden"
                        style={{ top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width, maxHeight: 280 }}
                    >
                        <div className="px-3 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-white/10 select-none">
                            Assign to Subadmin
                        </div>

                        <div className="overflow-y-auto" style={{ maxHeight: 210 }}>
                            {loading ? (
                                <div className="px-3 py-4 text-xs text-gray-400 text-center">Loading subadmins…</div>
                            ) : subadmins.length === 0 ? (
                                <div className="px-3 py-4 text-xs text-gray-400 text-center">No subadmins found</div>
                            ) : (
                                subadmins.map(s => (
                                    <button
                                        key={s._id}
                                        type="button"
                                        onClick={() => handleSelect(s._id, s.name)}
                                        className={`w-full text-left px-3 py-2.5 transition-colors hover:bg-gray-50 dark:hover:bg-white/5 ${currentAssignedId === s._id
                                            ? 'bg-accent-purple/5 text-accent-purple font-semibold'
                                            : 'text-gray-700 dark:text-gray-200'
                                            }`}
                                    >
                                        <div className="text-sm leading-tight">{s.name}</div>
                                        <div className="text-xs text-gray-400 dark:text-gray-500 truncate">{s.email}</div>
                                    </button>
                                ))
                            )}
                        </div>

                        {isAssigned && (
                            <button
                                type="button"
                                onClick={() => handleSelect(null, null)}
                                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 border-t border-gray-100 dark:border-white/10 transition-colors"
                            >
                                <X className="w-3.5 h-3.5" /> Unassign
                            </button>
                        )}
                    </div>
                </>,
                document.body
            )}
        </>
    );
}
